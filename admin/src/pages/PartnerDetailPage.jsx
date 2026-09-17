import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import ChoiceDropdown from '../components/ui/ChoiceDropdown';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const partnerAccessRoles = ['super_admin', 'global_editor', 'branch_editor'];
const familyRelationOptions = [
  { id: 'mother', label: 'Mother' },
  { id: 'father', label: 'Father' },
  { id: 'guardian', label: 'Guardian' },
  { id: 'other', label: 'Other' },
];

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

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = typeof value.toDate === 'function' ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString();
}

function normalizeStatus(partner) {
  return `${partner?.status || ''}`.trim().toLowerCase() || 'pending';
}

function isMinor(partner) {
  return `${partner?.kid || ''}`.trim().toLowerCase() === 'yes';
}

function parentIdFrom(parentVal) {
  if (!parentVal) return null;
  if (typeof parentVal === 'string') {
    return parentVal.includes('/') ? parentVal.split('/').pop() : parentVal;
  }
  if (parentVal.id) return parentVal.id;
  if (typeof parentVal.path === 'string') return parentVal.path.split('/').pop();
  return null;
}

function TextField({ label, value, onChange, placeholder, readOnly = false, type = 'text' }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5 read-only:opacity-70"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5"
      />
    </label>
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

const editablePartnerStatuses = ['acknowledged', 'active', 'approved', 'partner', 'not_partner'];

function buildDraft(partner) {
  return {
    name: partner?.name || '',
    surname: partner?.surname || '',
    cell: partner?.cell || '',
    email: partner?.email || '',
    branch: partner?.branch || '',
    address: partner?.address || '',
    postalCode: partner?.postalCode || '',
    occupation: partner?.Occupation || partner?.occupation || '',
    workplace: partner?.workplace || '',
    bornAgain: partner?.bornAgain || '',
    baptised: partner?.baptised || '',
    filled: partner?.filled || '',
    tongues: partner?.tongues || '',
    homeCell: partner?.homeCell || '',
    homeCellName: partner?.homeCellName || '',
    adminNotes: partner?.adminNotes || '',
    followUpStatus: partner?.followUpStatus || '',
  };
}

export default function PartnerDetailPage() {
  const { partnerId } = useParams();
  const { user, roles, profile } = useAuth();
  const canAccessPartners = roles.some((role) => partnerAccessRoles.includes(role));
  const canManageAll = roles.includes('super_admin') || roles.includes('global_editor');
  const isBranchEditor = roles.includes('branch_editor') && !canManageAll;
  const branchScope = `${profile?.branch || ''}`.trim();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [partner, setPartner] = useState(null);
  const [parentPartner, setParentPartner] = useState(null);
  const [branches, setBranches] = useState([]);
  const [usersByEmail, setUsersByEmail] = useState({});
  const [relatedPartners, setRelatedPartners] = useState([]);
  const [allPartners, setAllPartners] = useState([]);
  const [draft, setDraft] = useState(buildDraft(null));
  const [familyDraft, setFamilyDraft] = useState({ partnerId: '', relation: 'father' });

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError('');

      try {
        const [partnerSnapshot, branchesSnapshot] = await Promise.all([
          getDoc(doc(firestore, 'partners', partnerId)),
          getDocs(collection(firestore, 'branches')),
        ]);

        const nextPartner = partnerSnapshot.exists()
          ? { id: partnerSnapshot.id, ...partnerSnapshot.data() }
          : null;

        let nextParentPartner = null;
        const resolvedParentId = parentIdFrom(nextPartner?.parent);
        if (resolvedParentId) {
          try {
            const parentSnap = await getDoc(doc(firestore, 'partners', resolvedParentId));
            if (parentSnap.exists()) {
              nextParentPartner = { id: parentSnap.id, ...parentSnap.data() };
            }
          } catch {
            nextParentPartner = null;
          }
        }

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

        let nextRelatedPartners = [];
        let nextAllPartners = [];
        try {
          const partnersSnapshot = await getDocs(collection(firestore, 'partners'));
          nextAllPartners = partnersSnapshot.docs.map((entryDoc) => ({ id: entryDoc.id, ...entryDoc.data() }));
          nextRelatedPartners = nextAllPartners
            .filter((entry) => entry.id !== partnerId && `${entry.branch || ''}`.trim().toLowerCase() === `${nextPartner?.branch || ''}`.trim().toLowerCase())
            .sort((left, right) => partnerName(left).localeCompare(partnerName(right)));
        } catch {
          nextRelatedPartners = [];
          nextAllPartners = [];
        }

        if (active) {
          setPartner(nextPartner);
          setParentPartner(nextParentPartner);
          setBranches(nextBranches);
          setUsersByEmail(nextUsersByEmail);
          setRelatedPartners(nextRelatedPartners);
          setAllPartners(nextAllPartners);
          setDraft(buildDraft(nextPartner));
        }
      } catch {
        if (active) {
          setPartner(null);
          setParentPartner(null);
          setError('The partner record could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (partnerId) {
      loadData();
    }

    return () => {
      active = false;
    };
  }, [partnerId]);

  const visibleBranches = useMemo(() => {
    if (!isBranchEditor) {
      return branches;
    }

    return branches.filter((branchDoc) => branchMatchesScope(branchDoc, branchScope));
  }, [branches, branchScope, isBranchEditor]);

  const branchOptions = visibleBranches.map((branchDoc) => ({
    id: branchLabel(branchDoc),
    label: branchLabel(branchDoc),
  }));

  const relatedPartnerOptions = relatedPartners
    .filter((entry) => `${entry.kid || ''}`.trim().toLowerCase() !== 'yes')
    .map((entry) => ({
      id: entry.id,
      label: partnerName(entry),
    }));

  const partnerEmail = `${partner?.email || draft.email || ''}`.trim().toLowerCase();
  const suggestedUser = partner?.linkedUserId ? null : usersByEmail[partnerEmail];
  const linkedUser = partner?.linkedUserId
    ? Object.values(usersByEmail).find((entry) => entry.id === partner.linkedUserId)
    : null;
  const status = normalizeStatus(partner);
  const minor = isMinor(partner);
  const canEditPartner = editablePartnerStatuses.includes(status);

  const linkedChildren = useMemo(() => {
    if (!partner || isMinor(partner)) return [];
    return allPartners.filter((entry) => {
      const isKid = `${entry.kid || ''}`.trim().toLowerCase() === 'yes';
      if (!isKid) return false;
      const pId = parentIdFrom(entry.parent);
      return pId === partner.id;
    });
  }, [partner, allPartners]);

  async function handleSave(event) {
    event.preventDefault();
    if (!partner) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        name: draft.name.trim(),
        surname: draft.surname.trim(),
        cell: draft.cell.trim(),
        email: draft.email.trim(),
        branch: draft.branch.trim(),
        address: draft.address.trim(),
        postalCode: draft.postalCode.trim(),
        Occupation: draft.occupation.trim(),
        workplace: draft.workplace.trim(),
        bornAgain: draft.bornAgain.trim(),
        baptised: draft.baptised.trim(),
        filled: draft.filled.trim(),
        tongues: draft.tongues.trim(),
        homeCell: draft.homeCell.trim(),
        homeCellName: draft.homeCellName.trim(),
        adminNotes: draft.adminNotes.trim(),
        followUpStatus: draft.followUpStatus.trim(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(firestore, 'partners', partner.id), payload, { merge: true });
      setPartner((current) => ({ ...current, ...payload }));
      setMessage('Partner details saved.');
    } catch {
      setError('The partner record could not be saved right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAcknowledge() {
    if (!partner) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        status: 'acknowledged',
        acknowledgedAt: serverTimestamp(),
        acknowledgedBy: user?.uid || '',
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(firestore, 'partners', partner.id), payload, { merge: true });
      setPartner((current) => ({ ...current, status: 'acknowledged', acknowledgedBy: user?.uid || current?.acknowledgedBy }));
      setMessage('Partner request acknowledged.');
    } catch {
      setError('The partner request could not be acknowledged right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handlePartnerStatusToggle() {
    if (!partner || !canEditPartner) {
      return;
    }

    const nextStatus = status === 'not_partner' ? 'active' : 'not_partner';

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const payload = {
        status: nextStatus,
        partnerStatusUpdatedAt: serverTimestamp(),
        partnerStatusUpdatedBy: user?.uid || '',
        updatedAt: serverTimestamp(),
      };
      await setDoc(doc(firestore, 'partners', partner.id), payload, { merge: true });
      setPartner((current) => ({ ...current, status: nextStatus, partnerStatusUpdatedBy: user?.uid || current?.partnerStatusUpdatedBy }));
      setMessage(nextStatus === 'not_partner' ? 'Marked as not a partner.' : 'Marked as partner.');
    } catch {
      setError('The partner status could not be updated right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLinkUser(targetUser) {
    if (!partner || !targetUser) {
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const partnerRef = doc(firestore, 'partners', partner.id);
      const userRef = doc(firestore, 'users', targetUser.id);
      const payload = {
        linkedUserId: targetUser.id,
        userId: targetUser.id,
        linkedUserRef: userRef,
        userRef,
        linkedEmail: targetUser.email || partner.email || '',
        linkedAt: serverTimestamp(),
        linkedBy: user?.uid || '',
        updatedAt: serverTimestamp(),
      };

      await Promise.all([
        setDoc(partnerRef, payload, { merge: true }),
        setDoc(userRef, {
          partnerId: partner.id,
          partnerRef,
          partnerDoc: partnerRef,
          partnerLinkedBy: user?.uid || '',
          partnerLinkedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true }),
      ]);

      setPartner((current) => ({ ...current, linkedUserId: targetUser.id, linkedEmail: targetUser.email || current?.email }));
      setMessage('Partner record linked to the user account.');
    } catch {
      setError('The partner could not be linked to that user right now.');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddFamilyLink() {
    if (!partner || !familyDraft.partnerId) {
      setError('Select a partner to link first.');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const selected = relatedPartners.find((entry) => entry.id === familyDraft.partnerId);
      const familyLinks = Array.isArray(partner.familyLinks) ? partner.familyLinks : [];
      const nextLinks = [
        ...familyLinks.filter((entry) => !(entry.partnerId === familyDraft.partnerId && entry.relation === familyDraft.relation)),
        {
          partnerId: familyDraft.partnerId,
          partnerRef: doc(firestore, 'partners', familyDraft.partnerId),
          partnerName: selected ? partnerName(selected) : '',
          relation: familyDraft.relation,
          linkedAt: new Date().toISOString(),
        },
      ];

      await setDoc(doc(firestore, 'partners', partner.id), {
        familyLinks: nextLinks,
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setPartner((current) => ({ ...current, familyLinks: nextLinks }));
      setFamilyDraft({ partnerId: '', relation: 'father' });
      setMessage('Family link added.');
    } catch {
      setError('The family link could not be saved right now.');
    } finally {
      setSaving(false);
    }
  }

  if (!canAccessPartners) {
    return <Navigate to="/access-denied" replace />;
  }

  if (!partnerId) {
    return <Navigate to="/workspace/partners" replace />;
  }

  if (!loading && !partner) {
    return <Navigate to="/workspace/partners" replace />;
  }

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Partners</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Partner details</h1>
          </div>
          <Link to="/workspace/partners" className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold">
            Back to partners
          </Link>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        {!loading && partner && (
          <>
            <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{minor ? 'Minor partner record' : 'Adult partner record'}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">{partnerName(partner)}</h2>
                  <p className="mt-2 text-sm text-slate-400">Status: {status === 'not_partner' ? 'not a partner' : status}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {!canEditPartner && (
                    <button
                      type="button"
                      onClick={handleAcknowledge}
                      disabled={saving}
                      className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Acknowledge request
                    </button>
                  )}
                  {canEditPartner && (
                    <button
                      type="button"
                      onClick={handlePartnerStatusToggle}
                      disabled={saving}
                      className={`rounded-full px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${status === 'not_partner' ? 'bg-brand-gold text-slate-950 hover:brightness-110' : 'border border-red-400/40 bg-red-500/10 text-red-100 hover:border-red-300'}`}
                    >
                      {status === 'not_partner' ? 'Mark as partner' : 'Mark as not partner'}
                    </button>
                  )}
                </div>
              </div>
            </section>

            {canEditPartner ? (
              <form onSubmit={handleSave} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="Name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Name" />
                  <TextField label="Surname" value={draft.surname} onChange={(event) => setDraft((current) => ({ ...current, surname: event.target.value }))} placeholder="Surname" />
                  <TextField label="Cell" value={draft.cell} onChange={(event) => setDraft((current) => ({ ...current, cell: event.target.value }))} placeholder="Cell number" />
                  <TextField label="Email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} placeholder="Email address" />
                  <ChoiceDropdown
                    label="Branch"
                    value={draft.branch}
                    onChange={(value) => setDraft((current) => ({ ...current, branch: value }))}
                    options={branchOptions}
                    placeholder={branchOptions.length ? 'Select branch' : 'No branches available'}
                    disabled={!branchOptions.length}
                  />
                  <TextField label="Date of birth" value={formatDate(partner.DOB || partner.dob)} onChange={() => {}} readOnly placeholder="Date of birth" />
                  <TextField label="Occupation" value={draft.occupation} onChange={(event) => setDraft((current) => ({ ...current, occupation: event.target.value }))} placeholder="Occupation" />
                  <TextField label="Workplace" value={draft.workplace} onChange={(event) => setDraft((current) => ({ ...current, workplace: event.target.value }))} placeholder="Workplace" />
                  <TextField label="Postal code" value={draft.postalCode} onChange={(event) => setDraft((current) => ({ ...current, postalCode: event.target.value }))} placeholder="Postal code" />
                  <TextField label="Follow-up status" value={draft.followUpStatus} onChange={(event) => setDraft((current) => ({ ...current, followUpStatus: event.target.value }))} placeholder="Follow-up status" />
                </div>

                <TextAreaField label="Address" value={draft.address} onChange={(event) => setDraft((current) => ({ ...current, address: event.target.value }))} placeholder="Residential address" rows={3} />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <TextField label="Born again" value={draft.bornAgain} onChange={(event) => setDraft((current) => ({ ...current, bornAgain: event.target.value }))} placeholder="Yes / No" />
                  <TextField label="Baptised" value={draft.baptised} onChange={(event) => setDraft((current) => ({ ...current, baptised: event.target.value }))} placeholder="Yes / No" />
                  <TextField label="Filled" value={draft.filled} onChange={(event) => setDraft((current) => ({ ...current, filled: event.target.value }))} placeholder="Yes / No" />
                  <TextField label="Tongues" value={draft.tongues} onChange={(event) => setDraft((current) => ({ ...current, tongues: event.target.value }))} placeholder="Yes / No" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="Home cell" value={draft.homeCell} onChange={(event) => setDraft((current) => ({ ...current, homeCell: event.target.value }))} placeholder="Yes / No" />
                  <TextField label="Home cell name" value={draft.homeCellName} onChange={(event) => setDraft((current) => ({ ...current, homeCellName: event.target.value }))} placeholder="Home cell name" />
                </div>

                <TextAreaField label="Admin notes" value={draft.adminNotes} onChange={(event) => setDraft((current) => ({ ...current, adminNotes: event.target.value }))} placeholder="Internal notes for the branch/team" rows={4} />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? 'Saving…' : 'Save partner'}
                  </button>
                </div>
              </form>
            ) : (
              <section className="space-y-5 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Read-only request</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Submitted partner details</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    This is the original website submission. Acknowledge it first before editing, linking users, or managing family records.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <DetailItem label="Name" value={partner.name} />
                  <DetailItem label="Surname" value={partner.surname} />
                  <DetailItem label="Cell" value={partner.cell} />
                  <DetailItem label="Email" value={partner.email} />
                  <DetailItem label="Branch" value={partner.branch} />
                  <DetailItem label="Date of birth" value={formatDate(partner.DOB || partner.dob)} />
                  <DetailItem label="Occupation" value={partner.Occupation || partner.occupation} />
                  <DetailItem label="Workplace" value={partner.workplace} />
                  <DetailItem label="Postal code" value={partner.postalCode} />
                  <DetailItem label="Kid/minor" value={partner.kid} />
                  <DetailItem label="Born again" value={partner.bornAgain} />
                  <DetailItem label="Born again date" value={formatDate(partner.bornAgainDate)} />
                  <DetailItem label="Baptised" value={partner.baptised} />
                  <DetailItem label="Filled" value={partner.filled} />
                  <DetailItem label="Tongues" value={partner.tongues} />
                  <DetailItem label="Home cell" value={partner.homeCell} />
                  <DetailItem label="Home cell name" value={partner.homeCellName} />
                  <DetailItem label="Parent reference" value={partner.parent?.path} />
                </div>
                <DetailItem label="Address" value={partner.address} />

                {minor && (parentPartner || partner.parent) && (
                  <div className="rounded-[1.25rem] border border-brand-gold/30 bg-brand-gold/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Parent Profile</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-white">{parentPartner ? partnerName(parentPartner) : 'Parent partner record'}</p>
                        <p className="text-xs text-slate-400">
                          ID: {parentPartner ? parentPartner.id : parentIdFrom(partner.parent)}
                          {parentPartner?.branch ? ` · ${parentPartner.branch}` : ''}
                          {parentPartner?.cell ? ` · ${parentPartner.cell}` : ''}
                        </p>
                      </div>
                      <Link
                        to={`/workspace/partners/${parentPartner ? parentPartner.id : parentIdFrom(partner.parent)}`}
                        className="rounded-full border border-brand-gold/50 bg-brand-gold/20 px-4 py-2 text-xs font-bold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950"
                      >
                        View parent
                      </Link>
                    </div>
                  </div>
                )}

                {!minor && linkedChildren.length > 0 && (
                  <div className="rounded-[1.25rem] border border-white/10 bg-slate-950/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Linked Children (Registered Minors)</p>
                    <div className="mt-3 space-y-2">
                      {linkedChildren.map((child) => (
                        <div key={child.id} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-3 text-sm">
                          <div>
                            <span className="font-semibold text-white">{partnerName(child)}</span>
                            <span className="ml-2 rounded-full border border-brand-gold/40 px-2 py-0.5 text-[0.65rem] font-semibold text-brand-gold">Minor</span>
                            {child.DOB || child.dob ? (
                              <span className="ml-2 text-xs text-slate-400">DOB: {formatDate(child.DOB || child.dob)}</span>
                            ) : null}
                          </div>
                          <Link
                            to={`/workspace/partners/${child.id}`}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold"
                          >
                            View child
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {canEditPartner && (
              <section className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">User account link</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Authentication profile</h3>
                {linkedUser || partner.linkedUserId ? (
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    Linked to {linkedUser?.displayName || linkedUser?.email || partner.linkedEmail || partner.linkedUserId}.
                  </p>
                ) : suggestedUser ? (
                  <div className="mt-4 rounded-[1.4rem] border border-brand-gold/20 bg-brand-gold/10 p-4">
                    <p className="text-sm font-semibold text-brand-gold">Possible user account found</p>
                    <p className="mt-2 text-sm text-slate-300">{suggestedUser.displayName || suggestedUser.email}</p>
                    <button
                      type="button"
                      onClick={() => handleLinkUser(suggestedUser)}
                      disabled={saving}
                      className="mt-4 rounded-full bg-brand-gold px-4 py-2 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-60"
                    >
                      Confirm link
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-slate-400">
                    No matching user account was found for this email yet.
                  </p>
                )}
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Family links</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{minor ? 'Parents and guardians' : 'Linked children or family'}</h3>

                {minor && (parentPartner || partner.parent) && (
                  <div className="mt-4 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">Parent Profile</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-white">{parentPartner ? partnerName(parentPartner) : 'Parent partner record'}</p>
                        <p className="text-xs text-slate-400">
                          ID: {parentPartner ? parentPartner.id : parentIdFrom(partner.parent)}
                          {parentPartner?.branch ? ` · ${parentPartner.branch}` : ''}
                          {parentPartner?.cell ? ` · ${parentPartner.cell}` : ''}
                        </p>
                      </div>
                      <Link
                        to={`/workspace/partners/${parentPartner ? parentPartner.id : parentIdFrom(partner.parent)}`}
                        className="rounded-full border border-brand-gold/50 bg-brand-gold/20 px-4 py-2 text-xs font-bold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950"
                      >
                        View parent
                      </Link>
                    </div>
                  </div>
                )}

                {!minor && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Linked Children (Registered Minors)</p>
                    {linkedChildren.length > 0 ? (
                      <div className="space-y-2">
                        {linkedChildren.map((child) => (
                          <div key={child.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm">
                            <div>
                              <span className="font-semibold text-white">{partnerName(child)}</span>
                              <span className="ml-2 rounded-full border border-brand-gold/40 px-2 py-0.5 text-[0.65rem] font-semibold text-brand-gold">Minor</span>
                              {child.DOB || child.dob ? (
                                <span className="ml-2 text-xs text-slate-400">DOB: {formatDate(child.DOB || child.dob)}</span>
                              ) : null}
                            </div>
                            <Link
                              to={`/workspace/partners/${child.id}`}
                              className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold"
                            >
                              View child
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No linked minor children found for this partner.</p>
                    )}
                  </div>
                )}

                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Additional Family Links</p>
                  <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                    <ChoiceDropdown
                      label="Partner"
                      value={familyDraft.partnerId}
                      onChange={(value) => setFamilyDraft((current) => ({ ...current, partnerId: value }))}
                      options={relatedPartnerOptions}
                      placeholder={relatedPartnerOptions.length ? 'Select partner' : 'No adult partners found'}
                      disabled={!relatedPartnerOptions.length}
                    />
                    <ChoiceDropdown
                      label="Relation"
                      value={familyDraft.relation}
                      onChange={(value) => setFamilyDraft((current) => ({ ...current, relation: value }))}
                      options={familyRelationOptions}
                      placeholder="Select relation"
                    />
                    <button
                      type="button"
                      onClick={handleAddFamilyLink}
                      disabled={saving || !relatedPartnerOptions.length}
                      className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-brand-gold hover:text-brand-gold disabled:opacity-60"
                    >
                      Add link
                    </button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {Array.isArray(partner.familyLinks) && partner.familyLinks.length ? partner.familyLinks.map((link) => (
                      <div key={`${link.partnerId}-${link.relation}`} className="rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-300">
                        <span className="font-semibold text-white">{link.partnerName || link.partnerId}</span>
                        <span className="ml-2 text-slate-500">{familyRelationOptions.find((option) => option.id === link.relation)?.label || link.relation}</span>
                      </div>
                    )) : (
                      <p className="text-sm text-slate-400">No extra family links have been added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
