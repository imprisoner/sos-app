FROM node:18-alpine

ENV NPM_CONFIG_LOGLEVEL info

RUN apk update

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ADD ./package*.json ./

RUN npm ci

ADD  ./ ./

# "docker create context remote ssh://ubuntu@sos.luden-labs.com"
# "docker context use remote"
# "docker ...any commands..."
# "docker context use default"
