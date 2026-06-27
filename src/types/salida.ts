export type Salida = {
  id: number;
  responsable: string;
  tipo_salida: string;
  destino?: string | null;
  fecha_salida: string;
  descripcion?: string | null;
  items_count?: number;
};
