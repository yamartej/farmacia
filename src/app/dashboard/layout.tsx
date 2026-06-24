"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🚫 No hay token → redirigir al login
    if (!token) {
      router.push("/login");
      return;
    }

    // 🔍 Validar token contra el backend
    api
      .get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        // ❌ Token inválido → limpiar sesión
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      });
  }, [router]);

  // ⏳ Mostrar pantalla de carga mientras valida el usuario
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-gray-700">
        Verificando sesión...
      </div>
    );
  }

  // 🧱 Estructura general del Dashboard
  // 🧱 Estructura general del Dashboard
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
