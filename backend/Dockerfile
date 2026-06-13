FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build && mkdir -p dist && cp -r dist/src/* dist/ 2>/dev/null; true

EXPOSE 10000

CMD npx prisma migrate deploy && node dist/main
