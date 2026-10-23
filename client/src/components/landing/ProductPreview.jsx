import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CalendarCheck, Clock, ArrowUpRight, ChevronRight } from 'lucide-react';

export default function ProductPreview() {
  const [activeTab, setActiveTab] = useState('attendance');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
      {/* Editorial Header Callout */}
      <div className="flex flex-col items-center text-center gap-6 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-[#173D32]/80 mb-2 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#173D32]" />
            Unified Workforce Intelligence
          </p>
          <h3 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl text-[#102820] leading-tight max-w-2xl">
            StaffSync matches every team member to clear records,
            <span className="text-[#7E8980]"> resolves leave queues smoothly, and delivers live attendance insights.</span>
          </h3>
        </div>

        <div className="flex justify-center gap-2">
          <div className="inline-flex p-1 bg-[#102820]/5 rounded-xl border border-[#173D32]/10 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('attendance')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'attendance'
                  ? 'bg-[#173D32] text-[#EAE9DF] shadow-sm'
                  : 'text-[#34443A] hover:text-[#173D32]'
              }`}
            >
              Attendance Pulse
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('leaves')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'leaves'
                  ? 'bg-[#173D32] text-[#EAE9DF] shadow-sm'
                  : 'text-[#34443A] hover:text-[#173D32]'
              }`}
            >
              Leave Queue
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('growth')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'growth'
                  ? 'bg-[#173D32] text-[#EAE9DF] shadow-sm'
                  : 'text-[#34443A] hover:text-[#173D32]'
              }`}
            >
              Skills &amp; Training
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-[#102820] text-[#EAE9DF] rounded-2xl p-5 border border-[#34443A]/60 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#7E8980] font-semibold flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#C7F36B]" />
                Active Headcount
              </div>
              <div className="text-2xl font-serif-display font-medium text-white mt-1">
                142 <span className="text-sm font-sans text-[#7E8980]">team members</span>
              </div>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#173D32] text-[#C7F36B] border border-[#34785B]/40">
              ▲ 8.4% YoY
            </span>
          </div>

          <div className="space-y-2.5 my-2">
            <div className="flex items-center justify-between text-xs border-b border-[#34443A]/40 pb-2">
              <span className="text-[#D7D8CE]">On-Duty Today</span>
              <span className="font-semibold text-white">134 (94.3%)</span>
            </div>
            <div className="flex items-center justify-between text-xs border-b border-[#34443A]/40 pb-2">
              <span className="text-[#D7D8CE]">Approved Leave</span>
              <span className="text-[#D8C29A] font-medium">6 team members</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#D7D8CE]">New Hires (This Month)</span>
              <span className="text-[#C7F36B] font-medium">+4 onboarding</span>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-[#34443A]/50 flex items-center justify-between text-xs">
            <span className="text-[#7E8980]">6 Global Departments</span>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-[#C7F36B] hover:text-white font-medium transition-colors"
            >
              Directory <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-[#102820] text-[#EAE9DF] rounded-2xl p-5 border border-[#34443A]/60 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#7E8980] font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D8C29A]" />
                Daily Punctuality
              </div>
              <div className="text-2xl font-serif-display font-medium text-white mt-1">
                98.1% <span className="text-sm font-sans text-[#7E8980]">compliance</span>
              </div>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#34785B]/30 text-[#C7F36B] border border-[#34785B]/50">
              Optimal
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-end gap-1.5 h-16 w-full pt-2">
              {[88, 94, 96, 92, 98, 97, 99].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    className="w-full bg-[#173D32] group-hover:bg-[#C7F36B] rounded-t transition-all duration-300"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-[#7E8980]">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-[#34443A]/50 flex items-center justify-between text-xs">
            <span className="text-[#7E8980]">Avg shift: 8.2 hrs</span>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-[#D8C29A] hover:text-white font-medium transition-colors"
            >
              Roster <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-[#102820] text-[#EAE9DF] rounded-2xl p-5 border border-[#34443A]/60 shadow-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#7E8980] font-semibold flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-[#C7F36B]" />
                Leave Approvals
              </div>
              <div className="text-2xl font-serif-display font-medium text-white mt-1">
                2 Pending <span className="text-sm font-sans text-[#7E8980]">requests</span>
              </div>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#B7791F]/20 text-[#D8C29A] border border-[#B7791F]/40">
              Needs Review
            </span>
          </div>

          <div className="space-y-2 my-1">
            <div className="p-2.5 rounded-xl bg-[#173D32]/50 border border-[#34443A]/40 flex items-center justify-between text-xs">
              <div>
                <p className="font-medium text-white">Elena Rostova</p>
                <p className="text-[11px] text-[#7E8980]">Annual Leave • 5 Days (Nov 10-14)</p>
              </div>
              <span className="text-[10px] bg-[#B7791F]/30 text-[#D8C29A] px-2 py-0.5 rounded font-medium">
                Pending
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#173D32]/50 border border-[#34443A]/40 flex items-center justify-between text-xs">
              <div>
                <p className="font-medium text-white">Aisha Morales</p>
                <p className="text-[11px] text-[#7E8980]">Casual Leave • 1 Day (Oct 30)</p>
              </div>
              <span className="text-[10px] bg-[#B7791F]/30 text-[#D8C29A] px-2 py-0.5 rounded font-medium">
                Pending
              </span>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-[#34443A]/50 flex items-center justify-between text-xs">
            <span className="text-[#7E8980]">1-Click Manager Decision</span>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-[#C7F36B] hover:text-white font-medium transition-colors"
            >
              Review Desk <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
