import { Link } from 'react-router-dom';
import { adminSections } from '../app/adminBlueprint';
import MetricCard from '../components/ui/MetricCard';

export default function SectionPage({ section }) {
  const siblings = adminSections.filter((item) => item.key !== section.key).slice(0, 3);

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            {section.key}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {section.path}
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-bold text-white">{section.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{section.summary}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard value={section.items.length.toString()} label="items in section" />
        <MetricCard value={siblings.length.toString()} label="related sections" />
        <MetricCard value={section.items.filter((item) => item.slug !== '/').length.toString()} label="editable routes" />
        <MetricCard value="Draft" label="status" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-white">Managed pages</h2>
            <span className="text-sm font-semibold text-brand-gold">{section.items.length} entries</span>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {section.items.map((item) => (
              <article key={item.slug} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{section.title}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.note}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-400">{item.slug}</span>
                  <span className="rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold text-brand-gold">
                    {item.action}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-white/10 bg-brand-navy p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">Editing mode</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">What this section needs next</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
              {section.items.slice(0, 4).map((item) => (
                <li key={item.slug} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-gold" />
                  <span>{item.title}: connect copy, media, and publishing state.</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-white">Other areas to open</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {siblings.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-300 transition hover:border-brand-gold hover:text-white"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
