import { Medicamento } from "@/types/medicamento";

export type Movimiento = {
  id: number;
  medicamento_id: number;
  tipo: "entrada" | "salida";
  cantidad: number;
  fecha: string;
  origen?: string | null;
  origen_id?: number | null;
  descripcion?: string | null;
  medicamento?: Medicamento;
};
