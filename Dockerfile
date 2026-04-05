FROM node:22-alpine AS base

# ─── Build stage ─────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --ignore-scripts

COPY . .

RUN npx prisma generate && npx nuxt prepare

ARG VERSION
ARG COMMIT
ARG BUILD_DATE
ENV VERSION=$VERSION \
    COMMIT=$COMMIT \
    BUILD_DATE=$BUILD_DATE

RUN npm run build

# ─── Production stage ─────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]