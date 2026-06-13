FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build && find dist -name "*.js" | head -20 && mkdir -p /out && cp -r dist/* /out/ 2>/dev/null; if [ -d dist/src ]; then cp -r dist/src/* /out/; fi

EXPOSE 10000

CMD npx prisma migrate deploy && node /out/main
