# Fase 4 - Formularios funcionales del frontend

Esta fase corrige los botones que estaban solo visuales:

- Nuevo medicamento
- Nueva donación
- Nueva salida

## Qué se agregó

### Rutas nuevas

```txt
src/app/medicamentos/nuevo/page.tsx
src/app/donaciones/nueva/page.tsx
src/app/salidas/nueva/page.tsx
```

### Páginas actualizadas

```txt
src/app/medicamentos/page.tsx
src/app/donaciones/page.tsx
src/app/salidas/page.tsx
```

Ahora los botones son enlaces reales:

```txt
/medicamentos/nuevo
/donaciones/nueva
/salidas/nueva
```

## Endpoints usados

### Medicamentos

```txt
POST /api/medicamentos
```

Campos enviados:

```txt
nombre
presentacion
categoria
unidad
descripcion
```

### Donaciones

```txt
POST /api/donaciones
```

Campos enviados:

```txt
donante
tipo_donante
telefono
fecha_donacion
descripcion
items[]
```

Cada item contiene:

```txt
medicamento_id
cantidad
lote
fecha_vencimiento
```

### Salidas

```txt
POST /api/salidas
```

Campos enviados:

```txt
responsable
tipo_salida
destino
fecha_salida
descripcion
items[]
```

Cada item contiene:

```txt
medicamento_id
cantidad
lote
fecha_vencimiento
```

## Cómo aplicar

Copiar el contenido dentro del frontend:

```powershell
C:\Users\raymar\Documents\JAIRO\PROYECTOS\farmacia-web
```

Aceptar reemplazar archivos.

## Comandos recomendados

```powershell
cd "C:\Users\raymar\Documents\JAIRO\PROYECTOS\farmacia-web"

Remove-Item -Recurse -Force .next
npm run lint
npm run build
npm run dev
```

## Validación

1. Entrar al sistema.
2. Ir a Medicamentos.
3. Click en Nuevo medicamento.
4. Guardar un medicamento.
5. Ir a Donaciones.
6. Click en Nueva donación.
7. Agregar un medicamento con cantidad.
8. Guardar.
9. Ir a Salidas.
10. Click en Nueva salida.
11. Registrar una salida menor o igual al stock disponible.

## Git recomendado

```powershell
git checkout -b reingenieria-fase-4-formularios
git add .
git commit -m "Agrega formularios de medicamentos donaciones y salidas"
git push -u origin reingenieria-fase-4-formularios
```
