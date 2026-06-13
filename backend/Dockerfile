FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npx tsc -p tsconfig.json; echo "BUILD DONE"; ls -la dist/*.js 2>/dev/null || echo "NO JS FILES IN dist/"; ls -la dist/*.d.ts 2>/dev/null; echo "---"; wc -c dist/main.js 2>/dev/null || echo "main.js MISSING"; cat dist/main.js 2>/dev/null | head -5 || echo "CANNOT READ main.js"; echo "---END---"; mkdir -p /out; cp -r dist/* /out/ 2>/dev/null; ls -la /out/*.js 2>/dev/null || echo "NO JS IN /out"

EXPOSE 10000

CMD npx prisma migrate deploy && node /out/main
