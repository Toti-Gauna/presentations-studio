# Prompt · modificar una presentación existente

```text
Trabajá en presentations-studio sobre decks/<deck>. Leé CLAUDE.md y docs/esquema.md.
Cambio pedido: <describir>.
Reglas:
- Tocá solo las escenas, afirmaciones o QR involucrados. Conservá ids, identidad visual, datos y escenas no mencionadas.
- Si cambia una cifra, cambiala en afirmaciones.json (con fuente y corte nuevos), no en el texto de la escena.
- Si cambia un destino QR, dejalo explícito en el resumen (es una acción visible para el público).
- Mantené las duraciones de cada versión dentro del objetivo (npm run validar lo verifica).
- No modifiques src/ ni server/. No publiques una versión congelada sin pedido explícito.
- Corré npm run verify y listá: escenas cambiadas, cifras cambiadas (antes → después), avisos.
```
