"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { api } from "@/lib/api";

type MedicamentoForm = {
  nombre: string;
  presentacion: string;
  categoria: string;
  unidad: string;
  descripcion: string;
};

const initialForm: MedicamentoForm = {
  nombre: "",
  presentacion: "",
  categoria: "",
  unidad: "",
  descripcion: "",
};

export default function NuevoMedicamentoPage() {
  const router = useRouter();
  const [form, setForm] = useState<MedicamentoForm>(initialForm);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const updateField = (field: keyof MedicamentoForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      await api.post("/api/medicamentos", {
        nombre: form.nombre,
        presentacion: form.presentacion,
        categoria: form.categoria,
        unidad: form.unidad,
        descripcion: form.descripcion || null,
      });

      router.push("/medicamentos");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message || "No fue posible guardar el medicamento."
        );
      } else {
        setMessage("Error inesperado al guardar el medicamento.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Nuevo medicamento"
        description="Registra un medicamento en el catálogo principal."
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
              placeholder="Ej: Acetaminofén"
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
              placeholder="Ej: Tabletas 500 mg"
              required
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
              placeholder="Ej: Analgésico"
              required
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
              placeholder="Ej: caja, frasco, unidad"
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
              className="min-h-28 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Observaciones opcionales"
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
            {isSaving ? "Guardando..." : "Guardar medicamento"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
