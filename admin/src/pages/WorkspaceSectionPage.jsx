import { Link, Navigate, useParams } from 'react-router-dom';
import { workspaceCollectionMap } from '../workspace/workspaceSpec';
import MetricCard from '../components/ui/MetricCard';
import { roleLabel } from '../auth/roles';

export default function WorkspaceSectionPage({ section: sectionProp }) {
  const { sectionKey } = useParams();
  const section = sectionProp || workspaceCollectionMap[sectionKey];

  if (!section) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="space-y-6">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
            {section.area}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {section.collection}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {section.scope}
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-bold text-white">{section.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{section.summary}</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard value={section.fields.length.toString()} label="fields tracked" />
        <MetricCard value={section.editorRoles.length.toString()} label="allowed roles" />
        <MetricCard value={section.actions.length.toString()} label="starter actions" />
        <MetricCard value="Ready" label="build status" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold text-white">Tracked fields</h2>
            <span className="text-sm font-semibold text-brand-gold">{section.fields.length} fields</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {section.fields.map((field) => (
              <span key={field} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                {field}
              </span>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
            <p className="font-semibold text-white">Why this section exists</p>
            <p className="mt-2">{section.notes}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-white/10 bg-brand-navy p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">Role access</p>
            <h2 className="mt-3 text-2xl font-semibold text-white">Who can work here</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
              {section.editorRoles.map((role) => (
                <li key={role} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-brand-gold" />
                  <span>{roleLabel(role)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
            <h3 className="text-lg font-semibold text-white">First build actions</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              {section.actions.map((action) => (
                <li key={action} className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-slate-400" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
            <Link to="/workspace" className="mt-5 inline-flex text-sm font-semibold text-brand-gold">
              Back to workspace map
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
