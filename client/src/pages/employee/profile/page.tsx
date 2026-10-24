
import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Building,
  Calendar,
  Lock,
  CheckCircle2,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { MockService } from '../../../lib/mockService';
import { Employee } from '../../../lib/types';

export default function EmployeeProfilePage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('Alex Rostova (+1 555-987-6543)');
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    const cur = MockService.getCurrentUser();
    let emp = MockService.getEmployeeById(cur.id) || MockService.getEmployeeById(cur.employeeId);
    if (!emp) {
      emp = {
        id: cur.id,
        employeeId: cur.employeeId || 'STF-1008',
        name: cur.name,
        email: cur.email,
        phone: cur.phone || '+1 (555) 010-2030',
        role: cur.role,
        department: cur.department,
        designation: cur.designation,
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        managerName: 'Direct Leadership',
        location: cur.location || 'Remote, Global',
        avatar: cur.avatar,
        leaveBalances: { annual: 16, sick: 10, casual: 5, totalRemaining: 31 },
      };
    }
    setEmployee(emp);
    setPhone(emp.phone || '');
    setLocation(emp.location || '');
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    MockService.updateEmployee(employee.id, {
      phone,
      location,
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  if (!employee) return null;

  return (
    <DashboardLayout activeRole="employee" pageTitle="My Personal Dossier">
      <div className="max-w-3xl">
        <div className="mb-6">
          <h2 className="font-serif-display text-2xl text-[#102820]">Personal Profile & Information</h2>
          <p className="text-xs text-[#7E8980]">
            Update your verified contact channels and review your organizational credentials
          </p>
        </div>

        {savedNotice && (
          <div className="mb-6 p-3 rounded-xl bg-[#34785B]/15 border border-[#34785B]/30 text-xs text-[#34785B] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile details updated successfully.</span>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6EBE5] shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-[#E6EBE5]">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-display text-2xl text-[#102820]">{employee.name}</h3>
                <span className="text-[10px] bg-[#34785B]/15 text-[#34785B] font-bold px-2 py-0.5 rounded uppercase">
                  {employee.status}
                </span>
              </div>
              <p className="text-xs text-[#7E8980] mt-0.5">{employee.designation}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#34443A] mt-2">
                <span className="font-mono bg-[#173D32]/10 text-[#173D32] px-2 py-0.5 rounded font-semibold text-[11px]">
                  {employee.employeeId}
                </span>
                <span>{employee.department}</span>
                <span>•</span>
                <span>Lead: {employee.managerName}</span>
              </div>
            </div>
          </div>

          {/* View-Only Privileged Fields Box (Section 10.1 requirement) */}
          <div className="mt-6 p-4 rounded-2xl bg-[#F7F8F5] border border-[#E6EBE5]">
            <div className="flex items-center gap-1.5 text-xs text-[#7E8980] font-semibold mb-3">
              <Lock className="w-3.5 h-3.5 text-[#B7791F]" />
              <span>Administrative Credentials (Governed by HR)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[#7E8980] block text-[11px]">Role Permission</span>
                <span className="font-semibold text-[#102820] uppercase">{employee.role}</span>
              </div>
              <div>
                <span className="text-[#7E8980] block text-[11px]">Employee ID</span>
                <span className="font-mono font-semibold text-[#102820]">{employee.employeeId}</span>
              </div>
              <div>
                <span className="text-[#7E8980] block text-[11px]">Department</span>
                <span className="font-semibold text-[#102820]">{employee.department}</span>
              </div>
              <div>
                <span className="text-[#7E8980] block text-[11px]">Joining Date</span>
                <span className="font-semibold text-[#102820]">{employee.joiningDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Personal Contact Form */}
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6EBE5] shadow-xs space-y-5 text-xs">
          <h3 className="font-serif-display text-base text-[#102820] pb-3 border-b border-[#E6EBE5]">
            Editable Contact Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">
                Company Email (Read-Only)
              </label>
              <input
                type="email"
                value={employee.email}
                disabled
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] bg-[#F7F8F5] text-[#7E8980] cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] outline-none focus:border-[#173D32]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Work Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] outline-none focus:border-[#173D32]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] outline-none focus:border-[#173D32]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6EBE5] flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820] shadow-sm"
            >
              Update Profile Details
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
