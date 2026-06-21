import { heroStats, siteGroups } from '../app/churchBlueprint';
import SectionCard from '../components/ui/SectionCard';

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto mt-8 grid w-full max-w-7xl gap-8 px-6 pb-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-[2rem] bg-brand-navy p-8 text-white shadow-soft">
          <p className="text-xs uppercase tracking-[0.28em] text-brand-gold">FlutterFlow to React</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
            A structured public website built from the FlutterFlow church app.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200">
            This first pass turns the existing Flutter content model into a React-friendly site
            map, which gives us a clean foundation for routes, reusable sections, and content
            ownership.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/about-us"
              className="rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:opacity-95"
            >
              See the routes
            </a>
            <a
              href="/contact-us"
              className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Continue to contact
            </a>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Blueprint summary</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-brand-light p-4">
                  <p className="text-3xl font-bold text-brand-navy">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] bg-gradient-to-br from-brand-gold/10 via-white to-brand-light p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">What this becomes</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li>Public website routes for visitors.</li>
              <li>Shared data and helper functions in `functions`.</li>
              <li>Admin tooling for content, branches, and media.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Route structure</p>
          <h2 className="mt-2 text-3xl font-bold text-brand-navy">Content groups mapped from FlutterFlow</h2>
          <p className="mt-3 text-slate-600">
            Each group below reflects a cluster of pages already present in the Flutter app. That
            gives us a clear migration path instead of inventing a new information architecture.
          </p>
        </div>

        <div className="space-y-8">
          {siteGroups.map((group) => (
            <section key={group.title}>
              <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-brand-navy">{group.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{group.summary}</p>
                </div>
                <span className="text-sm font-semibold text-brand-gold">
                  {group.items.length} routes
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item) => (
                  <SectionCard key={item.slug} title={item.title} slug={item.slug} note={item.note} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
