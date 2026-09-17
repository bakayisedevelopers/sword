import { Link } from 'react-router-dom';
import { workspaceCollections, workspaceNavGroups, roleDefinitions } from '../workspace/workspaceSpec';

function Pill({ children, tone = 'lime' }) {
  const tones = {
    lime: 'bg-brand-gold/15 text-brand-gold',
    blue: 'bg-sky-400/10 text-sky-300',
    violet: 'bg-violet-400/10 text-violet-200',
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export default function CmsWorkspacePage() {
  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-brand-gold/20 bg-gradient-to-br from-[#19200b] via-slate-950 to-slate-950 p-8 shadow-soft">
        <Pill>Workspace map</Pill>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white">A role-aware map of the real Firestore collections.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              This is the starting point for the left navigation and the work queues. It groups the actual collections the Flutter site already uses, then separates them by who may edit them.
            </p>
          </div>
          <Link to="/" className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110">
            Back to overview
          </Link>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.04fr_.96fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[.24em] text-slate-400">Workspace groups</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Left-nav structure</h2>
            </div>
            <Pill>{workspaceCollections.length} collections</Pill>
          </div>
          <div className="mt-6 space-y-4">
            {workspaceNavGroups.map((group) => (
              <section key={group.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-white">{group.title}</h3>
                  <span className="text-xs text-slate-400">{group.items.length} items</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Link key={item.key} to={item.path} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 transition hover:border-brand-gold hover:text-white">
                      {item.title}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
            <p className="text-xs uppercase tracking-[.24em] text-slate-400">Roles</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Who should see what</h2>
            <div className="mt-5 space-y-3">
              {roleDefinitions.map((role) => (
                <article key={role.role} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{role.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{role.summary}</p>
                    </div>
                    <Pill tone="blue">{role.role}</Pill>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
