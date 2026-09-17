import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';
import { highestRole, roleLabel } from '../auth/roles';

function displayNameFor(user, profile) {
  const profileName = `${profile?.name || ''} ${profile?.surname || ''}`.trim();
  return profile?.displayName || profileName || user?.displayName || user?.email?.split('@')[0] || 'Admin';
}

function branchLabel(profile) {
  return profile?.branch || 'No branch assigned';
}

function isManageAll(roles) {
  return roles.includes('super_admin') || roles.includes('global_editor');
}

function branchScopes(profile) {
  return [
    `${profile?.branch || ''}`.trim(),
    ...(Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim()) : []),
  ].filter(Boolean);
}

function dateFrom(value) {
  if (!value) return null;
  const date = typeof value?.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function matchesBranch(record, scopes) {
  if (!scopes.length) return false;
  const branch = `${record?.branch || record?.branch_name || record?.requestedBranch || ''}`.trim().toLowerCase();
  const branches = Array.isArray(record?.branches) ? record.branches.map((item) => `${item}`.trim().toLowerCase()) : [];
  const normalizedScopes = scopes.map((scope) => scope.toLowerCase());
  return normalizedScopes.includes(branch) || branches.some((item) => normalizedScopes.includes(item));
}

function isPartnerActive(partner) {
  if (partner?.isPartner === false) return false;
  const status = `${partner?.status || ''}`.trim().toLowerCase();
  return partner?.acknowledged === true || ['acknowledged', 'active', 'approved', 'partner'].includes(status);
}

function isNewRequest(request) {
  return request?.acknowledged !== true && request?.status !== 'closed' && request?.status !== 'completed';
}

function isNewRegistration(registration) {
  return registration?.reviewed !== true && registration?.acknowledged !== true;
}

function isNewSignUp(signUp) {
  if (signUp?.acknowledged === true) return false;
  const status = `${signUp?.status || ''}`.trim().toLowerCase();
  return !['acknowledged', 'active', 'approved', 'contacted', 'completed', 'closed'].includes(status);
}

function isPendingAccess(accessRequest) {
  const status = `${accessRequest?.status || ''}`.trim().toLowerCase();
  return !status || status === 'pending';
}

function MetricCard({ label, value, to, className = '' }) {
  const content = (
    <article className="relative overflow-hidden rounded-[1.4rem] border border-brand-gold/15 bg-[#111805] p-4 shadow-soft transition hover:border-brand-gold/35 hover:bg-[#172006] sm:p-5">
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(rgba(222,255,75,0.45)_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="relative flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand-gold">{label}</p>
        <p className="text-2xl font-bold text-white sm:text-3xl">{value}</p>
      </div>
    </article>
  );

  return to ? <Link to={to} className={className}>{content}</Link> : <div className={className}>{content}</div>;
}

function QuickLink({ to, children }) {
  return (
    <Link to={to} className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-slate-300 transition hover:border-brand-gold hover:text-white">
      {children}
    </Link>
  );
}

export default function DashboardPage() {
  const { user, profile, roles } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    branches: 0,
    partners: 0,
    upcomingEvents: 0,
    newRequests: 0,
    newRegistrations: 0,
    newSignUps: 0,
    pendingAccessRequests: 0,
  });

  const userName = displayNameFor(user, profile);
  const topRole = highestRole(roles);
  const roleName = roleLabel(topRole) || 'Admin';
  const scopes = useMemo(() => branchScopes(profile), [profile]);
  const manageAll = isManageAll(roles);

  const canAccessBranches = manageAll;
  const canAccessPartners = manageAll || roles.includes('branch_editor');
  const canAccessEvents = manageAll || roles.includes('branch_editor') || roles.includes('ministry_editor');
  const canAccessRequests = manageAll || roles.includes('care_team') || roles.includes('branch_editor');
  const canAccessRegistrations = manageAll || roles.includes('care_team') || roles.includes('branch_editor');
  const canAccessSignUps = manageAll || roles.includes('care_team') || roles.includes('branch_editor');
  const canAccessUsers = manageAll || roles.includes('branch_editor');

  const metricCards = [
    ...(canAccessBranches ? [{ label: 'Branches', value: loading ? '…' : metrics.branches, to: '/workspace/branches' }] : []),
    ...(canAccessPartners ? [{ label: 'Partners', value: loading ? '…' : metrics.partners, to: '/workspace/partners' }] : []),
    ...(canAccessEvents ? [{ label: 'Upcoming events', value: loading ? '…' : metrics.upcomingEvents, to: '/workspace/events' }] : []),
    ...(canAccessRequests ? [{ label: 'New requests', value: loading ? '…' : metrics.newRequests, to: '/workspace/requests' }] : []),
    ...(canAccessRegistrations ? [{ label: 'Registrations', value: loading ? '…' : metrics.newRegistrations, to: '/workspace/registrations' }] : []),
    ...(canAccessSignUps ? [{ label: 'Ministry sign-ups', value: loading ? '…' : metrics.newSignUps, to: '/workspace/sign-ups' }] : []),
    ...(canAccessUsers && (manageAll || metrics.pendingAccessRequests > 0)
      ? [{ label: 'Access requests', value: loading ? '…' : metrics.pendingAccessRequests, to: '/workspace/users' }]
      : []),
  ];

  function metricSpanClass(index, total) {
    if (total === 4 || total === 2) return 'lg:col-span-3';
    const remainder = total % 3;
    const lastRowStart = total - remainder;

    if (remainder === 1 && index === lastRowStart) return 'lg:col-span-6';
    if (remainder === 2 && index >= lastRowStart) return 'lg:col-span-3';
    return 'lg:col-span-2';
  }

  useEffect(() => {
    let active = true;

    async function loadMetrics() {
      setLoading(true);

      try {
        const scopedQueries = (collectionName, branchField = 'branch') => {
          if (manageAll || (roles.includes('care_team') && ['requests', 'registrations', 'signUps'].includes(collectionName))) {
            return [query(collection(firestore, collectionName))];
          }
          return scopes.map((scope) => query(collection(firestore, collectionName), where(branchField, '==', scope)));
        };

        const [
          branchesResult,
          eventsResult,
          partnersResult,
          requestsResult,
          registrationsResult,
          signUpsResult,
          accessRequestsResult,
        ] = await Promise.allSettled([
          canAccessBranches ? getDocs(collection(firestore, 'branches')) : Promise.resolve({ docs: [] }),
          canAccessEvents ? getDocs(collection(firestore, 'events')) : Promise.resolve({ docs: [] }),
          canAccessPartners && scopedQueries('partners').length
            ? Promise.all(scopedQueries('partners').map((itemQuery) => getDocs(itemQuery)))
            : Promise.resolve([]),
          canAccessRequests && scopedQueries('requests').length
            ? Promise.all(scopedQueries('requests').map((itemQuery) => getDocs(itemQuery)))
            : Promise.resolve([]),
          canAccessRegistrations && scopedQueries('registrations').length
            ? Promise.all(scopedQueries('registrations').map((itemQuery) => getDocs(itemQuery)))
            : Promise.resolve([]),
          canAccessSignUps && scopedQueries('signUps').length
            ? Promise.all(scopedQueries('signUps').map((itemQuery) => getDocs(itemQuery)))
            : Promise.resolve([]),
          canAccessUsers && scopedQueries('accessRequests', 'requestedBranch').length
            ? Promise.all(scopedQueries('accessRequests', 'requestedBranch').map((itemQuery) => getDocs(itemQuery)))
            : Promise.resolve([]),
        ]);

        const branchDocs = branchesResult.status === 'fulfilled' && branchesResult.value?.docs
          ? branchesResult.value.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }))
          : [];
        const eventDocs = eventsResult.status === 'fulfilled' && eventsResult.value?.docs
          ? eventsResult.value.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() }))
          : [];
        const flattenDocs = (result) => {
          if (result.status !== 'fulfilled' || !Array.isArray(result.value)) return [];
          return result.value.flatMap((snapshot) => (snapshot?.docs ? snapshot.docs.map((docSnapshot) => ({ id: docSnapshot.id, ...docSnapshot.data() })) : []))
            .filter((record, index, records) => records.findIndex((item) => item.id === record.id) === index);
        };

        const partnerDocs = flattenDocs(partnersResult);
        const requestDocs = flattenDocs(requestsResult);
        const registrationDocs = flattenDocs(registrationsResult);
        const signUpDocs = flattenDocs(signUpsResult);
        const accessRequestDocs = flattenDocs(accessRequestsResult);

        const now = new Date();
        const visibleEvents = manageAll
          ? eventDocs
          : eventDocs.filter((eventDoc) => eventDoc.global || matchesBranch(eventDoc, scopes));
        const upcomingEvents = visibleEvents.filter((eventDoc) => {
          const date = dateFrom(eventDoc.date);
          return date && date >= now;
        }).length;

        if (active) {
          setMetrics({
            branches: manageAll ? branchDocs.length : scopes.length,
            partners: partnerDocs.filter(isPartnerActive).length,
            upcomingEvents,
            newRequests: requestDocs.filter(isNewRequest).length,
            newRegistrations: registrationDocs.filter(isNewRegistration).length,
            newSignUps: signUpDocs.filter(isNewSignUp).length,
            pendingAccessRequests: accessRequestDocs.filter(isPendingAccess).length,
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMetrics();
    return () => {
      active = false;
    };
  }, [canAccessBranches, canAccessEvents, canAccessPartners, canAccessRegistrations, canAccessRequests, canAccessSignUps, canAccessUsers, manageAll, roles, scopes]);

  return (
    <main className="space-y-5 pb-8 sm:space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-brand-gold/20 bg-[#111805] p-5 shadow-soft sm:p-8">
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(222,255,75,0.45)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.28em] text-brand-gold">{userName}</p>
            <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight text-white sm:text-4xl">{branchLabel(profile)}</h2>
          </div>
          <div className="inline-flex rounded-full border border-brand-gold/30 bg-brand-gold/10 px-5 py-3 text-sm font-bold text-brand-gold">
            {roleName}
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-brand-navy p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[.24em] text-brand-gold">Training</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Admin tour</h3>
          </div>
          <button type="button" disabled className="rounded-full border border-brand-gold/30 px-5 py-3 text-sm font-bold text-brand-gold opacity-70">
            Training coming soon
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {metricCards.map((metric, index) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            to={metric.to}
            className={metricSpanClass(index, metricCards.length)}
          />
        ))}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[.24em] text-slate-400">Today</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">Simple branch overview</h3>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{manageAll ? 'Global view' : 'Branch view'}</span>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
          This home page gives a quick operational snapshot only. Use the navigation to work through requests, registrations, partners, events, branches, ministries, and media.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {canAccessRequests ? <QuickLink to="/workspace/requests">Requests</QuickLink> : null}
          {canAccessRegistrations ? <QuickLink to="/workspace/registrations">Registrations</QuickLink> : null}
          {canAccessSignUps ? <QuickLink to="/workspace/sign-ups">Sign-ups</QuickLink> : null}
          {canAccessEvents ? <QuickLink to="/workspace/events">Events</QuickLink> : null}
          {canAccessPartners ? <QuickLink to="/workspace/partners">Partners</QuickLink> : null}
          {canAccessBranches ? <QuickLink to="/workspace/branches">Branches</QuickLink> : null}
          {canAccessUsers ? <QuickLink to="/workspace/users">Staff & Access</QuickLink> : null}
        </div>
      </section>
    </main>
  );
}
