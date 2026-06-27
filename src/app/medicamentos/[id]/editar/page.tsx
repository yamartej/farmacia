"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";
import { Medicamento } from "@/types/medicamento";

type MedicamentoForm = {
  nombre: string;
  presentacion: string;
  categoria: string;
  unidad: string;
  fecha_vencimiento: string;
  descripcion: string;
};

const initialForm: MedicamentoForm = {
  nombre: "",
  presentacion: "",
  categoria: "",
  unidad: "",
  fecha_vencimiento: "",
  descripcion: "",
};

export default function EditarMedicamentoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<MedicamentoForm>(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const medicamentoId = params.id;

  useEffect(() => {
    if (!medicamentoId) return;

    api
      .get<Medicamento>(`/api/medicamentos/${medicamentoId}`)
      .then((response) => {
        const medicamento = response.data;

        setForm({
          nombre: medicamento.nombre || "",
          presentacion: medicamento.presentacion || "",
          categoria: medicamento.categoria || "",
          unidad: medicamento.unidad || "",
          fecha_vencimiento: medicamento.fecha_vencimiento || "",
          descripcion: medicamento.descripcion || "",
        });
      })
      .catch(() => setError("No fue posible cargar el medicamento."))
      .finally(() => setIsLoading(false));
  }, [medicamentoId]);

  const updateField = (field: keyof MedicamentoForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      await api.put(`/api/medicamentos/${medicamentoId}`, {
        nombre: form.nombre,
        presentacion: form.presentacion || null,
        categoria: form.categoria || null,
        unidad: form.unidad || null,
        fecha_vencimiento: form.fecha_vencimiento || null,
        descripcion: form.descripcion || null,
      });

      router.push("/medicamentos");
    } catch (updateError: unknown) {
      if (axios.isAxiosError(updateError)) {
        setMessage(
          updateError.response?.data?.message ||
            Object.values(updateError.response?.data?.errors || {})?.flat()?.[0]?.toString() ||
            "No fue posible actualizar el medicamento."
        );
      } else {
        setMessage("Error inesperado al actualizar el medicamento.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Editar medicamento"
        description="Actualiza los datos principales del medicamento seleccionado."
        action={
          <Link
            href="/medicamentos"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        }
      />

      {isLoading && <LoadingState message="Cargando medicamento..." />}
      {error && <ErrorState message={error} />}

      {!isLoading && !error && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Nombre
              </label>
              <input
                value={form.nombre}
                onChange={(event) => updateField("nombre", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Presentación
              </label>
              <input
                value={form.presentacion}
                onChange={(event) => updateField("presentacion", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Categoría
              </label>
              <input
                value={form.categoria}
                onChange={(event) => updateField("categoria", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Unidad
              </label>
              <input
                value={form.unidad}
                onChange={(event) => updateField("unidad", event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Fecha de vencimiento general
              </label>
              <input
                type="date"
                value={form.fecha_vencimiento}
                onChange={(event) =>
                  updateField("fecha_vencimiento", event.target.value)
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <p className="mt-1 text-xs text-slate-500">
                Para control por lote, la fecha principal debe venir desde la donación.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Descripción
              </label>
              <textarea
                value={form.descripcion}
                onChange={(event) => updateField("descripcion", event.target.value)}
                className="min-h-28 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {message && (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">
              {message}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/medicamentos"
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
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      )}
    </AppShell>
  );
}
