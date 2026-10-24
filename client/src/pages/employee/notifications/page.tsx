import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ApiClient } from '../../../services/apiClient.js';
import { NotificationItem } from '../../../lib/types';

export default function EmployeeNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await ApiClient.getNotifications();
      const list = res?.notifications || res?.data || [];
      setNotifications(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAll = async () => {
    try {
      await ApiClient.markAllNotificationsRead();
      await loadData();
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const handleMarkSingle = async (id: string) => {
    try {
      await ApiClient.markNotificationRead(id);
      await loadData();
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  return (
    <DashboardLayout activeRole="employee" pageTitle="My Notifications & Alerts">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-display text-2xl text-[#102820]">Notification Center</h2>
          <p className="text-xs text-[#7E8980]">
            Track leave review outcomes, curriculum milestones, and bulletin alerts
          </p>
        </div>

        <button
          type="button"
          onClick={handleMarkAll}
          className="px-4 py-2 rounded-xl bg-white border border-[#E6EBE5] text-xs font-semibold text-[#173D32] hover:bg-[#F7F8F5] transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E6EBE5] shadow-xs p-6 divide-y divide-[#E6EBE5]">
        {loading ? (
          <p className="text-center py-12 text-xs text-[#7E8980]">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-center py-12 text-xs text-[#7E8980]">No notifications</p>
        ) : (
          notifications.map((item) => (
            <div
              key={(item as any)._id || item.id}
              className={`py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4 ${
                !item.read ? 'bg-[#EAE9DF]/30 -mx-6 px-6 rounded-xl' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    item.type === 'leave'
                      ? 'bg-[#B7791F]/10 text-[#B7791F]'
                      : item.type === 'attendance'
                      ? 'bg-[#34785B]/10 text-[#34785B]'
                      : 'bg-[#173D32]/10 text-[#173D32]'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#102820]">{item.title}</h4>
                  <p className="text-xs text-[#34443A] mt-0.5">{item.message}</p>
                  <span className="text-[10px] text-[#7E8980] block mt-1">{item.timestamp}</span>
                </div>
              </div>

              {!item.read && (
                <button
                  type="button"
                  onClick={() => handleMarkSingle((item as any)._id || item.id)}
                  className="px-2.5 py-1 rounded-lg border border-[#E6EBE5] text-[11px] text-[#173D32] hover:bg-white font-medium shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
