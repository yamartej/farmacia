"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Movimiento } from "@/types/movimiento";

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<PaginatedResponse<Movimiento>>("/api/movimientos")
      .then((response) => setMovimientos(response.data.data))
      .catch(() => setError("No fue posible cargar los movimientos."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Movimientos"
        description="Kardex general de entradas y salidas de medicamentos."
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState message={error} />}

      {!isLoading && !error && movimientos.length === 0 && (
        <EmptyState
          title="No hay movimientos registrados"
          description="Los movimientos se mostrarán cuando existan entradas o salidas de inventario."
        />
      )}

      {!isLoading && !error && movimientos.length > 0 && (
        <>
          <div className="space-y-3 md:hidden">
            {movimientos.map((movimiento) => (
              <article
                key={movimiento.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-slate-900">
                      {movimiento.medicamento?.nombre || "Medicamento"}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {movimiento.origen || "Sin origen"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      movimiento.tipo === "entrada"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {movimiento.tipo}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium uppercase text-slate-400">
                      Cantidad
                    </dt>
                    <dd className="mt-1 text-lg font-bold text-slate-900">
                      {movimiento.cantidad}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase text-slate-400">
                      Fecha
                    </dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {movimiento.fecha}
                    </dd>
                  </div>
                </dl>

                {movimiento.descripcion && (
                  <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-600">
                    {movimiento.descripcion}
                  </p>
                )}
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Medicamento
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">
                      Cantidad
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Origen
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {movimientos.map((movimiento) => (
                    <tr key={movimiento.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {movimiento.medicamento?.nombre || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            movimiento.tipo === "entrada"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {movimiento.tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {movimiento.cantidad}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {movimiento.origen || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {movimiento.fecha}
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
