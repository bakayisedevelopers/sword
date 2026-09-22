import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';

const ministryAccessRoles = ['super_admin', 'global_editor', 'branch_editor', 'ministry_editor'];
const creatorRoles = ['super_admin', 'global_editor', 'branch_editor'];
const fewdsOptions = ['Fellowship', 'Evangelism', 'Worship', 'Discipleship', 'Service'];

const typeOptions = [
  { id: 'normal', label: 'Normal Ministry (Catering, Worship, etc.)' },
  { id: 'special', label: 'Special Ministry (Youth, Singles, Couples, Kids)' },
  { id: 'conference', label: 'Conference / Special Gathering (Fire Conf, Camp Yolo, etc.)' },
];

export const defaultSeedMinistries = [
  {
    name: 'Fire Conference',
    ministryName: 'Fire Conference',
    slug: 'fire-conference',
    type: 'conference',
    FEWDS: 'Evangelism',
    description: 'An explosive annual gathering focused on spiritual revival, prophetic impartation, and Kingdom power.',
    picture: '/assets/images/FireConf_(2).png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Lagos'],
    meetingDetails: 'Annual conference held at designated SSMI regional centers. Specific schedules and keynote sessions are published prior to the gathering.',
    servingDetails: 'Join our host team, prayer intercessors, security, media, sound engineering, or hospitality crew.',
    contactName: 'Fire Conference Committee',
    contactEmail: 'fireconf@swordandspirit.org',
    contactWhatsApp: '+26876000000',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'Superman Conference',
    ministryName: 'Superman Conference',
    slug: 'superman-conference',
    type: 'conference',
    FEWDS: 'Discipleship',
    description: 'Empowering men to rise into spiritual leadership, strength, integrity, and godly authority in home, church, and society.',
    picture: '/assets/images/SuperKids.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
    meetingDetails: 'Held annually across major SSMI campuses, featuring workshops, keynote sessions, and brotherhood fellowship.',
    servingDetails: 'Serve in logistics, ushering, sound engineering, media, or hospitality for the Men’s Conference.',
    contactName: 'Men’s Ministry Leadership',
    contactEmail: 'superman@swordandspirit.org',
    contactWhatsApp: '+26876000001',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'Camp YOLO',
    ministryName: 'Camp YOLO',
    slug: 'camp-yolo',
    type: 'conference',
    FEWDS: 'Fellowship',
    description: 'Youth Living Out Loud! An immersive retreat packed with worship, Bible teaching, outdoor activities, and youth connection.',
    picture: '/assets/images/CampYolo.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg'],
    meetingDetails: 'Annual youth camp held during school holidays at selected retreat centers.',
    servingDetails: 'Counselors, team leaders, games coordinators, logistics assistants, and medical personnel needed.',
    contactName: 'Youth Pastor & Camp Directors',
    contactEmail: 'yolo@swordandspirit.org',
    contactWhatsApp: '+26876000002',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'Youth Ministry',
    ministryName: 'Youth Ministry',
    slug: 'youth',
    type: 'special',
    FEWDS: 'Fellowship',
    description: 'Equipping teenagers and young believers to stand uncompromised in their faith, cultivate spiritual gifts, and impact their schools.',
    picture: '/assets/images/Youth.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm'],
    meetingDetails: 'Meets every Friday at 17:00 across SSMI branches for passionate worship, the Word, and fellowship.',
    servingDetails: 'Youth worship team, media, small group leaders, ushering, and event setup team.',
    contactName: 'Youth Coordinator',
    contactEmail: 'youth@swordandspirit.org',
    contactWhatsApp: '+26876000003',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'For Men',
    ministryName: 'Men of Dominion',
    slug: 'for-men',
    type: 'special',
    FEWDS: 'Discipleship',
    description: 'Fostering authentic brotherhood, spiritual maturity, leadership development, and prayer among men of all ages.',
    picture: '/assets/images/Ladies.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Lagos'],
    meetingDetails: 'Monthly Saturday morning breakfast meetings and bi-weekly prayer calls across campuses.',
    servingDetails: 'Mentorship, event logistics, ushering, men’s choir, and community outreach.',
    contactName: 'Men’s Ministry Leader',
    contactEmail: 'men@swordandspirit.org',
    contactWhatsApp: '+26876000004',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'For Women',
    ministryName: 'Women of Virtue & Power',
    slug: 'for-women',
    type: 'special',
    FEWDS: 'Discipleship',
    description: 'Uniting women in prayer, Bible study, holistic empowerment, mentorship, and impactful community service.',
    picture: '/assets/images/Ladies.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm', 'Lagos'],
    meetingDetails: 'Monthly women’s gatherings and bi-weekly prayer circles across campuses.',
    servingDetails: 'Prayer team, hospitality, event coordination, welfare support, and mentorship.',
    contactName: 'Women’s Ministry Leader',
    contactEmail: 'women@swordandspirit.org',
    contactWhatsApp: '+26876000005',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'For Couples',
    ministryName: 'Couples Ministry',
    slug: 'for-couples',
    type: 'special',
    FEWDS: 'Fellowship',
    description: 'Strengthening marital bonds, fostering Biblical relationship principles, and building healthy, lasting Christian families.',
    picture: '/assets/images/Couples_(2).png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg'],
    meetingDetails: 'Quarterly couples dinners, marriage enrichment seminars, and annual relationship retreats.',
    servingDetails: 'Event planning, couples counseling support, seminar hospitality, and host team.',
    contactName: 'Marriage Directors',
    contactEmail: 'couples@swordandspirit.org',
    contactWhatsApp: '+26876000006',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'Singles Ministry',
    ministryName: 'Singles Ministry',
    slug: 'singles',
    type: 'special',
    FEWDS: 'Fellowship',
    description: 'Empowering unmarried adults to live purposefully, grow in Christ, and navigate career, relationships, and calling.',
    picture: '/assets/images/Felloship_(2).png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
    meetingDetails: 'Monthly social gatherings, interactive workshops, and career & relationship seminars.',
    servingDetails: 'Event hosts, discussion facilitators, sound & media, and community outreach.',
    contactName: 'Singles Coordinator',
    contactEmail: 'singles@swordandspirit.org',
    contactWhatsApp: '+26876000007',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'Young Adults',
    ministryName: 'Young Adults Ministry',
    slug: 'young-adults',
    type: 'special',
    FEWDS: 'Fellowship',
    description: 'Connecting university students and young professionals (ages 18–35) in passionate worship, discipleship, and kingdom impact.',
    picture: '/assets/images/Youth.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
    meetingDetails: 'Bi-weekly Friday evening fellowship and monthly campus worship nights.',
    servingDetails: 'Worship team, small group leaders, media, ushering, and campus outreach.',
    contactName: 'Young Adults Leader',
    contactEmail: 'youngadults@swordandspirit.org',
    contactWhatsApp: '+26876000008',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'Super Kids',
    ministryName: 'Children’s Church (Super Kids)',
    slug: 'super-kids',
    type: 'special',
    FEWDS: 'Discipleship',
    description: 'Nurturing children (ages 2–12) in God’s Word through fun, creative lessons, worship, crafts, and interactive prayer.',
    picture: '/assets/images/SuperKids.png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm', 'Lagos'],
    meetingDetails: 'Runs parallel to Sunday adult services at 09:00 AM across all SSMI branches.',
    servingDetails: 'Sunday school teachers, classroom helpers, child check-in registration crew, and praise team.',
    contactName: 'SuperKids Coordinator',
    contactEmail: 'kids@swordandspirit.org',
    contactWhatsApp: '+26876000009',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'Welfare Ministry',
    ministryName: 'Welfare & Benevolence',
    slug: 'welfare',
    type: 'normal',
    FEWDS: 'Service',
    description: 'Demonstrating Christ’s love by providing food, clothing, emergency financial assistance, and compassionate care to families in need.',
    picture: '/assets/images/Care_(2).png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm'],
    meetingDetails: 'Weekly food hamper distribution and emergency care support coordination across local branches.',
    servingDetails: 'Food drive collection, hamper packing, home visitation team, and community distribution.',
    contactName: 'Welfare Department Head',
    contactEmail: 'welfare@swordandspirit.org',
    contactWhatsApp: '+26876000010',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'Counseling Ministry',
    ministryName: 'Pastoral Counseling',
    slug: 'counseling',
    type: 'normal',
    FEWDS: 'Service',
    description: 'Providing confidential, Scripture-based guidance, emotional support, and spiritual healing for individuals, couples, and families.',
    picture: '/assets/images/Counselling_(2).png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
    meetingDetails: 'Available by appointment during weekday office hours and post-service on Sundays.',
    servingDetails: 'Trained lay counselors, prayer partners, and appointment receptionists.',
    contactName: 'Head Counselor',
    contactEmail: 'counseling@swordandspirit.org',
    contactWhatsApp: '+26876000011',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'Fellowship Ministry',
    ministryName: 'Fellowship & Cell Groups',
    slug: 'fellowship',
    type: 'normal',
    FEWDS: 'Fellowship',
    description: 'Connecting believers in small group home cell fellowships for Bible study, mutual encouragement, prayer, and community life.',
    picture: '/assets/images/Felloship_(2).png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm', 'Lagos'],
    meetingDetails: 'Weekly home cell meetings every Wednesday evening from 18:00 to 19:30 in neighborhoods.',
    servingDetails: 'Home cell hosts, discussion facilitators, neighborhood coordinators, and hospitality teams.',
    contactName: 'Cell Group Overseer',
    contactEmail: 'fellowship@swordandspirit.org',
    contactWhatsApp: '+26876000012',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'School of Ministry',
    ministryName: 'SSMI School of Ministry',
    slug: 'school-of-ministry',
    type: 'normal',
    FEWDS: 'Discipleship',
    description: 'Comprehensive theological training, leadership certification, and practical ministry preparation for aspiring leaders and ministers.',
    picture: '/assets/images/Minstries_(2).png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Boksburg', 'Online'],
    meetingDetails: 'Saturday intensive modules and weekday evening online lectures via the student portal.',
    servingDetails: 'Academic admin, registrar support, library management, and online lecture facilitators.',
    contactName: 'Dean of Academics',
    contactEmail: 'som@swordandspirit.org',
    contactWhatsApp: '+26876000013',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'Baptism Ministry',
    ministryName: 'Water Baptism',
    slug: 'baptism',
    type: 'normal',
    FEWDS: 'Discipleship',
    description: 'Guiding new believers through water baptism classes and celebrating their public confession of faith in Jesus Christ.',
    picture: '/assets/images/Baptis_(2).png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm'],
    meetingDetails: 'Monthly baptism classes followed by baptism celebration services at designated campus baptistries.',
    servingDetails: 'Baptism preparation crew, towel/gown hospitality team, and registration assistants.',
    contactName: 'Baptism Coordinator',
    contactEmail: 'baptism@swordandspirit.org',
    contactWhatsApp: '+26876000014',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
  {
    name: 'Prayer Ministry',
    ministryName: 'Intercessory Prayer',
    slug: 'prayer',
    type: 'normal',
    FEWDS: 'Worship',
    description: 'Standing in the gap for the church, leaders, nations, and individual prayer requests through continuous intercessory prayer.',
    picture: '/assets/images/Care_(2).png',
    branches: ['EMalahleni', 'Mbabane', 'Siteki', 'Hlutsi', 'Ludzeludze', 'Boksburg', 'Orange Farm', 'Lagos', 'Online'],
    meetingDetails: 'Pre-service Sunday intercessory prayer at 08:30 AM and Thursday evening churchwide prayer from 18:30 to 19:30.',
    servingDetails: 'Intercessors, altar prayer ministers, and online prayer chain team.',
    contactName: 'Prayer Director',
    contactEmail: 'prayer@swordandspirit.org',
    contactWhatsApp: '+26876000015',
    donations: false,
    volunteers: true,
    forServing: true,
    bankingDetails: '',
    status: 'active',
  },
];

const emptyDraft = {
  name: '',
  ministryName: '',
  slug: '',
  type: 'normal',
  description: '',
  picture: '',
  FEWDS: 'Fellowship',
  branches: [],
  meetingDetails: '',
  servingDetails: '',
  contactName: '',
  contactEmail: '',
  contactWhatsApp: '',
  donations: false,
  volunteers: false,
  forServing: false,
  bankingDetails: '',
};

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

function ministryName(ministry) {
  return ministry?.name || ministry?.ministryName || 'Untitled ministry';
}

function ministryBranches(ministry) {
  return Array.isArray(ministry?.branches) ? ministry.branches.filter(Boolean) : [];
}

function ministryMatchesBranch(ministry, branchDoc) {
  if (ministry?.global === true || ministryBranches(ministry).some((b) => `${b}`.trim().toLowerCase() === 'global')) {
    return true;
  }
  const selectedName = branchLabel(branchDoc).toLowerCase();
  const selectedId = `${branchDoc?.id || ''}`.toLowerCase();
  return ministryBranches(ministry).some((branch) => {
    const value = `${branch || ''}`.trim().toLowerCase();
    return value === selectedName || value === selectedId;
  });
}

function canUserEditMinistry(roles, profile, ministry) {
  if (roles.includes('super_admin') || roles.includes('global_editor')) {
    return true;
  }

  const branchScope = `${profile?.branch || ''}`.trim().toLowerCase();
  const otherBranches = Array.isArray(profile?.other_branches) ? profile.other_branches.map((branch) => `${branch}`.trim().toLowerCase()) : [];
  const branches = ministryBranches(ministry).map((branch) => `${branch}`.trim().toLowerCase());

  if (roles.includes('branch_editor') && branches.some((branch) => branch === branchScope || otherBranches.includes(branch))) {
    return true;
  }

  const ministryScopes = Array.isArray(profile?.ministries) ? profile.ministries : [];
  const ministryIdScopes = Array.isArray(profile?.ministryIds) ? profile.ministryIds : [];
  return roles.includes('ministry_editor') && (
    ministryScopes.includes(ministry.name) ||
    ministryScopes.includes(ministry.ministryName) ||
    ministryIdScopes.includes(ministry.id)
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-brand-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 5l7 7-7 7" />
    </svg>
  );
}

function MinistryRow({ ministry, canEdit }) {
  const isGlobal = ministry?.global === true || ministryBranches(ministry).some((b) => `${b}`.trim().toLowerCase() === 'global');
  return (
    <Link
      to={`/workspace/ministries/${ministry.id}`}
      className="group flex w-full items-center justify-between rounded-[1.35rem] border border-white/10 bg-slate-950/40 px-4 py-4 text-left transition hover:border-brand-gold/40 hover:bg-brand-gold/5"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-white">{ministryName(ministry)}</p>
          {isGlobal && (
            <span className="rounded-full bg-brand-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-gold">
              Global
            </span>
          )}
        </div>
        <div className="mt-1 hidden flex-wrap gap-2 text-xs text-slate-400 sm:flex">
          <span>{ministry.FEWDS || 'No department'}</span>
          {ministry.donations ? <span className="text-brand-gold">Giving enabled</span> : null}
          {ministry.volunteers || ministry.forServing ? <span>Volunteer enabled</span> : null}
          {!canEdit ? <span>View only</span> : null}
        </div>
      </div>
      <ChevronIcon />
    </Link>
  );
}

function TextField({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-brand-gold/60 focus:bg-brand-gold/5"
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

function TogglePill({ active, children, onClick, disabled = false }) {
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

function buildCreatePayload(draft, user) {
  const normalizedSlug = draft.slug.trim().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const isGlobal = draft.branches.some((b) => `${b}`.trim().toLowerCase() === 'global');
  return {
    name: draft.name.trim(),
    ministryName: draft.ministryName.trim() || draft.name.trim(),
    slug: normalizedSlug,
    type: draft.type || 'normal',
    global: isGlobal,
    description: draft.description.trim(),
    picture: draft.picture.trim(),
    FEWDS: draft.FEWDS,
    branches: draft.branches,
    meetingDetails: draft.meetingDetails.trim(),
    servingDetails: draft.servingDetails.trim(),
    contactName: draft.contactName.trim(),
    contactEmail: draft.contactEmail.trim(),
    contactWhatsApp: draft.contactWhatsApp.trim(),
    donations: draft.donations,
    volunteers: draft.volunteers,
    forServing: draft.forServing,
    bankingDetails: draft.bankingDetails.trim(),
    status: 'active',
    createdAt: serverTimestamp(),
    createdBy: user?.uid || '',
    updatedAt: serverTimestamp(),
    updatedBy: user?.uid || '',
  };
}

export default function MinistriesWorkspacePage() {
  const { user, roles, profile } = useAuth();
  const canAccessMinistries = roles.some((role) => ministryAccessRoles.includes(role));
  const canCreateMinistry = roles.some((role) => creatorRoles.includes(role));
  const canManageAll = roles.includes('super_admin') || roles.includes('global_editor');
  const isBranchScoped = !canManageAll && roles.includes('branch_editor');
  const branchScope = `${profile?.branch || ''}`.trim();

  const [loadingBranches, setLoadingBranches] = useState(true);
  const [loadingMinistries, setLoadingMinistries] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [branches, setBranches] = useState([]);
  const [ministries, setMinistries] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [activeTab, setActiveTab] = useState('ministries');
  const [draft, setDraft] = useState({ ...emptyDraft });

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoadingBranches(true);
      setLoadingMinistries(true);
      setError('');

      try {
        const [branchesSnapshot, ministriesSnapshot] = await Promise.all([
          getDocs(collection(firestore, 'branches')),
          getDocs(collection(firestore, 'ministries')),
        ]);

        const nextBranches = branchesSnapshot.docs
          .map((branchDoc) => ({ id: branchDoc.id, ...branchDoc.data() }))
          .sort((left, right) => branchLabel(left).localeCompare(branchLabel(right)));

        const nextMinistries = ministriesSnapshot.docs
          .map((ministryDoc) => ({ id: ministryDoc.id, ...ministryDoc.data() }))
          .sort((left, right) => ministryName(left).localeCompare(ministryName(right)));

        if (active) {
          setBranches(nextBranches);
          setMinistries(nextMinistries);
        }
      } catch {
        if (active) {
          setBranches([]);
          setMinistries([]);
          setError('Ministries could not be loaded. Check Firestore permissions.');
        }
      } finally {
        if (active) {
          setLoadingBranches(false);
          setLoadingMinistries(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const visibleBranches = useMemo(() => {
    if (!isBranchScoped) {
      return branches;
    }

    return branches.filter((branchDoc) => branchMatchesScope(branchDoc, branchScope));
  }, [branches, branchScope, isBranchScoped]);

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

  const selectedBranchName = selectedBranch ? branchLabel(selectedBranch) : 'Select a branch';
  const visibleMinistries = selectedBranch
    ? ministries.filter((ministry) => ministryMatchesBranch(ministry, selectedBranch))
    : [];

  async function handleBackfill() {
    if (!canManageAll) return;
    setCreating(true);
    setError('');
    setMessage('Backfilling 16 target ministries...');

    try {
      const snapshot = await getDocs(collection(firestore, 'ministries'));
      const existingDocs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      let updatedCount = 0;
      let createdCount = 0;

      for (const seed of defaultSeedMinistries) {
        const existing = existingDocs.find(
          (m) =>
            (m.slug && m.slug === seed.slug) ||
            (m.name && m.name.toLowerCase() === seed.name.toLowerCase()) ||
            (m.ministryName && m.ministryName.toLowerCase() === seed.name.toLowerCase())
        );

        if (existing) {
          await setDoc(doc(firestore, 'ministries', existing.id), { ...seed, updatedAt: serverTimestamp() }, { merge: true });
          updatedCount++;
        } else {
          const payload = { ...seed, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), createdBy: user?.uid || '' };
          await addDoc(collection(firestore, 'ministries'), payload);
          createdCount++;
        }
      }

      const refreshedSnap = await getDocs(collection(firestore, 'ministries'));
      const refreshedList = refreshedSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((left, right) => ministryName(left).localeCompare(ministryName(right)));

      setMinistries(refreshedList);
      setMessage(`Backfilled successfully! Created ${createdCount}, updated ${updatedCount} ministries.`);
    } catch (err) {
      console.error(err);
      setError('Could not backfill ministries: ' + (err.message || 'Error'));
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    if (!selectedBranch || activeTab !== 'create') {
      return;
    }

    const label = branchLabel(selectedBranch);
    if (!canManageAll) {
      setDraft((current) => ({ ...current, branches: [label] }));
      return;
    }

    setDraft((current) => (
      current.branches.length ? current : { ...current, branches: [label] }
    ));
  }, [activeTab, canManageAll, selectedBranch]);

  function toggleDraftBranch(value) {
    if (!canManageAll && value !== selectedBranchName) {
      return;
    }

    setDraft((current) => ({
      ...current,
      branches: current.branches.includes(value)
        ? current.branches.filter((branch) => branch !== value)
        : [...current.branches, value],
    }));
  }

  async function handleCreateMinistry(event) {
    event.preventDefault();
    if (!canCreateMinistry) {
      setError('Only super admins, global editors, and branch editors can create ministries.');
      return;
    }

    if (!draft.name.trim()) {
      setError('Enter a ministry name first.');
      setMessage('');
      return;
    }

    if (!draft.slug.trim()) {
      setError('Enter a URL slug (e.g. fire-conference, for-couples) first.');
      setMessage('');
      return;
    }

    if (!draft.description.trim()) {
      setError('Add a ministry description first.');
      setMessage('');
      return;
    }

    const scopedDraft = !canManageAll && selectedBranch
      ? { ...draft, branches: [selectedBranchName] }
      : draft;

    if (!scopedDraft.branches.length) {
      setError('Select at least one branch for this ministry.');
      setMessage('');
      return;
    }

    if (scopedDraft.donations && !scopedDraft.bankingDetails.trim()) {
      setError('Add banking details before enabling giving for this ministry.');
      setMessage('');
      return;
    }

    setCreating(true);
    setError('');
    setMessage('');

    try {
      const payload = buildCreatePayload(scopedDraft, user);
      const created = await addDoc(collection(firestore, 'ministries'), payload);
      setMinistries((existing) => [...existing, { id: created.id, ...payload }].sort((left, right) => ministryName(left).localeCompare(ministryName(right))));
      setDraft({ ...emptyDraft });
      setActiveTab('ministries');
      setMessage(`Created ${payload.name}.`);
    } catch {
      setError('The ministry could not be created right now.');
    } finally {
      setCreating(false);
    }
  }

  if (!canAccessMinistries) {
    return <Navigate to="/access-denied" replace />;
  }

  if (isBranchScoped && !loadingBranches && !visibleBranches.length) {
    return (
      <main className="pb-6">
        <section className="mx-auto w-full max-w-6xl rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ministries</p>
          <h1 className="mt-3 text-4xl font-bold text-white">No branch is assigned to this account</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
            Assign a branch on the user profile first. Branch editors can only manage ministries linked to their branch.
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
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Ministries</h1>
          </div>
        </section>

        {(error || message) && (
          <section className={`rounded-[1.6rem] border p-4 text-sm ${error ? 'border-red-400/30 bg-red-500/10 text-red-100' : 'border-brand-gold/20 bg-brand-gold/10 text-brand-gold'}`}>
            {error || message}
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

        <section className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex rounded-full border border-white/10 bg-slate-950/60 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('ministries')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'ministries' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}
            >
              Ministries
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('create')}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === 'create' ? 'bg-brand-gold text-slate-950' : 'text-slate-300 hover:text-white'}`}
            >
              Create ministry
            </button>
          </div>

          {canManageAll && (
            <button
              type="button"
              onClick={handleBackfill}
              disabled={creating}
              className="rounded-full border border-brand-gold/60 bg-brand-gold/10 px-5 py-2 text-sm font-semibold text-brand-gold transition hover:bg-brand-gold hover:text-slate-950 disabled:opacity-50"
            >
              {creating ? 'Backfilling...' : 'Backfill 16 Target Ministries'}
            </button>
          )}
        </section>

        {activeTab === 'ministries' ? (
          <section className="space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Ministries</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{selectedBranchName}</h2>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
                {loadingMinistries ? 'Loading…' : `${visibleMinistries.length} records`}
              </span>
            </div>

            <div className="space-y-3">
              {visibleMinistries.map((ministry) => (
                <MinistryRow key={ministry.id} ministry={ministry} canEdit={canUserEditMinistry(roles, profile, ministry)} />
              ))}
              {!visibleMinistries.length && !loadingMinistries && (
                <div className="rounded-[1.4rem] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                  No ministries are linked to this branch yet.
                </div>
              )}
            </div>
          </section>
        ) : (
          <form onSubmit={handleCreateMinistry} className="space-y-6 rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Create ministry</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">New ministry profile</h2>
              </div>
              {!canCreateMinistry ? (
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">No create access</span>
              ) : !canManageAll ? (
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{selectedBranchName} only</span>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Ministry name" />
              <TextField label="Ministry name alias" value={draft.ministryName} onChange={(event) => setDraft((current) => ({ ...current, ministryName: event.target.value }))} placeholder="Optional alias" />
              <TextField label="URL Slug (Required, e.g. for-couples, fire-conference)" value={draft.slug} onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))} placeholder="e.g. for-couples" />
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Ministry Category Type</span>
                <select
                  value={draft.type}
                  onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5"
                >
                  {typeOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                </select>
              </label>
              <TextField label="Picture URL" value={draft.picture} onChange={(event) => setDraft((current) => ({ ...current, picture: event.target.value }))} placeholder="Image URL" />
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">FEWDS department</span>
                <select
                  value={draft.FEWDS}
                  onChange={(event) => setDraft((current) => ({ ...current, FEWDS: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold/60 focus:bg-brand-gold/5"
                >
                  {fewdsOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              </label>
            </div>

            <TextAreaField label="Description" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} placeholder="Public ministry description" rows={4} />

            <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Branches</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <TogglePill
                  active={draft.branches.includes('Global')}
                  disabled={!canManageAll}
                  onClick={() => toggleDraftBranch('Global')}
                >
                  🌐 Global (All Branches)
                </TogglePill>
                {branches.map((branchDoc) => {
                  const label = branchLabel(branchDoc);
                  const disabled = !canManageAll && label !== selectedBranchName;
                  return (
                    <TogglePill key={branchDoc.id} active={draft.branches.includes(label)} disabled={disabled} onClick={() => toggleDraftBranch(label)}>
                      {label}
                    </TogglePill>
                  );
                })}
              </div>
            </section>

            <div className="grid gap-4 md:grid-cols-2">
              <TextAreaField label="Meeting details" value={draft.meetingDetails} onChange={(event) => setDraft((current) => ({ ...current, meetingDetails: event.target.value }))} placeholder="When and where this ministry meets" rows={4} />
              <TextAreaField label="Serving details" value={draft.servingDetails} onChange={(event) => setDraft((current) => ({ ...current, servingDetails: event.target.value }))} placeholder="How people can serve" rows={4} />
              <TextField label="Contact name" value={draft.contactName} onChange={(event) => setDraft((current) => ({ ...current, contactName: event.target.value }))} placeholder="Contact person" />
              <TextField label="Contact email" value={draft.contactEmail} onChange={(event) => setDraft((current) => ({ ...current, contactEmail: event.target.value }))} placeholder="Email address" />
              <TextField label="Contact WhatsApp" value={draft.contactWhatsApp} onChange={(event) => setDraft((current) => ({ ...current, contactWhatsApp: event.target.value }))} placeholder="WhatsApp number" />
            </div>

            <section className="rounded-[1.6rem] border border-white/10 bg-slate-950/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Website visibility</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <TogglePill active={draft.donations} onClick={() => setDraft((current) => ({ ...current, donations: !current.donations }))}>Show in Giving</TogglePill>
                <TogglePill active={draft.volunteers} onClick={() => setDraft((current) => ({ ...current, volunteers: !current.volunteers }))}>Allow Volunteer</TogglePill>
                <TogglePill active={draft.forServing} onClick={() => setDraft((current) => ({ ...current, forServing: !current.forServing }))}>For Serving</TogglePill>
              </div>
            </section>

            <TextAreaField label="Banking details" value={draft.bankingDetails} onChange={(event) => setDraft((current) => ({ ...current, bankingDetails: event.target.value }))} placeholder="Required if this ministry appears in Giving" rows={4} />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating || !canCreateMinistry}
                className="rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {creating ? 'Creating…' : 'Create ministry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
