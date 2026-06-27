export type Donacion = {
  id: number;
  donante: string;
  tipo_donante?: string | null;
  telefono?: string | null;
  fecha_donacion: string;
  descripcion?: string | null;
  items_count?: number;
};
