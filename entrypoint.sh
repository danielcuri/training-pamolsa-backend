#!/bin/sh
set -e

echo "=========================================="
echo "🔍 DEBUGGING: Variables de entorno"
echo "=========================================="
echo "DATABASE_URL: ${DATABASE_URL:-(NO DEFINIDA)}"
echo "NODE_ENV: ${NODE_ENV:-(NO DEFINIDA)}"
echo "PWD: $(pwd)"
echo "Archivos en /app:"
ls -la /app/ | head -20
echo "=========================================="

# Extraer host y puerto de DATABASE_URL
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\).*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')

if [ -z "$DB_PORT" ]; then
  DB_PORT=3306
fi

echo "⏳ Esperando MySQL en $DB_HOST:$DB_PORT..."

TIMEOUT=30
ELAPSED=0
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  if [ $ELAPSED -ge $TIMEOUT ]; then
    echo "❌ Timeout: No se pudo conectar a $DB_HOST:$DB_PORT"
    exit 1
  fi
  echo "  Reintentando... ($ELAPSED/$TIMEOUT)"
  sleep 1
  ELAPSED=$((ELAPSED + 1))
done

echo "✅ MySQL está disponible"

echo "🔄 Ejecutando migraciones con Prisma 7.4..."
echo "Comando: pnpm exec prisma migrate deploy"

# Ejecutar migraciones con output detallado
pnpm exec prisma migrate deploy 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Migraciones ejecutadas correctamente"
else
  echo "❌ Error en migraciones"
  exit 1
fi

echo "🚀 Iniciando aplicación..."
exec node dist/src/main.js