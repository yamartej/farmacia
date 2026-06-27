"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Donacion } from "@/types/donacion";

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

export default function DonacionesPage() {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDonaciones = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.get<PaginatedResponse<Donacion>>("/api/donaciones");
      setDonaciones(response.data.data);
    } catch {
      setError("No fue posible cargar las donaciones.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDonaciones();
  }, []);

  const handleDelete = async (donacion: Donacion) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar la donación de "${donacion.donante}"? Esta acción puede afectar el inventario.`
    );

    if (!confirmed) return;

    setIsDeletingId(donacion.id);
    setError("");
    setMessage("");

    try {
      await api.delete(`/api/donaciones/${donacion.id}`);

      setDonaciones((current) =>
        current.filter((item) => item.id !== donacion.id)
      );

      setMessage("Donación eliminada correctamente.");
    } catch (deleteError: unknown) {
      setError(
        getAxiosErrorMessage(
          deleteError,
          "No fue posible eliminar la donación."
        )
      );
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Donaciones"
        description="Registro de donaciones recibidas y control de sus ítems."
        action={
          <Link
            href="/donaciones/nueva"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Nueva donación
          </Link>
        }
      />

      {message && (
        <p className="mb-4 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
          {message}
        </p>
      )}

      {isLoading && <LoadingState />}
      {error && <ErrorState message={error} />}

      {!isLoading && !error && donaciones.length === 0 && (
        <EmptyState
          title="No hay donaciones registradas"
          description="Cuando registres una donación, aparecerá en esta sección."
        />
      )}

      {!isLoading && !error && donaciones.length > 0 && (
        <>
          <div className="space-y-3 md:hidden">
            {donaciones.map((donacion) => (
              <article
                key={donacion.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-slate-900">
                      {donacion.donante}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {donacion.tipo_donante || "Tipo no especificado"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 px-3 py-2 text-center">
                    <p className="text-[11px] font-medium uppercase text-green-600">
                      Ítems
                    </p>
                    <p className="text-lg font-bold text-green-700">
                      {donacion.items_count ?? 0}
                    </p>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium uppercase text-slate-400">
                      Teléfono
                    </dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {donacion.telefono || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase text-slate-400">
                      Fecha
                    </dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {donacion.fecha_donacion}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href={`/donaciones/${donacion.id}/editar`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(donacion)}
                    disabled={isDeletingId === donacion.id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeletingId === donacion.id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Donante
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Teléfono
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">
                      Ítems
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donaciones.map((donacion) => (
                    <tr key={donacion.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {donacion.donante}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {donacion.tipo_donante || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {donacion.telefono || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {donacion.fecha_donacion}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {donacion.items_count ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/donaciones/${donacion.id}/editar`}
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            <Pencil className="h-4 w-4" />
                            Editar
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(donacion)}
                            disabled={isDeletingId === donacion.id}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            {isDeletingId === donacion.id
                              ? "Eliminando..."
                              : "Eliminar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}
