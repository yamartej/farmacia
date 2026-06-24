"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [categoria, setCategoria] = useState("");
  const [unidad, setUnidad] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [stock, setStock] = useState("");

  const fetchData = () => {
    const token = localStorage.getItem("token");

    api
      .get(
        `/api/medicamentos?page=${page}&search=${search}&categoria=${categoria}&unidad=${unidad}&vencimiento=${vencimiento}&stock=${stock}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setMedicamentos(res.data.data);
        setPagination(res.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, [page]);

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
    setPage(1); // reinicia a la página 1
  };

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    setPage(1);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este medicamento?")) {
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await api.delete(`/api/medicamentos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Recargar lista
      fetchData();

      alert("Medicamento eliminado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al eliminar el medicamento");
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-bold">Medicamentos</h1>

        <Link
          href="/dashboard/medicamentos/nuevo"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Nuevo
        </Link>
      </div>

      {/* Buscador */}
      <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Buscar medicamento..."
          className="border p-2 rounded w-full"
          value={search}
          onChange={handleSearch}
        />
        <button className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">
          Buscar
        </button>
      </form>
      <div className="flex gap-4 mb-4">
        {/* Categoría */}
        <select
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">Todas las categorías</option>
          <option value="Antibiotico">Antibiótico</option>
          <option value="Analgesico">Analgésico</option>
          <option value="Antiinflamatorio">Antiinflamatorio</option>
        </select>

        {/* Unidad */}
        <select
          value={unidad}
          onChange={(e) => {
            setUnidad(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">Todas las unidades</option>
          <option value="caja">Cajas</option>
          <option value="frasco">Frascos</option>
          <option value="tabletas">Tabletas</option>
        </select>

        {/* Vencimiento cercano */}
        <select
          value={vencimiento}
          onChange={(e) => {
            setVencimiento(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">Vencimiento</option>
          <option value="proximo">Próximo (30 días)</option>
        </select>

        {/* Stock bajo */}
        <select
          value={stock}
          onChange={(e) => {
            setStock(e.target.value);
            setPage(1);
          }}
          className="border p-2 rounded"
        >
          <option value="">Stock</option>
          <option value="bajo">Bajo (≤10)</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow p-4 rounded">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Nombre</th>
              <th className="p-2">Presentación</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicamentos.length === 0 ? (
              <tr>
                <td className="p-4 text-center" colSpan={5}>
                  No se encontraron resultados.
                </td>
              </tr>
            ) : (
              medicamentos.map((m: any) => (
                <tr key={m.id} className="border-b">
                  <td className="p-2">{m.nombre}</td>
                  <td className="p-2">{m.presentacion}</td>
                  <td className="p-2">
                    <Link
                      href={`/dashboard/medicamentos/${m.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-red-600 hover:text-red-800 font-semibold"
                    >
                      Eliminar
                    </button>
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
              className={`px-4 py-2 rounded ${
                pagination.prev_page_url
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Anterior
            </button>

            <span className="text-sm text-gray-600">
              Página {pagination.current_page} de {pagination.last_page}
            </span>

            <button
              disabled={!pagination.next_page_url}
              onClick={() => setPage(page + 1)}
              className={`px-4 py-2 rounded ${
                pagination.next_page_url
                  ? "bg-gray-200 hover:bg-gray-300"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
