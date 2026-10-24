import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#102820] text-[#EAE9DF] pt-16 pb-12 border-t border-[#34443A]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#173D32] rounded-3xl p-8 sm:p-12 mb-16 border border-[#34785B]/40 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="font-serif-display text-3xl sm:text-4xl text-white mb-2">
              Experience the synchronized workforce.
            </h3>
            <p className="text-sm sm:text-base text-[#D7D8CE]">
              Streamline employee directories, attendance telemetry, leave requests, and workforce analytics in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl bg-[#C7F36B] text-[#102820] font-semibold text-sm hover:bg-white transition-all shadow-md flex items-center gap-2 group"
            >
              <span>Sign In to Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#173D32] flex items-center justify-center text-[#EAE9DF]">
                <svg
                  className="w-4 h-4 text-[#C7F36B]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 12a4 4 0 0 1 8 0" />
                  <path d="M12 8v8" />
                </svg>
              </div>
              <span className="font-serif-display text-xl font-bold tracking-tight text-white">
                StaffSync
              </span>
            </div>
            <p className="text-xs text-[#7E8980] leading-relaxed">
              Premium human resource management system uniting people directories, leave approvals,
              attendance tracking, and team learning.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#D8C29A] mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#D7D8CE]">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Employee Directory
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Leave Approvals
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Attendance Telemetry
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Training & Upskilling
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Workforce Reports
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#D8C29A] mb-3">
              Role Workspaces
            </h4>
            <ul className="space-y-2 text-xs text-[#D7D8CE]">
              <li>
                <Link to="/hr/dashboard" className="hover:text-white transition-colors">
                  HR Administrator View
                </Link>
              </li>
              <li>
                <Link to="/manager/dashboard" className="hover:text-white transition-colors">
                  Team Manager View
                </Link>
              </li>
              <li>
                <Link to="/employee/dashboard" className="hover:text-white transition-colors">
                  Employee Self-Service
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Switch Demo Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-[#D8C29A] mb-3">
              Architecture
            </h4>
            <p className="text-xs text-[#7E8980] leading-relaxed mb-3">
              Engineered with full MVC backend in <code className="text-[#C7F36B]">server/</code> and React+Vite in <code className="text-[#C7F36B]">client/</code>.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#173D32] text-[10px] text-[#C7F36B] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34785B]" />
              StaffSync Full-Stack v2.0
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#34443A]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7E8980]">
          <p>© {new Date().getFullYear()} StaffSync HRMS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#D7D8CE] cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#D7D8CE] cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#D7D8CE] cursor-pointer">Security Overview</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
