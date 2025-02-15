FROM node:20-alpine

WORKDIR /

ENV NODE_ENV=development

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build
RUN npm prune --production

EXPOSE 8000

CMD ["npm", "start"]
