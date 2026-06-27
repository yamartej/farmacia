"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HeartHandshake,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  Menu,
  PackageMinus,
  Pill,
  X,
} from "lucide-react";
import { PropsWithChildren, useEffect, useState } from "react";
import { AuthUser, getStoredUser, getToken } from "@/lib/auth";
import { logout } from "@/lib/logout";

const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/medicamentos",
    label: "Medicamentos",
    icon: Pill,
  },
  {
    href: "/donaciones",
    label: "Donaciones",
    icon: HeartHandshake,
  },
  {
    href: "/salidas",
    label: "Salidas",
    icon: PackageMinus,
  },
  {
    href: "/movimientos",
    label: "Movimientos",
    icon: ListOrdered,
  },
];

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      router.replace("/login");
      return;
    }

    setUser(getStoredUser());
  }, [router]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className={isMobile ? "space-y-2" : "space-y-1"}>
      {navigation.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
            Farmacia
          </p>
          <h1 className="mt-2 text-xl font-bold text-slate-900">
            Sistema de Gestión
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Medicamentos, donaciones e inventario
          </p>
        </div>

        <NavLinks />

        <div className="absolute bottom-6 left-5 right-5">
          <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              {user?.name || "Usuario"}
            </p>
            <p className="mt-1 truncate text-xs text-slate-500">
              {user?.email || "Sesión activa"}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Header móvil */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm"
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Farmacia
            </p>
            <h1 className="truncate text-base font-bold text-slate-900">
              Sistema de Gestión
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white shadow-sm"
          >
            Salir
          </button>
        </div>

        {/* Navegación rápida horizontal */}
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-semibold ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Drawer móvil */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Cerrar menú"
          />

          <aside className="relative flex h-full w-[86%] max-w-sm flex-col bg-white p-5 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
                  Farmacia
                </p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  Sistema de Gestión
                </h2>
                <p className="mt-1 text-sm text-slate-500">Menú principal</p>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl border border-slate-200 p-2 text-slate-600"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <NavLinks isMobile />

            <div className="mt-auto pt-6">
              <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name || "Usuario"}
                </p>
                <p className="mt-1 truncate text-xs text-slate-500">
                  {user?.email || "Sesión activa"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      <div className="lg:pl-72">
        <main className="mx-auto max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
