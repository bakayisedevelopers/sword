import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import useDerivedNotifications from '../../hooks/useDerivedNotifications';
import { workspaceNavGroups } from '../../workspace/workspaceSpec';

const linkClass = ({ isActive }) =>
  [
    'block py-1.5 pl-1 text-sm font-medium transition',
    isActive
      ? 'text-brand-gold font-semibold underline decoration-brand-gold decoration-2 underline-offset-8'
      : 'text-slate-400 hover:text-brand-gold',
  ].join(' ');

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 text-brand-gold transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function Badge({ count }) {
  if (!count) return null;

  return (
    <span className="ml-2 inline-flex min-w-5 items-center justify-center rounded-full bg-brand-gold px-1.5 py-0.5 text-[0.65rem] font-bold leading-none text-slate-950">
      {count > 99 ? '99+' : count}
    </span>
  );
}

function SidebarGroup({ group, open, onToggle, onNavigate, badges }) {
  const hasActiveChild = group.items.some((item) => item._active);
  const groupBadgeCount = group.items.reduce((total, item) => total + (badges[item.key] || 0), 0);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onToggle}
        className={[
          'flex w-full items-center justify-between py-1 text-left text-[0.96rem] transition',
          hasActiveChild ? 'text-brand-gold font-semibold' : 'text-slate-200 hover:text-brand-gold',
        ].join(' ')}
      >
        <span className="inline-flex items-center pl-1 tracking-[0.01em]">
          {group.title}
          <Badge count={groupBadgeCount} />
        </span>
        <Chevron open={open} />
      </button>
      {open ? (
        <div className="pl-6">
          {group.items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkClass}
              end={item.path === '/'}
              onClick={onNavigate}
            >
              <span className="inline-flex items-center">
                {item.title}
                <Badge count={badges[item.key]} />
              </span>
            </NavLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default function AdminSidebar({ open = false, onClose }) {
  const { user, profile, roles, signOut } = useAuth();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState('Inbox');
  const profileName = `${profile?.name || ''} ${profile?.surname || ''}`.trim();
  let nameLabel = profile?.displayName || profileName || user?.displayName || user?.email?.split('@')[0] || 'Admin';
  if (nameLabel === user?.uid) {
    nameLabel = user?.email?.split('@')[0] || 'Admin';
  }
  const { badges } = useDerivedNotifications({ profile, roles });

  useEffect(() => {
    const matchedGroup = workspaceNavGroups.find((group) =>
      group.title !== 'Overview' && group.items.some((item) => item.path === location.pathname || (item.path !== '/' && location.pathname.startsWith(item.path))),
    );

    if (matchedGroup) {
      setOpenGroup(matchedGroup.title);
    }
  }, [location.pathname]);

  const groups = workspaceNavGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      _active: location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path)),
    })),
  }));

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-950/70 transition lg:hidden ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <aside
        className={[
          'fixed left-0 top-0 z-50 flex h-[100dvh] w-[86vw] max-w-[20rem] -translate-x-full flex-col border-r border-white/10 bg-slate-950 p-4 shadow-soft transition-transform duration-200 lg:sticky lg:top-6 lg:z-0 lg:h-[calc(100dvh-7rem)] lg:w-auto lg:max-w-none lg:translate-x-0 lg:rounded-[2rem] lg:border lg:bg-white/5 lg:overflow-hidden',
          open ? 'translate-x-0' : '',
        ].join(' ')}
      >
        <nav className="flex-1 space-y-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <NavLink
            to="/"
            end
            onClick={onClose}
            className="block rounded-[1.35rem] border border-white/10 bg-slate-900/80 px-4 py-3 transition hover:border-brand-gold/40 hover:bg-brand-gold/10"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-white">Dashboard</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-gold">Home</span>
            </div>
          </NavLink>

          {groups.map((group) => (
            <SidebarGroup
              key={group.title}
              group={group}
              open={openGroup === group.title}
              onToggle={() => setOpenGroup((current) => (current === group.title ? '' : group.title))}
              onNavigate={onClose}
              badges={badges}
            />
          ))}
        </nav>

        <div className="mt-5 border-t border-white/10 pt-4">
          <div className="rounded-[1.35rem] border border-white/10 bg-slate-900/80 px-4 py-3 transition hover:border-brand-gold/40 hover:bg-brand-gold/10">
            <div className="flex items-center justify-between gap-3">
              <NavLink to="/profile" onClick={onClose} className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-semibold text-white">{nameLabel}</span>
                {user?.email ? <span className="block truncate text-xs text-slate-400 mt-0.5">{user.email}</span> : null}
              </NavLink>
              <button
                type="button"
                aria-label="Logout"
                onClick={async () => {
                  await signOut();
                  onClose?.();
                }}
                className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-brand-gold hover:text-brand-gold"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H4" />
                  <path d="M20 4v16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
