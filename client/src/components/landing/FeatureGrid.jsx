import React from 'react';
import {
  Users,
  CalendarCheck2,
  Clock3,
  GraduationCap,
  Megaphone,
  BarChart3,
  CheckCircle,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeatureGrid() {
  const features = [
    {
      id: 'employees',
      icon: Users,
      title: 'Employee Directory & Profiles',
      tagline: 'Single source of truth for all workforce records.',
      description:
        'Complete profiles with contact details, department mappings, assigned reporting leads, joining dates, and granular employment lifecycle states.',
      highlights: ['Instant name & ID search', 'Department segmentation', 'Document & contact history'],
      accent: '#173D32',
    },
    {
      id: 'leaves',
      icon: CalendarCheck2,
      title: 'Leave & Time-Off Management',
      tagline: 'Frictionless applications with 1-click approvals.',
      description:
        'Structured leave categories (Annual, Casual, Sick, Parental), live auto-calculated duration, manager review desk, and automatic balance deduction.',
      highlights: ['Multi-tier approval hierarchy', 'Reason-coded audit trail', 'Dynamic balance deduction'],
      accent: '#34785B',
    },
    {
      id: 'attendance',
      icon: Clock3,
      title: 'Attendance Telemetry & Logs',
      tagline: 'Daily presence tracking without invasive surveillance.',
      description:
        'Accurate daily check-in and check-out logs, late-arrival notifications, shift hours computation, and monthly attendance rosters.',
      highlights: ['One-touch employee check-in', 'Punctuality status alerts', 'Exportable attendance sheets'],
      accent: '#B7791F',
    },
    {
      id: 'training',
      icon: GraduationCap,
      title: 'Training & Skill Development',
      tagline: 'Upskill your teams with structured learning programs.',
      description:
        'Organize training curricula, assign employees and cohorts, monitor individual module completion percentages, and issue verified milestones.',
      highlights: ['Curriculum tracking', 'Cohort enrollment', 'Completion certificates'],
      accent: '#173D32',
    },
    {
      id: 'announcements',
      icon: Megaphone,
      title: 'Company Communications',
      tagline: 'Cut through email clutter with prioritized bulletins.',
      description:
        'Publish company-wide town halls, urgent policy updates, and team highlights with priority tagging (High, Medium, Normal) and target audiences.',
      highlights: ['Priority bulletin badges', 'Audience targeting', 'Dedicated notifications'],
      accent: '#C7F36B',
    },
    {
      id: 'reports',
      icon: BarChart3,
      title: 'Workforce Reports & Analytics',
      tagline: 'Executive clarity across department health.',
      description:
        'Actionable intelligence on attendance rates, leave frequency trends, headcount growth, and department distribution for informed planning.',
      highlights: ['Attendance trends', 'Leave patterns', 'Department capacity breakdown'],
      accent: '#D8C29A',
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#F7F8F5] border-t border-[#E6EBE5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#173D32] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#173D32]" />
            Complete Feature Architecture
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-[#102820] leading-tight">
            Six pillars engineered for clarity, accuracy, and operational dignity.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#7E8980]">
            StaffSync replaces disparate spreadsheets and clunky legacy software with a cohesive,
            role-aware HR operating system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="bg-white rounded-2xl p-7 border border-[#E6EBE5] shadow-sm hover:shadow-md hover:border-[#173D32]/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#173D32]/5 group-hover:bg-[#173D32] text-[#173D32] group-hover:text-[#EAE9DF] transition-colors flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-display text-xl sm:text-2xl text-[#102820] mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7E8980] mb-3">
                    {feat.tagline}
                  </p>
                  <p className="text-sm text-[#34443A] leading-relaxed mb-6">
                    {feat.description}
                  </p>
                </div>

                <div>
                  <div className="space-y-2 border-t border-[#E6EBE5] pt-4 mb-4">
                    {feat.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-[#34443A]">
                        <CheckCircle className="w-3.5 h-3.5 text-[#34785B] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#173D32] hover:text-[#102820] group-hover:underline pt-2"
                  >
                    <span>View in Live Demo</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
