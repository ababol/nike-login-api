FROM dockerinpractice/docker-puppeteer
LABEL name=nike-strava

USER puser

# Create app directory
RUN mkdir -p /home/puser/app
WORKDIR /home/puser/app

# Install app dependencies
COPY package.json package-lock.json ./
CMD [ "npm", "install" ]
CMD [ "npm", "run", "build" ]

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]
