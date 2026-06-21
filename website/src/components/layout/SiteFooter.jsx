import { brand, siteGroups } from '../../app/churchBlueprint';

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.25fr_1fr]">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Structure</p>
          <h2 className="text-2xl font-bold text-brand-navy">{brand.fullName}</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            This React structure mirrors the FlutterFlow content model and gives us a clean place
            to add route pages, reusable components, and shared data.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-navy">Tracked groups</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {siteGroups.map((group) => (
              <span
                key={group.title}
                className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {group.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
