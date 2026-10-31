#!/usr/bin/env bash
# Publica el build estático en Hostinger por SSH/rsync en una carpeta propia (nunca en la raíz de otro sitio).
# Uso: HOSTINGER_SSH=usuario@host -p PUERTO  DESTINO=domains/pitch.handyc.com/public_html  deploy/hostinger-publicar.sh
set -euo pipefail
: "${HOSTINGER_SSH:?falta HOSTINGER_SSH}"; : "${DESTINO:?falta DESTINO}"
case "$DESTINO" in *pitch*|*presentaciones*) ;; *) echo "DESTINO no parece la carpeta del pitch: $DESTINO" >&2; exit 1;; esac
npm run verify
rsync -az --delete -e "ssh ${HOSTINGER_SSH#* }" dist/ "${HOSTINGER_SSH%% *}:$DESTINO/.nuevo/"
ssh ${HOSTINGER_SSH} "cd $DESTINO && rm -rf .anterior && mkdir -p .anterior && find . -maxdepth 1 ! -name . ! -name .nuevo ! -name .anterior -exec mv {} .anterior/ \; && mv .nuevo/* . && rmdir .nuevo"
echo "Publicado. Respaldo anterior en $DESTINO/.anterior"
