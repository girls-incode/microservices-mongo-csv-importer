FROM node:lts-alpine

WORKDIR /apifilters

COPY package.json ./

RUN npm install

# ADD . /src
COPY . .

RUN npm run build

# RUN ls
# RUN pwd

EXPOSE 4000

CMD ["npm", "run", "dev"]

# To build and run it:
# docker build -t apifilters .
# docker run -it -p 4000:4000 apifilters
# docker run -d -p 4000:4000 apifilters