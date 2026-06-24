"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function NuevoMedicamentoPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nombre: "",
    presentacion: "",
    categoria: "",
    unidad: "",
    descripcion: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Manejar cambios de inputs
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Enviar al backend
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/api/medicamentos",
        {
          nombre: form.nombre,
          presentacion: form.presentacion,
          categoria: form.categoria,
          unidad: form.unidad,
          descripcion: form.descripcion,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Medicamento creado correctamente");
      router.push("/dashboard/medicamentos");
    } catch (err: any) {
      console.error(err);
      setError("Error al guardar el medicamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Nuevo Medicamento</h1>

      {error && (
        <div className="bg-red-200 text-red-700 px-3 py-2 mb-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          required
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="presentacion"
          placeholder="Presentación (ej: tabletas)"
          required
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="categoria"
          placeholder="Categoría"
          required
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="unidad"
          placeholder="Unidad (frascos, cajas)"
          required
          className="border p-2 rounded"
          onChange={handleChange}
        />

        <textarea
          name="descripcion"
          placeholder="Descripción..."
          className="border p-2 rounded"
          rows={3}
          onChange={handleChange}
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
