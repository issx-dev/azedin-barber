# Security — Dependency Audit Exception

**Fecha**: 2 de agosto de 2026  
**Proyecto**: Azedin Barber (azedin-barber)  
**Stack**: Astro 4.16.19 + Vite 5.x + Sharp 0.35.x  
**Tipo de despliegue**: Estático (SSG) en Netlify CDN

---

## Estado actual de `pnpm audit --prod`

```
21 vulnerabilities found
Severity: 4 low | 12 moderate | 5 high
```

Las vulnerabilidades afectan a:
- **Astro** (4.16.19): Funcionalidades SSR, Server Islands, middleware de servidor y rutas dinámicas.
- **Vite** (5.x): Dev server y hot module replacement.
- **Sharp** (transitivo): Procesamiento de imágenes en tiempo de build.

## Análisis de exposición

### ¿Qué se despliega?

El comando `astro build` genera una carpeta `dist/` con archivos **100% estáticos**:
- HTML prerenderizado
- CSS compilado
- JavaScript del cliente (bundles Vite)
- Imágenes optimizadas (AVIF, WebP)
- Vídeos MP4/WebM

Netlify sirve estos archivos directamente desde su CDN. **No hay proceso Node.js en producción**.

### Categorización de vulnerabilidades

| Categoría | Cantidad | Exposición en producción |
|---|---|---|
| SSR / Server Islands / Middleware | 14 | ❌ No aplica — sin servidor Node.js |
| Dev server (Vite HMR) | 4 | ❌ No aplica — solo entorno local |
| Procesamiento de imágenes (Sharp) | 3 | ❌ No aplica — solo en tiempo de build |

### Conclusión

**Las vulnerabilidades no son alcanzables desde el runtime estático desplegado actualmente; el riesgo de dependencias queda aceptado y documentado.** La migración del árbol de dependencias se planificará como proyecto independiente.

## Plan de mitigación

1. **Corto plazo** (actual): Desplegar el build estático con esta excepción documentada.
2. **Medio plazo**: Planificar la migración a Astro v5+ como proyecto independiente, dado que implica breaking changes en la API de content collections, configuración de integraciones y estructura del proyecto.
3. **Monitorización**: Revisar `pnpm audit` periódicamente para detectar vulnerabilidades que pudieran afectar al build o al JavaScript del cliente.

## Verificaciones de seguridad superadas

- ✅ Todos los enlaces externos usan `rel="noopener noreferrer"`
- ✅ CTA de conversión (Booksy) servido por HTTPS
- ✅ Headers de seguridad configurados en Netlify (HSTS, X-Frame-Options, CSP, etc.)
- ✅ No se detectaron secretos en el repositorio
- ✅ `target="_blank"` protegido en todos los casos
