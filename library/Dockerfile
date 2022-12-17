FROM node:16.17

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY ./dist ./

CMD ["npm", "start"]
