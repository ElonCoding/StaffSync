import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What is StaffSync and what problems does it solve?',
      a: 'StaffSync is a modern Human Resource Management System (HRMS) built to centralize employee records, automate digital leave approvals, track daily attendance, coordinate training curricula, and provide executive workforce reports in one unified, calm workspace.',
    },
    {
      q: 'Which roles are supported in StaffSync?',
      a: 'StaffSync natively supports three distinct operational roles: HR Administrators (full workforce directory and policy governance), Team Managers (direct report approvals and team attendance monitoring), and Employees (self-service profile management, leave applications, and clock-in logs).',
    },
    {
      q: 'How does the leave application and review workflow operate?',
      a: 'Employees select their leave category (Annual, Sick, Casual, Parental, or Unpaid), enter date ranges, and submit reasons. The request appears on the manager and HR approval desks, where reviewers can approve with one click or reject with mandatory explanatory feedback. Approved leaves automatically deduct from the employee’s balance.',
    },
    {
      q: 'Does StaffSync require invasive GPS or biometric tracking?',
      a: 'No. StaffSync is designed around operational trust and accurate logging. Employees record their check-ins and check-outs via a dignified self-service interface, recording timestamps, punctuality status, and optional notes without invasive device tracking.',
    },
    {
      q: 'Can managers assign training courses to their teams?',
      a: 'Yes. Managers and HR personnel can create structured learning programs with specific module counts, assign individual employees or departments, and track completion percentages as employees mark off modules.',
    },
    {
      q: 'How does this frontend integrate with our production backend?',
      a: 'The frontend is engineered with an explicit API client service in `src/services/apiClient.js` with structured REST endpoints. It supports real Node.js/Express and MongoDB connections with intelligent mock fallback if the database server is booting or offline.',
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#EAE9DF] text-[#102820] border-t border-[#173D32]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#173D32] mb-3 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#173D32]" />
            Frequently Asked Questions
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl text-[#102820]">
            Everything you need to know about StaffSync.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#173D32]/15 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 font-semibold text-[#102820] text-base sm:text-lg hover:text-[#173D32] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#7E8980] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#173D32]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm sm:text-base text-[#34443A] leading-relaxed border-t border-[#E6EBE5] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
