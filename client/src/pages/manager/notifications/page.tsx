
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, CalendarCheck, Clock, Megaphone, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { MockService } from '../../../lib/mockService';
import { NotificationItem } from '../../../lib/types';

export default function ManagerNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const loadData = () => {
    setNotifications(MockService.getNotifications());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staffsync_storage_update', loadData);
    return () => window.removeEventListener('staffsync_storage_update', loadData);
  }, []);

  const handleMarkAll = () => {
    MockService.markAllNotificationsRead();
    loadData();
  };

  const handleMarkSingle = (id: string) => {
    MockService.markNotificationRead(id);
    loadData();
  };

  return (
    <DashboardLayout activeRole="manager" pageTitle="Manager Notifications">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-display text-2xl text-[#102820]">Notification Center</h2>
          <p className="text-xs text-[#7E8980]">
            Review leave alerts, daily check-in anomalies, and team curriculum updates
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
        {notifications.length === 0 ? (
          <p className="text-center py-12 text-xs text-[#7E8980]">No notifications</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
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
                  onClick={() => handleMarkSingle(item.id)}
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
