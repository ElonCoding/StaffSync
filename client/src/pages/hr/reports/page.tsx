
import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Users,
  Clock,
  CalendarCheck,
  TrendingUp,
  FileText,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { MockService } from '../../../lib/mockService';
import { Employee, LeaveRequest, AttendanceRecord } from '../../../lib/types';

export default function HrReportsPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [reportPeriod, setReportPeriod] = useState('October 2026');

  useEffect(() => {
    setEmployees(MockService.getEmployees());
    setLeaves(MockService.getLeaveRequests());
    setAttendance(MockService.getAttendance());
  }, []);

  const totalHeadcount = employees.length;
  const approvedLeaves = leaves.filter((l) => l.status === 'Approved');
  const totalLeaveDays = approvedLeaves.reduce((acc, l) => acc + l.days, 0);

  const presentRecords = attendance.filter((a) => a.status === 'Present' || a.status === 'Late');
  const punctualityRate =
    attendance.length > 0 ? Math.round((presentRecords.length / attendance.length) * 100) : 95;

  const handlePrint = () => {
    window.print();
  };

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
          Data synchronized with current prototype registry
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
            <span className="text-xs text-[#34785B] font-semibold">▲ 2.1% MoM</span>
          </div>
          <p className="text-xs text-[#7E8980] mt-2">
            Consistent presence rate across {attendance.length} logged shifts.
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
            Across {approvedLeaves.length} approved applications in this reporting cycle.
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
            <span className="text-xs text-[#34785B] font-semibold">100% active</span>
          </div>
          <p className="text-xs text-[#7E8980] mt-2">
            Zero unresolved disciplinary suspensions or administrative halts.
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
                SyncWorks Global • Workforce Health Summary
              </h3>
              <p className="text-xs text-[#7E8980]">
                Generated on {new Date().toLocaleDateString()} for period {reportPeriod}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-md bg-[#173D32]/10 text-[#173D32] text-xs font-bold uppercase tracking-wider">
            Verified Internal Audit
          </span>
        </div>

        {/* Breakdown Table */}
        <div>
          <h4 className="font-serif-display text-base text-[#102820] mb-3">
            Departmental Capacity & Absence Utilization
          </h4>
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F5] text-[#7E8980] uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-4">Department</th>
                <th className="py-2.5 px-4">Headcount</th>
                <th className="py-2.5 px-4">Attendance Rate</th>
                <th className="py-2.5 px-4">Days Off Taken</th>
                <th className="py-2.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBE5]">
              <tr>
                <td className="py-3 px-4 font-semibold text-[#102820]">Engineering</td>
                <td className="py-3 px-4">4 Members</td>
                <td className="py-3 px-4 text-[#34785B] font-semibold">97.5%</td>
                <td className="py-3 px-4">3 Days</td>
                <td className="py-3 px-4 text-[#34785B]">Optimal</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#102820]">Product & Design</td>
                <td className="py-3 px-4">2 Members</td>
                <td className="py-3 px-4 text-[#34785B] font-semibold">98.0%</td>
                <td className="py-3 px-4">0 Days</td>
                <td className="py-3 px-4 text-[#34785B]">Optimal</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#102820]">People Operations</td>
                <td className="py-3 px-4">2 Members</td>
                <td className="py-3 px-4 text-[#34785B] font-semibold">100.0%</td>
                <td className="py-3 px-4">0 Days</td>
                <td className="py-3 px-4 text-[#34785B]">Optimal</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#102820]">Marketing</td>
                <td className="py-3 px-4">1 Member</td>
                <td className="py-3 px-4 text-[#B7791F] font-semibold">On Leave</td>
                <td className="py-3 px-4">5 Days</td>
                <td className="py-3 px-4 text-[#B7791F]">Approved Absence</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#102820]">Finance & Legal</td>
                <td className="py-3 px-4">1 Member</td>
                <td className="py-3 px-4 text-[#34785B] font-semibold">99.0%</td>
                <td className="py-3 px-4">0 Days</td>
                <td className="py-3 px-4 text-[#34785B]">Optimal</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-4 border-t border-[#E6EBE5] text-[11px] text-[#7E8980] flex items-center justify-between">
          <p>This report is formatted for administrative records and operational capacity planning.</p>
          <p className="font-mono">StaffSync Report Engine • Ref: SS-RPT-2026-Q4</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
