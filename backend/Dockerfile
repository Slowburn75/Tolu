FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build && ls -la dist/ && ls -la dist/src/ 2>/dev/null && find dist -name "*.js" | sort | head -25 && mkdir -p /out && (cp -r dist/src/* /out/ 2>/dev/null || cp -r dist/* /out/) && ls -la /out/

EXPOSE 10000

CMD npx prisma migrate deploy && node /out/main
