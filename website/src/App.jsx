const navItems = ['Home', 'About', 'Locations', 'Watch', 'Give'];

const ministries = [
  { title: 'Youth Ministry', tag: 'Youth' },
  { title: 'Super Kids', tag: 'Kids' },
  { title: 'Couples', tag: 'Family' },
  { title: 'Men of Dominion', tag: 'Men' },
];

const branchCards = [
  { name: 'Mbabane', region: 'Eswatini' },
  { name: 'Ludzeludze', region: 'Eswatini' },
  { name: 'Orange Farm', region: 'South Africa' },
  { name: 'Online', region: 'Global' },
];

export default function App() {
  return (
    <main>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-navy text-sm font-black text-white">SS</div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-navy">SSMI Web</p>
          </div>
          <nav className="hidden gap-6 text-sm font-medium text-slate-700 md:flex">
            {navItems.map((item) => (
              <a key={item} href="#" className="transition hover:text-brand-gold">
                {item}
              </a>
            ))}
          </nav>
          <button className="rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900">Join Us</button>
        </div>
      </header>

      <section className="mx-auto mt-10 grid w-full max-w-6xl gap-8 rounded-3xl bg-brand-navy p-6 text-white shadow-soft md:grid-cols-2 md:p-10">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.2em] text-brand-gold">Year of Running Lap</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Welcome Home — React + Tailwind redesign.</h1>
          <p className="text-slate-200">
            This concept keeps the SSMI information architecture and introduces clearer hierarchy,
            card-driven navigation, and mobile-first responsiveness.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-brand-gold px-5 py-2 font-semibold text-brand-navy">Watch Sermons</button>
            <button className="rounded-full border border-white/40 px-5 py-2 font-semibold">Find a Branch</button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-gold/30 via-slate-700 to-brand-navy p-6">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/20" />
          <div className="absolute -bottom-14 -left-14 h-48 w-48 rounded-full bg-brand-gold/20" />
          <div className="relative grid h-full place-content-center gap-4 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-100">Sunday Services</p>
            <p className="text-3xl font-bold">09:00 & 11:00</p>
            <p className="text-sm text-slate-200">In-person and Online Worship Experience</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy md:text-3xl">Ministries</h2>
            <p className="text-slate-600">Quick entry points inspired by the Flutter pages list.</p>
          </div>
          <a href="#" className="text-sm font-semibold text-brand-gold">View all</a>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ministries.map((item) => (
            <article key={item.title} className="rounded-2xl bg-white p-4 shadow-soft">
              <div className="mb-3 inline-flex rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold uppercase text-white">{item.tag}</div>
              <h3 className="font-semibold text-brand-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">Discipleship, care, and community pathways.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl px-6 pb-16">
        <h2 className="text-2xl font-bold text-brand-navy md:text-3xl">Branches</h2>
        <p className="mt-2 text-slate-600">Physical campuses and online church at a glance.</p>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {branchCards.map((branch) => (
            <article key={branch.name} className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:shadow-soft">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-light font-bold text-brand-navy">{branch.name.slice(0, 2).toUpperCase()}</div>
              <h3 className="mt-3 text-lg font-semibold text-brand-navy">{branch.name}</h3>
              <p className="text-sm text-slate-600">{branch.region}</p>
              <button className="mt-3 text-sm font-semibold text-brand-gold">Open branch profile →</button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
