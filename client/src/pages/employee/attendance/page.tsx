import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, Clock3 } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ApiClient } from '../../../services/apiClient.js';
import { AttendanceRecord } from '../../../lib/types';

export default function EmployeeAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const meRes = await ApiClient.getMe();
      const cur = meRes?.user || meRes;
      setCurrentUser(cur);

      const userId = cur._id || cur.id;
      const empId = cur.employeeId;

      const res = await ApiClient.getAttendance();
      const all: any[] = res?.attendance || res?.data || [];

      const myRecords = all.filter(
        (a) => a.employeeId === userId || a.employeeId === empId || a.employeeName === cur.name
      );
      setAttendance(myRecords);

      const today = new Date().toISOString().split('T')[0];
      const todayRec = myRecords.find((a) => a.date === today);
      if (todayRec && todayRec.checkInTime && !todayRec.checkOutTime) {
        setIsClockedIn(true);
      } else {
        setIsClockedIn(false);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleClock = async () => {
    if (!currentUser) return;
    const empId = currentUser._id || currentUser.id || currentUser.employeeId;

    try {
      if (!isClockedIn) {
        await ApiClient.clockIn({
          employeeId: empId,
          employeeName: currentUser.name,
          department: currentUser.department || 'General',
        });
        setIsClockedIn(true);
        setFeedbackMsg('Clocked in for today. Have a productive workday!');
      } else {
        await ApiClient.clockOut({
          employeeId: empId,
        });
        setIsClockedIn(false);
        setFeedbackMsg('Clocked out successfully. Enjoy your evening!');
      }
      await loadData();
    } catch (err) {
      console.error('Clock error:', err);
    }
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  return (
    <DashboardLayout activeRole="employee" pageTitle="My Attendance & Shift Telemetry">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-display text-2xl text-[#102820]">Attendance &amp; Presence Log</h2>
          <p className="text-xs text-[#7E8980]">
            Review your daily punctuality timestamps and cumulative shift hours
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleClock}
          className={`px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm transition-all self-start sm:self-auto ${
            isClockedIn
              ? 'bg-[#34785B] text-white hover:bg-[#286047]'
              : 'bg-[#173D32] text-[#EAE9DF] hover:bg-[#102820]'
          }`}
        >
          <Clock3 className="w-4 h-4 text-[#C7F36B]" />
          <span>{isClockedIn ? 'Clock Out for Today' : 'Clock In for Today'}</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="mb-6 p-3 rounded-xl bg-[#34785B]/15 border border-[#34785B]/30 text-xs text-[#34785B] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Attendance Log Table */}
      <div className="bg-white rounded-3xl border border-[#E6EBE5] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F8F5] border-b border-[#E6EBE5] text-[#7E8980] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-6">Work Date</th>
              <th className="py-3.5 px-6">Check-In</th>
              <th className="py-3.5 px-6">Check-Out</th>
              <th className="py-3.5 px-6">Total Shift Hours</th>
              <th className="py-3.5 px-6">Work Notes</th>
              <th className="py-3.5 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6EBE5]">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-[#7E8980]">
                  Loading your attendance records from database...
                </td>
              </tr>
            ) : attendance.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-[#7E8980]">
                  No attendance records found. Click &quot;Clock In for Today&quot; to log your shift.
                </td>
              </tr>
            ) : (
              attendance.map((rec: any) => (
                <tr key={rec._id || rec.id} className="hover:bg-[#F7F8F5]/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#102820]">{rec.date}</td>
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-[#102820]">
                    {rec.checkInTime || '—'}
                  </td>
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-[#102820]">
                    {rec.checkOutTime || '—'}
                  </td>
                  <td className="py-4 px-6 text-[#102820]">
                    {rec.totalHours ? `${rec.totalHours} hrs` : 'In progress'}
                  </td>
                  <td className="py-4 px-6 text-[#7E8980]">{rec.notes || 'Standard shift'}</td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        rec.status === 'Present'
                          ? 'bg-[#34785B]/15 text-[#34785B]'
                          : rec.status === 'Late'
                          ? 'bg-[#B7791F]/15 text-[#B7791F]'
                          : 'bg-[#173D32]/10 text-[#173D32]'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
