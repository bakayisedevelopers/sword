import { Link } from 'react-router-dom';
import { heroStats, primaryNavigation, siteGroups } from '../app/churchBlueprint';
import SectionCard from '../components/ui/SectionCard';

const quickLinks = [
  {
    title: 'Locations',
    slug: '/locations',
    copy:
      'With branches in multiple countries, the site helps people find the nearest church quickly.',
  },
  {
    title: 'Watch',
    slug: '/watch',
    copy:
      'Sermons, livestreams, and the latest video content are grouped into a clear media hub.',
  },
  {
    title: 'About Us',
    slug: '/about-us',
    copy:
      'Leadership, mission, and church story are presented in one place instead of scattered pages.',
  },
  {
    title: 'Give',
    slug: '/give',
    copy:
      'Tithes, offerings, and campaign routes are kept visible so giving is easy to find.',
  },
];

const spotlightGroups = ['branches', 'events', 'resources'];

export default function HomePage() {
  const branchGroup = siteGroups.find((group) => group.key === 'branches');
  const spotlightRoutes = siteGroups
    .filter((group) => spotlightGroups.includes(group.key))
    .flatMap((group) => group.items)
    .slice(0, 6);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,115,3,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(25,36,49,0.2),transparent_32%)]" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
          <div className="space-y-6 rounded-[2rem] bg-brand-navy p-8 text-white shadow-soft md:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-gold">Year of Running Lap</p>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight md:text-5xl">
              Welcome Home
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-200">
              This is the church landing page rebuilt from the FlutterFlow homepage. It keeps the
              public experience centered on worship, branch discovery, sermons, and giving.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/watch"
                className="rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:opacity-95"
              >
                Watch Sermons
              </a>
              <a
                href="/locations"
                className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Find a Location
              </a>
            </div>
            <div className="grid gap-4 pt-2 sm:grid-cols-3">
              {heroStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Sunday Services</p>
              <h2 className="mt-3 text-3xl font-bold text-brand-navy">09:00 and 11:00</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                In-person and online worship experience with live sermons and church updates.
              </p>
              <div className="mt-6 rounded-[1.5rem] bg-brand-light p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Next live sermon
                </p>
                <p className="mt-2 text-lg font-bold text-brand-navy">Watch our Sermons</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Stream the latest message or open the full Watch page for the full sermon list.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {quickLinks.map((item) => (
                <article
                  key={item.slug}
                  className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-soft"
                >
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{item.title}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.copy}</p>
                  <Link to={item.slug} className="mt-4 inline-flex text-sm font-semibold text-brand-gold">
                    Open page
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 pb-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((item) => (
            <SectionCard
              key={item.slug}
              title={item.title}
              slug={item.slug}
              note={item.copy}
              action="Open route"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Branch focus</p>
          <h2 className="mt-2 text-3xl font-bold text-brand-navy">Find a Location</h2>
          <p className="mt-3 text-slate-600">
            This mirrors the Flutter landing page's branch emphasis and keeps the service area
            visible for people joining from different cities.
          </p>
        </div>

        {branchGroup ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {branchGroup.items.slice(0, 6).map((item) => (
              <SectionCard
                key={item.slug}
                title={item.title}
                slug={item.slug}
                note={item.note}
                action={item.action}
                groupTitle="Branch"
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-6 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">More to explore</p>
          <h2 className="mt-2 text-3xl font-bold text-brand-navy">Ministry, events, and resources</h2>
          <p className="mt-3 text-slate-600">
            The lower sections keep the rest of the church information architecture available
            without turning the homepage into a directory.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {spotlightRoutes.map((item) => (
            <SectionCard
              key={item.slug}
              title={item.title}
              slug={item.slug}
              note={item.note}
              action={item.action}
              groupTitle="Spotlight"
            />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-6 py-8 pb-14">
        <div className="grid gap-6 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Navigation</p>
            <h2 className="mt-2 text-3xl font-bold text-brand-navy">Key public pages</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.slug}
                  to={item.slug}
                  className="rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600 transition hover:border-brand-gold hover:text-brand-gold"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-brand-light p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">What changed</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
              <li>The homepage is now styled like the FlutterFlow landing page.</li>
              <li>The public site still keeps route navigation under the surface.</li>
              <li>The admin app and shared functions stay tied to the same content model.</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
