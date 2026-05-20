#!/bin/sh

# Extraer host y puerto de DATABASE_URL
# Asume formato: mysql://user:pass@host:port/db
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\).*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')

# Si no hay puerto explícito, usa 3306
if [ -z "$DB_PORT" ]; then
  DB_PORT=3306
fi

echo "⏳ Esperando a MySQL en $DB_HOST:$DB_PORT..."

while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

echo "✅ MySQL está disponible"

echo "🚀 Ejecutando migraciones..."
pnpm exec prisma migrate deploy

echo "🚀 Iniciando aplicación..."
exec node dist/src/main.js