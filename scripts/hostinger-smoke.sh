#!/usr/bin/env bash
# Pruebas públicas de solo lectura de la presentación publicada y de su servidor de control (Render).
# Uso: bash scripts/hostinger-smoke.sh <URL de la presentación> [URL del servidor de control]
set -euo pipefail
base=${1:?Falta la URL de la presentación}
base=${base%/}
control=${2:-}
control=${control%/}

pedir() { curl --fail --silent --show-error --retry 3 --retry-delay 5 --connect-timeout 15 --max-time 30 "$@"; }
falla() { echo "Falló la prueba: $1" >&2; exit 1; }

inicio=$(pedir "$base/")
[[ "$inicio" == *'<title>Presentations Studio</title>'* ]] || falla 'el inicio no es el hub de presentaciones'
for ruta in presentar/ presentador/ control/ imprimir/; do
  pedir "$base/$ruta" >/dev/null || falla "no carga /$ruta"
done
if [[ "$base" == https://* ]]; then
  destino=$(curl --silent --output /dev/null --write-out '%{redirect_url}' --connect-timeout 15 --max-time 30 "http://${base#https://}/")
  [[ "$destino" == https://* ]] || falla 'http no redirige a https'
fi
if [[ -n "$control" ]]; then
  salud=$(pedir -H "Origin: $base" "$control/salud") || falla "el servidor de control $control no responde"
  [[ "$salud" == *'"ok":true'* ]] || falla 'el servidor de control no está sano'
  permitido=$(curl --silent --output /dev/null --dump-header - -H "Origin: $base" -X OPTIONS "$control/api/sesiones" | tr -d '\r' | awk 'tolower($1)=="access-control-allow-origin:" {print $2}')
  [[ "$permitido" == "$base" ]] || falla "el servidor de control no acepta el origen $base (revisá ALLOWED_ORIGINS en Render)"
fi
echo "La presentación publicada responde bien${control:+ y el servidor de control acepta su origen}."
