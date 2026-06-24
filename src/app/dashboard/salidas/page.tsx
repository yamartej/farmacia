"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function SalidasPage() {
  const [salidas, setSalidas] = useState([]);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);

  const fetchData = () => {
    const token = localStorage.getItem("token");

    api
      .get(`/api/salidas?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setSalidas(res.data.data);
        setPagination(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  console.log(salidas);
  return (
    <div>
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold">Salidas</h1>

        <Link
          href="/dashboard/salidas/nueva"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Nueva Salida
        </Link>
      </div>

      <div className="bg-white shadow p-4 rounded">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Responsable</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Items</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {salidas.length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan={5}>
                  No hay registros.
                </td>
              </tr>
            ) : (
              salidas.map((s: any) => (
                <tr key={s.id} className="border-b">
                  <td className="p-2">{s.responsable}</td>
                  <td className="p-2">{s.tipo_salida}</td>
                  <td className="p-2">{s.fecha_salida}</td>
                  <td className="p-2 text-center">{s.items_count}</td>
                  <td className="p-2">
                    <Link
                      href={`/dashboard/salidas/${s.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Ver detalles
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Paginación */}
        {pagination && (
          <div className="flex justify-between mt-4">
            <button
              disabled={!pagination.prev_page_url}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Anterior
            </button>

            <span className="text-sm">
              Página {pagination.current_page} de {pagination.last_page}
            </span>

            <button
              disabled={!pagination.next_page_url}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
