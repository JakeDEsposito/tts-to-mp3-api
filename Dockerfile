FROM node:14.17.6 as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV PORT=3000
EXPOSE ${PORT}
CMD ["npm", "start"]