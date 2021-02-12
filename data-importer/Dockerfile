FROM node:lts-alpine

WORKDIR /dataimporter

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "dev"]