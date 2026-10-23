import React from 'react';
import { Database, ShieldCheck, Zap, Layers, RefreshCw, FileText } from 'lucide-react';

export default function BenefitsSection() {
  const benefits = [
    {
      icon: Database,
      title: 'Centralized Employee Information',
      desc: 'Eliminate duplicate spreadsheets and outdated contact lists with a unified, authoritative directory.',
    },
    {
      icon: Zap,
      title: 'Organized Leave Workflows',
      desc: 'Sub-second digital leave applications with clear status tracking and reason-coded approvals.',
    },
    {
      icon: Layers,
      title: 'Accurate Attendance Visibility',
      desc: 'Immediate awareness of who is on-site, working remotely, late, or away without invasive spyware.',
    },
    {
      icon: RefreshCw,
      title: 'Clear Internal Communications',
      desc: 'Broadcast high-priority bulletins directly to target departments or company-wide with zero noise.',
    },
    {
      icon: ShieldCheck,
      title: 'Coordinated Training Programs',
      desc: 'Empower managers to assign learning curricula and monitor individual employee completion paths.',
    },
    {
      icon: FileText,
      title: 'Executive Workforce Reporting',
      desc: 'Instantly export attendance and leave distribution summaries for administrative and payroll analysis.',
    },
  ];

  return (
    <section id="benefits" className="py-24 bg-[#F7F8F5] border-t border-[#E6EBE5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold text-[#173D32] mb-3">
            Operational Value
          </p>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl text-[#102820] leading-tight">
            Designed for teams that value calm efficiency over administrative chaos.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="p-8 rounded-2xl bg-white border border-[#E6EBE5] shadow-sm hover:border-[#173D32]/30 transition-all flex flex-col justify-start"
              >
                <div className="w-10 h-10 rounded-xl bg-[#173D32]/5 text-[#173D32] flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif-display text-xl text-[#102820] mb-2">{b.title}</h3>
                <p className="text-sm text-[#7E8980] leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
