"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Medicamento } from "@/types/medicamento";

type LoteDisponible = {
  lote: string | null;
  fecha_vencimiento: string | null;
  entradas?: number;
  salidas?: number;
  stock: number;
};

type SalidaItemForm = {
  medicamento_id: string;
  cantidad: string;
  lote: string;
  fecha_vencimiento: string;
};

type SalidaForm = {
  responsable: string;
  tipo_salida: string;
  destino: string;
  fecha_salida: string;
  descripcion: string;
  items: SalidaItemForm[];
};

const today = new Date().toISOString().slice(0, 10);

const emptyItem: SalidaItemForm = {
  medicamento_id: "",
  cantidad: "1",
  lote: "",
  fecha_vencimiento: "",
};

function loteKey(lote: LoteDisponible) {
  return `${lote.lote ?? ""}|${lote.fecha_vencimiento ?? ""}`;
}

export default function NuevaSalidaPage() {
  const router = useRouter();

  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [lotesPorItem, setLotesPorItem] = useState<Record<number, LoteDisponible[]>>({});
  const [form, setForm] = useState<SalidaForm>({
    responsable: "",
    tipo_salida: "",
    destino: "",
    fecha_salida: today,
    descripcion: "",
    items: [{ ...emptyItem }],
  });
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api
      .get<PaginatedResponse<Medicamento>>("/api/medicamentos")
      .then((response) => setMedicamentos(response.data.data))
      .catch(() => setMessage("No fue posible cargar los medicamentos."));
  }, []);

  const updateField = (field: keyof Omit<SalidaForm, "items">, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateItem = (
    index: number,
    field: keyof SalidaItemForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const cargarLotes = async (index: number, medicamentoId: string) => {
    setLotesPorItem((current) => ({ ...current, [index]: [] }));

    if (!medicamentoId) {
      return;
    }

    try {
      const response = await api.get<LoteDisponible[]>(
        `/api/medicamentos/${medicamentoId}/lotes`
      );

      const lotesDisponibles = response.data.filter((lote) => Number(lote.stock) > 0);

      setLotesPorItem((current) => ({
        ...current,
        [index]: lotesDisponibles,
      }));
    } catch {
      setMessage("No fue posible cargar los lotes disponibles del medicamento.");
    }
  };

  const handleMedicamentoChange = async (index: number, medicamentoId: string) => {
    setMessage("");

    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              medicamento_id: medicamentoId,
              lote: "",
              fecha_vencimiento: "",
              cantidad: "1",
            }
          : item
      ),
    }));

    await cargarLotes(index, medicamentoId);
  };

  const handleLoteChange = (index: number, selectedKey: string) => {
    const loteSeleccionado = lotesPorItem[index]?.find(
      (lote) => loteKey(lote) === selectedKey
    );

    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              lote: loteSeleccionado?.lote ?? "",
              fecha_vencimiento: loteSeleccionado?.fecha_vencimiento ?? "",
              cantidad: "1",
            }
          : item
      ),
    }));
  };

  const addItem = () => {
    setForm((current) => ({
      ...current,
      items: [...current.items, { ...emptyItem }],
    }));
  };

  const removeItem = (index: number) => {
    setForm((current) => ({
      ...current,
      items:
        current.items.length === 1
          ? current.items
          : current.items.filter((_, itemIndex) => itemIndex !== index),
    }));

    setLotesPorItem((current) => {
      const updated = { ...current };
      delete updated[index];
      return updated;
    });
  };

  const getSelectedLote = (index: number, item: SalidaItemForm) => {
    return lotesPorItem[index]?.find(
      (lote) =>
        (lote.lote ?? "") === item.lote &&
        (lote.fecha_vencimiento ?? "") === item.fecha_vencimiento
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    const itemSinLote = form.items.find(
      (item) => !item.medicamento_id || !item.lote || !item.fecha_vencimiento
    );

    if (itemSinLote) {
      setMessage("Cada ítem debe tener medicamento y lote disponible seleccionado.");
      setIsSaving(false);
      return;
    }

    const itemSinStock = form.items.find((item, index) => {
      const loteSeleccionado = getSelectedLote(index, item);
      return loteSeleccionado && Number(item.cantidad) > Number(loteSeleccionado.stock);
    });

    if (itemSinStock) {
      setMessage("La cantidad a entregar no puede ser mayor al stock disponible del lote.");
      setIsSaving(false);
      return;
    }

    try {
      await api.post("/api/salidas", {
        responsable: form.responsable,
        tipo_salida: form.tipo_salida,
        destino: form.destino || null,
        fecha_salida: form.fecha_salida,
        descripcion: form.descripcion || null,
        items: form.items.map((item) => ({
          medicamento_id: Number(item.medicamento_id),
          cantidad: Number(item.cantidad),
          lote: item.lote,
          fecha_vencimiento: item.fecha_vencimiento,
        })),
      });

      router.push("/salidas");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message ||
            Object.values(error.response?.data?.errors || {})?.flat()?.[0]?.toString() ||
            "No fue posible guardar la salida."
        );
      } else {
        setMessage("Error inesperado al guardar la salida.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Nueva salida"
        description="Registra una salida seleccionando lotes disponibles del inventario."
        action={
          <Link
            href="/salidas"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <section>
          <h3 className="mb-4 text-base font-bold text-slate-900">
            Datos de la salida
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Responsable
              </label>
              <input
                value={form.responsable}
                onChange={(event) => updateField("responsable", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tipo de salida
              </label>
              <input
                value={form.tipo_salida}
                onChange={(event) => updateField("tipo_salida", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Entrega, consumo, despacho..."
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Destino
              </label>
              <input
                value={form.destino}
                onChange={(event) => updateField("destino", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Fecha de salida
              </label>
              <input
                type="date"
                value={form.fecha_salida}
                onChange={(event) => updateField("fecha_salida", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Descripción
              </label>
              <textarea
                value={form.descripcion}
                onChange={(event) => updateField("descripcion", event.target.value)}
                className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Medicamentos a entregar
              </h3>
              <p className="text-sm text-slate-500">
                Selecciona el medicamento y luego el lote disponible. La fecha de vencimiento se carga automáticamente.
              </p>
            </div>

            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              <Plus className="h-4 w-4" />
              Agregar ítem
            </button>
          </div>

          <div className="space-y-4">
            {form.items.map((item, index) => {
              const selectedLote = getSelectedLote(index, item);
              const selectedLoteKey = selectedLote ? loteKey(selectedLote) : "";

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700">
                      Ítem #{index + 1}
                    </h4>

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={form.items.length === 1}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 disabled:cursor-not-allowed disabled:text-slate-300"
                    >
                      <Trash2 className="h-4 w-4" />
                      Quitar
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Medicamento
                      </label>
                      <select
                        value={item.medicamento_id}
                        onChange={(event) =>
                          handleMedicamentoChange(index, event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                      >
                        <option value="">Seleccione...</option>
                        {medicamentos.map((medicamento) => (
                          <option key={medicamento.id} value={medicamento.id}>
                            {medicamento.nombre} - Stock total: {medicamento.stock ?? 0}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Lote disponible
                      </label>
                      <select
                        value={selectedLoteKey}
                        onChange={(event) =>
                          handleLoteChange(index, event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        disabled={!item.medicamento_id}
                        required
                      >
                        <option value="">
                          {item.medicamento_id
                            ? "Seleccione un lote..."
                            : "Seleccione primero un medicamento"}
                        </option>
                        {(lotesPorItem[index] || []).map((lote) => (
                          <option key={loteKey(lote)} value={loteKey(lote)}>
                            Lote: {lote.lote || "SIN LOTE"} | Vence:{" "}
                            {lote.fecha_vencimiento || "Sin fecha"} | Stock:{" "}
                            {lote.stock}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Cantidad
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={selectedLote?.stock ?? undefined}
                        value={item.cantidad}
                        onChange={(event) =>
                          updateItem(index, "cantidad", event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Stock del lote
                      </label>
                      <input
                        value={selectedLote?.stock ?? ""}
                        readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-600 outline-none"
                        placeholder="—"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Lote
                      </label>
                      <input
                        value={item.lote}
                        readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-600 outline-none"
                        placeholder="Automático"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Fecha de vencimiento
                      </label>
                      <input
                        value={item.fecha_vencimiento}
                        readOnly
                        className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-600 outline-none"
                        placeholder="Automático"
                      />
                    </div>
                  </div>

                  {item.medicamento_id && (lotesPorItem[index] || []).length === 0 && (
                    <p className="mt-3 rounded-xl bg-yellow-50 p-3 text-sm font-medium text-yellow-800">
                      Este medicamento no tiene lotes disponibles con stock.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {message && (
          <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
            {message}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/salidas"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Guardando..." : "Guardar salida"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
