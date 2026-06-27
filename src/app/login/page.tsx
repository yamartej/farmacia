"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { LoginResponse, setAuthData } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setMessage("Procesando...");

    try {
      const response = await api.post<LoginResponse>("/api/login", {
        email,
        password,
      });

      const { access_token, user } = response.data;

      setAuthData(access_token, user);
      setMessage("Inicio de sesión exitoso ✅");

      router.replace("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message || "Error en el inicio de sesión ❌"
        );
      } else {
        setMessage("Error inesperado en el inicio de sesión ❌");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
      >
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Sistema de Farmacia
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Correo
        </label>
        <input
          type="email"
          placeholder="usuario@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Contraseña
        </label>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-5 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          required
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? "Ingresando..." : "Entrar"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-slate-600">{message}</p>
        )}
      </form>
    </div>
  );
}
