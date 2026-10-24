
import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  UserPlus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  X,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ApiClient } from '../../../services/apiClient.js';
import { Employee, EmploymentStatus } from '../../../lib/types';
import AddEmployeeModal from '../../../components/modals/AddEmployeeModal';

export default function HrEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Detail Modal State
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Employee>>({});

  const loadData = async () => {
    try {
      const res = await ApiClient.getEmployees();
      const serverEmps = res?.data || res?.employees || [];
      setEmployees(Array.isArray(serverEmps) ? serverEmps : []);
    } catch (err) {
      console.error('Failed to load employees:', err);
      setEmployees([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter logic
  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (emp.name || '').toLowerCase().includes(query) ||
      (emp.email || '').toLowerCase().includes(query) ||
      (emp.employeeId || '').toLowerCase().includes(query) ||
      (emp.designation || '').toLowerCase().includes(query);

    const matchesDept = selectedDepartment === 'All' || emp.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the directory?`)) {
      try {
        await ApiClient.deleteEmployee(id);
        await loadData();
        if (selectedEmployee && ((selectedEmployee as any)._id === id || selectedEmployee.id === id)) {
          setSelectedEmployee(null);
        }
      } catch (err) {
        console.error('Failed to delete employee:', err);
      }
    }
  };

  const handleOpenEdit = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsEditMode(true);
    setEditFormData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      designation: emp.designation,
      status: emp.status,
      location: emp.location,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    try {
      const targetId = (selectedEmployee as any)._id || selectedEmployee.id;
      await ApiClient.updateEmployee(targetId, editFormData);
      await loadData();
      setSelectedEmployee(null);
      setIsEditMode(false);
    } catch (err) {
      console.error('Failed to update employee:', err);
    }
  };

  const departments = ['All', 'Engineering', 'Product & Design', 'People Operations', 'Marketing', 'Finance & Legal'];
  const statuses = ['All', 'Active', 'On Leave', 'Probation', 'Terminated'];

  return (
    <DashboardLayout activeRole="hr" pageTitle="Employee Directory">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-display text-2xl text-[#102820]">Workforce Directory</h2>
          <p className="text-xs text-[#7E8980]">
            Showing {filteredEmployees.length} of {employees.length} team members
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820] shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-3.5 h-3.5 text-[#C7F36B]" />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E6EBE5] shadow-xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#7E8980] absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ID, title, or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#7E8980]">Dept:</span>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E6EBE5] text-xs bg-white outline-none focus:border-[#173D32]"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#7E8980]">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-[#E6EBE5] text-xs bg-white outline-none focus:border-[#173D32]"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Employee Data Table */}
      <div className="bg-white rounded-3xl border border-[#E6EBE5] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8F5] border-b border-[#E6EBE5] text-[#7E8980] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">Employee</th>
                <th className="py-3.5 px-6">ID & Dept</th>
                <th className="py-3.5 px-6">Designation</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6">Joining Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EBE5]">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs text-[#7E8980]">
                    No employees matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#F7F8F5]/60 transition-colors">
                    {/* Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-9 h-9 rounded-xl object-cover border border-[#E6EBE5]"
                        />
                        <div>
                          <p className="font-bold text-[#102820] text-sm">{emp.name}</p>
                          <p className="text-[11px] text-[#7E8980]">{emp.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* ID & Dept */}
                    <td className="py-4 px-6">
                      <span className="font-mono text-[11px] text-[#173D32] bg-[#173D32]/10 px-2 py-0.5 rounded font-semibold">
                        {emp.employeeId}
                      </span>
                      <p className="text-[11px] text-[#7E8980] mt-0.5">{emp.department}</p>
                    </td>

                    {/* Designation */}
                    <td className="py-4 px-6 text-[#34443A] font-medium">
                      {emp.designation}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          emp.status === 'Active'
                            ? 'bg-[#34785B]/15 text-[#34785B]'
                            : emp.status === 'On Leave'
                            ? 'bg-[#B7791F]/15 text-[#B7791F]'
                            : emp.status === 'Probation'
                            ? 'bg-[#173D32]/10 text-[#173D32]'
                            : 'bg-[#C24141]/15 text-[#C24141]'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    {/* Joining Date */}
                    <td className="py-4 px-6 text-[#7E8980]">{emp.joiningDate}</td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setIsEditMode(false);
                          }}
                          className="p-1.5 rounded-lg border border-[#E6EBE5] text-[#34443A] hover:bg-[#F7F8F5]"
                          title="View Profile Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(emp)}
                          className="p-1.5 rounded-lg border border-[#E6EBE5] text-[#173D32] hover:bg-[#173D32]/10"
                          title="Edit Information"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(emp.id, emp.name)}
                          className="p-1.5 rounded-lg border border-[#E6EBE5] text-[#C24141] hover:bg-[#C24141]/10"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => loadData()}
      />

      {/* View/Edit Employee Drawer Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6EBE5] shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5] mb-5">
              <h3 className="font-serif-display text-xl text-[#102820]">
                {isEditMode ? 'Edit Employee Record' : 'Employee Dossier'}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedEmployee(null)}
                className="p-1.5 rounded-lg text-[#7E8980] hover:text-[#102820]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!isEditMode ? (
              <div className="space-y-5 text-xs">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedEmployee.avatar}
                    alt={selectedEmployee.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#E6EBE5]"
                  />
                  <div>
                    <h4 className="font-serif-display text-xl text-[#102820]">
                      {selectedEmployee.name}
                    </h4>
                    <p className="text-xs text-[#7E8980]">{selectedEmployee.designation}</p>
                    <span className="font-mono text-[10px] text-[#173D32] bg-[#173D32]/10 px-2 py-0.5 rounded font-semibold mt-1 inline-block">
                      {selectedEmployee.employeeId}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#E6EBE5]">
                  <div>
                    <span className="text-[#7E8980] block">Department</span>
                    <span className="font-semibold text-[#102820]">
                      {selectedEmployee.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7E8980] block">Status</span>
                    <span className="font-semibold text-[#102820]">{selectedEmployee.status}</span>
                  </div>
                  <div>
                    <span className="text-[#7E8980] block">Reporting Lead</span>
                    <span className="font-semibold text-[#102820]">
                      {selectedEmployee.managerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7E8980] block">Joining Date</span>
                    <span className="font-semibold text-[#102820]">
                      {selectedEmployee.joiningDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#7E8980] block">Work Email</span>
                    <span className="font-semibold text-[#102820]">{selectedEmployee.email}</span>
                  </div>
                  <div>
                    <span className="text-[#7E8980] block">Phone</span>
                    <span className="font-semibold text-[#102820]">{selectedEmployee.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[#7E8980] block">Location</span>
                    <span className="font-semibold text-[#102820]">
                      {selectedEmployee.location}
                    </span>
                  </div>
                </div>

                {/* Leave Balance Overview */}
                <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-[#E6EBE5]">
                  <span className="text-[#7E8980] font-semibold block mb-2">
                    Available Leave Balance
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded-xl border border-[#E6EBE5]">
                      <span className="font-bold text-sm text-[#102820]">
                        {selectedEmployee.leaveBalances.annual}
                      </span>
                      <p className="text-[10px] text-[#7E8980]">Annual</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-[#E6EBE5]">
                      <span className="font-bold text-sm text-[#102820]">
                        {selectedEmployee.leaveBalances.sick}
                      </span>
                      <p className="text-[10px] text-[#7E8980]">Sick</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-[#E6EBE5]">
                      <span className="font-bold text-sm text-[#102820]">
                        {selectedEmployee.leaveBalances.casual}
                      </span>
                      <p className="text-[10px] text-[#7E8980]">Casual</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(selectedEmployee)}
                    className="px-4 py-2 rounded-xl bg-[#173D32] text-[#EAE9DF] font-semibold hover:bg-[#102820]"
                  >
                    Edit Record
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-semibold text-[#102820] mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#102820] mb-1">Job Title</label>
                  <input
                    type="text"
                    value={editFormData.designation || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#102820] mb-1">Department</label>
                    <select
                      value={editFormData.department || 'Engineering'}
                      onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] bg-white"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="People Operations">People Operations</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance & Legal">Finance & Legal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#102820] mb-1">Status</label>
                    <select
                      value={editFormData.status || 'Active'}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value as EmploymentStatus })}
                      className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Probation">Probation</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-[#E6EBE5]">
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="px-4 py-2 rounded-xl border border-[#E6EBE5]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#173D32] text-[#EAE9DF] font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
