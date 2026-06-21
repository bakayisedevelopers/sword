import { brand, primaryNavigation } from '../../app/churchBlueprint';

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-navy text-sm font-black text-white">
            {brand.name}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Public website</p>
            <p className="text-sm font-semibold text-brand-navy">{brand.fullName}</p>
          </div>
        </div>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex">
          {primaryNavigation.slice(0, 5).map((item) => (
            <a key={item.slug} href={item.slug} className="transition hover:text-brand-gold">
              {item.title}
            </a>
          ))}
        </nav>
        <a
          href="/contact-us"
          className="rounded-full bg-brand-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
        >
          Start here
        </a>
      </div>
    </header>
  );
}
