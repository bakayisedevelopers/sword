import { Link } from 'react-router-dom';
import { adminMetrics, adminSections, publicRoutes } from '../app/adminBlueprint';
import MetricCard from '../components/ui/MetricCard';

export default function DashboardPage() {
  const featuredRoutes = publicRoutes.slice(0, 6);

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Control center</p>
        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <h2 className="text-4xl font-bold text-white">Admin foundation for the React rebuild</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              This dashboard gives us a place to manage the website content that used to live in
              FlutterFlow widgets. The next step is wiring these sections to real CRUD screens and
              content publishing flows.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {adminMetrics.map((metric) => (
              <MetricCard key={metric.label} value={metric.value} label={metric.label} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-2xl font-semibold text-white">Admin sections</h3>
            <span className="text-sm font-semibold text-brand-gold">{adminSections.length} groups</span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {adminSections.map((section) => (
              <article key={section.key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{section.key}</p>
                <h4 className="mt-2 text-lg font-semibold text-white">{section.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-300">{section.summary}</p>
                <Link
                  to={section.path}
                  className="mt-4 inline-flex text-sm font-semibold text-brand-gold"
                >
                  Open section
                </Link>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-white/10 bg-brand-navy p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">Publishing queue</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">Routes to shape next</h3>
            <div className="mt-4 space-y-3">
              {featuredRoutes.map((route) => (
                <div
                  key={route.slug}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200"
                >
                  <p className="font-semibold text-white">{route.title}</p>
                  <p className="mt-1 text-slate-300">{route.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-white">What to wire next</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <li>Connect section pages to Firestore or another CMS source.</li>
              <li>Add route editing forms for page title, note, and media.</li>
              <li>Introduce publish / draft state for each church content group.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
