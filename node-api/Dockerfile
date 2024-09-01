FROM node:22-alpine

COPY . .

RUN npm install
RUN npm install dd-trace --save

EXPOSE 3000
CMD ["node", "index.js"]