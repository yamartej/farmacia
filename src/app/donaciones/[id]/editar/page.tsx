"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Medicamento } from "@/types/medicamento";

type DonacionItem = {
  id: number;
  medicamento_id: number;
  cantidad: number;
  lote?: string | null;
  fecha_vencimiento?: string | null;
  medicamento?: Medicamento;
};

type DonacionDetalle = {
  id: number;
  donante: string;
  tipo_donante?: string | null;
  telefono?: string | null;
  fecha_donacion: string;
  descripcion?: string | null;
  items: DonacionItem[];
};

type DonacionForm = {
  donante: string;
  tipo_donante: string;
  telefono: string;
  fecha_donacion: string;
  descripcion: string;
};

type DonacionItemForm = {
  id?: number;
  medicamento_id: string;
  cantidad: string;
  lote: string;
  fecha_vencimiento: string;
};

const emptyItem: DonacionItemForm = {
  medicamento_id: "",
  cantidad: "1",
  lote: "",
  fecha_vencimiento: "",
};

function getAxiosErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;

  const data = error.response?.data as
    | { message?: string; error?: string; errors?: Record<string, string[]> }
    | undefined;

  if (data?.message) return data.message;
  if (data?.error) return data.error;

  const firstValidationMessage = data?.errors
    ? Object.values(data.errors).flat()[0]
    : null;

  return firstValidationMessage || fallback;
}

export default function EditarDonacionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const donacionId = params.id;

  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [form, setForm] = useState<DonacionForm>({
    donante: "",
    tipo_donante: "",
    telefono: "",
    fecha_donacion: "",
    descripcion: "",
  });
  const [items, setItems] = useState<DonacionItemForm[]>([]);
  const [nuevoItem, setNuevoItem] = useState<DonacionItemForm>({ ...emptyItem });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [savingItemId, setSavingItemId] = useState<number | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const [donacionResponse, medicamentosResponse] = await Promise.all([
        api.get<DonacionDetalle>(`/api/donaciones/${donacionId}`),
        api.get<PaginatedResponse<Medicamento>>("/api/medicamentos"),
      ]);

      const donacion = donacionResponse.data;

      setForm({
        donante: donacion.donante || "",
        tipo_donante: donacion.tipo_donante || "",
        telefono: donacion.telefono || "",
        fecha_donacion: donacion.fecha_donacion || "",
        descripcion: donacion.descripcion || "",
      });

      setItems(
        donacion.items.map((item) => ({
          id: item.id,
          medicamento_id: String(item.medicamento_id),
          cantidad: String(item.cantidad),
          lote: item.lote || "",
          fecha_vencimiento: item.fecha_vencimiento || "",
        }))
      );

      setMedicamentos(medicamentosResponse.data.data);
    } catch {
      setError("No fue posible cargar la donación.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (donacionId) {
      loadData();
    }
  }, [donacionId]);

  const updateField = (field: keyof DonacionForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateItem = (
    index: number,
    field: keyof DonacionItemForm,
    value: string
  ) => {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    );
  };

  const updateNuevoItem = (field: keyof DonacionItemForm, value: string) => {
    setNuevoItem((current) => ({ ...current, [field]: value }));
  };

  const handleSaveHeader = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSavingHeader(true);
    setError("");
    setMessage("");

    try {
      await api.put(`/api/donaciones/${donacionId}`, {
        donante: form.donante,
        tipo_donante: form.tipo_donante || null,
        telefono: form.telefono || null,
        fecha_donacion: form.fecha_donacion,
        descripcion: form.descripcion || null,
      });

      setMessage("Datos de la donación actualizados correctamente.");
    } catch (updateError: unknown) {
      setError(
        getAxiosErrorMessage(
          updateError,
          "No fue posible actualizar la donación."
        )
      );
    } finally {
      setIsSavingHeader(false);
    }
  };

  const handleSaveItem = async (index: number) => {
    const item = items[index];
    if (!item.id) return;

    setSavingItemId(item.id);
    setError("");
    setMessage("");

    try {
      const response = await api.put<{ item: DonacionItem }>(
        `/api/donaciones/${donacionId}/items/${item.id}`,
        {
          medicamento_id: Number(item.medicamento_id),
          cantidad: Number(item.cantidad),
          lote: item.lote || null,
          fecha_vencimiento: item.fecha_vencimiento || null,
        }
      );

      const updatedItem = response.data.item;

      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? {
                id: updatedItem.id,
                medicamento_id: String(updatedItem.medicamento_id),
                cantidad: String(updatedItem.cantidad),
                lote: updatedItem.lote || "",
                fecha_vencimiento: updatedItem.fecha_vencimiento || "",
              }
            : currentItem
        )
      );

      setMessage("Ítem actualizado correctamente.");
    } catch (updateError: unknown) {
      setError(
        getAxiosErrorMessage(updateError, "No fue posible actualizar el ítem.")
      );
    } finally {
      setSavingItemId(null);
    }
  };

  const handleDeleteItem = async (item: DonacionItemForm) => {
    if (!item.id) return;

    const confirmed = window.confirm(
      "¿Seguro que deseas eliminar este ítem de la donación?"
    );

    if (!confirmed) return;

    setDeletingItemId(item.id);
    setError("");
    setMessage("");

    try {
      await api.delete(`/api/donaciones/${donacionId}/items/${item.id}`);

      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      setMessage("Ítem eliminado correctamente.");
    } catch (deleteError: unknown) {
      setError(
        getAxiosErrorMessage(deleteError, "No fue posible eliminar el ítem.")
      );
    } finally {
      setDeletingItemId(null);
    }
  };

  const handleAddItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsAddingItem(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post<{ item: DonacionItem }>(
        `/api/donaciones/${donacionId}/items`,
        {
          medicamento_id: Number(nuevoItem.medicamento_id),
          cantidad: Number(nuevoItem.cantidad),
          lote: nuevoItem.lote || null,
          fecha_vencimiento: nuevoItem.fecha_vencimiento || null,
        }
      );

      const item = response.data.item;

      setItems((current) => [
        ...current,
        {
          id: item.id,
          medicamento_id: String(item.medicamento_id),
          cantidad: String(item.cantidad),
          lote: item.lote || "",
          fecha_vencimiento: item.fecha_vencimiento || "",
        },
      ]);

      setNuevoItem({ ...emptyItem });
      setMessage("Ítem agregado correctamente.");
    } catch (addError: unknown) {
      setError(getAxiosErrorMessage(addError, "No fue posible agregar el ítem."));
    } finally {
      setIsAddingItem(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Editar donación"
        description="Actualiza los datos de la donación y administra sus ítems."
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

      {isLoading && <LoadingState message="Cargando donación..." />}
      {error && <ErrorState message={error} />}
      {message && (
        <p className="mb-4 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
          {message}
        </p>
      )}

      {!isLoading && !error && (
        <div className="space-y-5">
          <form
            onSubmit={handleSaveHeader}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <h3 className="mb-4 text-base font-bold text-slate-900">
              Datos principales
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
                  onChange={(event) =>
                    updateField("tipo_donante", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  onChange={(event) =>
                    updateField("fecha_donacion", event.target.value)
                  }
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
                  onChange={(event) =>
                    updateField("descripcion", event.target.value)
                  }
                  className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                href="/donaciones"
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={isSavingHeader}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                <Save className="h-4 w-4" />
                {isSavingHeader ? "Guardando..." : "Guardar datos"}
              </button>
            </div>
          </form>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h3 className="mb-1 text-base font-bold text-slate-900">
              Ítems de la donación
            </h3>
            <p className="mb-4 text-sm text-slate-500">
              Puedes ajustar cantidades, lote y fecha. El sistema impedirá cambios que rompan salidas ya registradas.
            </p>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-700">
                      Ítem #{index + 1}
                    </h4>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item)}
                      disabled={deletingItemId === item.id}
                      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 disabled:cursor-not-allowed disabled:text-slate-300"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingItemId === item.id ? "Eliminando..." : "Eliminar"}
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
                        onChange={(event) => updateItem(index, "lote", event.target.value)}
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

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleSaveItem(index)}
                      disabled={savingItemId === item.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                      <Save className="h-4 w-4" />
                      {savingItemId === item.id ? "Guardando..." : "Guardar ítem"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <form
            onSubmit={handleAddItem}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <h3 className="mb-1 text-base font-bold text-slate-900">
              Agregar nuevo ítem
            </h3>
            <p className="mb-4 text-sm text-slate-500">
              El nuevo ítem sumará stock al inventario de la donación.
            </p>

            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Medicamento
                </label>
                <select
                  value={nuevoItem.medicamento_id}
                  onChange={(event) =>
                    updateNuevoItem("medicamento_id", event.target.value)
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
                  value={nuevoItem.cantidad}
                  onChange={(event) => updateNuevoItem("cantidad", event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Lote
                </label>
                <input
                  value={nuevoItem.lote}
                  onChange={(event) => updateNuevoItem("lote", event.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Fecha de vencimiento
                </label>
                <input
                  type="date"
                  value={nuevoItem.fecha_vencimiento}
                  onChange={(event) =>
                    updateNuevoItem("fecha_vencimiento", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={isAddingItem}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-300"
              >
                <Plus className="h-4 w-4" />
                {isAddingItem ? "Agregando..." : "Agregar ítem"}
              </button>
            </div>
          </form>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push("/donaciones")}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Finalizar
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
