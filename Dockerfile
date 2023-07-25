FROM node:18.16

ENV NPM_CONFIG_LOGLEVEL info

RUN apt-get update
RUN apt-get install -y python3

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

ADD ./package*.json ./

RUN npm ci

ADD  ./ ./

# "docker create context remote ssh://ubuntu@sos.luden-labs.com"
# "docker context use remote"
# "docker ...any commands..."
# "docker context use default"
