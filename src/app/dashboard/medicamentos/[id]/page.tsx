"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function EditarMedicamentoPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    nombre: "",
    presentacion: "",
    categoria: "",
    unidad: "",
    descripcion: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 🔍 Cargar datos del medicamento
  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get(`/api/medicamentos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setForm({
          nombre: res.data.nombre,
          presentacion: res.data.presentacion ?? "",
          categoria: res.data.categoria ?? "",
          unidad: res.data.unidad ?? "",
          descripcion: res.data.descripcion ?? "",
        });

        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar el medicamento.");
        setLoading(false);
      });
  }, [id]);

  // 📝 Manejar cambios
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Guardar cambios
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/api/medicamentos/${id}`,
        {
          nombre: form.nombre,
          presentacion: form.presentacion,
          categoria: form.categoria,
          unidad: form.unidad,
          descripcion: form.descripcion,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      router.push("/dashboard/medicamentos");
    } catch (err) {
      setError("Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-lg p-10">Cargando medicamento...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Editar Medicamento</h1>

      {error && (
        <div className="bg-red-200 text-red-700 p-3 mb-4 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <input
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Nombre"
          required
        />

        <input
          name="presentacion"
          type="text"
          value={form.presentacion}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Presentación"
        />

        <input
          name="categoria"
          type="text"
          value={form.categoria}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Categoría"
        />

        <input
          name="unidad"
          type="text"
          value={form.unidad}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Unidad"
        />

        <textarea
          name="descripcion"
          rows={3}
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="border p-2 rounded"
        ></textarea>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
