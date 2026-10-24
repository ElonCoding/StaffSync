import React, { useState, useEffect } from 'react';
import { Megaphone, Pin, Calendar, Users } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ApiClient } from '../../../services/apiClient.js';
import { Announcement } from '../../../lib/types';

export default function EmployeeAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await ApiClient.getAnnouncements();
        const list = res?.data || res?.announcements || [];
        setAnnouncements(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Failed to load announcements:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  return (
    <DashboardLayout activeRole="employee" pageTitle="Company Bulletin Board">
      <div className="mb-6">
        <h2 className="font-serif-display text-2xl text-[#102820]">Company News &amp; Bulletins</h2>
        <p className="text-xs text-[#7E8980]">
          Town hall notices, company recharge days, and leadership updates
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E6EBE5] text-xs text-[#7E8980]">
            Loading bulletins...
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E6EBE5] text-xs text-[#7E8980]">
            No announcements published yet.
          </div>
        ) : (
          announcements.map((item) => (
            <div
              key={(item as any)._id || item.id}
              className={`p-6 rounded-3xl border transition-all ${
                item.pinned
                  ? 'bg-white border-[#173D32]/30 shadow-sm ring-1 ring-[#173D32]/10'
                  : 'bg-white border-[#E6EBE5] shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {item.pinned && (
                    <span className="p-1 rounded-md bg-[#173D32]/10 text-[#173D32]">
                      <Pin className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      item.priority === 'High'
                        ? 'bg-[#C24141]/15 text-[#C24141]'
                        : 'bg-[#173D32]/10 text-[#173D32]'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                  <span className="text-xs text-[#7E8980]">Audience: {item.audience}</span>
                </div>
                <span className="text-xs text-[#7E8980] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {item.publishedAt}
                </span>
              </div>

              <h3 className="font-serif-display text-xl text-[#102820] mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-[#34443A] leading-relaxed mb-4 whitespace-pre-line">
                {item.content}
              </p>

              <div className="pt-3 border-t border-[#E6EBE5] text-[11px] text-[#7E8980]">
                Author: {item.authorName} ({item.authorRole})
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
