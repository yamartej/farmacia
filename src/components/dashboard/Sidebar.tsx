"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PillBottle,
  ClipboardList,
  ArrowDown,
  ArrowUp,
  BarChart3,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Inicio", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Medicamentos", icon: PillBottle, path: "/dashboard/medicamentos" },
    { name: "Donaciones", icon: ClipboardList, path: "/dashboard/donaciones" },
    { name: "Entradas", icon: ArrowDown, path: "/dashboard/entradas" },
    { name: "Salidas", icon: ArrowUp, path: "/dashboard/salidas" },
    { name: "Reportes", icon: BarChart3, path: "/dashboard/reportes" },
  ];

  return (
    <aside className="w-60 min-h-screen bg-white shadow-lg border-r border-gray-200">
      <div className="py-6 px-4 font-bold text-xl text-blue-700">Farmacia</div>

      <nav className="mt-4">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center px-4 py-3 transition-colors cursor-pointer rounded-r-xl
                ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
