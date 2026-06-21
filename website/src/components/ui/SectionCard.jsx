import { Link } from 'react-router-dom';

export default function SectionCard({ title, slug, note, action = 'Open route', groupTitle }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-gold/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-brand-navy">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{note}</p>
        </div>
        {groupTitle ? (
          <span className="rounded-full bg-brand-light px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-navy">
            {groupTitle}
          </span>
        ) : null}
      </div>
      <Link to={slug} className="mt-4 inline-flex text-sm font-semibold text-brand-gold">
        {action}
      </Link>
    </article>
  );
}
