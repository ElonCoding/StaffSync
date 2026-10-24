
import React, { useState, useEffect } from 'react';
import {
  Megaphone,
  Plus,
  Pin,
  Trash2,
  Calendar,
  Users,
  Search,
  CheckCircle2,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { MockService } from '../../../lib/mockService';
import { Announcement } from '../../../lib/types';
import CreateAnnouncementModal from '../../../components/modals/CreateAnnouncementModal';

export default function HrAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    setAnnouncements(MockService.getAnnouncements());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staffsync_storage_update', loadData);
    return () => window.removeEventListener('staffsync_storage_update', loadData);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this announcement?')) {
      MockService.deleteAnnouncement(id);
      loadData();
    }
  };

  const filtered = announcements.filter((a) => {
    const matchesPriority = filterPriority === 'All' || a.priority === filterPriority;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query) ||
      a.authorName.toLowerCase().includes(query);
    return matchesPriority && matchesSearch;
  });

  return (
    <DashboardLayout activeRole="hr" pageTitle="Company Announcements">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-display text-2xl text-[#102820]">Internal Bulletins</h2>
          <p className="text-xs text-[#7E8980]">
            Broadcast official company policies, holiday notices, and culture updates
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820] shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C7F36B]" />
          <span>Publish New Bulletin</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6EBE5] shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-[#7E8980]">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E6EBE5] text-xs bg-white outline-none focus:border-[#173D32]"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Normal">Normal</option>
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#7E8980] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bulletins..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
          />
        </div>
      </div>

      {/* Announcements List Grid */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#E6EBE5] text-xs text-[#7E8980]">
            No announcements match the selected criteria.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-3xl border transition-all ${
                item.pinned
                  ? 'bg-white border-[#173D32]/30 shadow-sm ring-1 ring-[#173D32]/10'
                  : 'bg-white border-[#E6EBE5] shadow-xs'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  {item.pinned && (
                    <span className="p-1 rounded-md bg-[#173D32]/10 text-[#173D32]" title="Pinned bulletin">
                      <Pin className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      item.priority === 'High'
                        ? 'bg-[#C24141]/15 text-[#C24141]'
                        : item.priority === 'Medium'
                        ? 'bg-[#B7791F]/15 text-[#B7791F]'
                        : 'bg-[#173D32]/10 text-[#173D32]'
                    }`}
                  >
                    {item.priority} Priority
                  </span>
                  <span className="text-xs text-[#7E8980] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Audience: {item.audience}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#7E8980] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {item.publishedAt}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-[#7E8980] hover:text-[#C24141] hover:bg-[#C24141]/10 transition-colors"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-serif-display text-xl text-[#102820] mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-[#34443A] leading-relaxed mb-4 whitespace-pre-line">
                {item.content}
              </p>

              <div className="pt-3 border-t border-[#E6EBE5] text-[11px] text-[#7E8980] flex items-center justify-between">
                <span>
                  Author: <strong className="text-[#102820]">{item.authorName}</strong> ({item.authorRole})
                </span>
                <span className="text-[#173D32] font-semibold">Active Bulletin</span>
              </div>
            </div>
          ))
        )}
      </div>

      <CreateAnnouncementModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => loadData()}
      />
    </DashboardLayout>
  );
}
