import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2 } from 'lucide-react';
import { MockService } from '../../services/mockService.js';

export default function AddEmployeeModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('');
  const [status, setStatus] = useState('Active');
  const [managerName, setManagerName] = useState('Marcus Vance');
  const [location, setLocation] = useState('San Francisco, CA');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !designation.trim()) return;

    const newEmp = MockService.addEmployee({
      name,
      email,
      phone: phone || '+1 (555) 000-1122',
      role: 'employee',
      department,
      designation,
      joiningDate: new Date().toISOString().split('T')[0],
      status,
      managerId: 'emp-02',
      managerName,
      location,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      leaveBalances: {
        annual: 15,
        sick: 10,
        casual: 5,
        totalRemaining: 30,
      },
    });

    onSuccess(newEmp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6EBE5] shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#173D32] text-[#EAE9DF] flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-[#C7F36B]" />
            </div>
            <div>
              <h3 className="font-serif-display text-xl text-[#102820]">Add New Employee</h3>
              <p className="text-xs text-[#7E8980]">Add a team member to the organizational directory</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Clara Montgomery"
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Company Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="c.montgomery@syncworks.io"
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32] bg-white"
              >
                <option value="Engineering">Engineering</option>
                <option value="Product & Design">Product & Design</option>
                <option value="People Operations">People Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance & Legal">Finance & Legal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Job Title</label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Reporting Lead</label>
              <input
                type="text"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="e.g. Marcus Vance"
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32] bg-white"
              >
                <option value="Active">Active</option>
                <option value="Probation">Probation</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102820] mb-1">Work Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA (HQ)"
              className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
            />
          </div>

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
              className="px-5 py-2 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820] shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C7F36B]" />
              <span>Create Employee Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
