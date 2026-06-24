"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function DonacionesPage() {
  const [donaciones, setDonaciones] = useState([]);

  const fetchDonaciones = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/donaciones", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setDonaciones(res.data.data); // si usamos paginate
  };

  useEffect(() => {
    fetchDonaciones();
  }, []);

  const eliminarDonacion = async (id: number) => {
    if (!confirm("¿Eliminar esta donación?")) return;

    const token = localStorage.getItem("token");

    await api.delete(`/api/donaciones/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchDonaciones();
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Donaciones Recibidas</h1>

        <Link
          href="/dashboard/donaciones/nueva"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Nueva
        </Link>
      </div>

      <table className="w-full bg-white shadow p-4 rounded">
        <thead>
          <tr className="border-b">
            <th className="p-2">Donante</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Items</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {donaciones.map((d: any) => (
            <tr key={d.id} className="border-b">
              <td className="p-2">{d.donante}</td>
              <td className="p-2">{d.fecha_donacion}</td>
              <td className="p-2">{d.items_count ?? 0}</td>

              <td className="p-2">
                <Link
                  href={`/dashboard/donaciones/${d.id}`}
                  className="text-blue-600 mr-4"
                >
                  Ver
                </Link>

                <button
                  onClick={() => eliminarDonacion(d.id)}
                  className="text-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
