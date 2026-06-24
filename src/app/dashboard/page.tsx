"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { logout } from "@/lib/logout";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Cerrar sesión
        </button>
      </div>

      {user && (
        <p className="text-gray-700">
          Bienvenido, <strong>{user.name}</strong>
        </p>
      )}
    </div>
  );
}
