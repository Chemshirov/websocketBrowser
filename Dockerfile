FROM node:14-slim

RUN apt-get update && \
apt-get install -y wget gnupg ca-certificates procps libxss1 && \
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" \
>> /etc/apt/sources.list.d/google.list' && \
apt-get update && \
apt-get install -y google-chrome-stable && \
apt-get clean && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/nodejs
WORKDIR /usr/nodejs
COPY package.json /usr/nodejs
RUN npm install

CMD ["npm", "start"]