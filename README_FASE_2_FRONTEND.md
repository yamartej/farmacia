# Fase 2 - Reorganización visual del frontend

Esta fase agrega una estructura visual más profesional para el proyecto `farmacia-web`.

## Objetivo

Organizar el frontend con:

- Layout principal con menú lateral.
- Encabezados reutilizables.
- Componentes visuales reutilizables.
- Páginas base para:
  - Dashboard
  - Medicamentos
  - Donaciones
  - Salidas
  - Movimientos
- Tipos TypeScript para los datos principales.
- Consumo inicial de endpoints protegidos por Bearer Token.

## Archivos agregados o modificados

```txt
src/components/layout/AppShell.tsx
src/components/layout/PageHeader.tsx
src/components/ui/StatCard.tsx
src/components/ui/EmptyState.tsx
src/components/ui/LoadingState.tsx
src/components/ui/ErrorState.tsx
src/types/api.ts
src/types/medicamento.ts
src/types/donacion.ts
src/types/salida.ts
src/types/movimiento.ts
src/app/dashboard/page.tsx
src/app/medicamentos/page.tsx
src/app/donaciones/page.tsx
src/app/salidas/page.tsx
src/app/movimientos/page.tsx
```

## Cómo aplicar

Copia el contenido de este paquete dentro del proyecto:

```powershell
C:\Users\raymar\Documents\JAIRO\PROYECTOS\farmacia-web
```

Acepta reemplazar archivos existentes cuando Windows lo solicite.

## Comandos recomendados

```powershell
cd "C:\Users\raymar\Documents\JAIRO\PROYECTOS\farmacia-web"

npm run lint
npm run build
npm run dev
```

## Flujo Git recomendado

```powershell
git checkout -b reingenieria-fase-2-frontend
git add .
git commit -m "Agrega layout y modulos base del frontend"
git push -u origin reingenieria-fase-2-frontend
```

## Observación importante

Esta fase prepara las pantallas y consume listados existentes. Los botones de "Nuevo medicamento", "Nueva donación" y "Nueva salida" quedan visualmente preparados, pero los formularios completos se trabajan en una fase posterior.
