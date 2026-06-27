# Fase 1 - Autenticación limpia con Bearer Token

Esta fase corrige la autenticación del frontend para trabajar de forma coherente con la API Laravel Sanctum usando tokens Bearer.

## Cambios aplicados

- Se eliminó el uso innecesario de `/sanctum/csrf-cookie` en el login.
- Se creó `src/lib/auth.ts` para centralizar token, usuario y limpieza de sesión.
- Se actualizó `src/lib/api.ts` para agregar automáticamente `Authorization: Bearer <token>`.
- Se corrigió `src/lib/logout.ts` para evitar borrar cookies al importar el archivo.
- Se actualizó `src/app/login/page.tsx` con manejo de carga y errores.
- Se actualizó `src/app/dashboard/page.tsx` para usar el interceptor global.
- Se actualizó `src/app/layout.tsx` con metadatos del sistema.
- Se actualizó `src/app/page.tsx` para redirigir a `/login`.

## Cómo aplicar

Copia estas carpetas/archivos dentro del proyecto frontend `farmacia-web`, respetando las rutas.

Luego ejecuta:

```powershell
cd "C:\Users\raymar\Documents\JAIRO\PROYECTOS\farmacia-web"
npm run lint
npm run build
npm run dev
```

## Variable opcional

Si la API no corre en `http://127.0.0.1:8000`, crea un archivo `.env.local` en el frontend:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

## Flujo Git recomendado

```powershell
git checkout -b reingenieria-fase-1-auth
git add .
git commit -m "Refactoriza autenticacion con token Bearer"
git push -u origin reingenieria-fase-1-auth
```
