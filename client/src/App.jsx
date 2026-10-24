import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public Experience
import Header from './components/landing/Header.jsx';
import Hero from './components/landing/Hero.jsx';
import FeatureGrid from './components/landing/FeatureGrid.jsx';
import RoleWorkflow from './components/landing/RoleWorkflow.jsx';
import BenefitsSection from './components/landing/BenefitsSection.jsx';
import FaqSection from './components/landing/FaqSection.jsx';
import Footer from './components/landing/Footer.jsx';
import LoginPage from './pages/login/page';
import SignupPage from './pages/signup/page';
import ForgotPasswordPage from './pages/forgot-password/page';

// Modals
import AddEmployeeModal from './components/modals/AddEmployeeModal';
import ApplyLeaveModal from './components/modals/ApplyLeaveModal';

// HR Experience
import HrDashboardPage from './pages/hr/dashboard/page';
import HrEmployeesPage from './pages/hr/employees/page';
import HrLeavesPage from './pages/hr/leaves/page';
import HrAttendancePage from './pages/hr/attendance/page';
import HrAnnouncementsPage from './pages/hr/announcements/page';
import HrTrainingPage from './pages/hr/training/page';
import HrReportsPage from './pages/hr/reports/page';
import HrSettingsPage from './pages/hr/settings/page';

// Manager Experience
import ManagerDashboardPage from './pages/manager/dashboard/page';
import ManagerTeamPage from './pages/manager/team/page';
import ManagerLeavesPage from './pages/manager/leaves/page';
import ManagerAttendancePage from './pages/manager/attendance/page';
import ManagerTrainingPage from './pages/manager/training/page';
import ManagerAnnouncementsPage from './pages/manager/announcements/page';
import ManagerNotificationsPage from './pages/manager/notifications/page';
import ManagerSettingsPage from './pages/manager/settings/page';

// Employee Experience
import EmployeeDashboardPage from './pages/employee/dashboard/page';
import EmployeeProfilePage from './pages/employee/profile/page';
import EmployeeLeavesPage from './pages/employee/leaves/page';
import EmployeeAttendancePage from './pages/employee/attendance/page';
import EmployeeTrainingPage from './pages/employee/training/page';
import EmployeeAnnouncementsPage from './pages/employee/announcements/page';
import EmployeeNotificationsPage from './pages/employee/notifications/page';
import EmployeeSettingsPage from './pages/employee/settings/page';

function LandingPage({ onOpenAddEmployee, onOpenApplyLeave }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#EAE9DF] text-[#102820]">
      <Header />
      <main className="flex-1">
        <Hero />
        <section id="features">
          <FeatureGrid />
        </section>
        <section id="workflow">
          <RoleWorkflow />
        </section>
        <section id="benefits">
          <BenefitsSection />
        </section>
        <section id="faq">
          <FaqSection />
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <LandingPage
              onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
              onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
            />
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* HR Experience */}
        <Route path="/hr/dashboard" element={<HrDashboardPage />} />
        <Route path="/hr/employees" element={<HrEmployeesPage />} />
        <Route path="/hr/leaves" element={<HrLeavesPage />} />
        <Route path="/hr/attendance" element={<HrAttendancePage />} />
        <Route path="/hr/announcements" element={<HrAnnouncementsPage />} />
        <Route path="/hr/training" element={<HrTrainingPage />} />
        <Route path="/hr/reports" element={<HrReportsPage />} />
        <Route path="/hr/settings" element={<HrSettingsPage />} />

        {/* Manager Experience */}
        <Route path="/manager/dashboard" element={<ManagerDashboardPage />} />
        <Route path="/manager/team" element={<ManagerTeamPage />} />
        <Route path="/manager/leaves" element={<ManagerLeavesPage />} />
        <Route path="/manager/attendance" element={<ManagerAttendancePage />} />
        <Route path="/manager/training" element={<ManagerTrainingPage />} />
        <Route path="/manager/announcements" element={<ManagerAnnouncementsPage />} />
        <Route path="/manager/notifications" element={<ManagerNotificationsPage />} />
        <Route path="/manager/settings" element={<ManagerSettingsPage />} />

        {/* Employee Experience */}
        <Route path="/employee/dashboard" element={<EmployeeDashboardPage />} />
        <Route path="/employee/profile" element={<EmployeeProfilePage />} />
        <Route path="/employee/leaves" element={<EmployeeLeavesPage />} />
        <Route path="/employee/attendance" element={<EmployeeAttendancePage />} />
        <Route path="/employee/training" element={<EmployeeTrainingPage />} />
        <Route path="/employee/announcements" element={<EmployeeAnnouncementsPage />} />
        <Route path="/employee/notifications" element={<EmployeeNotificationsPage />} />
        <Route path="/employee/settings" element={<EmployeeSettingsPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AddEmployeeModal
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
        onSuccess={() => setIsAddEmployeeOpen(false)}
      />

      <ApplyLeaveModal
        isOpen={isApplyLeaveOpen}
        onClose={() => setIsApplyLeaveOpen(false)}
        onSuccess={() => setIsApplyLeaveOpen(false)}
      />
    </BrowserRouter>
  );
}
