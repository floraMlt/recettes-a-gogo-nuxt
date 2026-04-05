FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --ignore-scripts

COPY . .

RUN node_modules/.bin/prisma generate && node_modules/.bin/nuxt prepare

ARG VERSION
ARG COMMIT
ARG BUILD_DATE
ENV VERSION=$VERSION \
    COMMIT=$COMMIT \
    BUILD_DATE=$BUILD_DATE

RUN npm run build

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
