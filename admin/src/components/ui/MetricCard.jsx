export default function MetricCard({ value, label }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-soft">
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{label}</p>
    </article>
  );
}
