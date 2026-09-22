import { useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { helpTopics, helpTopicMap, tourDefinitions } from '../help/helpContent';
import { useTour } from '../tour/TourProvider';

function canAccessTopic(topicId, roles = []) {
  if (['overview', 'website-admin', 'roles', 'dashboard', 'notifications', 'profile', 'troubleshooting'].includes(topicId)) return true;
  const manageAll = roles.includes('super_admin') || roles.includes('global_editor');
  if (manageAll) return true;
  if (topicId === 'requests') return roles.includes('care_team') || roles.includes('branch_editor');
  if (topicId === 'registrations') return roles.includes('care_team') || roles.includes('branch_editor');
  if (topicId === 'sign-ups') return roles.includes('care_team') || roles.includes('branch_editor');
  if (topicId === 'partners') return roles.includes('branch_editor');
  if (topicId === 'events') return roles.includes('branch_editor') || roles.includes('ministry_editor');
  if (topicId === 'sermons') return roles.includes('branch_editor');
  if (topicId === 'branches') return roles.includes('branch_editor');
  if (topicId === 'ministries') return roles.includes('ministry_editor');
  return false;
}

function isTourComplete(entry) {
  return entry?.status === 'completed' && entry?.version === 1;
}

function ProgressPill({ complete }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-bold ${complete ? 'bg-brand-gold text-slate-950' : 'border border-white/10 text-slate-400'}`}>
      {complete ? 'Tour complete' : 'Tour pending'}
    </span>
  );
}

function previewPathFor(topic) {
  const route = topic.route && topic.route !== '/help' ? topic.route : '/';
  return `${route}${route.includes('?') ? '&' : '?'}helpPreview=1`;
}

const previewFrames = [
  {
    id: 'desktop',
    label: 'Desktop preview',
    wrapperClass: 'hidden lg:block h-[600px] w-[960px]',
    width: 1280,
    height: 800,
    scale: 0.75,
  },
  {
    id: 'tablet',
    label: 'Tablet preview',
    wrapperClass: 'hidden sm:block lg:hidden h-[800px] w-[600px]',
    width: 768,
    height: 1024,
    scale: 0.78125,
  },
  {
    id: 'mobile',
    label: 'Mobile preview',
    wrapperClass: 'block sm:hidden h-[720px] w-[360px]',
    width: 390,
    height: 780,
    scale: 0.9230769231,
  },
];

function PreviewFrame({ frame, previewPath, topic }) {
  return (
    <div
      className={`mx-auto max-w-full overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-950 shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${frame.wrapperClass}`}
      aria-label={frame.label}
    >
      <iframe
        key={`${topic.id}-${frame.id}`}
        src={previewPath}
        title={`${topic.title} ${frame.label}`}
        width={frame.width}
        height={frame.height}
        className="block origin-top-left border-0"
        style={{
          width: `${frame.width}px`,
          height: `${frame.height}px`,
          transform: `scale(${frame.scale})`,
        }}
        loading="lazy"
      />
    </div>
  );
}

function TopicLivePreview({ topic }) {
  const previewPath = previewPathFor(topic);
  return (
    <figure className="rounded-[1.5rem] border border-white/10 bg-slate-950 shadow-soft">
      <div className="border-b border-white/10 bg-slate-900/80 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">Live preview</p>
        <figcaption className="mt-1 text-sm text-slate-300">
          {topic.title} section preview
        </figcaption>
      </div>
      <div className="bg-[#080b05] p-4 sm:p-6">
        {previewFrames.map((frame) => (
          <PreviewFrame key={frame.id} frame={frame} previewPath={previewPath} topic={topic} />
        ))}
        <p className="mx-auto mt-3 max-w-[960px] text-xs leading-5 text-slate-500">
          This preview uses the live admin route. Desktop, tablet, and mobile screen sizes are rendered with fixed internal viewport sizes and scaled down to fit this guide.
        </p>
      </div>
    </figure>
  );
}

export default function HelpPage() {
  const { roles } = useAuth();
  const { progress, startTour, completedCount, totalTours } = useTour();
  const [activeTopicId, setActiveTopicId] = useState('overview');
  const visibleTopics = useMemo(() => helpTopics.filter((topic) => canAccessTopic(topic.id, roles)), [roles]);
  const activeTopic = visibleTopics.find((topic) => topic.id === activeTopicId) || visibleTopics[0] || helpTopics[0];

  const relatedTourKey = useMemo(() => (
    tourDefinitions[activeTopic.id] ? activeTopic.id : ''
  ), [activeTopic.id]);
  const relatedTourComplete = relatedTourKey ? isTourComplete(progress[relatedTourKey]) : false;

  return (
    <main className="grid gap-5 pb-8 lg:grid-cols-[18rem_1fr]">
      <section className="sticky top-[5rem] z-30 rounded-[1.4rem] border border-white/10 bg-slate-950/95 p-3 shadow-soft backdrop-blur lg:hidden">
        <label className="block space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">Help topic</span>
          <select
            value={activeTopic.id}
            onChange={(event) => setActiveTopicId(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5"
          >
            {visibleTopics.map((topic) => (
              <option key={topic.id} value={topic.id}>{topic.title}</option>
            ))}
          </select>
        </label>
      </section>

      <aside className="hidden rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-soft lg:sticky lg:top-0 lg:block lg:max-h-[calc(100dvh-8rem)] lg:overflow-y-auto lg:[scrollbar-width:none] lg:[-ms-overflow-style:none] lg:[&::-webkit-scrollbar]:hidden">
        <p className="px-2 text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">Help</p>
        <h1 className="mt-2 px-2 text-2xl font-semibold text-white">Admin guide</h1>
        <div className="mt-4 rounded-[1.25rem] border border-brand-gold/20 bg-brand-gold/10 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Tour progress</p>
          <p className="mt-2 text-sm text-slate-200">{completedCount} of {totalTours} section tours complete</p>
        </div>
        <nav className="mt-4 space-y-1">
          {visibleTopics.map((topic) => {
            const active = topic.id === activeTopic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setActiveTopicId(topic.id)}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${active ? 'bg-brand-gold text-slate-950 font-bold' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}
              >
                {topic.title}
              </button>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0 space-y-5">
        <div className="rounded-[2rem] border border-white/10 bg-brand-navy p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">Documentation</p>
              <h2 className="mt-2 text-3xl font-bold text-white">{activeTopic.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">{activeTopic.summary}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {relatedTourKey ? <ProgressPill complete={relatedTourComplete} /> : null}
              {relatedTourKey && !relatedTourComplete ? (
                <button
                  type="button"
                  onClick={() => startTour(relatedTourKey, { navigateToRoute: true, force: true })}
                  className="rounded-full bg-brand-gold px-4 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
                >
                  Start tour
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_0.8fr]">
          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">How to use this section</p>
            <ol className="mt-4 space-y-3">
              {activeTopic.steps.map((step, index) => (
                <li key={step} className="flex gap-3 rounded-[1.2rem] border border-white/10 bg-slate-950/45 p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-slate-950">{index + 1}</span>
                  <span className="text-sm leading-6 text-slate-200">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Important fields and records</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {activeTopic.fields.map((field) => (
                <span key={field} className="rounded-full border border-white/10 bg-slate-950/60 px-3 py-1.5 text-xs font-semibold text-slate-300">
                  {field}
                </span>
              ))}
            </div>
            <div className="mt-5 rounded-[1.2rem] border border-brand-gold/20 bg-brand-gold/10 p-4">
              <p className="text-sm font-semibold text-brand-gold">Website impact</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                When this section saves content records, the public website reads those records from Firestore. Content edits normally update the website data without a code deployment.
              </p>
            </div>
          </section>
        </div>

        <TopicLivePreview topic={activeTopic} />

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Guided tour progress</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {visibleTopics
              .filter((topic) => tourDefinitions[topic.id])
              .map((topic) => {
                const complete = isTourComplete(progress[topic.id]);
                return (
                  <div key={topic.id} className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-white/10 bg-slate-950/45 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{topic.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{complete ? 'Completed' : 'Not completed yet'}</p>
                    </div>
                    {complete ? (
                      <span className="shrink-0 rounded-full bg-brand-gold px-3 py-1.5 text-xs font-bold text-slate-950">Done</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startTour(topic.id, { navigateToRoute: true, force: true })}
                        className="shrink-0 rounded-full border border-brand-gold/40 px-3 py-1.5 text-xs font-bold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950"
                      >
                        Start
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </section>
      </section>
    </main>
  );
}
