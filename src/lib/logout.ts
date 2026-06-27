import { api } from "@/lib/api";
import { clearAuthData, getToken } from "@/lib/auth";

export async function logout(): Promise<void> {
  const token = getToken();

  try {
    if (token) {
      await api.post("/api/logout");
    }
  } catch (error) {
    console.error("Error cerrando sesión:", error);
  } finally {
    clearAuthData();
  }
}
