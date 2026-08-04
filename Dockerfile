FROM node:22-slim AS builder

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci --ignore-scripts

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

RUN npx prisma generate

COPY . .

RUN npm run build


FROM node:22-slim AS production-deps

WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./

RUN npm ci --omit=dev --ignore-scripts

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

RUN npx prisma generate


FROM node:22-slim AS runner

WORKDIR /app

LABEL maintainer="PML Development Team"
LABEL description="Pharma Metrics Labs NestJS API"

ENV NODE_ENV=production
ENV PORT=4000

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=production-deps /app/package.json ./
COPY --from=production-deps /app/package-lock.json ./
COPY --from=production-deps /app/prisma.config.ts ./prisma.config.ts
COPY --from=production-deps /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

RUN mkdir -p /app/public/uploads \
  && chown -R node:node /app/public/uploads

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "const port=process.env.PORT||4000; fetch('http://127.0.0.1:'+port+'/api/health/public').then(r=>{if(!r.ok)process.exit(1);return r.json()}).then(body=>{if(!['operational','degraded'].includes(body.status))process.exit(1)}).catch(()=>process.exit(1))"]

CMD ["node", "dist/src/main.js"]
