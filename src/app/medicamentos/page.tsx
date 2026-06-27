"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Medicamento } from "@/types/medicamento";

export default function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadMedicamentos = async (query = "") => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await api.get<PaginatedResponse<Medicamento>>(
        "/api/medicamentos",
        {
          params: query ? { search: query } : undefined,
        }
      );

      setMedicamentos(response.data.data);
    } catch {
      setError("No fue posible cargar el listado de medicamentos.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedicamentos();
  }, []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadMedicamentos(search);
  };

  const handleDelete = async (medicamento: Medicamento) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar el medicamento "${medicamento.nombre}"? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    setIsDeletingId(medicamento.id);
    setMessage("");
    setError("");

    try {
      await api.delete(`/api/medicamentos/${medicamento.id}`);

      setMedicamentos((current) =>
        current.filter((item) => item.id !== medicamento.id)
      );

      setMessage("Medicamento eliminado correctamente.");
    } catch (deleteError: unknown) {
      if (axios.isAxiosError(deleteError)) {
        setError(
          deleteError.response?.data?.message ||
            "No fue posible eliminar el medicamento."
        );
      } else {
        setError("Error inesperado al eliminar el medicamento.");
      }
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Medicamentos"
        description="Catálogo principal de medicamentos registrados en el sistema."
        action={
          <Link
            href="/medicamentos/nuevo"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Nuevo medicamento
          </Link>
        }
      />

      <form
        onSubmit={handleSearch}
        className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          <input
            type="search"
            placeholder="Buscar medicamento..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          Buscar
        </button>
      </form>

      {message && (
        <p className="mb-4 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
          {message}
        </p>
      )}

      {isLoading && <LoadingState />}
      {error && <ErrorState message={error} />}

      {!isLoading && !error && medicamentos.length === 0 && (
        <EmptyState
          title="No hay medicamentos para mostrar"
          description="Cuando registres medicamentos, aparecerán en esta lista."
        />
      )}

      {!isLoading && !error && medicamentos.length > 0 && (
        <>
          <div className="space-y-3 md:hidden">
            {medicamentos.map((medicamento) => (
              <article
                key={medicamento.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-slate-900">
                      {medicamento.nombre}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {medicamento.presentacion || "Sin presentación"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 px-3 py-2 text-center">
                    <p className="text-[11px] font-medium uppercase text-blue-600">
                      Stock
                    </p>
                    <p className="text-lg font-bold text-blue-700">
                      {medicamento.stock ?? 0}
                    </p>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium uppercase text-slate-400">
                      Categoría
                    </dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {medicamento.categoria || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase text-slate-400">
                      Unidad
                    </dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {medicamento.unidad || "—"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href={`/medicamentos/${medicamento.id}/editar`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(medicamento)}
                    disabled={isDeletingId === medicamento.id}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    {isDeletingId === medicamento.id ? "Eliminando..." : "Eliminar"}
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
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Presentación
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Unidad
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {medicamentos.map((medicamento) => (
                    <tr key={medicamento.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {medicamento.nombre}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {medicamento.presentacion || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {medicamento.categoria || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {medicamento.unidad || "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {medicamento.stock ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/medicamentos/${medicamento.id}/editar`}
                            className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                          >
                            <Pencil className="h-4 w-4" />
                            Editar
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(medicamento)}
                            disabled={isDeletingId === medicamento.id}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            {isDeletingId === medicamento.id
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
