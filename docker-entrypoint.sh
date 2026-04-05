#!/bin/sh
set -e

echo "🚀 Starting container..."

echo "🗄️ Running Prisma migrations..."
npx prisma migrate deploy

echo "✅ Migrations applied"

echo "🔥 Starting Nuxt server..."
exec node .output/server/index.mjs