# Console Automation - Google Photos Selector
# 📸 Google Photos Bulk Day Selection Script

Script de **automatización por consola** (navegador) para seleccionar múltiples días completos en Google Photos.

Fue creado para resolver un problema real: migrar miles de fotos de una cuenta de Google a otra sin tener que dar clic día por día.

---

## 💡 ¿Por qué existe?

Necesitaba migrar mi biblioteca de fotos de una cuenta a otra.

Google Photos no ofrece una forma sencilla de:

❌ Seleccionar muchos días rápidamente  
❌ Añadir grandes bloques de fotos a un álbum  

Hacerlo manualmente = horas de clics.

Así que creé un **script de automatización en consola** que selecciona varios días automáticamente mientras navegas.

---

## 🔁 Flujo real de migración (cómo lo uso)

Este es el proceso exacto para el que fue diseñado:

### Paso a paso

1. Inicia sesión en la **cuenta destino**
2. Crea **un álbum compartido**
3. Invita a la **cuenta origen**
4. Cambia a la **cuenta origen**
5. Abre el álbum → clic en **“Agregar fotos”**
6. Abre DevTools → **Consola**
7. Pega y ejecuta el script
8. Los días se seleccionan automáticamente
9. Presiona **Guardar manualmente**
10. Repite las veces necesarias

Esto te permite:

✅ Ejecutarlo múltiples veces  
✅ Migrar por lotes  
✅ Evitar bloqueos o timeouts  
✅ Tener control total de lo que agregas  

---

## ✨ Características

✔ Selección masiva por día  
✔ Funciona en cualquier idioma  
✔ No depende de clases CSS frágiles  
✔ Usa roles accesibles (role="checkbox")  
✔ Detección inteligente del día  
✔ Dirección de scroll configurable  
✔ Guardado opcional de clics  
✔ Sin instalación  
✔ Corre directamente en la consola  

---

## 🚀 Inicio rápido

1. Abre Google Photos
2. Entra al álbum o línea de tiempo
3. Abre DevTools → Consola
4. Pega script.js
5. Presiona Enter

Listo.

---

## ⚙️ Configuración

```javascript
const ACTION_MODE = "older"; // newer | older | both
const DAYS_TO_SELECT = 5;
const SAVE_CLICKS = true;
```

| Opción | Descripción |
|---------|-------------|
| ACTION_MODE | Dirección del scroll |
| DAYS_TO_SELECT | Número de días a seleccionar |
| SAVE_CLICKS | Guardar etiquetas para debug/repetir |

---

## 🧠 Cómo funciona

En lugar de depender de textos como:

❌ aria-label^="Seleccionar todas las fotos"

El script usa:

✔ role="checkbox"  
✔ estructura del DOM  
✔ proximidad visual al encabezado del día  

Por eso funciona en cualquier idioma.

---

## ⚠️ Aviso

No es una herramienta oficial de Google.  
Solo simula clics localmente en tu navegador.

Úsalo bajo tu responsabilidad.

---
