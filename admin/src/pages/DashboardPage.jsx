import { adminMetrics, adminSections } from '../app/adminBlueprint';
import MetricCard from '../components/ui/MetricCard';

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Control center</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <h2 className="text-4xl font-bold text-white">Admin foundation for the React rebuild</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              This dashboard gives us a place to manage the website content that used to live in
              FlutterFlow widgets. The next step is wiring these sections to real CRUD screens.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {adminMetrics.map((metric) => (
              <MetricCard key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 xl:grid-cols-2">
        {adminSections.map((section) => (
          <article key={section.title} className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft">
            <h3 className="text-xl font-semibold text-white">{section.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{section.summary}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
