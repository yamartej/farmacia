"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Procesando...");

    try {
      console.log("Iniciando proceso de login");
      // 1️⃣ Solicitar cookie CSRF
      await api.get("/sanctum/csrf-cookie");

      // 2️⃣ Enviar login
      const response = await api.post("/api/login", {
        email,
        password,
      });
      console.log(response.data);

      const { access_token, user } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("Inicio de sesión exitoso ✅");
      router.push("/dashboard");
    } catch (error: any) {
      console.error(error.response?.data || error);
      setMessage(
        error.response?.data?.message || "Error en el inicio de sesión ❌"
      );
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-md rounded w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h1>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Entrar
        </button>
        <p className="text-center text-sm mt-3 text-gray-600">{message}</p>
      </form>
    </div>
  );
}
