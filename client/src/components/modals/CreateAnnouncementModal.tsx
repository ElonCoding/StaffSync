
import React, { useState } from 'react';
import { X, Megaphone, CheckCircle2 } from 'lucide-react';
import { Announcement, AnnouncementPriority } from '../../lib/types';
import { ApiClient } from '../../services/apiClient.js';

interface CreateAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newAnnouncement: Announcement) => void;
  authorName?: string;
  authorRole?: string;
}

export default function CreateAnnouncementModal({
  isOpen,
  onClose,
  onSuccess,
  authorName,
  authorRole,
}: CreateAnnouncementModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<AnnouncementPriority>('Normal');
  const [audience, setAudience] = useState('All Employees');
  const [pinned, setPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setError('');
    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      content: content.trim(),
      authorName: authorName || 'Leadership',
      authorRole: authorRole || 'Management',
      priority,
      audience,
      pinned,
    };

    try {
      const res = await ApiClient.createAnnouncement(payload);
      const newAnc = res?.announcement || res?.data || res;
      setIsSubmitting(false);
      onSuccess(newAnc);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.data?.message || err?.message || 'Failed to publish announcement.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6EBE5] shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#173D32] text-[#EAE9DF] flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-[#C7F36B]" />
            </div>
            <div>
              <h3 className="font-serif-display text-xl text-[#102820]">Publish Announcement</h3>
              <p className="text-xs text-[#7E8980]">Broadcast updates across the organization</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7E8980] hover:text-[#102820] hover:bg-[#F7F8F5]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#102820] mb-1">Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 Town Hall and Synchronized Recharge Days"
              className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as AnnouncementPriority)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32] bg-white"
              >
                <option value="Normal">Normal</option>
                <option value="Medium">Medium</option>
                <option value="High">High Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Target Audience</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32] bg-white"
              >
                <option value="All Employees">All Employees</option>
                <option value="Engineering & Product">Engineering &amp; Product</option>
                <option value="People Operations">People Operations</option>
                <option value="Leadership">Leadership Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102820] mb-1">Announcement Body</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write the full announcement message..."
              className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pinnedCheck"
              checked={pinned}
              onChange={(e) => setPinned(e.target.checked)}
              className="w-4 h-4 rounded text-[#173D32] focus:ring-[#173D32] border-[#E6EBE5]"
            />
            <label htmlFor="pinnedCheck" className="text-xs text-[#34443A] cursor-pointer">
              Pin this bulletin to the top of the board
            </label>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E6EBE5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E6EBE5] text-xs font-semibold text-[#7E8980] hover:bg-[#F7F8F5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820] shadow-sm flex items-center gap-1.5 disabled:opacity-60"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>{isSubmitting ? 'Publishing…' : 'Publish Bulletin'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
