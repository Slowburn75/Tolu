FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npx tsc -p tsconfig.json

EXPOSE 10000

CMD npx prisma migrate deploy && node dist/main
