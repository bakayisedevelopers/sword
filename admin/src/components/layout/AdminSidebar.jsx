import { NavLink } from 'react-router-dom';
import { adminNavEntries } from '../../routes/adminRoutes';

const linkClass = ({ isActive }) =>
  [
    'block rounded-2xl border px-4 py-3 transition',
    isActive
      ? 'border-brand-gold/60 bg-brand-gold/10 text-white'
      : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/10 hover:text-white',
  ].join(' ');

export default function AdminSidebar() {
  return (
    <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-soft">
      <div className="space-y-1 px-1 pb-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Navigation</p>
        <h2 className="text-lg font-semibold text-white">Content areas</h2>
      </div>
      <nav className="space-y-2">
        {adminNavEntries.map((item) => (
          <NavLink key={item.path} to={item.path} className={linkClass} end={item.path === '/'}>
            <span className="block text-sm font-semibold">{item.title}</span>
            <span className="mt-1 block text-xs text-slate-400">{item.summary}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
