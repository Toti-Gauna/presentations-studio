# Guía de función (preparar · comprobar · iniciar · recuperar · cerrar)

## La noche anterior
1. `npm run publicar -- --deck=handyx --etiqueta=aticma-2026-11-04` con el corte de datos del 04/11 → `VITE_PUBLICADA=aticma-2026-11-04 npm run build`.
2. `npm run exportar:pdf -- --version=aticma`, `npm run exportar:video -- --version=aticma`, `npm run paquete:local`. Copiar `salida/paquete-local.zip` a un pendrive.
3. Imprimir los QR públicos (`salida/qr/handyx/*.png`) en A4 como contingencia.

## En el lugar (30 min antes)
1. Computadora con cargador, adaptador HDMI/USB-C, clicker. Modo avión **no**: Wi-Fi del evento o hotspot.
2. Abrir el presentador (`/presentador/?deck=handyx&version=aticma`) y **Abrir pantalla pública**; arrastrarla al proyector y apretar **F**.
   Si el navegador bloquea la ventana: usar el enlace manual que aparece debajo.
3. **Activar audio** con un clic en la computadora (y uno en la pantalla pública). El celular no habilita audio en la computadora.
4. Ver "Recursos listos N/N" y la huella de versión en la barra.
5. Control remoto: **Conectar control remoto** → escanear el QR privado con el celular → **Aprobar**. Verificar avance y "✓ Confirmado".
   Probar con el celular en datos móviles (red distinta). Nunca proyectar la ventana del presentador.
6. Recorrer 2 escenas, volver al inicio (tecla **Inicio**), reiniciar reloj.

## Durante
→ / Espacio / PageDown avanza · ← retrocede · ↓ ↑ saltan escena · **B** pantalla negra · **Inicio** reinicia · **R** reloj.

## Si algo falla
| Falla | Acción |
|---|---|
| El celular no confirma / "Sin conexión" | Seguir con clicker o teclado (siempre funciona). |
| Indicador "Sin confirmación del servidor" | Nada: la computadora manda. Al volver la red se sincroniza sola; o **Recuperar**. |
| La pública quedó desfasada | **Recuperar** en el presentador. |
| Navegador colgado | Paquete local (`node servir-local.ts dist 4173`) o PDF. |
| Video no arranca | Seguir con el póster; la historia no depende del video. |

## Al cerrar
**Terminar sesión remota** (revoca celulares e invalida la sesión) y cerrar las ventanas.
