FROM node:20-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npx tsc -p tsconfig.json; ls -laR dist/ | head -80; find dist -name "main*"; mkdir -p /out; cp -r dist/* /out/; echo "=== /out ==="; ls -laR /out/ | head -80; true

EXPOSE 10000

CMD npx prisma migrate deploy && node /out/main
