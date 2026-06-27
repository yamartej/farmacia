"use client";

import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  ListOrdered,
  PackageMinus,
  Pill,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";

const modules = [
  {
    title: "Medicamentos",
    description: "Consulta, registra y administra el catálogo de medicamentos.",
    href: "/medicamentos",
    icon: Pill,
  },
  {
    title: "Donaciones",
    description: "Registra donaciones recibidas y sus respectivos ítems.",
    href: "/donaciones",
    icon: HeartHandshake,
  },
  {
    title: "Salidas",
    description: "Controla entregas, despachos y consumo de medicamentos.",
    href: "/salidas",
    icon: PackageMinus,
  },
  {
    title: "Movimientos",
    description: "Revisa el kardex general de entradas y salidas.",
    href: "/movimientos",
    icon: ListOrdered,
  },
];

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="Vista general del sistema de farmacia y accesos rápidos a los módulos principales."
      />

      <div className="mb-5 grid gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="Medicamentos"
          value="Catálogo"
          description="Módulo para registrar y consultar medicamentos."
          icon={<Pill className="h-5 w-5" />}
        />
        <StatCard
          title="Donaciones"
          value="Entradas"
          description="Registro de donaciones e ingreso de inventario."
          icon={<HeartHandshake className="h-5 w-5" />}
        />
        <StatCard
          title="Salidas"
          value="Despachos"
          description="Control de salidas por lote y fecha de vencimiento."
          icon={<PackageMinus className="h-5 w-5" />}
        />
        <StatCard
          title="Movimientos"
          value="Kardex"
          description="Historial general de entradas y salidas."
          icon={<ListOrdered className="h-5 w-5" />}
        />
      </div>

      <section className="grid gap-3 sm:gap-4 md:grid-cols-2">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <Link
              key={module.href}
              href={module.href}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition active:scale-[0.99] sm:p-5 sm:hover:-translate-y-0.5 sm:hover:border-blue-200 sm:hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Icon className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
              </div>

              <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                {module.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {module.description}
              </p>
            </Link>
          );
        })}
      </section>
    </AppShell>
  );
}
