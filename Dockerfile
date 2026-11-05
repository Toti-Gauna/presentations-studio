# syntax=docker/dockerfile:1
# Un solo contenedor: sirve la presentación (build estático) y el control desde el celular (WebSocket) en el mismo
# dominio. Sin base de datos. Node ≥ 22.18 (corre TypeScript nativo). Detrás de Caddy (HTTPS) en el VPS.

FROM node:22-alpine AS construccion
WORKDIR /app
COPY package.json package-lock.json ./
# Certificado extra opcional (solo redes con proxy corporativo): docker build --secret id=ca,src=ruta.crt .
RUN --mount=type=secret,id=ca,required=false NODE_EXTRA_CA_CERTS=/run/secrets/ca npm ci --include=dev --no-audit --no-fund
COPY . .
ARG VITE_DECK=handyx-pitch
ARG VITE_SERVIDOR=
ENV VITE_DECK=$VITE_DECK VITE_SERVIDOR=$VITE_SERVIDOR
RUN npx vite build

FROM node:22-alpine
ENV NODE_ENV=production PORT=8787 HOST=0.0.0.0 SERVIR_ESTATICOS=dist MISMO_ORIGEN=true CONFIAR_PROXY=true \
    QR_REDIRECCIONES=decks/handyx/qr.json
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=ca,required=false NODE_EXTRA_CA_CERTS=/run/secrets/ca npm ci --omit=dev --ignore-scripts --no-audit --no-fund && npm cache clean --force
COPY --from=construccion /app/dist ./dist
COPY server ./server
COPY src/core ./src/core
COPY decks/handyx/qr.json ./decks/handyx/qr.json
USER node
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1:8787/salud > /dev/null || exit 1
CMD ["node", "server/main.ts"]
