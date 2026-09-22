import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { GeoPoint, addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import ChoiceDropdown from '../components/ui/ChoiceDropdown';
import ConfirmDeleteModal from '../components/ui/ConfirmDeleteModal';
import { firestore } from '../lib/firebase';

const branchAccessRoles = ['super_admin', 'global_editor', 'branch_editor'];
const creatorRoles = ['super_admin', 'global_editor'];
const branchWriteRoles = ['super_admin', 'global_editor'];
const serviceTimeCategories = [
  { id: 'Adults', label: 'Adults' },
  { id: 'Youth', label: 'Youth' },
  { id: 'Kids', label: 'Kids' },
  { id: 'Sunday Service', label: 'Sunday Service' },
  { id: 'Online', label: 'Online' },
  { id: 'Prayer', label: 'Prayer' },
  { id: 'Prayer Chain', label: 'Prayer Chain' },
];

const heroImageRequirements = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 1080, height: 1350 },
  video: { minWidth: 1280, minHeight: 720 },
};

const emptyBranchDraft = {
  name: '',
  slug: '',
  website: '',
  country: '',
  location: '',
  locationLink: '',
  locationPinLat: '',
  locationPinLng: '',
  pastorUid: '',
  email: '',
  phone_number: '',
  bankingDetails: '',
  whatsapp: '',
  instagram: '',
  facebook: '',
  youtube: '',
  googlepay: '',
  applepay: '',
  paypal: '',
  yoco: '',
};

const emptyContentDraft = {
  heroTitle: '',
  heroSubtitle: '',
  heroMediaType: 'image',
  heroDesktopImage: '',
  heroMobileImage: '',
  heroVideoUrl: '',
  serviceTimes: [],
  pastorImage: '',
  pastorBio: '',
  landingHighlights: '',
  givingNote: '',
  givingLink: '',
};

function TextField({ label, value, onChange, placeholder, disabled = false, type = 'text', helper = '' }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5 disabled:cursor-not-allowed disabled:opacity-60"
      />
      {helper ? <span className="block text-xs leading-5 text-slate-500">{helper}</span> : null}
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

function Modal({ open, title, onClose, children }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <section className="max-h-[90dvh] w-full max-w-5xl overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950 p-6 shadow-[0_40px_120px_rgba(0,0,0,0.55)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-brand-gold hover:text-brand-gold"
          >
            Close
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function branchLabel(branchDoc) {
  return branchDoc?.name || branchDoc?.id || 'Untitled branch';
}

function slugifyBranch(value) {
  return `${value || ''}`
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

function parseLines(value) {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function stringifyLines(value) {
  return Array.isArray(value) ? value.join('\n') : '';
}

function normalizeServiceTimes(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => {
        if (typeof entry === 'string') {
          return {
            category: 'Service',
            time: entry,
            repeat: '',
          };
        }

        return {
          category: entry?.category || entry?.title || 'Service',
          time: entry?.time || '',
          repeat: entry?.repeat || entry?.frequency || '',
        };
      })
      .filter((entry) => entry.category || entry.time || entry.repeat);
  }

  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => ({
        category: 'Service',
        time: line,
        repeat: '',
      }));
  }

  return [];
}

function serializeServiceTimes(rows) {
  return rows
    .map((row) => ({
      category: (row.category || 'Adults').trim(),
      time: (row.time || '').trim(),
      repeat: (row.repeat || '').trim(),
      title: (row.title || row.repeat || `${row.category || 'Adults'} Service`).trim(),
    }))
    .filter((row) => row.category || row.time || row.repeat || row.title);
}

function validateHeroMedia(draft) {
  const mediaType = draft.heroMediaType || 'image';
  const desktopImage = `${draft.heroDesktopImage || ''}`.trim();
  const mobileImage = `${draft.heroMobileImage || ''}`.trim();
  const videoUrl = `${draft.heroVideoUrl || ''}`.trim();

  if (mediaType === 'video' && !videoUrl) {
    return 'Add a hero video URL before saving.';
  }

  if (mediaType === 'image' && (!desktopImage || !mobileImage)) {
    return 'Add both a desktop hero image and a mobile hero image before saving.';
  }

  return '';
}

function dimensionsLabel({ width, height }) {
  return `${width} × ${height}`;
}

function normalizeGeoPoint(value) {
  if (!value) {
    return { lat: '', lng: '' };
  }

  if (value instanceof GeoPoint) {
    return {
      lat: value.latitude?.toString?.() || '',
      lng: value.longitude?.toString?.() || '',
    };
  }

  if (typeof value === 'object') {
    const lat = value.latitude ?? value._latitude ?? '';
    const lng = value.longitude ?? value._longitude ?? '';
    if (lat !== '' || lng !== '') {
      return {
        lat: `${lat}`,
        lng: `${lng}`,
      };
    }
  }

  return { lat: '', lng: '' };
}

function generatedMapUrl(lat, lng) {
  if (!lat || !lng) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
}

function openStreetMapUrl(lat, lng) {
  if (!lat || !lng) return '';
  return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(lng)}#map=18/${encodeURIComponent(lat)}/${encodeURIComponent(lng)}`;
}

function buildEditorDraft(branchDoc) {
  const landingPage = branchDoc?.landingPage || {};
  const pin = normalizeGeoPoint(branchDoc?.locationPIN);
  const pastorRef = branchDoc?.pastor;
  const heroMediaType = landingPage.heroMediaType || (landingPage.heroVideoUrl || landingPage.heroVideoLink ? 'video' : 'image');
  const heroDesktopImage = landingPage.heroDesktopImage || landingPage.heroImage || '';
  const heroMobileImage = landingPage.heroMobileImage || landingPage.heroImage || '';
  const heroVideoUrl = landingPage.heroVideoUrl || landingPage.heroVideoLink || '';

  return {
    name: branchDoc?.name || '',
    slug: branchDoc?.slug || slugifyBranch(branchDoc?.name || ''),
    website: branchDoc?.website || '',
    country: branchDoc?.country || '',
    location: branchDoc?.location || '',
    locationLink: branchDoc?.locationLink || branchDoc?.location_link || '',
    locationPinLat: pin.lat,
    locationPinLng: pin.lng,
    pastorUid: pastorRef?.id || branchDoc?.pastorUid || '',
    email: branchDoc?.email || '',
    phone_number: branchDoc?.phone_number || '',
    bankingDetails: branchDoc?.bankingDetails || '',
    whatsapp: branchDoc?.whatsapp || '',
    instagram: branchDoc?.instagram || '',
    facebook: branchDoc?.facebook || '',
    youtube: branchDoc?.youtube || '',
    googlepay: branchDoc?.googlepay || '',
    applepay: branchDoc?.applepay || '',
    paypal: branchDoc?.paypal || '',
    yoco: branchDoc?.yoco || '',
    heroTitle: landingPage.heroTitle || '',
    heroSubtitle: landingPage.heroSubtitle || '',
    heroMediaType,
    heroDesktopImage,
    heroMobileImage,
    heroVideoUrl,
    serviceTimes: normalizeServiceTimes(landingPage.serviceTimes),
    pastorImage: landingPage.pastorImage || '',
    pastorBio: landingPage.pastorBio || '',
    landingHighlights: stringifyLines(landingPage.landingHighlights),
    givingNote: landingPage.givingNote || '',
    givingLink: landingPage.givingLink || '',
  };
}

function buildBranchPayload(draft, selectedBranch) {
  const locationPinLat = Number.parseFloat(draft.locationPinLat);
  const locationPinLng = Number.parseFloat(draft.locationPinLng);
  const pastorRef = draft.pastorUid ? doc(firestore, 'users', draft.pastorUid) : null;
  const desktopHeroImage = draft.heroDesktopImage.trim();
  const mobileHeroImage = draft.heroMobileImage.trim();
  const heroVideoUrl = draft.heroVideoUrl.trim();

  const payload = {
    name: draft.name.trim(),
    slug: slugifyBranch(draft.slug || draft.name),
    website: draft.website.trim(),
    country: draft.country.trim(),
    location: draft.location.trim(),
    locationLink: draft.locationLink.trim(),
    email: draft.email.trim(),
    phone_number: draft.phone_number.trim(),
    bankingDetails: draft.bankingDetails.trim(),
    whatsapp: draft.whatsapp.trim(),
    instagram: draft.instagram.trim(),
    facebook: draft.facebook.trim(),
    youtube: draft.youtube.trim(),
    googlepay: draft.googlepay.trim(),
    applepay: draft.applepay.trim(),
    paypal: draft.paypal.trim(),
    yoco: draft.yoco.trim(),
    Image: selectedBranch?.Image || '',
    date: selectedBranch?.date || serverTimestamp(),
    landingPage: {
      heroTitle: draft.heroTitle.trim(),
      heroSubtitle: draft.heroSubtitle.trim(),
      heroMediaType: draft.heroMediaType,
      heroDesktopImage,
      heroMobileImage,
      heroVideoUrl,
      heroImage: desktopHeroImage || mobileHeroImage,
      heroVideoLink: heroVideoUrl,
      serviceTimes: serializeServiceTimes(draft.serviceTimes),
      pastorImage: draft.pastorImage.trim(),
      pastorBio: draft.pastorBio.trim(),
      landingHighlights: parseLines(draft.landingHighlights),
      givingNote: draft.givingNote.trim(),
      givingLink: draft.givingLink.trim(),
      socialLinks: {
        instagram: draft.instagram.trim(),
        facebook: draft.facebook.trim(),
        youtube: draft.youtube.trim(),
        whatsapp: draft.whatsapp.trim(),
      },
    },
    updatedAt: serverTimestamp(),
  };

  if (Number.isFinite(locationPinLat) && Number.isFinite(locationPinLng)) {
    payload.locationPIN = new GeoPoint(locationPinLat, locationPinLng);
  }

  if (pastorRef) {
    payload.pastor = pastorRef;
  }

  return payload;
}

function buildCreatePayload(draft) {
  const locationPinLat = Number.parseFloat(draft.locationPinLat);
  const locationPinLng = Number.parseFloat(draft.locationPinLng);
  const pastorRef = draft.pastorUid ? doc(firestore, 'users', draft.pastorUid) : null;

  const payload = {
    name: draft.name.trim(),
    slug: slugifyBranch(draft.slug || draft.name),
    website: draft.website.trim(),
    country: draft.country.trim(),
    location: draft.location.trim(),
    locationLink: draft.locationLink.trim(),
    email: draft.email.trim(),
    phone_number: draft.phone_number.trim(),
    bankingDetails: draft.bankingDetails.trim(),
    whatsapp: draft.whatsapp.trim(),
    instagram: draft.instagram.trim(),
    facebook: draft.facebook.trim(),
    youtube: draft.youtube.trim(),
    googlepay: draft.googlepay.trim(),
    applepay: draft.applepay.trim(),
    paypal: draft.paypal.trim(),
    yoco: draft.yoco.trim(),
    Image: '',
    date: serverTimestamp(),
    landingPage: {
      heroTitle: '',
      heroSubtitle: '',
      heroMediaType: 'image',
      heroDesktopImage: '',
      heroMobileImage: '',
      heroVideoUrl: '',
      heroImage: '',
      heroVideoLink: '',
      serviceTimes: [],
      pastorImage: '',
      pastorBio: '',
      landingHighlights: [],
      givingNote: '',
      givingLink: '',
      socialLinks: {
        instagram: draft.instagram.trim(),
        facebook: draft.facebook.trim(),
        youtube: draft.youtube.trim(),
        whatsapp: draft.whatsapp.trim(),
      },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (Number.isFinite(locationPinLat) && Number.isFinite(locationPinLng)) {
    payload.locationPIN = new GeoPoint(locationPinLat, locationPinLng);
  }

  if (pastorRef) {
    payload.pastor = pastorRef;
  }

  return payload;
}

function RowButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-brand-gold hover:text-white"
    >
      {children}
    </button>
  );
}

export default function BranchWorkspacePage() {
  const { roles, profile } = useAuth();
  const canAccessBranches = roles.some((role) => branchAccessRoles.includes(role));
  const canCreateBranch = roles.some((role) => creatorRoles.includes(role));
  const canWriteBranches = roles.some((role) => branchWriteRoles.includes(role));
  const isBranchEditor = roles.includes('branch_editor') && !roles.includes('super_admin') && !roles.includes('global_editor');
  const branchScope = `${profile?.branch || ''}`.trim();

  const [loading, setLoading] = useState(true);
  const [savingBranch, setSavingBranch] = useState(false);
  const [creatingBranch, setCreatingBranch] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [branches, setBranches] = useState([]);
  const [pastorOptions, setPastorOptions] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [editorTab, setEditorTab] = useState('details');
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [geocodingBranch, setGeocodingBranch] = useState(false);
  const [geocodingCreate, setGeocodingCreate] = useState(false);
  const [createDraft, setCreateDraft] = useState(emptyBranchDraft);
  const [draft, setDraft] = useState({ ...emptyBranchDraft, ...emptyContentDraft });

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      try {
        const [branchSnapshot, userSnapshot] = await Promise.all([
          getDocs(collection(firestore, 'branches')),
          getDocs(collection(firestore, 'users')),
        ]);

        const nextBranches = branchSnapshot.docs
          .map((branchDoc) => ({
            id: branchDoc.id,
            ...branchDoc.data(),
          }))
          .sort((left, right) => branchLabel(left).localeCompare(branchLabel(right)));

        const nextPastors = userSnapshot.docs
          .map((userDoc) => {
            const data = userDoc.data() || {};
            const staffPositions = Array.isArray(data.staff_positions) ? data.staff_positions : [];
            const displayName = data.display_name || `${data.name || ''} ${data.surname || ''}`.trim() || data.email || userDoc.id;
            const looksPastoral = Boolean(
              data.SeniorPastor
              || data.AssociatePastor
              || staffPositions.some((entry) => `${entry}`.toLowerCase().includes('pastor'))
              || `${data.global_position || ''}`.toLowerCase().includes('pastor'),
            );

            return looksPastoral
              ? {
                  id: data.uid || userDoc.id,
                  label: displayName,
                  branch: data.branch || '',
                }
              : null;
          })
          .filter(Boolean)
          .sort((left, right) => left.label.localeCompare(right.label));

        if (active) {
          setBranches(nextBranches);
          setPastorOptions(nextPastors);
        }
      } catch {
        if (active) {
          setBranches([]);
          setPastorOptions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

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
    if (!selectedBranch) {
      setDraft({ ...emptyBranchDraft, ...emptyContentDraft });
      setHeroAssets({ ...emptyHeroAssets });
      return;
    }

    setDraft(buildEditorDraft(selectedBranch));
    setHeroAssets({ ...emptyHeroAssets });
  }, [selectedBranch]);

  if (!canAccessBranches) {
    return <Navigate to="/access-denied" replace />;
  }

  if (isBranchEditor && !loading && !visibleBranches.length) {
    return (
      <main className="space-y-6">
        <section className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Branch workspace</p>
          <h1 className="mt-3 text-4xl font-bold text-white">No branch is assigned to this account</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Assign the branch on the profile page first. Branch editors can only edit their own branch.
          </p>
        </section>
      </main>
    );
  }

  function handlePastorSelect(nextPastorUid, targetSetter) {
    targetSetter((current) => ({
      ...current,
      pastorUid: nextPastorUid,
    }));
  }

  async function handleFindCoordinates(sourceDraft, targetSetter, setBusy) {
    const address = `${sourceDraft.location || ''}`.trim();

    if (!address) {
      setError('Enter a branch address first.');
      setMessage('');
      return;
    }

    setBusy(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`);

      if (!response.ok) {
        throw new Error(`Nominatim returned ${response.status}`);
      }

      const results = await response.json();
      const place = Array.isArray(results) ? results[0] : null;

      if (!place?.lat || !place?.lon) {
        setError('No map result was found for that address. Try adding the city and country.');
        return;
      }

      const lat = Number.parseFloat(place.lat).toFixed(6);
      const lng = Number.parseFloat(place.lon).toFixed(6);

      targetSetter((current) => ({
        ...current,
        location: place.display_name || address,
        locationPinLat: lat,
        locationPinLng: lng,
        locationLink: generatedMapUrl(lat, lng),
      }));
      setMessage('Coordinates found from the typed address. Review them before saving.');
    } catch (err) {
      console.error('Address geocoding failed:', err);
      setError('The address could not be geocoded right now. Try again or enter coordinates manually.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveBranch(event) {
    event.preventDefault();
    if (!selectedBranch) {
      return;
    }

    if (!canWriteBranches) {
      setError('Your account can view this branch, but only a Super Admin or Global Editor can save branch details with the current Firestore permissions.');
      setMessage('');
      return;
    }

    const heroMediaError = validateHeroMedia(draft);
    if (heroMediaError) {
      setError(heroMediaError);
      setMessage('');
      return;
    }

    setSavingBranch(true);
    setError('');
    setMessage('');

    try {
      const nextDraft = {
        ...draft,
        heroDesktopImage: draft.heroDesktopImage.trim(),
        heroMobileImage: draft.heroMobileImage.trim(),
        heroVideoUrl: draft.heroVideoUrl.trim(),
      };

      if (nextDraft.heroMediaType === 'image') {
        nextDraft.heroVideoUrl = '';
      } else {
        nextDraft.heroDesktopImage = '';
        nextDraft.heroMobileImage = '';
      }

      await setDoc(doc(firestore, 'branches', selectedBranch.id), buildBranchPayload(nextDraft, selectedBranch), { merge: true });
      setDraft(nextDraft);
      setMessage(`Saved ${branchLabel(selectedBranch)}.`);
    } catch (err) {
      console.error('Branch save failed:', err);
      setError('The branch could not be saved right now. Please try again.');
    } finally {
      setSavingBranch(false);
    }
  }

  async function handleCreateBranch(event) {
    event.preventDefault();
    if (!createDraft.name.trim()) {
      setError('Enter a branch name first.');
      return;
    }

    setCreatingBranch(true);
    setError('');
    setMessage('');

    try {
      const payload = buildCreatePayload(createDraft);
      const created = await addDoc(collection(firestore, 'branches'), payload);
      setBranches((existing) => [...existing, { id: created.id, ...payload }].sort((left, right) => branchLabel(left).localeCompare(branchLabel(right))));
      setCreateDraft(emptyBranchDraft);
      setCreateOpen(false);
      setSelectedBranchId(created.id);
      setMessage(`Created ${createDraft.name.trim()}.`);
    } catch {
      setError('The new branch could not be created right now. Please try again.');
    } finally {
      setCreatingBranch(false);
    }
  }

  async function handleDeleteBranch() {
    if (!selectedBranch?.id || !canCreateBranch) return;
    setDeleting(true);
    setError('');
    setMessage('');
    try {
      await deleteDoc(doc(firestore, 'branches', selectedBranch.id));
      const remainingBranches = branches.filter((b) => b.id !== selectedBranch.id);
      setBranches(remainingBranches);
      setSelectedBranchId(remainingBranches[0]?.id || '');
      setMessage(`Deleted ${branchLabel(selectedBranch)}.`);
      setDeleteOpen(false);
    } catch {
      setError('The branch could not be deleted right now. Check permissions.');
    } finally {
      setDeleting(false);
    }
  }

  const selectedBranchName = selectedBranch ? branchLabel(selectedBranch) : 'Select a branch';
  const selectedPastorValue = draft.pastorUid || '';
  const createPastorValue = createDraft.pastorUid || '';
  const serviceTimeRows = draft.serviceTimes || [];

  function addServiceTimeRow() {
    setDraft((current) => ({
      ...current,
      serviceTimes: [...(current.serviceTimes || []), { category: 'Adults', time: '', repeat: '' }],
    }));
  }

  function updateServiceTimeRow(index, key, value) {
    setDraft((current) => ({
      ...current,
      serviceTimes: (current.serviceTimes || []).map((row, rowIndex) => (
        rowIndex === index ? { ...row, [key]: value } : row
      )),
    }));
  }

  function removeServiceTimeRow(index) {
    setDraft((current) => ({
      ...current,
      serviceTimes: (current.serviceTimes || []).filter((_, rowIndex) => rowIndex !== index),
    }));
  }

  return (
    <main className="pb-6">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className="flex items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Workspace</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Branch workspace</h1>
          </div>
          {canCreateBranch && (
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110"
            >
              Create branch
            </button>
          )}
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
          </section>
        )}

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Branches</p>
              <span className="text-sm font-semibold text-white">{selectedBranchName}</span>
            </div>
            {canCreateBranch && selectedBranch && (
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="rounded-full border border-red-500/30 px-3.5 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                Delete branch
              </button>
            )}
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

        <section data-tour-id="branches-tabs" className="flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
            <button
              type="button"
              onClick={() => setEditorTab('details')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${editorTab === 'details' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}
            >
              Branch details
            </button>
            <button
              type="button"
              onClick={() => setEditorTab('content')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${editorTab === 'content' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}
            >
              Branch content
            </button>
          </div>
        </section>

        {editorTab === 'details' ? (
          <form data-tour-id="branches-details-form" onSubmit={handleSaveBranch} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Branch details</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{selectedBranchName}</h2>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                {isBranchEditor ? 'Your branch only' : 'All branches'}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Branch name" />
              <TextField label="URL slug" value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} placeholder="emalahleni" />
              <TextField label="Website" value={draft.website} onChange={(event) => setDraft((current) => ({ ...current, website: event.target.value }))} placeholder="Branch website" />
              <TextField label="Country" value={draft.country} onChange={(event) => setDraft((current) => ({ ...current, country: event.target.value }))} placeholder="Country" />
              <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-4 md:col-span-2">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Location and map</p>
                    <p className="mt-1 text-xs text-slate-400">Type an address, find coordinates, then save the generated map URL.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFindCoordinates(draft, setDraft, setGeocodingBranch)}
                    disabled={geocodingBranch}
                    className="rounded-full border border-brand-gold/60 px-4 py-2 text-xs font-bold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {geocodingBranch ? 'Finding...' : 'Find coordinates'}
                  </button>
                </div>
                <TextField label="Location" value={draft.location} onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))} placeholder="Branch address" />
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="Location pin lat" value={draft.locationPinLat} onChange={(event) => setDraft((current) => ({ ...current, locationPinLat: event.target.value, locationLink: generatedMapUrl(event.target.value, current.locationPinLng) }))} placeholder="Latitude" />
                  <TextField label="Location pin lng" value={draft.locationPinLng} onChange={(event) => setDraft((current) => ({ ...current, locationPinLng: event.target.value, locationLink: generatedMapUrl(current.locationPinLat, event.target.value) }))} placeholder="Longitude" />
                </div>
                <TextField label="Maps URL" value={draft.locationLink} onChange={(event) => setDraft((current) => ({ ...current, locationLink: event.target.value }))} placeholder="Generated Google Maps URL" />
                <div className="flex flex-wrap gap-3">
                  {draft.locationPinLat && draft.locationPinLng && (
                    <a
                      href={openStreetMapUrl(draft.locationPinLat, draft.locationPinLng)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-brand-gold hover:text-white"
                    >
                      Preview on map
                    </a>
                  )}
                  {draft.locationLink && (
                    <a
                      href={draft.locationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-brand-gold hover:text-white"
                    >
                      Open saved URL
                    </a>
                  )}
                </div>
              </div>
              <TextField label="Email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} placeholder="Branch email" />
              <TextField label="Phone number" value={draft.phone_number} onChange={(event) => setDraft((current) => ({ ...current, phone_number: event.target.value }))} placeholder="Branch phone number" />
              <ChoiceDropdown
                label="Pastor"
                value={selectedPastorValue}
                onChange={(id) => handlePastorSelect(id, setDraft)}
                options={pastorOptions}
                placeholder={pastorOptions.length ? 'Select pastor' : 'No pastors found'}
                disabled={!pastorOptions.length}
              />
              <TextAreaField label="Banking details" value={draft.bankingDetails} onChange={(event) => setDraft((current) => ({ ...current, bankingDetails: event.target.value }))} placeholder="Bank account details and giving instructions" rows={4} />
              <TextField label="WhatsApp" value={draft.whatsapp} onChange={(event) => setDraft((current) => ({ ...current, whatsapp: event.target.value }))} placeholder="WhatsApp link or number" />
              <TextField label="Instagram" value={draft.instagram} onChange={(event) => setDraft((current) => ({ ...current, instagram: event.target.value }))} placeholder="Instagram link" />
              <TextField label="Facebook" value={draft.facebook} onChange={(event) => setDraft((current) => ({ ...current, facebook: event.target.value }))} placeholder="Facebook link" />
              <TextField label="YouTube" value={draft.youtube} onChange={(event) => setDraft((current) => ({ ...current, youtube: event.target.value }))} placeholder="YouTube link" />
              <TextField label="Google Pay" value={draft.googlepay} onChange={(event) => setDraft((current) => ({ ...current, googlepay: event.target.value }))} placeholder="Google Pay detail" />
              <TextField label="Apple Pay" value={draft.applepay} onChange={(event) => setDraft((current) => ({ ...current, applepay: event.target.value }))} placeholder="Apple Pay detail" />
              <TextField label="PayPal" value={draft.paypal} onChange={(event) => setDraft((current) => ({ ...current, paypal: event.target.value }))} placeholder="PayPal detail" />
              <TextField label="Yoco" value={draft.yoco} onChange={(event) => setDraft((current) => ({ ...current, yoco: event.target.value }))} placeholder="Yoco detail" />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={savingBranch || !selectedBranch}
                className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingBranch ? 'Saving…' : 'Save branch'}
              </button>
            </div>
          </form>
        ) : (
          <section data-tour-id="branches-content-form" className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Branch content</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Landing-page content</h2>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">For the branch page</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Hero title" value={draft.heroTitle} onChange={(event) => setDraft((current) => ({ ...current, heroTitle: event.target.value }))} placeholder="Welcome to our branch" />
              <ChoiceDropdown
                label="Hero media type"
                value={draft.heroMediaType || 'image'}
                onChange={(value) => setDraft((current) => ({ ...current, heroMediaType: value }))}
                options={[
                  { id: 'image', label: 'Image' },
                  { id: 'video', label: 'Video' },
                ]}
                placeholder="Select media type"
              />
            </div>

            <TextAreaField label="Hero subtitle" value={draft.heroSubtitle} onChange={(event) => setDraft((current) => ({ ...current, heroSubtitle: event.target.value }))} placeholder="Short branch introduction" rows={3} />

            {draft.heroMediaType === 'video' ? (
              <div className="space-y-4 rounded-[1.6rem] border border-white/10 bg-slate-950/55 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Hero video URL</p>
                  <p className="mt-1 text-xs leading-6 text-slate-400">
                    Paste a direct video URL or a YouTube link. Recommended minimum video size is {dimensionsLabel(heroImageRequirements.video)}.
                  </p>
                </div>
                <TextField
                  type="url"
                  label="Hero video URL"
                  value={draft.heroVideoUrl}
                  onChange={(event) => setDraft((current) => ({ ...current, heroVideoUrl: event.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=... or https://.../hero.mp4"
                  helper="Use a 16:9 video where possible. Direct video URLs and YouTube video links are supported on the branch page."
                />
              </div>
            ) : (
              <div className="space-y-4 rounded-[1.6rem] border border-white/10 bg-slate-950/55 p-4">
                <div>
                  <p className="text-sm font-semibold text-white">Hero image URLs</p>
                  <p className="mt-1 text-xs leading-6 text-slate-400">
                    Paste hosted image URLs. Recommended desktop image size is {dimensionsLabel(heroImageRequirements.desktop)}. Recommended mobile image size is {dimensionsLabel(heroImageRequirements.mobile)}.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    type="url"
                    label="Desktop image URL"
                    value={draft.heroDesktopImage}
                    onChange={(event) => setDraft((current) => ({ ...current, heroDesktopImage: event.target.value }))}
                    placeholder="https://.../branch-desktop.jpg"
                    helper={`Best fit: ${dimensionsLabel(heroImageRequirements.desktop)} desktop hero artwork.`}
                  />
                  <TextField
                    type="url"
                    label="Mobile image URL"
                    value={draft.heroMobileImage}
                    onChange={(event) => setDraft((current) => ({ ...current, heroMobileImage: event.target.value }))}
                    placeholder="https://.../branch-mobile.jpg"
                    helper={`Best fit: ${dimensionsLabel(heroImageRequirements.mobile)} mobile hero artwork.`}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4 rounded-[1.6rem] border border-white/10 bg-slate-950/55 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Service times</p>
                  <p className="mt-1 text-sm text-slate-300">Create structured entries for Adults, Youth, Kids, Sunday service, or Online.</p>
                </div>
                <RowButton onClick={addServiceTimeRow}>Add row</RowButton>
              </div>

              <div className="space-y-4">
                {serviceTimeRows.length ? serviceTimeRows.map((row, index) => (
                  <div key={`${row.category || 'service'}-${index}`} className="rounded-[1.4rem] border border-white/10 bg-slate-950/60 p-4">
                    <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-end">
                      <ChoiceDropdown
                        label="Category"
                        value={row.category || ''}
                        onChange={(value) => updateServiceTimeRow(index, 'category', value)}
                        options={serviceTimeCategories}
                        placeholder="Select category"
                        disabled={false}
                      />
                      <TextField
                        label="Time"
                        value={row.time || ''}
                        onChange={(event) => updateServiceTimeRow(index, 'time', event.target.value)}
                        placeholder="9:00 AM"
                      />
                      <TextField
                        label="Repeat"
                        value={row.repeat || ''}
                        onChange={(event) => updateServiceTimeRow(index, 'repeat', event.target.value)}
                        placeholder="Every Sunday"
                      />
                      <div className="flex md:justify-end">
                        <button
                          type="button"
                          onClick={() => removeServiceTimeRow(index)}
                          className="rounded-full border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-red-400/50 hover:text-red-200"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                    No service times yet. Add a row to describe the branch schedule.
                  </div>
                )}
              </div>
            </div>

            <TextAreaField label="Landing highlights" value={draft.landingHighlights} onChange={(event) => setDraft((current) => ({ ...current, landingHighlights: event.target.value }))} placeholder="One highlight per line" rows={4} />

            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Pastor image" value={draft.pastorImage} onChange={(event) => setDraft((current) => ({ ...current, pastorImage: event.target.value }))} placeholder="Pastor image URL" />
              <TextField label="Giving link" value={draft.givingLink} onChange={(event) => setDraft((current) => ({ ...current, givingLink: event.target.value }))} placeholder="Branch giving or bank page" />
            </div>

            <TextAreaField label="Pastor bio" value={draft.pastorBio} onChange={(event) => setDraft((current) => ({ ...current, pastorBio: event.target.value }))} placeholder="Short pastor biography" rows={5} />
            <TextAreaField label="Giving note" value={draft.givingNote} onChange={(event) => setDraft((current) => ({ ...current, givingNote: event.target.value }))} placeholder="Short giving instructions or note" rows={3} />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveBranch}
                disabled={savingBranch || !selectedBranch}
                className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingBranch ? 'Saving…' : 'Save branch content'}
              </button>
            </div>
          </section>
        )}
      </div>

      <Modal open={createOpen} title="Create branch" onClose={() => setCreateOpen(false)}>
        <form onSubmit={handleCreateBranch} className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <TextField label="Name" value={createDraft.name} onChange={(event) => setCreateDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Branch name" />
            <TextField label="URL slug" value={createDraft.slug} onChange={(event) => setCreateDraft((current) => ({ ...current, slug: event.target.value }))} placeholder="Defaults from branch name" />
            <TextField label="Website" value={createDraft.website} onChange={(event) => setCreateDraft((current) => ({ ...current, website: event.target.value }))} placeholder="Branch website" />
            <TextField label="Country" value={createDraft.country} onChange={(event) => setCreateDraft((current) => ({ ...current, country: event.target.value }))} placeholder="Country" />
            <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-slate-950/40 p-4 md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Location and map</p>
                  <p className="mt-1 text-xs text-slate-400">Type an address, find coordinates, then save the generated map URL.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFindCoordinates(createDraft, setCreateDraft, setGeocodingCreate)}
                  disabled={geocodingCreate}
                  className="rounded-full border border-brand-gold/60 px-4 py-2 text-xs font-bold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {geocodingCreate ? 'Finding...' : 'Find coordinates'}
                </button>
              </div>
              <TextField label="Location" value={createDraft.location} onChange={(event) => setCreateDraft((current) => ({ ...current, location: event.target.value }))} placeholder="Branch address" />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Location pin lat" value={createDraft.locationPinLat} onChange={(event) => setCreateDraft((current) => ({ ...current, locationPinLat: event.target.value, locationLink: generatedMapUrl(event.target.value, current.locationPinLng) }))} placeholder="Latitude" />
                <TextField label="Location pin lng" value={createDraft.locationPinLng} onChange={(event) => setCreateDraft((current) => ({ ...current, locationPinLng: event.target.value, locationLink: generatedMapUrl(current.locationPinLat, event.target.value) }))} placeholder="Longitude" />
              </div>
              <TextField label="Maps URL" value={createDraft.locationLink} onChange={(event) => setCreateDraft((current) => ({ ...current, locationLink: event.target.value }))} placeholder="Generated Google Maps URL" />
              <div className="flex flex-wrap gap-3">
                {createDraft.locationPinLat && createDraft.locationPinLng && (
                  <a
                    href={openStreetMapUrl(createDraft.locationPinLat, createDraft.locationPinLng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-brand-gold hover:text-white"
                  >
                    Preview on map
                  </a>
                )}
                {createDraft.locationLink && (
                  <a
                    href={createDraft.locationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-brand-gold hover:text-white"
                  >
                    Open saved URL
                  </a>
                )}
              </div>
            </div>
            <TextField label="Email" value={createDraft.email} onChange={(event) => setCreateDraft((current) => ({ ...current, email: event.target.value }))} placeholder="Branch email" />
            <TextField label="Phone number" value={createDraft.phone_number} onChange={(event) => setCreateDraft((current) => ({ ...current, phone_number: event.target.value }))} placeholder="Branch phone number" />
            <ChoiceDropdown
              label="Pastor"
              value={createPastorValue}
              onChange={(id) => handlePastorSelect(id, setCreateDraft)}
              options={pastorOptions}
              placeholder={pastorOptions.length ? 'Select pastor' : 'No pastors found'}
              disabled={!pastorOptions.length}
            />
            <TextAreaField label="Banking details" value={createDraft.bankingDetails} onChange={(event) => setCreateDraft((current) => ({ ...current, bankingDetails: event.target.value }))} placeholder="Bank account details and giving instructions" rows={4} />
            <TextField label="WhatsApp" value={createDraft.whatsapp} onChange={(event) => setCreateDraft((current) => ({ ...current, whatsapp: event.target.value }))} placeholder="WhatsApp link or number" />
            <TextField label="Instagram" value={createDraft.instagram} onChange={(event) => setCreateDraft((current) => ({ ...current, instagram: event.target.value }))} placeholder="Instagram link" />
            <TextField label="Facebook" value={createDraft.facebook} onChange={(event) => setCreateDraft((current) => ({ ...current, facebook: event.target.value }))} placeholder="Facebook link" />
            <TextField label="YouTube" value={createDraft.youtube} onChange={(event) => setCreateDraft((current) => ({ ...current, youtube: event.target.value }))} placeholder="YouTube link" />
            <TextField label="Google Pay" value={createDraft.googlepay} onChange={(event) => setCreateDraft((current) => ({ ...current, googlepay: event.target.value }))} placeholder="Google Pay detail" />
            <TextField label="Apple Pay" value={createDraft.applepay} onChange={(event) => setCreateDraft((current) => ({ ...current, applepay: event.target.value }))} placeholder="Apple Pay detail" />
            <TextField label="PayPal" value={createDraft.paypal} onChange={(event) => setCreateDraft((current) => ({ ...current, paypal: event.target.value }))} placeholder="PayPal detail" />
            <TextField label="Yoco" value={createDraft.yoco} onChange={(event) => setCreateDraft((current) => ({ ...current, yoco: event.target.value }))} placeholder="Yoco detail" />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:border-brand-gold hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creatingBranch}
              className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creatingBranch ? 'Creating…' : 'Create branch'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete branch"
        itemName={selectedBranchName}
        message="Are you sure you want to delete this church branch campus? This action is permanent and will remove branch content, location settings, and media bindings."
        loading={deleting}
        onConfirm={handleDeleteBranch}
        onClose={() => setDeleteOpen(false)}
      />
    </main>
  );
}
