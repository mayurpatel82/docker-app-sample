FROM node:12.14.1
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm install
RUN npm run build
# start app
CMD ["npm", "start"]
EXPOSE 3000