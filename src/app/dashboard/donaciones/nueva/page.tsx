"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type Item = {
  medicamento_id: string;
  cantidad: string;
  fecha_vencimiento: string;
  lote: string;
};

export default function NuevaDonacionPage() {
  const router = useRouter();

  const [donante, setDonante] = useState("");
  const [tipoDonante, setTipoDonante] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaDonacion, setFechaDonacion] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [items, setItems] = useState<Item[]>([
    {
      medicamento_id: "",
      cantidad: "",
      fecha_vencimiento: "",
      lote: "",
    },
  ]);

  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar medicamentos para el select
  useEffect(() => {
    const token = localStorage.getItem("token");

    api
      .get("/api/medicamentos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setMedicamentos(res.data.data || res.data); // según tu API
      })
      .catch((err) => console.error(err));
  }, []);

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string
  ) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        medicamento_id: "",
        cantidad: "",
        fecha_vencimiento: "",
        lote: "",
      },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        donante,
        tipo_donante: tipoDonante,
        telefono,
        fecha_donacion: fechaDonacion,
        descripcion,
        items: items.map((item) => ({
          medicamento_id: Number(item.medicamento_id),
          cantidad: Number(item.cantidad),
          fecha_vencimiento: item.fecha_vencimiento || null,
          lote: item.lote,
        })),
      };

      await api.post("/api/donaciones", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Donación registrada correctamente");
      router.push("/dashboard/donaciones");
    } catch (err: any) {
      console.error(err);
      setError("Error al guardar la donación. Revisa los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Nueva Donación</h1>

      {error && (
        <div className="bg-red-200 text-red-700 px-3 py-2 mb-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos del donante */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Donante *</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={donante}
              onChange={(e) => setDonante(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Tipo de donante</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={tipoDonante}
              onChange={(e) => setTipoDonante(e.target.value)}
              placeholder="Persona, empresa, ONG..."
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Teléfono</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Fecha de donación *</label>
            <input
              type="date"
              className="border p-2 rounded w-full"
              value={fechaDonacion}
              onChange={(e) => setFechaDonacion(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">
            Descripción / Observaciones
          </label>
          <textarea
            className="border p-2 rounded w-full"
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        {/* Items */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Medicamentos donados</h2>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end border p-3 rounded"
              >
                <div>
                  <label className="block text-sm mb-1">Medicamento *</label>
                  <select
                    className="border p-2 rounded w-full"
                    value={item.medicamento_id}
                    onChange={(e) =>
                      handleItemChange(index, "medicamento_id", e.target.value)
                    }
                    required
                  >
                    <option value="">Seleccione...</option>
                    {medicamentos.map((m: any) => (
                      <option key={m.id} value={m.id}>
                        {`${m.nombre} — ${m.presentacion}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-1">Cantidad *</label>
                  <input
                    type="number"
                    min={1}
                    className="border p-2 rounded w-full"
                    value={item.cantidad}
                    onChange={(e) =>
                      handleItemChange(index, "cantidad", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="date"
                    name="fecha_vencimiento"
                    value={item.fecha_vencimiento}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "fecha_vencimiento",
                        e.target.value
                      )
                    }
                    className="border p-2 rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Lote</label>
                  <input
                    type="text"
                    className="border p-2 rounded w-full"
                    value={item.lote}
                    onChange={(e) =>
                      handleItemChange(index, "lote", e.target.value)
                    }
                  />
                </div>

                <div className="md:col-span-5 flex justify-end">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      className="text-red-600 text-sm"
                    >
                      Eliminar fila
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItemRow}
            className="mt-3 text-sm text-blue-600 hover:underline"
          >
            + Agregar otro medicamento
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Guardando..." : "Guardar donación"}
        </button>
      </form>
    </div>
  );
}
