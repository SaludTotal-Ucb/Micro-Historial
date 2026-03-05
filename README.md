# Micro-Historial
Microservicio del Historial Médico

Este repositorio utiliza **Biome** como herramienta unificada para formateo y linting, reemplazando ESLint y Prettier. Además se integra con **Husky** y **lint-staged** para ejecutar validaciones antes del `commit`.

## Configuración principal

- **biome.json**: archivo raíz donde se define la configuración del formateador y del linter.
- **package.json**:
  - Dependencias de desarrollo:
    - `@biomejs/biome` (analizador y formateador).
    - `husky` (hooks de git).
    - `lint-staged` (ejecuta Biome sólo en los archivos modificados).
  - Scripts disponibles:
    ```json
    "scripts": {
      "prepare": "husky install",
      "lint": "biome check .",
      "format": "biome format ."
    }
    ```
  - Sección `lint-staged`:
    ```json
    "lint-staged": {
      "*.js": [
        "biome format",
        "biome check --quiet"
      ]
    }
    ```

## Reglas de estilo y linting

La configuración de `biome.json` establece:

- **Formato**
  - Punto y coma obligatorio (`semi: true`).
  - Comillas simples (`singleQuote: true`).
  - Indentación de 2 espacios (`tabWidth: 2`).
- **Linting**
  - Basado en `biome:recommended`.
  - Detecta variables no usadas como advertencia y errores de variables no declaradas.

Ejemplo completo de `biome.json`:

```json
{
  "root": true,
  "formatter": {
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2
  },
  "linter": {
    "enabled": true,
    "extends": ["biome:recommended"],
    "rules": {
      "no-unused-vars": "warn",
      "no-undef": "error"
    }
  }
}
```

## Hooks de Git

Husky se configura con un hook `pre-commit` que ejecuta `lint-staged`. Antes de que un commit se registre, Biome:

1. Formatea los archivos `.js` cambiados.
2. Ejecuta el linter en modo silencioso.

Si Biome encuentra problemas de lint o formato, el commit será rechazado y deberás corregir los errores antes de intentar de nuevo.

### Inicializar y actualizar hooks

```bash
npm install          # instala dependencias
npm run prepare       # activa Husky
npx husky add .husky/pre-commit "npx lint-staged"
```

## Uso diario

- `npm run format`: formatea todos los archivos del proyecto.
- `npm run lint`: ejecuta las comprobaciones de Biome en el proyecto.

Al hacer `git commit`, las validaciones se ejecutarán automáticamente.

---

Con estas herramientas unificadas garantizamos un **código consistente**, detección temprana de errores y **procesos de commit seguros** en los microservicios del backend Node.js/Express.
