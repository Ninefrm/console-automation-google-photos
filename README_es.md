# Console Automation – Google Photos Selector

Scripts de **automatización por consola** (navegador) para gestionar fotos masivamente en Google Photos.

Este proyecto nació para resolver un problema real: migrar miles de fotos de una cuenta de Google a otra sin tener que dar clic día por día.

Incluye **dos scripts complementarios** dentro de `/scripts/`:

- 📅 `google-photos-days-selector.js` → Selección automática por días completos
- 🖼️ `google-photos-photos-selector.js` → Selección automática foto por foto (modo revisión)

Juntos permiten migraciones grandes de forma rápida y sencilla.

---

## 💡 ¿Por qué existe?

Necesitaba migrar mi biblioteca entre cuentas.

Google Photos no ofrece una forma fácil de:

❌ Seleccionar muchos días rápidamente  
❌ Agregar grandes cantidades de fotos a un álbum  
❌ Revisar fotos pendientes fácilmente  

Hacerlo manualmente = horas de clics repetitivos.

Así que creé scripts de **automatización en consola**.

---

## 📁 Estructura del proyecto

```
/scripts
   google-photos-days-selector.js
   google-photos-photos-selector.js
README.md
```

---

## 🔁 Flujo real de migración (recomendado)

### Paso a paso

1. Inicia sesión en la **cuenta destino**
2. Crea **un álbum compartido**
3. Invita a la **cuenta origen**
4. Cambia a la **cuenta origen**
5. Abre el álbum → “Agregar fotos”
6. Abre DevTools → Consola
7. Ejecuta los scripts

### Uso típico

### 1️⃣ Primero selecciona días
Ejecuta:
```
scripts/google-photos-days-selector.js
```

Selecciona muchos **días completos**.

Luego presiona **Guardar manualmente**.

### 2️⃣ Después revisa pendientes (opcional)
Ejecuta:
```
scripts/google-photos-photos-selector.js
```

Este:
- selecciona fotos individuales
- oculta las ya seleccionadas
- hace scroll automático
- ayuda a encontrar lo que faltó

Ejecutarlo otra vez lo desactiva.

---

## ✨ Características

### Selector por días
✔ Selección masiva por día  
✔ Detección inteligente  
✔ Scroll configurable  
✔ Independiente del idioma  

### Selector por fotos
✔ Selección automática de fotos visibles  
✔ Oculta las ya seleccionadas  
✔ Toggle ON/OFF  
✔ Scroll arriba/abajo  
✔ Inicio arriba/abajo/mantener  

---

## 🚀 Inicio rápido

1. Abre Google Photos
2. Ve al álbum o línea de tiempo
3. Abre DevTools → Consola
4. Pega uno de los scripts
5. Presiona Enter

---

## ⚙️ Configuración

### Selector por días

```javascript
const ACTION_MODE = "older"; // newer | older | both
const DAYS_TO_SELECT = 5;
const SAVE_CLICKS = true;
```

### Selector por fotos

```javascript
const START_AT = "top";     // top | bottom | keep
const SCROLL_MODE = "down"; // down | up
```

---

## 🧠 Cómo funciona

En lugar de depender de textos como:

❌ aria-label^="Seleccionar todas las fotos"

Los scripts usan:

✔ role="checkbox"  
✔ aria-checked  
✔ estructura del DOM  
✔ proximidad visual  

Por eso funcionan en cualquier idioma.

---

## ⚠️ Aviso

No es una herramienta oficial de Google.  
Solo simula clics localmente en tu navegador.

Úsalo bajo tu responsabilidad.

---
