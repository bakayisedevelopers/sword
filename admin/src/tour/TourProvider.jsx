import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDocs, collection, serverTimestamp, setDoc } from 'firebase/firestore';
import { useAuth } from '../auth/AuthProvider';
import { firestore } from '../lib/firebase';
import { sectionKeyFromPath, tourDefinitions } from '../help/helpContent';

const TourContext = createContext(null);
const TOUR_PROGRESS_VERSION = 1;

function isCurrentCompletion(entry) {
  return entry?.status === 'completed' && entry?.version === TOUR_PROGRESS_VERSION;
}

function localKey(uid) {
  return `ssmi-admin-tour-progress:${uid || 'anonymous'}`;
}

function readLocalProgress(uid) {
  try {
    return JSON.parse(window.localStorage.getItem(localKey(uid)) || '{}');
  } catch {
    return {};
  }
}

function writeLocalProgress(uid, progress) {
  try {
    window.localStorage.setItem(localKey(uid), JSON.stringify(progress));
  } catch {
    // Local progress is a fallback only.
  }
}

function findTargetRect(targetId) {
  if (!targetId) return null;
  const node = document.querySelector(`[data-tour-id="${targetId}"]`);
  if (!node) return null;
  const rect = node.getBoundingClientRect();
  if (!rect.width && !rect.height) return null;
  return rect;
}

function TourOverlay({ tour, step, index, total, rect, onNext, onClose }) {
  const boxStyle = rect
    ? {
        top: Math.min(window.innerHeight - 220, Math.max(16, rect.bottom + 16)),
        left: Math.min(window.innerWidth - 380, Math.max(16, rect.left)),
      }
    : {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      };

  const highlightStyle = rect
    ? {
        top: rect.top - 6,
        left: rect.left - 6,
        width: rect.width + 12,
        height: rect.height + 12,
      }
    : null;

  return (
    <div className="fixed inset-0 z-[10000]">
      {!highlightStyle ? <div className="absolute inset-0 bg-black/70" /> : null}
      {highlightStyle ? (
        <div
          className="pointer-events-none absolute rounded-[1.6rem] border-2 border-brand-gold shadow-[0_0_0_9999px_rgba(0,0,0,0.58),0_0_42px_rgba(219,255,84,0.35)]"
          style={highlightStyle}
        />
      ) : null}
      <section
        className="absolute w-[min(22rem,calc(100vw-2rem))] rounded-[1.5rem] border border-brand-gold/30 bg-slate-950 p-5 text-white shadow-[0_28px_90px_rgba(0,0,0,0.72)]"
        style={boxStyle}
      >
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">{tour.title}</p>
        <h2 className="mt-3 text-xl font-semibold">{step.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{step.body}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-500">Step {index + 1} of {total}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:border-brand-gold hover:text-white"
            >
              Later
            </button>
            <button
              type="button"
              onClick={onNext}
              className="rounded-full bg-brand-gold px-4 py-2 text-xs font-bold text-slate-950 transition hover:brightness-110"
            >
              {index + 1 === total ? 'Complete tour' : 'Next'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function TourProvider({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const [activeTourKey, setActiveTourKey] = useState('');
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const embeddedPreviewRef = useRef(typeof window !== 'undefined' && window.self !== window.top);
  const startedForPathRef = useRef('');

  useEffect(() => {
    let active = true;

    async function loadProgress() {
      const uid = user?.uid;
      const localProgress = readLocalProgress(uid);
      if (active) setProgress(localProgress);

      if (!uid) return;

      try {
        const snapshot = await getDocs(collection(firestore, 'users', uid, 'tourProgress'));
        const nextProgress = { ...localProgress };
        snapshot.docs.forEach((progressDoc) => {
          nextProgress[progressDoc.id] = progressDoc.data();
        });
        if (active) {
          setProgress(nextProgress);
          writeLocalProgress(uid, nextProgress);
        }
      } catch {
        // Firestore progress is best effort. Local progress keeps the UI usable.
      }
    }

    loadProgress();
    return () => {
      active = false;
    };
  }, [user?.uid]);

  const activeTour = activeTourKey ? tourDefinitions[activeTourKey] : null;
  const activeStep = activeTour?.steps?.[stepIndex] || null;

  const completeTour = useCallback(async (sectionKey) => {
    if (!sectionKey) return;
    const nextEntry = {
      sectionKey,
      status: 'completed',
      completedSteps: tourDefinitions[sectionKey]?.steps?.length || 0,
      version: TOUR_PROGRESS_VERSION,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const nextProgress = { ...progress, [sectionKey]: nextEntry };
    setProgress(nextProgress);
    writeLocalProgress(user?.uid, nextProgress);

    if (user?.uid) {
      try {
        await setDoc(doc(firestore, 'users', user.uid, 'tourProgress', sectionKey), {
          ...nextEntry,
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch {
        // Keep local completion if Firestore rules do not allow this write yet.
      }
    }
  }, [progress, user?.uid]);

  const startTour = useCallback((sectionKey, { navigateToRoute = false, force = true } = {}) => {
    const tour = tourDefinitions[sectionKey];
    if (!tour) return;
    if (!force && isCurrentCompletion(progress[sectionKey])) return;
    if (navigateToRoute && tour.route && location.pathname !== tour.route) {
      navigate(tour.route);
    }
    setActiveTourKey(sectionKey);
    setStepIndex(0);
  }, [location.pathname, navigate, progress]);

  const closeTour = useCallback(() => {
    setActiveTourKey('');
    setStepIndex(0);
    setTargetRect(null);
  }, []);

  const nextStep = useCallback(async () => {
    if (!activeTour || !activeTourKey) return;
    if (stepIndex + 1 >= activeTour.steps.length) {
      await completeTour(activeTourKey);
      closeTour();
      return;
    }
    setStepIndex((current) => current + 1);
  }, [activeTour, activeTourKey, closeTour, completeTour, stepIndex]);

  useEffect(() => {
    if (embeddedPreviewRef.current) return;
    if (location.pathname.startsWith('/help')) return;
    const sectionKey = sectionKeyFromPath(location.pathname);
    if (!sectionKey || !tourDefinitions[sectionKey]) return;
    if (isCurrentCompletion(progress[sectionKey])) return;
    const runKey = `${location.pathname}:${sectionKey}`;
    if (startedForPathRef.current === runKey) return;
    startedForPathRef.current = runKey;
    window.setTimeout(() => startTour(sectionKey, { force: false }), 500);
  }, [location.pathname, progress, startTour]);

  useEffect(() => {
    function handleRequestedTour(event) {
      const sectionKey = event.detail?.sectionKey;
      if (sectionKey) startTour(sectionKey, { force: false });
    }

    window.addEventListener('admin-tour:start', handleRequestedTour);
    return () => window.removeEventListener('admin-tour:start', handleRequestedTour);
  }, [startTour]);

  useEffect(() => {
    if (!activeStep) {
      setTargetRect(null);
      return undefined;
    }

    let raf = 0;
    const updateRect = () => {
      setTargetRect(findTargetRect(activeStep.target));
    };

    raf = window.requestAnimationFrame(updateRect);
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
  }, [activeStep]);

  const value = useMemo(() => ({
    progress,
    startTour,
    completeTour,
    completedCount: Object.values(progress).filter(isCurrentCompletion).length,
    totalTours: Object.keys(tourDefinitions).length,
  }), [completeTour, progress, startTour]);

  return (
    <TourContext.Provider value={value}>
      {children}
      {!embeddedPreviewRef.current && activeTour && activeStep ? (
        <TourOverlay
          tour={activeTour}
          step={activeStep}
          index={stepIndex}
          total={activeTour.steps.length}
          rect={targetRect}
          onNext={nextStep}
          onClose={closeTour}
        />
      ) : null}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    return {
      progress: {},
      startTour: () => {},
      completeTour: () => {},
      completedCount: 0,
      totalTours: Object.keys(tourDefinitions).length,
    };
  }
  return context;
}
