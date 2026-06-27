# Hotfix - Menú único del sistema

## Problema detectado

Existía un menú anterior en:

```txt
src/components/dashboard/Sidebar.tsx
```

Ese componente puede provocar que el dashboard muestre un menú diferente al menú responsive nuevo.

## Corrección aplicada

Este paquete hace dos cosas:

1. Reemplaza `src/app/dashboard/page.tsx` para que use el menú oficial:

```tsx
import { AppShell } from "@/components/layout/AppShell";
```

2. Neutraliza el componente viejo:

```txt
src/components/dashboard/Sidebar.tsx
```

Ahora ese componente retorna `null`, para que no muestre un menú duplicado si algún archivo antiguo todavía lo importa.

## Menú oficial

De ahora en adelante, el único menú oficial debe ser:

```txt
src/components/layout/AppShell.tsx
```

Ninguna página debe importar directamente:

```txt
src/components/dashboard/Sidebar.tsx
```

## Validación recomendada

Ejecuta este comando en el frontend para encontrar referencias al menú viejo:

```powershell
cd "C:\Users\raymar\Documents\JAIRO\PROYECTOS\farmacia-web"

Get-ChildItem .\src -Recurse -Include *.tsx,*.ts | Select-String -Pattern "components/dashboard/Sidebar|<Sidebar|from `"@/components/dashboard|from '@/components/dashboard"
```

Si aparece algún resultado, hay que reemplazar esa pantalla para que use `AppShell`.

## Comandos después de copiar

```powershell
cd "C:\Users\raymar\Documents\JAIRO\PROYECTOS\farmacia-web"

Remove-Item -Recurse -Force .next
npm run lint
npm run build
npm run dev
```

## Flujo Git recomendado

```powershell
git checkout -b hotfix-menu-unico
git add .
git commit -m "Corrige menu duplicado y consolida AppShell"
git push -u origin hotfix-menu-unico
```
