FROM node

# set a directory for the app
WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

# install dependencies
RUN yarn install

# tell the port number the container should expose
EXPOSE 5000

# run
CMD ["yarn", "run", "dev"]