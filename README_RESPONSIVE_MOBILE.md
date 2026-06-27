# Mejora responsive móvil - Sistema de Farmacia

Este paquete mejora la adaptabilidad del frontend para dispositivos móviles.

## Cambios principales

- `AppShell` ahora tiene:
  - Menú móvil con botón hamburguesa.
  - Panel lateral deslizable en móviles.
  - Navegación horizontal rápida en pantallas pequeñas.
  - Sidebar fijo solo en desktop.
  - Botones y contenedores adaptables.

- `PageHeader` ahora:
  - Se adapta mejor a móvil.
  - Encapsula el título y acción en tarjeta.
  - Hace que los botones ocupen ancho completo en móvil.

- `StatCard` ahora:
  - Reduce tamaños y paddings en móvil.
  - Evita desbordes de texto.

- Las páginas:
  - `medicamentos`
  - `donaciones`
  - `salidas`
  - `movimientos`

  ahora muestran tarjetas en móviles y tablas en tablet/desktop.

## Archivos incluidos

```txt
src/components/layout/AppShell.tsx
src/components/layout/PageHeader.tsx
src/components/ui/StatCard.tsx
src/app/dashboard/page.tsx
src/app/medicamentos/page.tsx
src/app/donaciones/page.tsx
src/app/salidas/page.tsx
src/app/movimientos/page.tsx
```

## Cómo aplicar

Copiar el contenido dentro del proyecto frontend:

```powershell
C:\Users\raymar\Documents\JAIRO\PROYECTOS\farmacia-web
```

Aceptar reemplazar archivos.

## Validación

Luego ejecutar:

```powershell
cd "C:\Users\raymar\Documents\JAIRO\PROYECTOS\farmacia-web"
npm run lint
npm run build
npm run dev
```

## Prueba recomendada

Abrir el navegador y probar con el modo responsive de herramientas de desarrollador:

- iPhone SE
- iPhone 12/13/14
- Pixel 7
- iPad Mini
- Desktop

## Git recomendado

```powershell
git checkout -b mejora-responsive-mobile
git add .
git commit -m "Mejora adaptabilidad responsive movil"
git push -u origin mejora-responsive-mobile
```
