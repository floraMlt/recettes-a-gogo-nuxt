FROM node:22-alpine AS base

# ─── Build stage ─────────────────────────────────────────────────────────────
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

# ─── Production stage ─────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.output ./.output
# Prisma uses a native query engine binary that cannot be bundled
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
