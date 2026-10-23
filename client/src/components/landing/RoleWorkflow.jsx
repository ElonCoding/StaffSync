import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, User, ArrowRight } from 'lucide-react';

export default function RoleWorkflow() {
  const [activeRole, setActiveRole] = useState('hr');

  const roleDetails = {
    hr: {
      title: 'Human Resources Administration',
      badge: 'Full Operational Control',
      summary:
        'HR leaders maintain workforce compliance, add new hires, audit attendance records, manage company-wide leave balances, and broadcast essential bulletins.',
      steps: [
        {
          num: '01',
          head: 'Centralize Staff Records',
          desc: 'Provision employees across departments, assign managers, and maintain updated contact cards.',
        },
        {
          num: '02',
          head: 'Policy & Leave Governance',
          desc: 'Establish leave rules, audit pending approvals, and resolve exception requests with notes.',
        },
        {
          num: '03',
          head: 'Workforce Reporting',
          desc: 'Generate executive attendance reports, track absenteeism, and verify headcount growth.',
        },
      ],
      demoAccount: {
        role: 'hr',
        name: 'Sarah Jenkins',
        email: 'hr@staffsync.demo',
        destination: '/hr/dashboard',
      },
    },
    manager: {
      title: 'Department & Team Leadership',
      badge: 'Team Supervision & Development',
      summary:
        'Managers gain immediate visibility into their direct team members, approve or reject leave requests in one click, and assign targeted skill development courses.',
      steps: [
        {
          num: '01',
          head: 'Daily Team Attendance',
          desc: 'Quickly inspect who is on-site, remote, or away to plan sprint schedules and meetings.',
        },
        {
          num: '02',
          head: '1-Click Leave Approvals',
          desc: 'Review team time-off requests with transparent context and optional rejection guidance.',
        },
        {
          num: '03',
          head: 'Training Assignments',
          desc: 'Assign learning tracks to direct reports and monitor completion percentages.',
        },
      ],
      demoAccount: {
        role: 'manager',
        name: 'Marcus Vance',
        email: 'manager@staffsync.demo',
        destination: '/manager/dashboard',
      },
    },
    employee: {
      title: 'Individual Team Member',
      badge: 'Self-Service Autonomy',
      summary:
        'Employees enjoy a clean personal portal to clock in with ease, check available leave days, submit requests in seconds, and stay informed on company announcements.',
      steps: [
        {
          num: '01',
          head: 'One-Touch Check-in',
          desc: 'Log daily start and end times with instant status feedback and punctuality logs.',
        },
        {
          num: '02',
          head: 'Leave Applications',
          desc: 'Pick leave dates, view remaining balances, and receive instant status notifications upon review.',
        },
        {
          num: '03',
          head: 'Skill Advancement',
          desc: 'Access assigned training courses, track module progress, and mark completed milestones.',
        },
      ],
      demoAccount: {
        role: 'employee',
        name: 'Elena Rostova',
        email: 'employee@staffsync.demo',
        destination: '/employee/dashboard',
      },
    },
  };

  const current = roleDetails[activeRole];

  return (
    <section id="workflow" className="py-24 bg-[#EAE9DF] text-[#102820] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#173D32] mb-3">
            Role-Aware Architecture
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-[#102820] leading-tight">
            How StaffSync coordinates your organization.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#34443A]">
            Every role receives a dedicated interface tailored to their exact responsibilities and
            permissions.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 bg-white/70 rounded-2xl border border-[#173D32]/15 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveRole('hr')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeRole === 'hr'
                  ? 'bg-[#173D32] text-[#EAE9DF] shadow-md'
                  : 'text-[#34443A] hover:text-[#173D32]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-[#C7F36B]" />
              <span>HR Administrator</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('manager')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeRole === 'manager'
                  ? 'bg-[#173D32] text-[#EAE9DF] shadow-md'
                  : 'text-[#34443A] hover:text-[#173D32]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#D8C29A]" />
              <span>Team Manager</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveRole('employee')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeRole === 'employee'
                  ? 'bg-[#173D32] text-[#EAE9DF] shadow-md'
                  : 'text-[#34443A] hover:text-[#173D32]'
              }`}
            >
              <User className="w-4 h-4 text-[#7E8980]" />
              <span>Employee Portal</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E6EBE5] shadow-lg max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6EBE5] pb-6 mb-8">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#173D32]/10 text-[#173D32] uppercase tracking-wider">
                {current.badge}
              </span>
              <h3 className="font-serif-display text-2xl sm:text-3xl text-[#102820] mt-2">
                {current.title}
              </h3>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#173D32] text-[#EAE9DF] text-sm font-medium hover:bg-[#102820] shadow-sm transition-all"
            >
              <span>Test {current.demoAccount.name}&apos;s View</span>
              <ArrowRight className="w-4 h-4 text-[#C7F36B]" />
            </Link>
          </div>

          <p className="text-base text-[#34443A] leading-relaxed mb-10 max-w-3xl">
            {current.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {current.steps.map((st, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#F7F8F5] border border-[#E6EBE5]">
                <span className="font-serif-display text-2xl font-bold text-[#173D32]/40 block mb-2">
                  {st.num}
                </span>
                <h4 className="font-semibold text-base text-[#102820] mb-2">{st.head}</h4>
                <p className="text-xs sm:text-sm text-[#7E8980] leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
