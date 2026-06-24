import { api } from "@/lib/api";

export async function logout() {
  try {
    const token = localStorage.getItem("token");

    if (!token) return;

    await api.post("/api/logout", null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Error cerrando sesión:", error);
  }
}
document.cookie.split(";").forEach(function (c) {
  document.cookie = c
    .replace(/^ +/, "")
    .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});
