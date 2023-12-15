FROM node:18.16.0

WORKDIR /app

COPY package.json /app

RUN yarn

RUN npm install -g @nestjs/cli

COPY . /app

EXPOSE 3000

# run
CMD ["yarn", "start"]
