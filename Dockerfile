FROM zenato/puppeteer
LABEL name=nike-login-api

USER root

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "yarn", "start" ]
