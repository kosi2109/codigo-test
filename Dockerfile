FROM node:lts-alpine3.18

WORKDIR /app

COPY package.json package.json
    
RUN npm install

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "npm start"]