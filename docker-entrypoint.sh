#!/bin/sh
set -e

echo "🚀 Starting container..."

echo "🗄️ Running Prisma migrations..."
node ./node_modules/prisma/build/index.js migrate deploy

echo "✅ Migrations applied"

echo "🔥 Starting Nuxt server..."
exec node .output/server/index.mjs