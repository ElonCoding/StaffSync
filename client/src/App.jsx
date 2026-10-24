import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/landing/Header.jsx';
import Hero from './components/landing/Hero.jsx';
import FeatureGrid from './components/landing/FeatureGrid.jsx';
import RoleWorkflow from './components/landing/RoleWorkflow.jsx';
import BenefitsSection from './components/landing/BenefitsSection.jsx';
import FaqSection from './components/landing/FaqSection.jsx';
import Footer from './components/landing/Footer.jsx';
import AddEmployeeModal from './components/modals/AddEmployeeModal.jsx';
import ApplyLeaveModal from './components/modals/ApplyLeaveModal.jsx';

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
        <Route
          path="/"
          element={
            <LandingPage
              onOpenAddEmployee={() => setIsAddEmployeeOpen(true)}
              onOpenApplyLeave={() => setIsApplyLeaveOpen(true)}
            />
          }
        />
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
