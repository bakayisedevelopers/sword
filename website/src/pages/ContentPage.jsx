import { Link } from 'react-router-dom';
import {
  adminSections,
  buildRouteChecklist,
  buildRouteHighlights,
  buildRouteSubtitle,
  getRelatedRoutes,
  primaryNavigation,
} from '../app/churchBlueprint';
import SectionCard from '../components/ui/SectionCard';

export default function ContentPage({ route }) {
  const relatedRoutes = getRelatedRoutes(route, 6);
  const highlights = buildRouteHighlights(route);
  const checklist = buildRouteChecklist(route);
  const adminSection = adminSections.find((section) => section.key === route.groupKey);

  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-10">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] bg-white p-8 shadow-soft">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy">
              {route.groupTitle}
            </span>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">
              {route.slug}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold text-brand-navy md:text-5xl">{route.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{route.note}</p>
          <p className="mt-3 text-sm font-semibold text-brand-gold">{buildRouteSubtitle(route)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {primaryNavigation.slice(0, 3).map((item) => (
              <Link
                key={item.slug}
                to={item.slug}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-brand-navy transition hover:border-brand-gold hover:text-brand-gold"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </article>

        <aside className="grid gap-4">
          <div className="rounded-[2rem] bg-brand-navy p-6 text-white shadow-soft">
            <p className="text-xs uppercase tracking-[0.24em] text-brand-gold">Page type</p>
            <h2 className="mt-3 text-2xl font-bold">{route.kind}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-200">
              This route is being rebuilt as a reusable React screen so the public website can grow
              without repeating the FlutterFlow widget tree.
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Admin mirror</p>
            <h3 className="mt-3 text-xl font-semibold text-brand-navy">
              {adminSection?.title || 'Content management'}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {adminSection?.summary || 'The admin app will manage this route from a shared content model.'}
            </p>
            <div className="mt-4 rounded-2xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-navy">
              Admin path: {adminSection?.path || '/content'}
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <h2 className="text-2xl font-bold text-brand-navy">What belongs here</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <div key={item} className="rounded-2xl bg-brand-light p-4 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-[1.5rem] bg-brand-navy p-6 text-white">
            <p className="text-xs uppercase tracking-[0.24em] text-brand-gold">Build checklist</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
              {checklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-gold" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-brand-navy">Related routes</h2>
            <span className="text-sm font-semibold text-brand-gold">{relatedRoutes.length} nearby</span>
          </div>
          <div className="mt-5 space-y-4">
            {relatedRoutes.map((item) => (
              <SectionCard
                key={item.slug}
                title={item.title}
                slug={item.slug}
                note={item.note}
                action="Open related route"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
