FROM node:18-alpine

WORKDIR /app

COPY services/auth/package*.json ./
RUN npm install

COPY services/auth/ .

EXPOSE 3001

CMD ["npm", "start"]
