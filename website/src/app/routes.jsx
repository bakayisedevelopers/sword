import React, { useEffect } from 'react';
import { createBrowserRouter, Outlet, useLocation } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell.jsx';
import { PageContainer } from '../components/layout/PageContainer.jsx';
import { LocationsPage } from '../pages/LocationsPage.jsx';
import { BranchTemplatePage } from '../pages/BranchTemplatePage.jsx';
import { BranchGivePage } from '../pages/BranchGivePage.jsx';
import { BeyondTithePage } from '../pages/BeyondTithePage.jsx';
import { WatchPage } from '../pages/WatchPage.jsx';
import { MinistriesPage } from '../pages/MinistriesPage.jsx';
import { MinistryPage } from '../pages/MinistryPage.jsx';
import { EventsPage } from '../pages/EventsPage.jsx';
import { EventPage } from '../pages/EventPage.jsx';
import { PrayerPage } from '../pages/PrayerPage.jsx';
import { CounselingPage } from '../pages/CounselingPage.jsx';
import { WelfarePage } from '../pages/WelfarePage.jsx';
import { RegisterPage } from '../pages/RegisterPage.jsx';
import { BeAPartnerPage } from '../pages/BeAPartnerPage.jsx';
import { BaptismPage } from '../pages/BaptismPage.jsx';
import { ContactUsPage } from '../pages/ContactUsPage.jsx';
import { HomePage } from '../pages/HomePage.jsx';

// Phase 9 Imports
import { AboutUsPage } from '../pages/AboutUsPage.jsx';
import { CarePage } from '../pages/CarePage.jsx';
import { GivePage } from '../pages/GivePage.jsx';
import { PartnerPage } from '../pages/PartnerPage.jsx';
import { SchoolOfMinistryPage } from '../pages/SchoolOfMinistryPage.jsx';
import { SuperKidsPage } from '../pages/SuperKidsPage.jsx';
import { YouthPage } from '../pages/YouthPage.jsx';
import { PrivacyPolicyPage } from '../pages/PrivacyPolicyPage.jsx';
import { EResourcesCenterPage } from '../pages/EResourcesCenterPage.jsx';
import { CouplesPage } from '../pages/CouplesPage.jsx';
import { ForMenPage } from '../pages/ForMenPage.jsx';
import { ForWomenPage } from '../pages/ForWomenPage.jsx';
import { FellowshipPage } from '../pages/FellowshipPage.jsx';
import { FollowJesusPage } from '../pages/FollowJesusPage.jsx';
import { PodcastsPage } from '../pages/PodcastsPage.jsx';
import { CampYoloPage } from '../pages/CampYoloPage.jsx';
import { FireConferencePage } from '../pages/FireConferencePage.jsx';
import { SupermanConferencePage } from '../pages/SupermanConferencePage.jsx';
import { YoungAdultsPage } from '../pages/YoungAdultsPage.jsx';
import { SinglesPage } from '../pages/SinglesPage.jsx';
import { YouthTemplatePage } from '../pages/YouthTemplatePage.jsx';
import { SocialsPage } from '../pages/SocialsPage.jsx';

/**
 * Placeholder component for routes before individual page migrations are executed.
 * Renders within the shared PageShell so layout, routing, and navigation work immediately.
 */
function RoutePlaceholder({ title, description, phase }) {
  return (
    <PageShell>
      <PageContainer className="py-16">
        <div className="bg-white rounded-[30px] p-8 md:p-12 shadow-sm border border-slate-100 text-center max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-ff-alternate bg-ff-alternate/10 rounded-full mb-4">
            {phase ? `Scheduled: ${phase}` : 'Migration Scaffold'}
          </span>
          <h1 className="text-3xl font-bold text-ff-secondary mb-3">{title}</h1>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {description ||
              'This route is configured in the React router infrastructure. Full visual and behavioral page migration will occur according to MIGRATION_PLAN.md.'}
          </p>
        </div>
      </PageContainer>
    </PageShell>
  );
}

function NotFoundPlaceholder() {
  return (
    <PageShell>
      <PageContainer className="py-20 text-center">
        <h1 className="text-4xl font-bold text-ff-secondary mb-2">404 - Page Not Found</h1>
        <p className="text-slate-600 text-sm">The requested route does not exist.</p>
      </PageContainer>
    </PageShell>
  );
}

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search]);

  return null;
}

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

/**
 * Route table mapped from flutter-website/lib/flutter_flow/nav/nav.dart using
 * the migration plan's approved kebab-case React route convention.
 */
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      // Core routes
      { path: '/', element: <HomePage /> },
  { path: '/home', element: <HomePage /> },
  { path: '/about-us', element: <AboutUsPage /> },
  { path: '/locations', element: <LocationsPage /> },
  { path: '/watch', element: <WatchPage /> },
  { path: '/care', element: <CarePage /> },
  { path: '/prayer', element: <PrayerPage /> },
  { path: '/counseling', element: <CounselingPage /> },
  { path: '/ministries', element: <MinistriesPage /> },
  { path: '/ministry', element: <MinistryPage /> },
  { path: '/partner', element: <PartnerPage /> },
  { path: '/be-a-partner', element: <BeAPartnerPage /> },
  { path: '/give', element: <GivePage /> },
  { path: '/branch-give', element: <BranchGivePage /> },
  { path: '/beyond-tithe', element: <BeyondTithePage /> },
  { path: '/events', element: <EventsPage /> },
  { path: '/event', element: <EventPage /> },
  { path: '/school-of-ministry', element: <SchoolOfMinistryPage /> },
  { path: '/super-kids', element: <SuperKidsPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/youth', element: <YouthPage /> },
  { path: '/baptism', element: <BaptismPage /> },
  { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
  { path: '/welfare', element: <WelfarePage /> },
  { path: '/e-resources-center', element: <EResourcesCenterPage /> },
  { path: '/couples', element: <CouplesPage /> },
  { path: '/for-men', element: <ForMenPage /> },
  { path: '/for-women', element: <ForWomenPage /> },
  { path: '/fellowship', element: <FellowshipPage /> },
  { path: '/follow-jesus', element: <FollowJesusPage /> },
  { path: '/podcasts', element: <PodcastsPage /> },
  { path: '/camp-yolo', element: <CampYoloPage /> },
  { path: '/fire-conference', element: <FireConferencePage /> },
  { path: '/superman-conference', element: <SupermanConferencePage /> },
  { path: '/contact-us', element: <ContactUsPage /> },
  { path: '/young-adults', element: <YoungAdultsPage /> },
  { path: '/singles', element: <SinglesPage /> },
  { path: '/youth-template', element: <YouthTemplatePage /> },
  { path: '/socials', element: <SocialsPage /> },

  // Legacy Branch routes
  { path: '/legacy/emalahleni', element: <BranchTemplatePage /> },
  { path: '/legacy/ludzeludze', element: <BranchTemplatePage /> },
  { path: '/legacy/hlutsi', element: <BranchTemplatePage /> },
  { path: '/legacy/lagos', element: <BranchTemplatePage /> },
  { path: '/legacy/siteki', element: <BranchTemplatePage /> },
  { path: '/legacy/orange-farm', element: <BranchTemplatePage /> },
  { path: '/legacy/boksburg', element: <BranchTemplatePage /> },
  { path: '/legacy/online', element: <BranchTemplatePage /> },
  { path: '/legacy/mbabane', element: <BranchTemplatePage /> },

  // Dynamic Branch Route
  { path: '/:branchSlug', element: <BranchTemplatePage /> },

  // 404 Fallback
  { path: '*', element: <NotFoundPlaceholder /> },
    ],
  },
]);
