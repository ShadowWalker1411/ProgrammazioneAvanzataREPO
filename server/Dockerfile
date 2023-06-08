FROM node:14

EXPOSE 3001

RUN npm install i npm@latest -g

WORKDIR /src

COPY ../package.json ../package*.json ./

RUN npm install

RUN mkdir /src/Images

COPY . .

CMD ["node", "index.js"]