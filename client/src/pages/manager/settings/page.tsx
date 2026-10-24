
import React, { useState } from 'react';
import { Settings, Bell, Mail, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

export default function ManagerSettingsPage() {
  const [notifyOnLeave, setNotifyOnLeave] = useState(true);
  const [notifyOnLate, setNotifyOnLate] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout activeRole="manager" pageTitle="Manager Preferences">
      <div className="max-w-2xl">
        <div className="mb-6">
          <h2 className="font-serif-display text-2xl text-[#102820]">Desk Preferences</h2>
          <p className="text-xs text-[#7E8980]">
            Customize approval notifications and team report summaries
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
            Notification Alerts
          </h3>

          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-[#102820] block">Team Leave Requests</span>
                <span className="text-[#7E8980]">Receive immediate alerts when direct reports submit time-off</span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnLeave}
                onChange={(e) => setNotifyOnLeave(e.target.checked)}
                className="w-4 h-4 rounded text-[#173D32]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-[#102820] block">Punctuality Flags</span>
                <span className="text-[#7E8980]">Notify when a team member logs in late with a note</span>
              </div>
              <input
                type="checkbox"
                checked={notifyOnLate}
                onChange={(e) => setNotifyOnLate(e.target.checked)}
                className="w-4 h-4 rounded text-[#173D32]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-[#102820] block">Weekly Sprint Digest</span>
                <span className="text-[#7E8980]">Consolidated Monday briefing of upcoming team absences</span>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
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
