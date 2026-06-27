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

type DonacionItemForm = {
  medicamento_id: string;
  cantidad: string;
  lote: string;
  fecha_vencimiento: string;
};

type DonacionForm = {
  donante: string;
  tipo_donante: string;
  telefono: string;
  fecha_donacion: string;
  descripcion: string;
  items: DonacionItemForm[];
};

const today = new Date().toISOString().slice(0, 10);

const emptyItem: DonacionItemForm = {
  medicamento_id: "",
  cantidad: "1",
  lote: "",
  fecha_vencimiento: "",
};

export default function NuevaDonacionPage() {
  const router = useRouter();

  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [form, setForm] = useState<DonacionForm>({
    donante: "",
    tipo_donante: "",
    telefono: "",
    fecha_donacion: today,
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

  const updateField = (field: keyof Omit<DonacionForm, "items">, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateItem = (
    index: number,
    field: keyof DonacionItemForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
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
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      await api.post("/api/donaciones", {
        donante: form.donante,
        tipo_donante: form.tipo_donante || null,
        telefono: form.telefono || null,
        fecha_donacion: form.fecha_donacion,
        descripcion: form.descripcion || null,
        items: form.items.map((item) => ({
          medicamento_id: Number(item.medicamento_id),
          cantidad: Number(item.cantidad),
          lote: item.lote || null,
          fecha_vencimiento: item.fecha_vencimiento || null,
        })),
      });

      router.push("/donaciones");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message ||
            Object.values(error.response?.data?.errors || {})?.flat()?.[0]?.toString() ||
            "No fue posible guardar la donación."
        );
      } else {
        setMessage("Error inesperado al guardar la donación.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Nueva donación"
        description="Registra una donación y sus medicamentos asociados."
        action={
          <Link
            href="/donaciones"
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
            Datos de la donación
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Donante
              </label>
              <input
                value={form.donante}
                onChange={(event) => updateField("donante", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tipo de donante
              </label>
              <input
                value={form.tipo_donante}
                onChange={(event) => updateField("tipo_donante", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Persona, institución, empresa..."
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Teléfono
              </label>
              <input
                value={form.telefono}
                onChange={(event) => updateField("telefono", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Fecha de donación
              </label>
              <input
                type="date"
                value={form.fecha_donacion}
                onChange={(event) => updateField("fecha_donacion", event.target.value)}
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
                Medicamentos donados
              </h3>
              <p className="text-sm text-slate-500">
                Agrega uno o varios medicamentos a la donación.
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
            {form.items.map((item, index) => (
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
                        updateItem(index, "medicamento_id", event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      required
                    >
                      <option value="">Seleccione...</option>
                      {medicamentos.map((medicamento) => (
                        <option key={medicamento.id} value={medicamento.id}>
                          {medicamento.nombre} - {medicamento.presentacion}
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
                      Lote
                    </label>
                    <input
                      value={item.lote}
                      onChange={(event) =>
                        updateItem(index, "lote", event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Fecha de vencimiento
                    </label>
                    <input
                      type="date"
                      value={item.fecha_vencimiento}
                      onChange={(event) =>
                        updateItem(index, "fecha_vencimiento", event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {message && (
          <p className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
            {message}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/donaciones"
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
            {isSaving ? "Guardando..." : "Guardar donación"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
