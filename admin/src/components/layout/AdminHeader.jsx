import { brand } from '../../app/adminBlueprint';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import useDerivedNotifications from '../../hooks/useDerivedNotifications';
import swordLogo from '@ssmi/flutter-assets/sword_logo.png';

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function formatNotificationTime(value) {
  if (!value) return '';
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('en', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export default function AdminHeader({ onMenuClick }) {
  const { user, profile, roles } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { notifications, total } = useDerivedNotifications({ profile, roles });
  const profileName = `${profile?.name || ''} ${profile?.surname || ''}`.trim();
  let displayName = profile?.displayName || profileName || user?.displayName || '';
  if (!displayName || displayName === user?.uid) {
    displayName = user?.email ? user.email.split('@')[0] : '';
  }
  const displayInitials = (displayName || user?.email || 'Admin')
    .split(/\s+|@/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  const photoURL = profile?.photoURL || user?.photoURL || '';

  return (
    <header className="relative z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:border-brand-gold hover:text-white lg:hidden"
            aria-label="Open navigation"
          >
            <MenuIcon />
          </button>
          <img src={swordLogo} alt="Sword & Spirit Ministries" className="h-12 w-12 rounded-lg object-contain" />
          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Admin app</p>
            <h1 className="text-lg font-semibold text-white">{brand.fullName}</h1>
          </div>
        </div>
        <div className="relative flex items-center gap-3">
          <button
            type="button"
            onClick={() => setNotificationsOpen((open) => !open)}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-slate-200 transition hover:border-brand-gold hover:text-brand-gold"
            aria-label="Open notifications"
          >
            <BellIcon />
            {total ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-brand-gold px-1.5 py-0.5 text-[0.65rem] font-bold leading-none text-slate-950">
                {total > 99 ? '99+' : total}
              </span>
            ) : null}
          </button>
          {displayName ? <p className="hidden text-sm font-semibold text-white sm:block">{displayName}</p> : null}
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-brand-gold/30 bg-slate-900 text-sm font-bold text-brand-gold">
            {photoURL ? <img src={photoURL} alt={displayName || 'Admin profile'} className="h-full w-full object-cover" /> : displayInitials}
          </div>
          {notificationsOpen ? (
            <section className="absolute right-0 top-14 z-[9999] w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950 shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
              <div className="border-b border-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-brand-gold">Notifications</p>
                <p className="mt-1 text-sm text-slate-300">{total ? `${total} items need attention` : 'No new items'}</p>
              </div>
              <div className="max-h-96 overflow-y-auto p-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {notifications.slice(0, 12).map((notification) => (
                  <Link
                    key={notification.id}
                    to={notification.path}
                    onClick={() => setNotificationsOpen(false)}
                    className="block rounded-[1.1rem] px-3 py-3 transition hover:bg-brand-gold/10"
                  >
                    <p className="text-sm font-semibold text-white">{notification.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{notification.subtitle}</p>
                    {formatNotificationTime(notification.createdAt) ? <p className="mt-1 text-[0.7rem] text-slate-500">{formatNotificationTime(notification.createdAt)}</p> : null}
                  </Link>
                ))}
                {!notifications.length ? <p className="p-3 text-sm text-slate-400">Nothing needs review right now.</p> : null}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </header>
  );
}
