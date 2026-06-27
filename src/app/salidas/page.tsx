"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { api } from "@/lib/api";
import { PaginatedResponse } from "@/types/api";
import { Salida } from "@/types/salida";

export default function SalidasPage() {
  const [salidas, setSalidas] = useState<Salida[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<PaginatedResponse<Salida>>("/api/salidas")
      .then((response) => setSalidas(response.data.data))
      .catch(() => setError("No fue posible cargar las salidas."))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AppShell>
      <PageHeader
        title="Salidas"
        description="Control de salidas, entregas o despachos de medicamentos."
        action={
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-auto">
            <Plus className="h-4 w-4" />
            Nueva salida
          </button>
        }
      />

      {isLoading && <LoadingState />}
      {error && <ErrorState message={error} />}

      {!isLoading && !error && salidas.length === 0 && (
        <EmptyState
          title="No hay salidas registradas"
          description="Cuando registres una salida, aparecerá en esta sección."
        />
      )}

      {!isLoading && !error && salidas.length > 0 && (
        <>
          <div className="space-y-3 md:hidden">
            {salidas.map((salida) => (
              <article
                key={salida.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-slate-900">
                      {salida.responsable}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {salida.tipo_salida}
                    </p>
                  </div>

                  <div className="rounded-xl bg-red-50 px-3 py-2 text-center">
                    <p className="text-[11px] font-medium uppercase text-red-600">
                      Ítems
                    </p>
                    <p className="text-lg font-bold text-red-700">
                      {salida.items_count ?? 0}
                    </p>
                  </div>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium uppercase text-slate-400">
                      Destino
                    </dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {salida.destino || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase text-slate-400">
                      Fecha
                    </dt>
                    <dd className="mt-1 font-medium text-slate-700">
                      {salida.fecha_salida}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Responsable
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Destino
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">
                      Ítems
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {salidas.map((salida) => (
                    <tr key={salida.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {salida.responsable}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {salida.tipo_salida}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {salida.destino || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {salida.fecha_salida}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {salida.items_count ?? 0}
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
