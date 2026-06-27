"use client";

/**
 * @deprecated
 *
 * Este componente pertenecía al menú anterior del dashboard.
 * El menú oficial del sistema ahora vive en:
 *
 *   src/components/layout/AppShell.tsx
 *
 * Se deja este archivo temporalmente para evitar errores de compilación
 * si algún archivo viejo todavía importa "@/components/dashboard/Sidebar".
 *
 * No debe renderizar ningún menú para evitar duplicidad visual.
 * En una limpieza posterior, elimina los imports restantes y borra este archivo.
 */

export function Sidebar() {
  return null;
}

export default Sidebar;
