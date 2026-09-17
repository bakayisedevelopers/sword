import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const partnerAccessRoles = ['super_admin', 'global_editor', 'branch_editor'];
const currentPartnerStatuses = ['acknowledged', 'active', 'approved', 'partner'];

function branchLabel(branchDoc) {
  return branchDoc?.name || branchDoc?.id || 'Untitled branch';
}

function branchMatchesScope(branchDoc, scopeValue) {
  const needle = `${scopeValue || ''}`.trim().toLowerCase();
  if (!needle) {
    return false;
  }

  const branchName = `${branchDoc?.name || ''}`.trim().toLowerCase();
  const branchId = `${branchDoc?.id || ''}`.trim().toLowerCase();
  return needle === branchName || needle === branchId;
}

function partnerName(partner) {
  const name = `${partner?.name || ''} ${partner?.surname || ''}`.trim();
  if (name) {
    return name;
  }

  const email = `${partner?.email || ''}`.trim();
  if (email.includes('@')) {
    const localPart = email.split('@')[0] || '';
    return localPart ? `${localPart.charAt(0).toUpperCase()}${localPart.slice(1)}` : 'No Name';
  }

  return 'No Name';
}

function normalizeStatus(partner) {
  return `${partner?.status || ''}`.trim().toLowerCase() || 'pending';
}

function statusLabel(partner) {
  const status = normalizeStatus(partner);
  return status === 'not_partner' ? 'Not a partner' : status;
}

function isAcknowledged(partner) {
  return currentPartnerStatuses.includes(normalizeStatus(partner));
}

function isNewRequest(partner) {
  const status = normalizeStatus(partner);
  return status !== 'not_partner' && !currentPartnerStatuses.includes(status);
}

function isMinor(partner) {
  return `${partner?.kid || ''}`.trim().toLowerCase() === 'yes';
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 5l7 7-7 7" />
    </svg>
  );
}

function PartnerRow({ partner, userMatch }) {
  const minor = isMinor(partner);

  return (
    <Link
      to={`/workspace/partners/${partner.id}`}
      className="group flex w-full items-center justify-between rounded-[1.35rem] border border-white/10 bg-slate-950/40 px-4 py-4 text-left transition hover:border-brand-gold/40 hover:bg-brand-gold/5"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-white">{partnerName(partner)}</p>
          <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold ${minor ? 'border-brand-gold/40 text-brand-gold' : 'border-white/10 text-slate-300'}`}>
            {minor ? 'Minor' : 'Adult'}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
          {minor && partner.parent ? <span className="text-brand-gold/80">Has parent link</span> : null}
          <span>{statusLabel(partner)}</span>
          {partner.branch ? <span>· {partner.branch}</span> : null}
          {userMatch || partner.linkedUserId ? <span className="text-brand-gold">· User linked</span> : null}
        </div>
      </div>
      <ChevronIcon />
    </Link>
  );
}

export default function PartnersWorkspacePage() {
  const { roles, profile } = useAuth();
  const canAccessPartners = roles.some((role) => partnerAccessRoles.includes(role));
  const isBranchEditor = roles.includes('branch_editor') && !roles.includes('super_admin') && !roles.includes('global_editor');
  const branchScope = `${profile?.branch || ''}`.trim();

  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingPartners, setLoadingPartners] = useState(false);
  const [error, setError] = useState('');
  const [branches, setBranches] = useState([]);
  const [partners, setPartners] = useState([]);
  const [usersByEmail, setUsersByEmail] = useState({});
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [activeTab, setActiveTab] = useState('partners');

  useEffect(() => {
    let active = true;

    async function loadFoundation() {
      setLoadingBranches(true);
      setError('');

      try {
        const branchesSnapshot = await getDocs(collection(firestore, 'branches'));
        const nextBranches = branchesSnapshot.docs
          .map((branchDoc) => ({ id: branchDoc.id, ...branchDoc.data() }))
          .sort((left, right) => branchLabel(left).localeCompare(branchLabel(right)));

        let nextUsersByEmail = {};
        try {
          const usersSnapshot = await getDocs(collection(firestore, 'users'));
          nextUsersByEmail = Object.fromEntries(usersSnapshot.docs
            .map((userDoc) => {
              const data = userDoc.data() || {};
              const email = `${data.email || ''}`.trim().toLowerCase();
              return email ? [email, { id: userDoc.id, ...data }] : null;
            })
            .filter(Boolean));
        } catch {
          nextUsersByEmail = {};
        }

        if (active) {
          setBranches(nextBranches);
          setUsersByEmail(nextUsersByEmail);
        }
      } catch {
        if (active) {
          setBranches([]);
          setError('Branches could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) {
          setLoadingBranches(false);
        }
      }
    }

    loadFoundation();

    return () => {
      active = false;
    };
  }, []);

  const visibleBranches = useMemo(() => {
    if (!isBranchEditor) {
      return branches;
    }

    return branches.filter((branchDoc) => branchMatchesScope(branchDoc, branchScope));
  }, [branches, branchScope, isBranchEditor]);

  useEffect(() => {
    if (!visibleBranches.length) {
      setSelectedBranchId('');
      return;
    }

    if (!visibleBranches.some((branchDoc) => branchDoc.id === selectedBranchId)) {
      const scopeMatch = visibleBranches.find((branchDoc) => branchMatchesScope(branchDoc, branchScope));
      setSelectedBranchId(scopeMatch?.id || visibleBranches[0].id);
    }
  }, [branchScope, selectedBranchId, visibleBranches]);

  const selectedBranch = useMemo(
    () => visibleBranches.find((branchDoc) => branchDoc.id === selectedBranchId) || null,
    [selectedBranchId, visibleBranches],
  );

  useEffect(() => {
    let active = true;

    async function loadPartners() {
      if (!selectedBranch) {
        setPartners([]);
        return;
      }

      setLoadingPartners(true);
      setError('');

      try {
        const selectedBranchName = branchLabel(selectedBranch);
        const partnerSnapshot = isBranchEditor
          ? await getDocs(query(collection(firestore, 'partners'), where('branch', '==', selectedBranchName)))
          : await getDocs(collection(firestore, 'partners'));

        const nextPartners = partnerSnapshot.docs
          .map((partnerDoc) => ({ id: partnerDoc.id, ...partnerDoc.data() }))
          .filter((partner) => {
            const partnerBranch = `${partner.branch || ''}`.trim().toLowerCase();
            return partnerBranch === selectedBranchName.toLowerCase() || partnerBranch === selectedBranch.id.toLowerCase();
          })
          .sort((left, right) => partnerName(left).localeCompare(partnerName(right)));

        if (active) {
          setPartners(nextPartners);
        }
      } catch {
        if (active) {
          setPartners([]);
          setError('Partners could not be loaded. Check admin role access and branch permissions.');
        }
      } finally {
        if (active) {
          setLoadingPartners(false);
        }
      }
    }

    loadPartners();

    return () => {
      active = false;
    };
  }, [isBranchEditor, selectedBranch]);

  const acknowledgedPartners = partners.filter(isAcknowledged);
  const pendingPartners = partners.filter(isNewRequest);
  const visiblePartners = activeTab === 'partners' ? acknowledgedPartners : pendingPartners;
  const selectedBranchName = selectedBranch ? branchLabel(selectedBranch) : 'Select a branch';

  if (!canAccessPartners) {
    return <Navigate to="/access-denied" replace />;
  }

  if (isBranchEditor && !loadingBranches && !visibleBranches.length) {
    return (
      <main className="pb-6">
        <section className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Partners</p>
          <h1 className="mt-3 text-4xl font-bold text-white">No branch is assigned to this account</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Assign a branch on the user profile first. Branch editors can only review partner records for their own branch.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Partners</h1>
          </div>
        </section>

        {error && (
          <section className="rounded-[1.6rem] border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </section>
        )}

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Branches</p>
            <span className="text-sm text-slate-300">{loadingBranches ? 'Loading…' : selectedBranchName}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleBranches.map((branchDoc) => {
              const active = branchDoc.id === selectedBranchId;
              return (
                <button
                  key={branchDoc.id}
                  type="button"
                  onClick={() => setSelectedBranchId(branchDoc.id)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-gold text-slate-950' : 'border border-white/10 bg-slate-950/40 text-slate-300 hover:border-brand-gold hover:text-white'}`}
                >
                  {branchLabel(branchDoc)}
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('partners')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'partners' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}
            >
              Partners
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'requests' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}
            >
              New requests
            </button>
          </div>
        </section>

        <section className="space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                {activeTab === 'partners' ? 'Acknowledged partners' : 'Pending intake'}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">{selectedBranchName}</h2>
            </div>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
              {loadingPartners ? 'Loading…' : `${visiblePartners.length} records`}
            </span>
          </div>

          <div className="space-y-3">
            {visiblePartners.map((partner) => {
              const email = `${partner.email || ''}`.trim().toLowerCase();
              return (
                <PartnerRow
                  key={partner.id}
                  partner={partner}
                  userMatch={email ? usersByEmail[email] : null}
                />
              );
            })}
            {!visiblePartners.length && !loadingPartners && (
              <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                {activeTab === 'partners'
                  ? 'No acknowledged partners for this branch yet.'
                  : 'No new partner requests for this branch right now.'}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
