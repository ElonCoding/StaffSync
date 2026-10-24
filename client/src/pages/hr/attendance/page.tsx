
import React, { useState, useEffect } from 'react';
import {
  Clock,
  Search,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  UserX,
  FileSpreadsheet,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { MockService } from '../../../lib/mockService';
import { AttendanceRecord, AttendanceStatus } from '../../../lib/types';

export default function HrAttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState('2026-10-23');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  const loadData = () => {
    setAttendance(MockService.getAttendance());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staffsync_storage_update', loadData);
    return () => window.removeEventListener('staffsync_storage_update', loadData);
  }, []);

  const handleStatusChange = (id: string, newStatus: AttendanceStatus) => {
    MockService.updateAttendanceStatus(id, newStatus, 'Manually adjusted by HR Admin');
    loadData();
    setToastMessage(`Updated attendance record to ${newStatus}`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleExportCsv = () => {
    // Generate CSV string from filtered attendance
    const headers = ['ID', 'Employee', 'Department', 'Date', 'Status', 'CheckIn', 'CheckOut', 'Hours', 'Notes'];
    const rows = filteredRecords.map((r) => [
      r.id,
      r.employeeName,
      r.department,
      r.date,
      r.status,
      r.checkInTime || 'N/A',
      r.checkOutTime || 'N/A',
      r.totalHours || 0,
      `"${r.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StaffSync_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage('Exported attendance roster to CSV.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredRecords = attendance.filter((rec) => {
    const matchesDate = !selectedDate || rec.date === selectedDate;
    const matchesSearch =
      rec.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    const matchesDept = deptFilter === 'All' || rec.department === deptFilter;
    return matchesDate && matchesSearch && matchesStatus && matchesDept;
  });

  const presentCount = filteredRecords.filter((r) => r.status === 'Present').length;
  const lateCount = filteredRecords.filter((r) => r.status === 'Late').length;
  const onLeaveCount = filteredRecords.filter((r) => r.status === 'On Leave').length;
  const absentCount = filteredRecords.filter((r) => r.status === 'Absent').length;

  return (
    <DashboardLayout activeRole="hr" pageTitle="Daily Attendance Log">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="mb-4 p-3 rounded-xl bg-[#34785B]/15 border border-[#34785B]/30 text-xs text-[#34785B] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-display text-2xl text-[#102820]">Attendance Telemetry</h2>
          <p className="text-xs text-[#7E8980]">
            Review presence timestamps, punctuality rates, and shift completion logs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 rounded-xl bg-white border border-[#E6EBE5] text-xs font-semibold text-[#102820] hover:bg-[#F7F8F5] shadow-xs flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-[#173D32]" />
            <span>Export Roster (CSV)</span>
          </button>
        </div>
      </div>

      {/* Micro Status Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-2xl bg-white border border-[#E6EBE5] shadow-xs">
          <span className="text-[10px] text-[#7E8980] font-semibold uppercase block">Present</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-serif-display text-2xl font-bold text-[#34785B]">{presentCount}</span>
            <span className="text-xs text-[#7E8980]">on-duty</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#E6EBE5] shadow-xs">
          <span className="text-[10px] text-[#7E8980] font-semibold uppercase block">Late Logged</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-serif-display text-2xl font-bold text-[#B7791F]">{lateCount}</span>
            <span className="text-xs text-[#7E8980]">tardy</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#E6EBE5] shadow-xs">
          <span className="text-[10px] text-[#7E8980] font-semibold uppercase block">Approved Leave</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-serif-display text-2xl font-bold text-[#173D32]">{onLeaveCount}</span>
            <span className="text-xs text-[#7E8980]">away</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-[#E6EBE5] shadow-xs">
          <span className="text-[10px] text-[#7E8980] font-semibold uppercase block">Unexcused Absent</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="font-serif-display text-2xl font-bold text-[#C24141]">{absentCount}</span>
            <span className="text-xs text-[#7E8980]">pending review</span>
          </div>
        </div>
      </div>

      {/* Filter and Date Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6EBE5] shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Date Picker */}
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="w-4 h-4 text-[#7E8980]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E6EBE5] text-xs bg-white outline-none focus:border-[#173D32]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E6EBE5] text-xs bg-white outline-none focus:border-[#173D32]"
          >
            <option value="All">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Late">Late</option>
            <option value="On Leave">On Leave</option>
            <option value="Absent">Absent</option>
          </select>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E6EBE5] text-xs bg-white outline-none focus:border-[#173D32]"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Product & Design">Product & Design</option>
            <option value="People Operations">People Operations</option>
            <option value="Marketing">Marketing</option>
            <option value="Finance & Legal">Finance & Legal</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#7E8980] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search employee..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-3xl border border-[#E6EBE5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F5] border-b border-[#E6EBE5] text-[#7E8980] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">Employee & Unit</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Check-In</th>
                <th className="py-3.5 px-6">Check-Out</th>
                <th className="py-3.5 px-6">Total Hours</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Adjust Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBE5]">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#7E8980]">
                    No attendance records for the selected date and filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#F7F8F5]/60 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-[#102820] text-sm">{rec.employeeName}</p>
                      <p className="text-[11px] text-[#7E8980]">{rec.department}</p>
                    </td>

                    <td className="py-4 px-6 text-[#7E8980]">{rec.date}</td>

                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-semibold text-[#102820]">
                        {rec.checkInTime || '—'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-semibold text-[#102820]">
                        {rec.checkOutTime || '—'}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-semibold text-[#102820]">
                        {rec.totalHours ? `${rec.totalHours} hrs` : 'In progress'}
                      </span>
                      {rec.notes && <p className="text-[10px] text-[#7E8980] mt-0.5">{rec.notes}</p>}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          rec.status === 'Present'
                            ? 'bg-[#34785B]/15 text-[#34785B]'
                            : rec.status === 'Late'
                            ? 'bg-[#B7791F]/15 text-[#B7791F]'
                            : rec.status === 'On Leave'
                            ? 'bg-[#173D32]/10 text-[#173D32]'
                            : 'bg-[#C24141]/15 text-[#C24141]'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <select
                        value={rec.status}
                        onChange={(e) => handleStatusChange(rec.id, e.target.value as AttendanceStatus)}
                        className="px-2 py-1 rounded-lg border border-[#E6EBE5] text-[11px] bg-white font-medium outline-none focus:border-[#173D32]"
                      >
                        <option value="Present">Present</option>
                        <option value="Late">Late</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Absent">Absent</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
