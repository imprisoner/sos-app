FROM node:18.16

ENV NPM_CONFIG_LOGLEVEL info

RUN apt-get update
RUN apt-get install -y python3

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN npm install --only=production

COPY  . .