FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build && ls -la dist/; ls -la dist/main* 2>/dev/null; find dist -name "*.js" | sort | head -25; find dist -name "main.js" | head -5; mkdir -p /out && cp -r dist/* /out/ && echo "=== /out ===" && ls -la /out/; ls -la /out/main* 2>/dev/null; true

EXPOSE 10000

CMD npx prisma migrate deploy && node /out/main
