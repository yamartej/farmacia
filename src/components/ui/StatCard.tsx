import { ReactNode } from "react";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
};

export function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 truncate text-2xl font-bold text-slate-900 sm:text-3xl">
            {value}
          </p>
        </div>

        {icon && (
          <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600">
            {icon}
          </div>
        )}
      </div>

      {description && (
        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
      )}
    </div>
  );
}
