# Prompt · crear una presentación nueva

```text
Trabajá en el repo presentations-studio. Leé CLAUDE.md, docs/esquema.md y docs/claude/flujo.md.
Creá una presentación nueva a partir del brief adjunto:
- Marca: brands/<marca>/tema.json (tokens, paletas con "neutro", fuentes locales o del sistema, personajes solo si hay arte con licencia).
- Deck: decks/<deck>/deck.json, afirmaciones.json y qr.json. Una idea principal por escena. Una versión por duración pedida.
- Toda cifra en pantalla va como {{ID}} de afirmaciones.json con tipo, fuente, corte y verificación. Desconocido = null y solo en notas.
  Proyecciones con fórmula. No inventar datos, testimonios, clientes, alianzas ni cifras.
- QR públicos con destino definido por el cliente; definitivo=false hasta que confirme. Nunca credenciales en un QR.
- No modifiques src/ ni server/. Si el esquema no alcanza, detenete y proponé el cambio de núcleo por separado.
- Corré npm run verify hasta 0 errores, generá capturas o PDF de vista previa y resumí avisos pendientes (arte temporal, QR provisorios).
```
