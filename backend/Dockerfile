FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npx tsc -p tsconfig.json

EXPOSE 10000

CMD npx prisma migrate deploy && node dist/main
