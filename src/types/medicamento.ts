export type Medicamento = {
  id: number;
  nombre: string;
  presentacion?: string | null;
  categoria?: string | null;
  unidad?: string | null;
  descripcion?: string | null;
  fecha_vencimiento?: string | null;
  stock?: number;
};
