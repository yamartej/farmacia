"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { logout } from "@/lib/logout";
import { AuthUser, clearAuthData, getStoredUser, getToken } from "@/lib/auth";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }

    api
      .get<AuthUser>("/api/user")
      .then((res) => setUser(res.data))
      .catch(() => {
        clearAuthData();
        router.replace("/login");
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <section className="mx-auto max-w-6xl rounded-xl bg-white p-6 shadow">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500">
              Panel principal del sistema de farmacia
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        </div>

        {user && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-slate-700">
              Bienvenido, <strong>{user.name}</strong>
            </p>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          </div>
        )}
      </section>
    </main>
  );
}
