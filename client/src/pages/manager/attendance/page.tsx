
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, Clock3 } from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { MockService } from '../../../lib/mockService';
import { AttendanceRecord } from '../../../lib/types';

export default function ManagerAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState('2026-10-23');

  useEffect(() => {
    const todayAll = MockService.getAttendance(selectedDate);
    const teamAtt = todayAll.filter(
      (a) => a.department === 'Engineering' || a.department === 'Product & Design'
    );
    setAttendance(teamAtt);
  }, [selectedDate]);

  return (
    <DashboardLayout activeRole="manager" pageTitle="Team Attendance Telemetry">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-display text-2xl text-[#102820]">Engineering & Design Presence</h2>
          <p className="text-xs text-[#7E8980]">
            Monitor daily check-ins, remote hours, and shift consistency
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-white px-3 py-1.5 rounded-xl border border-[#E6EBE5]">
          <Calendar className="w-4 h-4 text-[#7E8980]" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="outline-none text-xs bg-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E6EBE5] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#F7F8F5] border-b border-[#E6EBE5] text-[#7E8980] uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3.5 px-6">Team Member</th>
              <th className="py-3.5 px-6">Department</th>
              <th className="py-3.5 px-6">Check-In</th>
              <th className="py-3.5 px-6">Check-Out</th>
              <th className="py-3.5 px-6">Hours</th>
              <th className="py-3.5 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E6EBE5]">
            {attendance.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-[#7E8980]">
                  No team attendance logged for this date.
                </td>
              </tr>
            ) : (
              attendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#F7F8F5]/60 transition-colors">
                  <td className="py-4 px-6 font-bold text-[#102820] text-sm">{rec.employeeName}</td>
                  <td className="py-4 px-6 text-[#7E8980]">{rec.department}</td>
                  <td className="py-4 px-6 font-mono font-semibold text-[#102820]">
                    {rec.checkInTime || '—'}
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-[#102820]">
                    {rec.checkOutTime || '—'}
                  </td>
                  <td className="py-4 px-6 text-[#102820]">
                    {rec.totalHours ? `${rec.totalHours} hrs` : 'In progress'}
                  </td>
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
