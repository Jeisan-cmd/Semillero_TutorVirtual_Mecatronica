# 🔒 REPORTE DE AUDITORÍA DE SEGURIDAD
## Semillero Tutor Virtual Mecatrónica

**Fecha:** 28 de enero de 2026  
**Versión:** 1.0  
**Generado por:** Auditoría Automática de Código  

---

## 📋 TABLA DE CONTENIDOS

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Vulnerabilidades Críticas](#vulnerabilidades-críticas)
3. [Vulnerabilidades Altas](#vulnerabilidades-altas)
4. [Vulnerabilidades Medias](#vulnerabilidades-medias)
5. [Vulnerabilidades Bajas](#vulnerabilidades-bajas)
6. [Fortalezas del Proyecto](#fortalezas-del-proyecto)
7. [Recomendaciones de Mejora](#recomendaciones-de-mejora)
8. [Plan de Acción](#plan-de-acción)
9. [Matriz de Riesgo](#matriz-de-riesgo)

---

## 📊 RESUMEN EJECUTIVO

### Puntuación de Seguridad General
```
█████░░░░ 50/100 - SEGURIDAD MEDIA
```

### Estadísticas de Vulnerabilidades
| Nivel | Cantidad | Estado |
|-------|----------|--------|
| 🔴 Críticas | 3 | Requieren acción inmediata |
| 🟠 Altas | 4 | Requieren acción prioritaria |
| 🟡 Medias | 5 | Requieren mejora |
| 🟢 Bajas | 2 | Mejora opcional |
| ✅ Implementadas | 8 | Sin problemas |

### Conclusión
El proyecto tiene una **base de seguridad sólida** con implementación de JWT, bcrypt y Prisma ORM. Sin embargo, existen **3 vulnerabilidades críticas** relacionadas con tokens, contraseñas expuestas y CORS que deben ser corregidas inmediatamente antes de producción.

---

## 🔴 VULNERABILIDADES CRÍTICAS

### 1. Tokens JWT en localStorage (CRÍTICO - CVSS: 8.8)

**Ubicación:**
- `composables/useAuth.ts` (líneas 24-25)
- `pages/login.vue` (línea 108)
- `pages/student/chat.vue` (línea 421)

**Descripción:**
Los tokens JWT se guardan en `localStorage`, lo cual es vulnerable a ataques XSS. Cualquier script malicioso puede acceder al token y usar la sesión.

**Código Vulnerable:**
```typescript
// ❌ MALO
localStorage.setItem('token', res.token)
localStorage.setItem('user', JSON.stringify(res.user))
```

**Impacto:**
- Robo de sesiones
- Acceso no autorizado a datos
- Suplantación de identidad

**Solución Recomendada:**
```typescript
// ✅ BUENO - Usar HTTP-Only Cookies
setCookie(event, 'token', token, {
  httpOnly: true,
  secure: true, // Solo HTTPS
  sameSite: 'strict',
  maxAge: 8 * 60 * 60
})

// Cliente: El navegador maneja las cookies automáticamente
const response = await $fetch('/api/ruta', {
  credentials: 'include' // Envía cookies automáticamente
})
```

**Prioridad:** 🔴 **INMEDIATA**

---

### 2. CORS Demasiado Permisivo (CRÍTICO - CVSS: 7.5)

**Ubicación:**
- `nuxt.config.ts` (línea 115-117)

**Descripción:**
El CORS permite requests desde **cualquier origen** (`*`). Esto permite ataques CSRF y acceso desde sitios maliciosos.

**Código Vulnerable:**
```typescript
// ❌ MALO
nitro: {
  routeRules: {
    "/api/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*", // ⚠️ Demasiado permisivo
      },
    },
  },
}
```

**Impacto:**
- Ataques CSRF (Cross-Site Request Forgery)
- Acceso desde sitios maliciosos
- Fuga de datos

**Solución Recomendada:**
```typescript
// ✅ BUENO - Restringir a dominios específicos
nitro: {
  routeRules: {
    "/api/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "https://tudominio.com",
        "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Max-Age": "3600"
      },
    },
  },
}
```

**Prioridad:** 🔴 **INMEDIATA**

---

### 3. Contraseñas Expuestas en API (CRÍTICO - CVSS: 9.1)

**Ubicación:**
- `server/api/admin/[users].get.ts` (línea 24)

**Descripción:**
La endpoint retorna las contraseñas hasheadas de los usuarios. Aunque estén hasheadas, esto nunca debe suceder.

**Código Vulnerable:**
```typescript
// ❌ MALO - Expone contraseñas
select: {
  id: true,
  documentoIdentidad: true,
  nombre: true,
  correo: true,
  rol: true,
  contrasena: true, // ⚠️ NUNCA incluir
}
```

**Impacto:**
- Acceso a hashes de contraseña
- Posibilidad de ataque de fuerza bruta (rainbow tables)
- Violación de privacidad

**Solución Recomendada:**
```typescript
// ✅ BUENO - Excluir contraseña
select: {
  id: true,
  documentoIdentidad: true,
  nombre: true,
  correo: true,
  rol: true,
  activo: true,
  creadoEn: true
  // ❌ NO incluir: contrasena
}
```

**Prioridad:** 🔴 **INMEDIATA**

---

## 🟠 VULNERABILIDADES ALTAS

### 4. JWT_SECRET con Fallback Débil (ALTO - CVSS: 7.2)

**Ubicación:**
- `server/api/students/calendar.get.ts` (línea 21)
- `server/api/students/chatStudents/auth.ts` (línea 8)

**Descripción:**
Si `JWT_SECRET` no está configurado, usa una contraseña por defecto débil ("fallback_secret" o "secret").

**Código Vulnerable:**
```typescript
// ❌ MALO
const secret = process.env.JWT_SECRET || "fallback_secret"
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
```

**Impacto:**
- Si la variable de entorno no está configurada, es fácil adivinar el secreto
- Cualquiera puede generar tokens válidos

**Solución Recomendada:**
```typescript
// ✅ BUENO
const secret = process.env.JWT_SECRET
if (!secret) {
  throw new Error('JWT_SECRET no está configurado en variables de entorno')
}
const decoded = jwt.verify(token, secret)
```

**Prioridad:** 🟠 **ALTA**

---

### 5. Falta de Rate Limiting Global (ALTO - CVSS: 6.8)

**Ubicación:**
- Solo en `server/api/students/chatStudents/chat.post.ts`

**Descripción:**
Solo el endpoint de chat tiene rate limiting. Las demás rutas están desprotegidas de ataques de fuerza bruta.

**Impacto:**
- Ataques de fuerza bruta (login, registro)
- DoS (Denial of Service)
- Abuso de API

**Solución Recomendada:**
```typescript
// ✅ BUENO - Rate limiting global
npm install h3-ratelimit

// En server/middleware/rateLimit.ts
import { defineEventHandler, createError } from 'h3'
import { RateLimiter } from 'h3-ratelimit'

const limiter = new RateLimiter({
  max: 100, // 100 requests
  interval: 15 * 60 * 1000 // por 15 minutos
})

export default defineEventHandler(async (event) => {
  const id = event.node.req.socket.remoteAddress || 'unknown'
  
  if (!limiter.isAllowed(id)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Demasiadas solicitudes. Intenta más tarde.'
    })
  }
})
```

**Prioridad:** 🟠 **ALTA**

---

### 6. Sin Validación de Input con Schema (ALTO - CVSS: 6.5)

**Ubicación:**
- `server/api/admin/[users].get.ts` (búsqueda sin validar)
- `server/api/admin/[users].post.ts` (validación básica)

**Descripción:**
No hay validación de esquema. Los inputs se validan de forma manual.

**Código Vulnerable:**
```typescript
// ❌ MALO - Sin validación de esquema
const search = (query.search as string) || ""
const { titulo, contenido, orden, asignaturaId } = body

if (!titulo || !contenido || orden === undefined || !asignaturaId) {
  // Validación débil
}
```

**Impacto:**
- Inyección de código
- Validación inconsistente
- Difícil de mantener

**Solución Recomendada:**
```typescript
// ✅ BUENO - Usar Zod para validación
npm install zod

import { z } from 'zod'

const createUserSchema = z.object({
  documentoIdentidad: z.string().min(5).max(20),
  nombre: z.string().min(2).max(100),
  correo: z.string().email(),
  contrasena: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  telefono: z.string().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const validatedData = createUserSchema.parse(body)
  // Usar validatedData
})
```

**Prioridad:** 🟠 **ALTA**

---

### 7. Sin Encriptación de Datos Sensibles (ALTO - CVSS: 6.4)

**Ubicación:**
- Base de datos (email, teléfono sin encriptar)

**Descripción:**
Datos PII (Personally Identifiable Information) no están encriptados en la BD.

**Impacto:**
- Violación de GDPR/LOPD
- Exposición de datos personales
- Incumplimiento normativo

**Solución Recomendada:**
```typescript
// ✅ BUENO - Encriptar campos sensibles
npm install @prisma/extension-encrypt-fields

// En schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Campos a encriptar: correo, documentoIdentidad, telefono
```

**Prioridad:** 🟠 **ALTA**

---

## 🟡 VULNERABILIDADES MEDIAS

### 8. Sin Protección CSRF (MEDIA - CVSS: 5.3)

**Ubicación:**
- Todos los formularios POST/PUT/DELETE

**Descripción:**
No hay tokens CSRF para proteger contra ataques de Cross-Site Request Forgery.

**Solución Recomendada:**
```typescript
// ✅ BUENO - Implementar CSRF
npm install h3-csrf

// En server/middleware/csrf.ts
import { defineEventHandler } from 'h3'
import csrf from 'h3-csrf'

export default defineEventHandler(csrf())
```

**Prioridad:** 🟡 **MEDIA**

---

### 9. Headers de Seguridad Faltantes (MEDIA - CVSS: 5.1)

**Ubicación:**
- `nuxt.config.ts`

**Descripción:**
Faltan headers de seguridad importantes para proteger contra ataques comunes.

**Código Vulnerable:**
```typescript
// ❌ MALO - Sin headers de seguridad
nitro: {
  // ...
}
```

**Solución Recomendada:**
```typescript
// ✅ BUENO - Agregar headers de seguridad
nitro: {
  headers: {
    // Prevenir clickjacking
    "X-Frame-Options": "DENY",
    
    // Prevenir MIME type sniffing
    "X-Content-Type-Options": "nosniff",
    
    // Prevenir XSS
    "X-XSS-Protection": "1; mode=block",
    
    // Política de referrer
    "Referrer-Policy": "strict-origin-when-cross-origin",
    
    // HTTPS solo
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    
    // Política de seguridad de contenido
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  }
}
```

**Prioridad:** 🟡 **MEDIA**

---

### 10. Logs Exponen Información Sensible (MEDIA - CVSS: 5.2)

**Ubicación:**
- `server/utils/prisma.ts` (línea 9)

**Descripción:**
Prisma loguea todas las queries en desarrollo, incluyendo datos sensibles.

**Código Vulnerable:**
```typescript
// ❌ MALO - Loguea queries
new PrismaClient({
  log: ['query', 'error', 'warn']
})
```

**Solución Recomendada:**
```typescript
// ✅ BUENO - Solo loguear en desarrollo y sin queries
new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['error', 'warn'] 
    : ['error']
})
```

**Prioridad:** 🟡 **MEDIA**

---

### 11. Sin Validación de Tipo de Archivo en Upload (MEDIA - CVSS: 5.0)

**Ubicación:**
- `server/middleware/fileUpload.ts`
- `server/utils/fileUtils.ts`

**Descripción:**
No hay validación del tipo de archivo en uploads.

**Solución Recomendada:**
```typescript
// ✅ BUENO - Validar tipo de archivo
export function isValidFileType(filename: string): boolean {
  const allowedExtensions = ['pdf', 'doc', 'docx', 'pptx', 'xlsx', 'jpg', 'png']
  const ext = getFileExtension(filename).toLowerCase()
  return allowedExtensions.includes(ext)
}

export function validateFileSize(fileSize: number, maxSize: number = 10 * 1024 * 1024): boolean {
  return fileSize <= maxSize
}
```

**Prioridad:** 🟡 **MEDIA**

---

## 🟢 VULNERABILIDADES BAJAS

### 12. Sin Validación de Email (BAJA - CVSS: 3.2)

**Ubicación:**
- `server/api/auth/register`

**Descripción:**
No hay confirmación de email después del registro.

**Solución Recomendada:**
```typescript
// ✅ BUENO - Enviar email de confirmación
npm install nodemailer

export async function sendVerificationEmail(email: string, token: string) {
  // Implementar envío de email
}
```

**Prioridad:** 🟢 **BAJA**

---

### 13. Sin Implementación de Logout Seguro (BAJA - CVSS: 3.1)

**Ubicación:**
- `composables/useAuth.ts`

**Descripción:**
No hay endpoint de logout en servidor para invalidar tokens.

**Solución Recomendada:**
```typescript
// ✅ BUENO - Implementar logout en servidor
// server/api/auth/logout.post.ts
export default defineEventHandler((event) => {
  deleteCookie(event, 'token')
  return { message: 'Logout exitoso' }
})
```

**Prioridad:** 🟢 **BAJA**

---

## ✅ FORTALEZAS DEL PROYECTO

### 1. ✅ Autenticación JWT Implementada
- Tokens con expiración de 8 horas
- Verificación en middleware global
- Estructura: `Bearer <token>`

### 2. ✅ Hash Seguro de Contraseñas
- Uso de **bcrypt** con 10 rounds
- Comparación segura sin exponer hashes
- Función `sanitizeUser()` que oculta contraseñas

### 3. ✅ Protección contra Inyección SQL
- Uso de **Prisma ORM**
- Todas las queries con parámetros
- No hay SQL crudo

### 4. ✅ Protección contra XSS en Chat
- **DOMPurify** implementado
- Sanitización de HTML en `pages/student/chat.vue`
- Validación en frontend

### 5. ✅ Rate Limiting en Chat
- Implementado `RateLimiter` personalizado
- Previene abuso de API Gemini

### 6. ✅ Validación de Entrada
- Validación en formularios (frontend)
- Campos requeridos en endpoints

### 7. ✅ Rutas Públicas Protegidas
- Middleware `auth.global.ts` valida rutas
- Redirección automática a login

### 8. ✅ Control de Roles Basado en RBAC
- Enum `Rol` en Prisma
- Validación de permisos en `requireRole`

---

## 🛠️ RECOMENDACIONES DE MEJORA

### FASE 1: CRÍTICO (Semana 1)
```
[ ] Migrar tokens a HTTP-Only Cookies
[ ] Restringir CORS a dominios específicos
[ ] Remover contraseñas de respuestas API
[ ] Requerir JWT_SECRET en variables de entorno
```

### FASE 2: ALTO (Semana 2-3)
```
[ ] Implementar rate limiting global
[ ] Agregar validación con Zod
[ ] Encriptar datos PII en BD
[ ] Implementar protección CSRF
```

### FASE 3: MEDIO (Semana 3-4)
```
[ ] Agregar headers de seguridad
[ ] Limpiar logs de información sensible
[ ] Validar tipo de archivo en uploads
[ ] Implementar límite de tamaño de archivo
```

### FASE 4: BAJO (Opcional)
```
[ ] Validación de email
[ ] Logout seguro en servidor
[ ] 2FA (Two-Factor Authentication)
[ ] Auditoría de logs
```

---

## 📋 PLAN DE ACCIÓN

### Paso 1: Migrar a HTTP-Only Cookies
**Tiempo estimado:** 2 horas

```typescript
// server/api/auth/login.post.ts
import { setCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { user, token } = await loginUser(body.correo, body.contrasena)
  
  // Guardar token en HTTP-Only Cookie
  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60
  })
  
  return { user }
})
```

### Paso 2: Corregir CORS
**Tiempo estimado:** 30 minutos

```typescript
// nuxt.config.ts
nitro: {
  routeRules: {
    "/api/**": {
      headers: {
        "Access-Control-Allow-Origin": process.env.ALLOWED_ORIGIN || "https://localhost:3000",
        "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Headers": "Content-Type,Authorization"
      }
    }
  }
}
```

### Paso 3: Remover Contraseñas de API
**Tiempo estimado:** 1 hora

```typescript
// server/api/admin/[users].get.ts
select: {
  id: true,
  documentoIdentidad: true,
  nombre: true,
  correo: true,
  rol: true,
  activo: true,
  creadoEn: true
}
```

### Paso 4: Validación con Zod
**Tiempo estimado:** 3 horas

```bash
npm install zod
```

```typescript
// server/schemas/user.schema.ts
import { z } from 'zod'

export const createUserSchema = z.object({
  documentoIdentidad: z.string().min(5).max(20),
  nombre: z.string().min(2).max(100),
  correo: z.string().email(),
  contrasena: z.string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Debe contener mayúscula')
    .regex(/[0-9]/, 'Debe contener número'),
  telefono: z.string().optional()
})
```

---

## 📊 MATRIZ DE RIESGO

```
IMPACTO
   ↑
   │     ┌─────────────┐
 A │     │  #2 CORS    │
 L │     │  #1 Token   │  
 T │  ┌──┼──────────────┤
 O │  │  │  #3 Password │
   │  │  └──┼────────────┤
   │  │     │  #4 JWT   │
   │  │     │  #5-7     │
   │  │  ┌──┼────────────┤
   │  │  │  │  #8-11    │
   │  │  │  └────────────┤
   │  │  │     #12-13   │
   └──┴──┴──────────────→ PROBABILIDAD
```

**Leyenda:**
- 🔴 Crítico = Alto Impacto + Alta Probabilidad
- 🟠 Alto = Alto Impacto + Media Probabilidad
- 🟡 Medio = Medio Impacto + Media Probabilidad
- 🟢 Bajo = Bajo Impacto + Baja Probabilidad

---

## 📈 PRÓXIMOS PASOS

1. **Revisar recomendaciones críticas** con el equipo
2. **Priorizar implementación** según disponibilidad
3. **Establecer deadline** para vulnerabilidades críticas
4. **Realizar auditoría de seguridad** después de cambios
5. **Implementar SIEM** (Security Information and Event Management)
6. **Crear política de seguridad** para el proyecto

---

## 📞 CONTACTO Y SOPORTE

Para preguntas o aclaraciones sobre este reporte:
- Revisar documentación de seguridad en [OWASP Top 10](https://owasp.org/Top10/)
- Consultar [MDN Web Security](https://developer.mozilla.org/es/docs/Web/Security/)
- Contactar al equipo de DevSecOps

---

**Documento generado automáticamente**  
**Última actualización:** 28 de enero de 2026  
**Próxima auditoría recomendada:** 28 de febrero de 2026
