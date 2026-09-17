import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import ChoiceDropdown from '../components/ui/ChoiceDropdown';
import { useAuth } from '../auth/AuthProvider';
import { adminRoles, ministryRoleLabel, ministryRoleOptions, roleLabel } from '../auth/roles';
import { firestore } from '../lib/firebase';

const branchApprovalRoles = ['branch_editor', 'ministry_editor', 'care_team', 'reports_viewer'];

function formatDate(value) {
  if (!value) return '—';
  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
}

function requestName(request) {
  return request?.displayName || request?.email || 'Unnamed request';
}

function partnerName(partner) {
  return `${partner?.name || ''} ${partner?.surname || ''}`.trim() || partner?.email || 'Unnamed partner';
}

function toggleValue(list, value) {
  return list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];
}

function Pill({ active, children, onClick, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${active ? 'bg-brand-gold text-slate-950' : 'border border-white/10 text-slate-300 hover:border-brand-gold hover:text-brand-gold'}`}
    >
      {children}
    </button>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 break-words text-sm leading-6 text-slate-200">{value || '—'}</p>
    </div>
  );
}

export default function UserAccessRequestDetailPage() {
  const { requestId } = useParams();
  const { user, roles, profile } = useAuth();
  const canManageAll = roles.includes('super_admin') || roles.includes('global_editor');
  const canReviewBranch = roles.includes('branch_editor');
  const branchScopes = useMemo(() => [
    `${profile?.branch || ''}`.trim(),
    ...(Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim()) : []),
  ].filter(Boolean), [profile?.branch, profile?.other_branches]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [request, setRequest] = useState(null);
  const [matchedUser, setMatchedUser] = useState(null);
  const [partnerMatches, setPartnerMatches] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);
  const [draft, setDraft] = useState({
    branch: '',
    roles: [],
    staff_positions: [],
  });

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const [requestSnapshot, branchesSnapshot] = await Promise.all([
          getDoc(doc(firestore, 'accessRequests', requestId)),
          getDocs(collection(firestore, 'branches')),
        ]);
        const nextRequest = requestSnapshot.exists() ? { id: requestSnapshot.id, ...requestSnapshot.data() } : null;
        const nextBranches = branchesSnapshot.docs
          .map((branchDoc) => {
            const data = branchDoc.data() || {};
            return { id: data.name || branchDoc.id, label: data.name || branchDoc.id };
          })
          .sort((left, right) => left.label.localeCompare(right.label));

        if (!nextRequest) {
          if (active) setRequest(null);
          return;
        }

        const scoped = canManageAll || (canReviewBranch && branchScopes.includes(nextRequest.requestedBranch));
        if (!scoped) {
          if (active) {
            setRequest(null);
            setError('This access request is outside your approval scope.');
          }
          return;
        }

        let nextUser = null;
        if (nextRequest.uid) {
          const userSnapshot = await getDoc(doc(firestore, 'users', nextRequest.uid));
          if (userSnapshot.exists()) nextUser = { id: userSnapshot.id, ...userSnapshot.data() };
        }
        if (!nextUser && nextRequest.email) {
          const usersSnapshot = await getDocs(query(collection(firestore, 'users'), where('email', '==', nextRequest.email)));
          if (usersSnapshot.docs[0]) nextUser = { id: usersSnapshot.docs[0].id, ...usersSnapshot.docs[0].data() };
        }

        let nextPartnerMatches = [];
        if (nextRequest.email) {
          try {
            const partnersSnapshot = await getDocs(query(collection(firestore, 'partners'), where('email', '==', nextRequest.email)));
            nextPartnerMatches = partnersSnapshot.docs
              .map((partnerDoc) => ({ id: partnerDoc.id, ref: partnerDoc.ref, ...partnerDoc.data() }))
              .filter((partnerDoc) => !partnerDoc.userId && !partnerDoc.linkedUserId);
          } catch {
            nextPartnerMatches = [];
          }
        }

        if (active) {
          setRequest(nextRequest);
          setMatchedUser(nextUser);
          setPartnerMatches(nextPartnerMatches);
          setBranchOptions(nextBranches);
          setDraft({
            branch: nextRequest.requestedBranch || nextUser?.branch || '',
            roles: Array.isArray(nextRequest.requestedRoles) ? nextRequest.requestedRoles : [],
            staff_positions: Array.isArray(nextRequest.requestedStaffPositions)
              ? nextRequest.requestedStaffPositions
              : Array.isArray(nextUser?.staff_positions) ? nextUser.staff_positions : [],
          });
        }
      } catch {
        if (active) {
          setRequest(null);
          setMatchedUser(null);
          setPartnerMatches([]);
          setError('The access request could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    if (requestId) loadData();
    return () => {
      active = false;
    };
  }, [branchScopes, canManageAll, canReviewBranch, requestId]);

  const allowedRoleOptions = canManageAll ? adminRoles : branchApprovalRoles;
  const canApprove = canManageAll || (canReviewBranch && branchScopes.includes(draft.branch) && draft.roles.every((role) => branchApprovalRoles.includes(role)));

  async function handleApprove() {
    if (!request || !canApprove) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const userDocId = matchedUser?.id || request.uid || request.id;
      const userPayload = {
        uid: request.uid || matchedUser?.uid || userDocId,
        email: request.email || matchedUser?.email || '',
        displayName: request.displayName || matchedUser?.displayName || '',
        branch: draft.branch,
        roles: draft.roles,
        staff_positions: draft.staff_positions,
        accessStatus: 'approved',
        accessApprovedAt: serverTimestamp(),
        accessApprovedBy: user?.uid || '',
        updatedAt: serverTimestamp(),
      };

      await Promise.all([
        setDoc(doc(firestore, 'users', userDocId), userPayload, { merge: true }),
        setDoc(doc(firestore, 'accessRequests', request.id), {
          status: 'approved',
          approvedRoles: draft.roles,
          approvedBranch: draft.branch,
          approvedStaffPositions: draft.staff_positions,
          reviewedAt: serverTimestamp(),
          reviewedBy: user?.uid || '',
          updatedAt: serverTimestamp(),
        }, { merge: true }),
      ]);

      setRequest((current) => ({ ...current, status: 'approved', approvedRoles: draft.roles, approvedBranch: draft.branch }));
      setMatchedUser((current) => ({ ...(current || {}), id: userDocId, ...userPayload }));
      setMessage('Access request approved.');
    } catch {
      setError('The access request could not be approved right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handleReject() {
    if (!request) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      await setDoc(doc(firestore, 'accessRequests', request.id), {
        status: 'rejected',
        reviewedAt: serverTimestamp(),
        reviewedBy: user?.uid || '',
        updatedAt: serverTimestamp(),
      }, { merge: true });
      setRequest((current) => ({ ...current, status: 'rejected' }));
      setMessage('Access request rejected.');
    } catch {
      setError('The access request could not be rejected right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLinkPartner(partner) {
    const targetUserId = matchedUser?.id || request?.uid;
    if (!partner || !targetUserId) {
      setError('Approve or match the user before linking a partner record.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const userRef = doc(firestore, 'users', targetUserId);
      const partnerRef = doc(firestore, 'partners', partner.id);
      await Promise.all([
        setDoc(userRef, {
          partnerId: partner.id,
          partnerRef,
          partnerDoc: partnerRef,
          partnerLinkedAt: serverTimestamp(),
          partnerLinkedBy: user?.uid || '',
          updatedAt: serverTimestamp(),
        }, { merge: true }),
        setDoc(partnerRef, {
          userId: targetUserId,
          linkedUserId: targetUserId,
          userRef,
          linkedUserRef: userRef,
          linkedEmail: request?.email || partner.email || '',
          userLinkedAt: serverTimestamp(),
          userLinkedBy: user?.uid || '',
          updatedAt: serverTimestamp(),
        }, { merge: true }),
      ]);
      setPartnerMatches((current) => current.filter((entry) => entry.id !== partner.id));
      setMatchedUser((current) => ({ ...(current || {}), id: targetUserId, partnerId: partner.id, partnerRef, partnerDoc: partnerRef }));
      setMessage('Partner record linked.');
    } catch {
      setError('The partner record could not be linked right now.');
    } finally {
      setSaving(false);
    }
  }

  if (!requestId) return <Navigate to="/workspace/users" replace />;
  if (!loading && !request && !error) return <Navigate to="/workspace/users" replace />;

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Users</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{loading ? 'Loading request…' : requestName(request)}</h1>
          </div>
          <Link to="/workspace/users" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold">
            Back to users
          </Link>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        {!loading && request ? (
          <section className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Access request</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{request.status || 'pending'}</h2>
              </div>
              <span className="rounded-full border border-brand-gold/30 px-3 py-1 text-xs font-semibold text-brand-gold">{request.requestedBranch || 'No branch selected'}</span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <DetailItem label="Name" value={request.displayName} />
              <DetailItem label="Email" value={request.email} />
              <DetailItem label="Submitted" value={formatDate(request.createdAt)} />
              <DetailItem label="Requested branch" value={request.requestedBranch} />
              <DetailItem label="Requested admin roles" value={(request.requestedRoles || []).map(roleLabel).join(', ') || 'None'} />
              <DetailItem label="Requested ministry roles" value={(request.requestedStaffPositions || []).map(ministryRoleLabel).join(', ') || 'None'} />
              <DetailItem label="Current roles" value={(request.currentRoles || []).map(roleLabel).join(', ') || 'None'} />
              <DetailItem label="Matched user" value={matchedUser ? matchedUser.email || matchedUser.displayName || matchedUser.id : 'No existing user document'} />
              {matchedUser && (
                <DetailItem
                  label="Matched user scope"
                  value={`Branch: ${matchedUser.branch || 'None'} | Roles: ${(matchedUser.roles || []).map(roleLabel).join(', ') || 'None'}`}
                />
              )}
            </div>

            <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Reason</p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-200">{request.reason || '—'}</p>
            </div>

            <div className="rounded-[1.35rem] border border-brand-gold/20 bg-brand-gold/5 p-4 text-xs leading-5 text-slate-300">
              <span className="font-semibold text-brand-gold uppercase tracking-wider block mb-1">Authorization Review Policy (DEC-03)</span>
              Staff access request viewing and scope review are non-blocking. Any writes granting effective staff permissions or assigning custom claims via Cloud Functions remain subject to user decision DEC-03.
            </div>

            {partnerMatches.length ? (
              <section className="rounded-[1.6rem] border border-brand-gold/20 bg-brand-gold/10 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-brand-gold">Possible partner match</p>
                <p className="mt-2 text-sm leading-6 text-slate-200">The request email matches partner records that are not linked yet.</p>
                <div className="mt-4 space-y-3">
                  {partnerMatches.map((partner) => (
                    <article key={partner.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                      <div>
                        <p className="font-semibold text-white">{partnerName(partner)}</p>
                        <p className="mt-1 text-xs text-slate-400">{partner.branch || 'No branch'} · {partner.cell || 'No cell'}</p>
                      </div>
                      <button type="button" disabled={saving || !(matchedUser?.id || request?.uid)} onClick={() => handleLinkPartner(partner)} className="rounded-full bg-brand-gold px-4 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-50">
                        Link partner
                      </button>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}

            <ChoiceDropdown
              label="Approved branch"
              value={draft.branch}
              onChange={(value) => setDraft((current) => ({ ...current, branch: value }))}
              placeholder={branchOptions.length ? 'Select branch' : 'No branches available'}
              options={canManageAll ? branchOptions : branchOptions.filter((option) => branchScopes.includes(option.label))}
              disabled={!branchOptions.length || saving}
            />

            <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Approved admin roles</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {allowedRoleOptions.map((role) => (
                  <Pill key={role} active={draft.roles.includes(role)} disabled={saving} onClick={() => setDraft((current) => ({ ...current, roles: toggleValue(current.roles, role) }))}>
                    {roleLabel(role)}
                  </Pill>
                ))}
              </div>
            </section>

            <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ministry roles</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ministryRoleOptions.map((option) => (
                  <Pill key={option.id} active={draft.staff_positions.includes(option.id)} disabled={saving} onClick={() => setDraft((current) => ({ ...current, staff_positions: toggleValue(current.staff_positions, option.id) }))}>
                    {option.label}
                  </Pill>
                ))}
              </div>
            </section>

            {!canApprove ? (
              <div className="rounded-[1.35rem] border border-amber-300/30 bg-amber-500/10 p-4 text-sm leading-6 text-amber-100">
                This approval is outside your scope. Branch editors can only approve branch-scoped roles for their own branch.
              </div>
            ) : null}

            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" disabled={saving} onClick={handleReject} className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-red-300 hover:text-red-100 disabled:opacity-50">
                Reject
              </button>
              <button type="button" disabled={saving || !canApprove} onClick={handleApprove} className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
                {saving ? 'Saving…' : 'Approve access'}
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
