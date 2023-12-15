FROM node:18.16.0

WORKDIR /app

COPY package.json /app

RUN yarn

COPY . /app

CMD yarn build && yarn preview --host
