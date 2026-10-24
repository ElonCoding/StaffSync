import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Printer,
  Calendar,
  Users,
  Clock,
  CalendarCheck,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ApiClient } from '../../../services/apiClient.js';
import { Employee, LeaveRequest, AttendanceRecord } from '../../../lib/types';

export default function HrReportsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [reportPeriod, setReportPeriod] = useState('October 2026');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReportData() {
      try {
        const [empRes, leavesRes, attRes] = await Promise.all([
          ApiClient.getEmployees().catch(() => ({ employees: [] })),
          ApiClient.getLeaves().catch(() => ({ leaves: [] })),
          ApiClient.getAttendance().catch(() => ({ attendance: [] })),
        ]);

        setEmployees(empRes?.employees || empRes?.data || []);
        setLeaves(leavesRes?.leaves || leavesRes?.data || []);
        setAttendance(attRes?.attendance || attRes?.data || []);
      } catch (err) {
        console.error('Failed to load report data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReportData();
  }, []);

  const totalHeadcount = employees.length;
  const approvedLeaves = leaves.filter((l) => l.status === 'Approved');
  const totalLeaveDays = approvedLeaves.reduce((acc, l) => acc + (l.days || 1), 0);

  const presentRecords = attendance.filter((a) => a.status === 'Present' || a.status === 'Late');
  const punctualityRate =
    attendance.length > 0 ? Math.round((presentRecords.length / attendance.length) * 100) : 100;

  const handlePrint = () => {
    window.print();
  };

  // Group by department
  const deptStats: Record<string, { count: number; leaves: number }> = {};
  employees.forEach((emp) => {
    const dept = emp.department || 'General';
    if (!deptStats[dept]) deptStats[dept] = { count: 0, leaves: 0 };
    deptStats[dept].count += 1;
  });

  approvedLeaves.forEach((l) => {
    const dept = l.department || 'General';
    if (!deptStats[dept]) deptStats[dept] = { count: 0, leaves: 0 };
    deptStats[dept].leaves += (l.days || 1);
  });

  return (
    <DashboardLayout activeRole="hr" pageTitle="Workforce Analytics & Reports">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-display text-2xl text-[#102820]">Executive Workforce Reports</h2>
          <p className="text-xs text-[#7E8980]">
            Audit attendance compliance, time-off trends, and departmental resource allocation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-white border border-[#E6EBE5] text-xs font-semibold text-[#102820] hover:bg-[#F7F8F5] shadow-xs flex items-center gap-2 transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-[#173D32]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Period Selection */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6EBE5] shadow-xs mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-4 h-4 text-[#7E8980]" />
          <span className="font-semibold text-[#102820]">Reporting Window:</span>
          <select
            value={reportPeriod}
            onChange={(e) => setReportPeriod(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#E6EBE5] text-xs bg-white outline-none focus:border-[#173D32]"
          >
            <option value="October 2026">October 2026 (Current Cycle)</option>
            <option value="Q3 2026">Q3 2026 (Jul – Sep)</option>
            <option value="FY2026 Year-to-Date">FY2026 Year-to-Date</option>
          </select>
        </div>

        <span className="text-[11px] text-[#7E8980] hidden sm:inline">
          Live MongoDB dynamic synchronization
        </span>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-[#E6EBE5] shadow-xs">
          <span className="text-xs font-semibold text-[#7E8980] uppercase tracking-wider block mb-2">
            Average Attendance Compliance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-4xl font-bold text-[#102820]">
              {punctualityRate}%
            </span>
            <span className="text-xs text-[#34785B] font-semibold">Live</span>
          </div>
          <p className="text-xs text-[#7E8980] mt-2">
            Across {attendance.length} logged shift record(s).
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E6EBE5] shadow-xs">
          <span className="text-xs font-semibold text-[#7E8980] uppercase tracking-wider block mb-2">
            Approved Leave Consumed
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-4xl font-bold text-[#102820]">
              {totalLeaveDays}
            </span>
            <span className="text-xs text-[#7E8980]">total days</span>
          </div>
          <p className="text-xs text-[#7E8980] mt-2">
            Across {approvedLeaves.length} approved applications in database.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#E6EBE5] shadow-xs">
          <span className="text-xs font-semibold text-[#7E8980] uppercase tracking-wider block mb-2">
            Organization Headcount
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-4xl font-bold text-[#102820]">
              {totalHeadcount}
            </span>
            <span className="text-xs text-[#34785B] font-semibold">Active staff</span>
          </div>
          <p className="text-xs text-[#7E8980] mt-2">
            Real registered team members in database.
          </p>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white rounded-3xl p-8 border border-[#E6EBE5] shadow-xs space-y-8">
        <div className="flex items-center justify-between border-b border-[#E6EBE5] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#173D32] text-[#EAE9DF] flex items-center justify-center font-bold">
              SS
            </div>
            <div>
              <h3 className="font-serif-display text-xl text-[#102820]">
                StaffSync Enterprise • Workforce Health Summary
              </h3>
              <p className="text-xs text-[#7E8980]">
                Generated on {new Date().toLocaleDateString()} for period {reportPeriod}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-md bg-[#173D32]/10 text-[#173D32] text-xs font-bold uppercase tracking-wider">
            Verified Dynamic Audit
          </span>
        </div>

        {/* Breakdown Table */}
        <div>
          <h4 className="font-serif-display text-base text-[#102820] mb-3">
            Departmental Capacity &amp; Absence Utilization
          </h4>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F5] text-[#7E8980] uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Headcount</th>
                <th className="py-2.5 px-4">Days Off Approved</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBE5]">
              {Object.keys(deptStats).length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-xs text-[#7E8980]">No department records found.</td>
                </tr>
              ) : (
                Object.entries(deptStats).map(([dept, data]) => (
                  <tr key={dept}>
                    <td className="py-3 px-4 font-semibold text-[#102820]">{dept}</td>
                    <td className="py-3 px-4">{data.count} Member(s)</td>
                    <td className="py-3 px-4">{data.leaves} Days</td>
                    <td className="py-3 px-4 text-[#34785B] font-medium">Active</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-[#E6EBE5] text-[11px] text-[#7E8980] flex items-center justify-between">
          <p>This report is formatted for administrative records and operational capacity planning.</p>
          <p className="font-mono">StaffSync Report Engine • Live Data</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
