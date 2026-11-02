#!/usr/bin/env bash
# Se ejecuta en Hostinger, por SSH, desde .github/workflows/deploy-hostinger.yml. No recibe credenciales.
# Copia del método de Handy-landing-page-fe (mismo que Eclipse-Web): copia el sitio compilado a la carpeta del subdominio con
# un respaldo previo y, si algo falla (la copia o las pruebas públicas), restaura lo anterior.
#
#   publish  <carpeta> <release> [perfil]   copia el sitio de .handyx-deploy/staging/<release> a <carpeta>
#   rollback <carpeta> <release> [perfil]   restaura el respaldo de esa release
#
# Perfil (solo puede publicar en su carpeta; nunca en la landing ni en las apps):
#   pitch            pitch.handyc.com (o handyc.com/pitch)
set -Eeuo pipefail

action=${1:?Falta la acción: publish o rollback}
target=${2:?Falta la carpeta de publicación}
release=${3:?Falta el identificador de release}
profile=${4:-pitch}
[[ "$action" == publish || "$action" == rollback ]] || exit 2
[[ "$release" =~ ^[0-9]+-[0-9]+-[a-f0-9]{40}$ ]] || { echo "Identificador de release inválido." >&2; exit 2; }
# Cada perfil publica solo en su carpeta: la landing nunca pisa la raíz de handyc.com (ahí va la app del usuario) y las
# apps nunca pisan la landing ni se pisan entre sí.
case "$profile:$target" in
  pitch:/*/domains/pitch.handyc.com/public_html | pitch:/*/domains/handyc.com/public_html/pitch) ;;
  pitch:*) echo "Carpeta de publicación inesperada para el perfil $profile." >&2; exit 2 ;;
  *) echo "Perfil desconocido: $profile." >&2; exit 2 ;;
esac
[[ -d "$target" && ! -L "$target" ]] || { echo 'La carpeta de publicación no existe o es un enlace.' >&2; exit 2; }
root="${target%%/public_html*}"
base="$root/.handyx-deploy"
stage="$base/staging/$release"
backup="$base/backups/$release.tar.gz"
umask 077
mkdir -p "$base/backups"
chmod 700 "$base" "$base/backups"
mkdir "$base/lock" || { echo 'Hay otra publicación en curso: revisá el lock antes de reintentar.' >&2; exit 1; }
trap 'rmdir "$base/lock"' EXIT

restore() {
  [[ -f "$backup" && -f "$backup.list" && -d "$stage" ]] || return 1
  # Hostinger puede no exponer /dev/fd: se usa una lista privada en disco.
  local incoming="$base/backups/$release.incoming"
  find "$stage" -type f -print0 > "$incoming" || return 1
  # Se borran solo los archivos que introdujo esta release y después se restaura el respaldo completo.
  while IFS= read -r -d '' file; do
    relative=${file#"$stage/"}
    if ! grep -Fxq -- "./$relative" "$backup.list"; then
      rm -f -- "$target/$relative" || return 1
    fi
  done < "$incoming"
  tar --same-permissions -xzf "$backup" -C "$target" || return 1
  echo "Se restauró el respaldo de la release $release."
}

if [[ "$action" == rollback ]]; then
  restore
  exit
fi

required=(index.html .htaccess presentar/index.html presentador/index.html control/index.html imprimir/index.html)
for file in "${required[@]}"; do
  [[ -s "$stage/$file" ]] || { echo "Sitio incompleto: falta $file." >&2; exit 1; }
done
[[ -d "$stage/assets" ]] || { echo 'Sitio incompleto: falta assets/.' >&2; exit 1; }
# Un .htaccess ajeno (por ejemplo el de Hostinger) se revisa antes de reemplazarlo: no se pisa en silencio.
if [[ -s "$target/.htaccess" ]] && ! grep -Fxq '# Handyx Hostinger managed static export' "$target/.htaccess"; then
  echo 'Hay un .htaccess que no es de este despliegue: revisalo antes de la primera publicación. No se cambió nada.' >&2
  exit 1
fi
# No se siguen enlaces simbólicos al copiar en la carpeta pública.
[[ -z "$(find "$target" "$stage" -type l -print -quit)" ]] || {
  echo 'Revisá los enlaces simbólicos antes de publicar.' >&2; exit 1;
}
[[ ! -e "$backup" ]] || { echo 'Esta release ya tiene un respaldo.' >&2; exit 1; }
tar -czf "$backup" -C "$target" .
tar -tzf "$backup" > "$backup.list"

publication_failed() {
  trap - ERR
  echo 'Falló la publicación: se restauran los archivos anteriores.' >&2
  if ! restore; then
    echo 'Falló la restauración automática. Usá el respaldo guardado antes de reintentar.' >&2
  fi
  exit 1
}
trap publication_failed ERR
find "$stage" -type d -exec chmod 755 {} +
find "$stage" -type f -exec chmod 644 {} +
# El respaldo es privado (umask 077); los archivos públicos tienen que quedar legibles.
umask 022
# Primero los assets (con hash): se conservan los anteriores para que las páginas ya abiertas sigan andando.
cp -R --preserve=mode "$stage/assets" "$target/"
cp -R --preserve=mode "$stage/." "$target/"
trap - ERR
echo "Release $release publicada. Respaldo: $backup"
