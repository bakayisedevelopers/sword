import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import RequireAdmin from './auth/RequireAdmin';
import AdminHeader from './components/layout/AdminHeader';
import AdminSidebar from './components/layout/AdminSidebar';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import SectionPage from './pages/SectionPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import CmsWorkspacePage from './pages/CmsWorkspacePage';
import BranchWorkspacePage from './pages/BranchWorkspacePage';
import PartnersWorkspacePage from './pages/PartnersWorkspacePage';
import PartnerDetailPage from './pages/PartnerDetailPage';
import MinistrySignUpsWorkspacePage from './pages/MinistrySignUpsWorkspacePage';
import MinistrySignUpDetailPage from './pages/MinistrySignUpDetailPage';
import RegistrationsWorkspacePage from './pages/RegistrationsWorkspacePage';
import RegistrationDetailPage from './pages/RegistrationDetailPage';
import RequestsWorkspacePage from './pages/RequestsWorkspacePage';
import RequestDetailPage from './pages/RequestDetailPage';
import EventsWorkspacePage from './pages/EventsWorkspacePage';
import EventDetailPage from './pages/EventDetailPage';
import MinistriesWorkspacePage from './pages/MinistriesWorkspacePage';
import MinistryDetailPage from './pages/MinistryDetailPage';
import SermonsWorkspacePage from './pages/SermonsWorkspacePage';
import SermonDetailPage from './pages/SermonDetailPage';
import WebsiteContentPage from './pages/WebsiteContentPage';
import UsersAccessPage from './pages/UsersAccessPage';
import UsersDetailPage from './pages/UsersDetailPage';
import UserAccessRequestDetailPage from './pages/UserAccessRequestDetailPage';
import WorkspaceSectionPage from './pages/WorkspaceSectionPage';
import ProfilePage from './pages/ProfilePage';
import SignInPage from './pages/SignInPage';
import { adminRouteEntries } from './routes/adminRoutes';

function AdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
      <div className="mx-auto grid w-full max-w-7xl gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[18rem_1fr] lg:items-start">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-h-0 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:pr-1 lg:[scrollbar-width:none] lg:[-ms-overflow-style:none] lg:[&::-webkit-scrollbar]:hidden">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/workspace" element={<CmsWorkspacePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cms" element={<CmsWorkspacePage />} />
            <Route path="/workspace/ministries/:ministryId" element={<MinistryDetailPage />} />
            <Route path="/workspace/requests/:requestId" element={<RequestDetailPage />} />
            <Route path="/workspace/events/:eventId" element={<EventDetailPage />} />
            <Route path="/workspace/registrations/:registrationId" element={<RegistrationDetailPage />} />
            <Route path="/workspace/sign-ups/:signUpId" element={<MinistrySignUpDetailPage />} />
            <Route path="/workspace/partners/:partnerId" element={<PartnerDetailPage />} />
            <Route path="/workspace/sermons/:sourceType/:mediaId" element={<SermonDetailPage />} />
            <Route path="/workspace/users/requests/:requestId" element={<UserAccessRequestDetailPage />} />
            <Route path="/workspace/users/:userId" element={<UsersDetailPage />} />
            {adminRouteEntries.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.kind === 'workspace'
              ? (route.section.key === 'branches'
                    ? <BranchWorkspacePage section={route.section} />
                    : route.section.key === 'requests'
                      ? <RequestsWorkspacePage section={route.section} />
                    : route.section.key === 'partners'
                      ? <PartnersWorkspacePage section={route.section} />
                    : route.section.key === 'registrations'
                      ? <RegistrationsWorkspacePage section={route.section} />
                    : route.section.key === 'sign-ups'
                      ? <MinistrySignUpsWorkspacePage section={route.section} />
                    : route.section.key === 'events'
                      ? <EventsWorkspacePage section={route.section} />
                    : route.section.key === 'ministries'
                      ? <MinistriesWorkspacePage section={route.section} />
                    : route.section.key === 'sermons'
                      ? <SermonsWorkspacePage section={route.section} />
                    : route.section.key === 'website-content'
                      ? <WebsiteContentPage section={route.section} />
                    : route.section.key === 'users'
                      ? <UsersAccessPage section={route.section} />
                    : <WorkspaceSectionPage section={route.section} />)
                  : <SectionPage section={route.section} />}
              />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="*" element={<RequireAdmin><AdminShell /></RequireAdmin>} />
    </Routes>
  );
}
