FROM node

WORKDIR /usr/src/app/ng-currency-converter

RUN apt-get update && apt install chromium -y

ENV CHROME_BIN=/usr/bin/chromium

COPY . .

RUN npm install

# Serve the app using start container to run the app on host localhost from container
CMD ["npm", "run", "start-container"]