# Guía de Deployment - Optimizaciones de Performance

## 📋 Pre-Deployment Checklist

### 1. Verificar Cambios Localmente
```bash
# Limpiar build anterior
npm run clean

# Instalar dependencias (si es necesario)
npm install

# Build de producción
npm run build

# Iniciar servidor local
npm run start
```

### 2. Probar en Local
```bash
# Opción 1: Usar script de npm
npm run lighthouse:local

# Opción 2: Usar script de PowerShell (Windows)
.\scripts\test-performance.ps1

# Opción 3: Usar script de Bash (Unix/Mac)
bash scripts/test-performance.sh
```

### 3. Verificar que No Hay Errores
```bash
# Lint
npm run lint

# TypeScript check
npx tsc --noEmit

# Verificar que el servidor inicia correctamente
npm run start
# Abrir http://localhost:3000 y verificar que todo funciona
```

---

## 🚀 Deployment Steps

### Opción A: Vercel (Recomendado)

#### 1. Commit y Push
```bash
git add .
git commit -m "feat: implement performance optimizations

- Add redirect from bunnatic.com to www.bunnatic.com
- Optimize script loading (lazyOnload for analytics)
- Implement lazy loading for below-fold components
- Add resource preload and preconnect
- Configure webpack code splitting
- Add performance headers in middleware
- Optimize font loading with display swap

Expected improvements:
- TBT: 1180ms → 400-600ms
- Performance Score: 58 → 75-80
- LCP: 3.7s → 2.8s"

git push origin main
```

#### 2. Verificar Deploy en Vercel
- Ir a https://vercel.com/dashboard
- Verificar que el deploy se completó exitosamente
- Revisar los logs por si hay errores

#### 3. Esperar Propagación
- Esperar 5-10 minutos para que se propague el deploy
- Verificar que www.bunnatic.com muestra la nueva versión

---

### Opción B: Otro Hosting

#### 1. Build de Producción
```bash
npm run build
```

#### 2. Subir Archivos
Subir los siguientes archivos/carpetas:
- `.next/` (carpeta completa)
- `public/`
- `package.json`
- `package-lock.json`
- `.env.production` (si aplica)

#### 3. Instalar Dependencias en Servidor
```bash
npm install --production
```

#### 4. Iniciar Aplicación
```bash
npm run start
```

---

## ✅ Post-Deployment Verification

### 1. Verificar Redirect
```bash
# Debe redirigir a www.bunnatic.com
curl -I https://bunnatic.com/

# Debe retornar 301 Moved Permanently
# Location: https://www.bunnatic.com/
```

### 2. Verificar Headers
```bash
# Verificar headers de performance
curl -I https://www.bunnatic.com/

# Debe incluir:
# X-DNS-Prefetch-Control: on
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
```

### 3. Verificar Scripts
- Abrir https://www.bunnatic.com/
- Abrir DevTools → Network
- Verificar que Google Analytics y Clarity se cargan con `lazyOnload`
- Verificar que componentes lazy-loaded se cargan al hacer scroll

### 4. Lighthouse Audit (Esperar 24-48h)
```bash
# Audit completo
npm run lighthouse

# O manualmente
npx lighthouse https://www.bunnatic.com/ --view
```

---

## 📊 Métricas a Monitorear

### Inmediato (0-24h)
- ✅ Redirect funciona correctamente
- ✅ No hay errores en consola
- ✅ Todos los componentes se cargan
- ✅ Analytics funciona correctamente

### Corto Plazo (24-48h)
- 📈 Performance Score > 75
- 📈 TBT < 600ms
- 📈 LCP < 3.0s
- 📈 FCP < 2.0s
- ✅ CLS = 0

### Mediano Plazo (1 semana)
- 📊 Core Web Vitals en Google Search Console
- 📊 Bounce rate
- 📊 Tiempo de permanencia
- 📊 Conversiones

---

## 🔧 Troubleshooting

### Problema: Redirect no funciona
**Solución**: Verificar que el hosting soporta redirects de Next.js
```typescript
// En next.config.ts debe estar:
async redirects() {
  return [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'bunnatic.com' }],
      destination: 'https://www.bunnatic.com/:path*',
      permanent: true,
    },
  ]
}
```

### Problema: Scripts no se cargan
**Solución**: Verificar que los componentes tienen `'use client'`
```typescript
// En GoogleAnalytics.tsx y MicrosoftClarity.tsx
'use client'
```

### Problema: Lazy loading no funciona
**Solución**: Verificar imports en app/page.tsx
```typescript
import dynamic from 'next/dynamic'

const Comparison = dynamic(() => import('@/components/Comparison'), {
  loading: () => <div className="h-96" />,
})
```

### Problema: Build falla
**Solución**: Limpiar cache y reinstalar
```bash
npm run clean
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

---

## 📈 Comparación de Resultados

### Antes de Optimizaciones
```
Performance: 58/100
FCP: 2.6s
LCP: 3.7s
TBT: 1,180ms ❌
TTI: 7.5s
CLS: 0 ✓
```

### Después de Optimizaciones (Esperado)
```
Performance: 75-80/100 ✓
FCP: ~2.0s ✓
LCP: ~2.8s ✓
TBT: ~400-600ms ✓
TTI: ~5.0s ✓
CLS: 0 ✓
```

---

## 🎯 Próximos Pasos Opcionales

### 1. Bundle Analysis
```bash
npm install -D @next/bundle-analyzer
npm run analyze
```

### 2. Implementar ISR
Para páginas semi-estáticas:
```typescript
export const revalidate = 3600 // 1 hora
```

### 3. Implementar Caching
Con Redis/Upstash para queries frecuentes

### 4. Optimizar Imágenes
Agregar `priority` a imágenes LCP:
```typescript
<Image src="/hero.jpg" priority />
```

### 5. Monitoring Continuo
- Configurar Lighthouse CI
- Implementar Real User Monitoring (RUM)
- Monitorear Core Web Vitals en producción

---

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs de build/deploy
2. Verificar que todas las dependencias están instaladas
3. Comprobar que las variables de entorno están configuradas
4. Revisar la documentación de Next.js: https://nextjs.org/docs

---

## ✨ Conclusión

Todas las optimizaciones están implementadas y listas para deploy. 

**Recuerda**:
- Hacer backup antes de deploy
- Monitorear métricas después del deploy
- Esperar 24-48h para resultados definitivos
- Iterar basándose en datos reales

¡Buena suerte con el deploy! 🚀
