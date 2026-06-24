"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function NuevaSalidaPage() {
  const router = useRouter();

  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [lotes, setLotes] = useState<any[]>([]);

  const [selectedMedicamento, setSelectedMedicamento] = useState("");
  const [selectedLote, setSelectedLote] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const [form, setForm] = useState({
    responsable: "",
    tipo_salida: "",
    destino: "",
    fecha_salida: "",
    descripcion: "",
  });

  const [error, setError] = useState("");

  // 🟦 Cargar medicamentos
  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/api/medicamentos?page=1", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMedicamentos(res.data.data))
      .catch(() => setError("Error cargando medicamentos."));
  }, []);

  // 🟦 Cargar lotes cuando cambie medicamento seleccionado
  useEffect(() => {
    if (!selectedMedicamento) {
      setLotes([]);
      return;
    }

    const token = localStorage.getItem("token");

    api
      .get(`/api/medicamentos/${selectedMedicamento}/lotes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLotes(res.data))
      .catch(() => setError("Error cargando lotes."));
  }, [selectedMedicamento]);

  // 🟧 Agregar ítem a la tabla temporal
  const agregarItem = () => {
    setError("");

    if (!selectedMedicamento) {
      setError("Debe seleccionar un medicamento.");
      return;
    }

    const loteInfo = lotes.find((l) => l.lote === selectedLote);

    if (!loteInfo) {
      setError("Debe seleccionar un lote válido.");
      return;
    }

    if (cantidad < 1) {
      setError("Debe ingresar una cantidad válida.");
      return;
    }

    if (cantidad > loteInfo.stock) {
      setError("La cantidad supera el stock disponible.");
      return;
    }

    const med = medicamentos.find((m) => m.id == selectedMedicamento);

    setItems((prev) => [
      ...prev,
      {
        medicamento_id: med.id,
        nombre: med.nombre,
        lote: loteInfo.lote,
        fecha_vencimiento: loteInfo.fecha_vencimiento,
        cantidad,
      },
    ]);

    // Reset de campos
    setSelectedMedicamento("");
    setSelectedLote("");
    setCantidad(1);
  };

  // 🟩 Guardar salida completa
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Debe agregar al menos un medicamento.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/api/salidas",
        {
          ...form,
          items,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      router.push("/dashboard/salidas");
    } catch (err) {
      console.error(err);
      setError("Error al registrar la salida.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Nueva Salida</h1>

      {error && (
        <div className="bg-red-200 text-red-700 px-3 py-2 mb-3 rounded">
          {error}
        </div>
      )}

      {/* 🟦 Datos generales */}
      <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
        <input
          type="text"
          placeholder="Responsable"
          className="border p-2 rounded"
          required
          onChange={(e) => setForm({ ...form, responsable: e.target.value })}
        />

        <input
          type="text"
          placeholder="Tipo de salida (paciente, campaña...)"
          className="border p-2 rounded"
          required
          onChange={(e) => setForm({ ...form, tipo_salida: e.target.value })}
        />

        <input
          type="text"
          placeholder="Destino"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, destino: e.target.value })}
        />

        <input
          type="date"
          className="border p-2 rounded"
          required
          onChange={(e) => setForm({ ...form, fecha_salida: e.target.value })}
        />

        <textarea
          placeholder="Descripción"
          className="border p-2 rounded"
          rows={3}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
        ></textarea>

        {/* Items agregados + Agregar item */}
        <h2 className="text-xl font-bold mt-6 mb-2">Agregar Medicamento</h2>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* Medicamento */}
          <select
            className="border p-2 rounded"
            value={selectedMedicamento}
            onChange={(e) => setSelectedMedicamento(e.target.value)}
          >
            <option value="">Seleccione medicamento</option>
            {medicamentos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>

          {/* Lote */}
          <select
            className="border p-2 rounded"
            value={selectedLote}
            onChange={(e) => setSelectedLote(e.target.value)}
          >
            <option value="">Seleccione lote</option>
            {lotes.map((l, idx) => (
              <option key={idx} value={l.lote}>
                {l.lote} — vence {l.fecha_vencimiento} — stock {l.stock}
              </option>
            ))}
          </select>

          {/* Cantidad */}
          <input
            type="number"
            min="1"
            className="border p-2 rounded"
            value={cantidad}
            onChange={(e) => setCantidad(parseInt(e.target.value))}
          />
        </div>

        <button
          type="button"
          onClick={agregarItem}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
        >
          + Agregar Item
        </button>

        {/* Tabla de items */}
        <div className="bg-gray-50 p-4 rounded mb-6">
          <h3 className="text-lg font-semibold mb-2">Items agregados</h3>

          {items.length === 0 ? (
            <p className="text-gray-600">No se han agregado medicamentos.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Lote</th>
                  <th>Vencimiento</th>
                  <th>Cantidad</th>
                </tr>
              </thead>

              <tbody>
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.nombre}</td>
                    <td>{it.lote}</td>
                    <td>{it.fecha_vencimiento}</td>
                    <td>{it.cantidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* BOTÓN SUBMIT — AHORA FUNCIONAL */}
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded w-full"
        >
          Registrar salida
        </button>
      </form>
    </div>
  );
}
