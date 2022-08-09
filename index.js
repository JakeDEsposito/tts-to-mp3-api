require('dotenv').config();

const http = require('http');
const url = require('url');
const server = http.createServer();

const { Readable } = require('stream');
const txttomp3 = require('text-to-mp3');

function regexBadCharacters(str) {
  return str.replace(/[^ a-zA-Z0-9,.:;[\]()/\!@#$%^&*+_{}<>=?~|"-]+/g,'').replace(/\s+/g, ' ')
};

server.on('request', async(req, res) => {
   
  let query = url.parse(req.url, true).query;

  let contentType = 'text/html';
  let earlierResponse = false;
  if(query != undefined)
  {
    if(query.type != undefined)
    {
      switch(query.type)
      {
        case 'tts':
          if(query.text != undefined && query.language != undefined)
          {
            txttomp3.attributes.tl = query.language;

            const fixedText = regexBadCharacters(query.text)
            console.log(fixedText);

            txttomp3.getMp3(fixedText)
              .then(function(binaryStream)
              {
                const stream = Readable.from(binaryStream);
                stream.pipe(res);
              })
              .catch(function(err)
              {
                console.log("Error", err);
              });
            
            earlierResponse = true;
            contentType = 'audio/mp3';
          }
          else
            data = {error: 'No text or language specified'};
          break;

        default:
          data = {error: 'Specified type is invalid'};
      }
    }
    else
    {
      data = {error: 'No type specified'};
    }
  }
  
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    "Access-Control-Max-Age": 2592000,
    'Content-Type': contentType
  });

  if(!earlierResponse)
    res.end(JSON.stringify(data));

}).listen(process.env.PORT);
