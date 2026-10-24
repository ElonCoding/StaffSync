import React, { useState } from 'react';
import {
  Settings,
  Building,
  Calendar,
  Shield,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

export default function HrSettingsPage() {
  const [orgName, setOrgName] = useState('StaffSync Enterprise HR');
  const [hqLocation, setHqLocation] = useState('San Francisco, CA');
  const [standardHours, setStandardHours] = useState('8.0');
  const [annualLeaveQuota, setAnnualLeaveQuota] = useState('20');
  const [sickLeaveQuota, setSickLeaveQuota] = useState('10');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <DashboardLayout activeRole="hr" pageTitle="HR System & Policy Settings">
      <div className="max-w-4xl">
        <div className="mb-6">
          <h2 className="font-serif-display text-2xl text-[#102820]">Organization Policies &amp; Settings</h2>
          <p className="text-xs text-[#7E8980]">
            Configure workplace hours, leave balances, and organizational defaults
          </p>
        </div>

        {savedNotice && (
          <div className="mb-6 p-3 rounded-xl bg-[#34785B]/15 border border-[#34785B]/30 text-xs text-[#34785B] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Policy configurations updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Company Profile */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6EBE5] shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E6EBE5] mb-5">
              <Building className="w-5 h-5 text-[#173D32]" />
              <h3 className="font-serif-display text-lg text-[#102820]">Organization Identity</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#102820] mb-1">Company Name</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] outline-none focus:border-[#173D32]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102820] mb-1">Headquarters</label>
                <input
                  type="text"
                  value={hqLocation}
                  onChange={(e) => setHqLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] outline-none focus:border-[#173D32]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Attendance & Leave Policies */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6EBE5] shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#E6EBE5] mb-5">
              <Calendar className="w-5 h-5 text-[#173D32]" />
              <h3 className="font-serif-display text-lg text-[#102820]">Leave Quotas &amp; Workday Norms</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[#102820] mb-1">
                  Annual Leave Days / Year
                </label>
                <input
                  type="number"
                  value={annualLeaveQuota}
                  onChange={(e) => setAnnualLeaveQuota(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] outline-none focus:border-[#173D32]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102820] mb-1">
                  Sick Leave Days / Year
                </label>
                <input
                  type="number"
                  value={sickLeaveQuota}
                  onChange={(e) => setSickLeaveQuota(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] outline-none focus:border-[#173D32]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#102820] mb-1">
                  Daily Standard Shift (Hours)
                </label>
                <input
                  type="text"
                  value={standardHours}
                  onChange={(e) => setStandardHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] outline-none focus:border-[#173D32]"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820] shadow-sm"
            >
              Save Policy Changes
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
