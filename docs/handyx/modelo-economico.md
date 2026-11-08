# Modelo económico (lote 5.2)

Código: `src/econ/modelo.ts` (genérico, sin marca) · Parámetros: `decks/handyx/escenarios.json` · Resultados:
`docs/handyx/escenarios.md` (`npm run escenarios`) · Pruebas: `tests/modelo.test.ts`, `tests/afirmaciones.test.ts`.

Unidad: **ARS constantes del 31/10/2026**. No se mezclan monedas ni se usa tipo de cambio. Desconocido = `null`.
Horizonte: mes 1 = piloto (10/11–10/12/2026) + 12 meses.

## Fórmulas aplicadas

1. **Trabajos** = pedidos × cobertura × aceptación | cubierto × finalización | aceptado (probabilidades condicionales: cada pérdida se descuenta una sola vez).
2. **Tope de capacidad**: trabajos = mín(demanda atendible, capacidad de oferta, capacidad de soporte). La capacidad de oferta usa especialistas **disponibles** (registrados × verificación × disponibilidad + altas), nunca los 56 registrados.
3. **GMV** = Σ precio base de trabajos completados. No incluye la tarifa de Handy ni materiales; cancelaciones y devoluciones no suman.
4. **Ingreso por tarifas** = Σ (tarifa usuario + tarifa especialista vigentes por mes y cohorte) − bonificación del primer trabajo del usuario − reembolsos. El reconocimiento contable lo confirma el contador.
5. **Contribución** = ingreso − pasarela − soporte variable. Fijos y captación se restan aparte para el flujo neto.
6. **CAC usuario** = gasto de captación de usuarios ÷ usuarios nuevos con **primer trabajo completado**. El costo por registro es otra métrica.
7. **LTV proyectado (12 meses)** = contribución por trabajo × trabajos esperados por usuario en 12 meses. No es histórico ni usa 1/churn.
8. **Runway** = caja propia ÷ consumo mensual promedio, **solo** si la caja está informada (hoy `null` → "no calculable"). El dinero del servicio va directo al especialista: no es caja de Handy.
9. **Equilibrio** = costos fijos ÷ contribución por trabajo (si es ≤ 0, no existe: el volumen no lo resuelve).

**MET-01:** el modelo reporta por separado `trabajos` (pagados por el usuario) y `trabajosConTarifa` (Handy cobró tarifa > 0).

## Resultados clave (escenario base; ver tablas completas en `escenarios.md`)

- Mes de piloto: ≈ 18 trabajos, ingreso por tarifas $ 0, consumo ≈ $ 536.000 (fijos $ 300.000 + captación $ 200.000 + soporte).
- Contribución por trabajo con tarifa estándar y usuario recurrente: ≈ $ 6.206 (0,20 P − 3 % reembolsos − 6 % pasarela s/ tarifa − $ 2.000 soporte).
- Equilibrio ≈ 49 trabajos/mes con fijos supuestos sin sueldos. En 13 meses el base llega a ≈ 90 trabajos/mes.
- En los tres escenarios el límite es la **demanda**: captar pedidos en la misma zona es la prioridad del piloto.
- La bonificación del primer trabajo del usuario pesa: cada usuario nuevo deja solo 0,05–0,10 P en su primer trabajo.
- Al 31/12 (≈ 3 semanas con tarifa) el base proyecta ≈ 15 trabajos con tarifa: la meta de 50 cobrados exige 3× la captación supuesta o aclarar MET-01.

## Los cinco datos que más cambian el resultado
Captación mensual de usuarios, repetición, precio base, cobertura por rubro/zona y aceptación de propuestas (ver sensibilidad).

## Pedido derivado (propuesta, no decisión)
Consumo de caja del base, sin sueldos: ≈ $ 3,0 M a 6 meses y ≈ $ 6,1 M a 13 meses → rango propuesto **$ 3 a 6 millones**.
Uso: ≈ 40 % captación, ≈ 60 % fijos e infraestructura. Monto, instrumento y condiciones: decisión de Ignacio (FUND-03).
No se inventa valuación, dilución ni compromisos.
