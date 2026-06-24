"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

export default function DonacionDetallePage() {
  const { id } = useParams();

  const [donacion, setDonacion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    donante: "",
    tipo_donante: "",
    telefono: "",
    fecha_donacion: "",
    descripcion: "",
  });

  const [nuevoItem, setNuevoItem] = useState({
    medicamento_id: "",
    cantidad: 1,
    fecha_vencimiento: "",
    lote: "",
  });

  const [medicamentos, setMedicamentos] = useState([]);

  const fetchDonacion = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await api.get(`/api/donaciones/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDonacion(res.data);

      setForm({
        donante: res.data.donante,
        tipo_donante: res.data.tipo_donante,
        telefono: res.data.telefono,
        fecha_donacion: res.data.fecha_donacion,
        descripcion: res.data.descripcion,
      });
    } finally {
      setLoading(false);
    }
  };
  const fetchMedicamentos = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/medicamentos", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMedicamentos(res.data.data);
  };

  useEffect(() => {
    fetchDonacion();
    fetchMedicamentos();
  }, []);

  const agregarItem = async () => {
    if (!nuevoItem.medicamento_id) {
      alert("Seleccione un medicamento");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await api.post(
        `/api/donaciones/${id}/items`,
        {
          medicamento_id: nuevoItem.medicamento_id,
          cantidad: Number(nuevoItem.cantidad),
          fecha_vencimiento: nuevoItem.fecha_vencimiento || null,
          lote: nuevoItem.lote,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // limpiar formulario
      setNuevoItem({
        medicamento_id: "",
        cantidad: 1,
        fecha_vencimiento: "",
        lote: "",
      });

      fetchDonacion(); // recargar lista
      alert("Ítem agregado correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al agregar el ítem");
    }
  };

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const guardarCambios = async () => {
    const token = localStorage.getItem("token");

    await api.put(`/api/donaciones/${id}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Datos actualizados");
  };

  const actualizarItem = async (item: any) => {
    const token = localStorage.getItem("token");

    await api.put(
      `/api/donaciones/${id}/items/${item.id}`,
      {
        cantidad: Number(item.cantidad),
        medicamento_id: item.medicamento_id,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    fetchDonacion();
  };

  const eliminarItem = async (itemId: number) => {
    if (!confirm("¿Eliminar ítem?")) return;

    const token = localStorage.getItem("token");

    await api.delete(`/api/donaciones/${id}/items/${itemId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchDonacion();
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Donación #{id}</h1>

      {/* Datos generales */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <input
          name="donante"
          value={form.donante}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="tipo_donante"
          value={form.tipo_donante}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          name="telefono"
          value={form.telefono}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="date"
          name="fecha_donacion"
          value={form.fecha_donacion}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          onClick={guardarCambios}
          className="bg-blue-600 text-white py-2 rounded"
        >
          Guardar cambios
        </button>
      </div>

      {/* Items */}
      <h2 className="text-xl font-bold">Ítems</h2>

      {/* Formulario para agregar ítem */}
      <div className="mt-4 p-4 bg-gray-50 rounded border">
        <h3 className="font-semibold mb-2">Agregar ítem</h3>

        <div className="flex gap-3 items-end">
          {/* Selector de medicamentos */}
          <select
            value={nuevoItem.medicamento_id}
            onChange={(e) =>
              setNuevoItem({ ...nuevoItem, medicamento_id: e.target.value })
            }
            className="border p-2 rounded w-1/2"
          >
            <option value="">Seleccione medicamento</option>
            {medicamentos.map((m: any) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>

          {/* Cantidad */}
          <input
            type="number"
            min={1}
            value={nuevoItem.cantidad}
            onChange={(e) =>
              setNuevoItem({ ...nuevoItem, cantidad: e.target.value })
            }
            className="border p-2 rounded w-24"
            placeholder="Cant."
          />

          {/* Fecha de Vencimiento */}
          <input
            type="date"
            value={nuevoItem.fecha_vencimiento || ""}
            onChange={(e) =>
              setNuevoItem({
                ...nuevoItem,
                fecha_vencimiento: e.target.value,
              })
            }
            placeholder="Vencimiento"
            className="border p-2 rounded w-40"
          />

          <input
            type="text"
            value={nuevoItem.lote || ""}
            onChange={(e) =>
              setNuevoItem({
                ...nuevoItem,
                lote: e.target.value,
              })
            }
            placeholder="Lote"
            className="border p-2 rounded w-40"
          />

          <button
            onClick={agregarItem}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Agregar
          </button>
        </div>
      </div>

      <table className="w-full mt-3 border">
        <thead>
          <tr className="border-b">
            <th className="p-2">Medicamento</th>
            <th className="p-2">Cantidad</th>
            <th className="p-2">Lote</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {donacion.items.map((item: any, index: number) => (
            <tr key={item.id} className="border-b">
              <td className="p-2">
                <input
                  value={item.medicamento?.nombre}
                  disabled
                  className="border p-1 bg-gray-100 rounded"
                />
              </td>

              <td className="p-2">
                <input
                  type="number"
                  value={item.cantidad}
                  min={1}
                  className="border p-1 w-20 rounded"
                  onChange={(e) => {
                    const list = [...donacion.items];
                    list[index].cantidad = e.target.value;
                    setDonacion({ ...donacion, items: list });
                  }}
                />
              </td>

              <td className="p-2">
                <input
                  type="date"
                  value={item.fecha_vencimiento || ""}
                  className="border p-1 rounded"
                  onChange={(e) => {
                    const list = [...donacion.items];
                    list[index].fecha_vencimiento = e.target.value;
                    setDonacion({ ...donacion, items: list });
                  }}
                />
              </td>

              <td className="p-2">
                <input
                  type="text"
                  value={item.lote || ""}
                  className="border p-1 rounded"
                  onChange={(e) => {
                    const list = [...donacion.items];
                    list[index].lote = e.target.value;
                    setDonacion({ ...donacion, items: list });
                  }}
                />
              </td>

              <td className="p-2">
                <button
                  onClick={() => actualizarItem(item)}
                  className="text-blue-600 mr-4"
                >
                  Guardar
                </button>

                <button
                  onClick={() => eliminarItem(item.id)}
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
