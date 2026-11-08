#!/usr/bin/env sh
# Configurador de deploy. Usa Node si está instalado (≥ 22.18); si no, lo corre dentro de Docker.
set -e
cd "$(dirname "$0")"
if command -v node >/dev/null 2>&1 && node -e 'const [a,b]=process.versions.node.split(".").map(Number);process.exit(a>22||(a===22&&b>=18)?0:1)'; then
  exec node scripts/configurar-deploy.ts
fi
exec docker run -it --rm -v "$PWD":/app -w /app node:22-alpine sh -c "apk add --no-cache openssh-keygen >/dev/null && node scripts/configurar-deploy.ts"
