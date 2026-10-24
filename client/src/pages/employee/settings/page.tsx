
import React, { useState } from 'react';
import { Settings, Bell, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

export default function EmployeeSettingsPage() {
  const [notifyOnLeaveDecision, setNotifyOnLeaveDecision] = useState(true);
  const [notifyOnAnnouncement, setNotifyOnAnnouncement] = useState(true);
  const [notifyOnTraining, setNotifyOnTraining] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout activeRole="employee" pageTitle="My Account Preferences">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="font-serif-display text-2xl text-[#102820]">Account Preferences</h2>
          <p className="text-xs text-[#7E8980]">
            Customize notification channels and workspace alerts
          </p>
        </div>

        {saved && (
          <div className="mb-4 p-3 rounded-xl bg-[#34785B]/15 border border-[#34785B]/30 text-xs text-[#34785B] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Preferences saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6EBE5] shadow-xs space-y-5 text-xs">
          <h3 className="font-serif-display text-base text-[#102820] pb-3 border-b border-[#E6EBE5]">
            Notification Settings
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-[#102820] block">Leave Request Decisions</span>
                <span className="text-[#7E8980]">Notify me immediately when a manager approves or rejects my leave</span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnLeaveDecision}
                onChange={(e) => setNotifyOnLeaveDecision(e.target.checked)}
                className="w-4 h-4 rounded text-[#173D32]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-[#102820] block">Company Announcements</span>
                <span className="text-[#7E8980]">Alert me when high-priority bulletins or town hall notes are posted</span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnAnnouncement}
                onChange={(e) => setNotifyOnAnnouncement(e.target.checked)}
                className="w-4 h-4 rounded text-[#173D32]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-[#102820] block">Course Assignments & Reminders</span>
                <span className="text-[#7E8980]">Remind me when new skill tracks are assigned by leadership</span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnTraining}
                onChange={(e) => setNotifyOnTraining(e.target.checked)}
                className="w-4 h-4 rounded text-[#173D32]"
              />
            </label>
          </div>

          <div className="pt-4 border-t border-[#E6EBE5] flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820]"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
