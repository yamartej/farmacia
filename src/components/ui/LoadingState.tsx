export function LoadingState({ message = "Cargando información..." }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
