
import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  Award,
  ChevronRight,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { MockService } from '../../../lib/mockService';
import { Employee } from '../../../lib/types';

export default function ManagerTeamPage() {
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [selectedMember, setSelectedMember] = useState<Employee | null>(null);
  const [oneOnOneNote, setOneOnOneNote] = useState('');
  const [notesHistory, setNotesHistory] = useState<Record<string, string[]>>({
    'emp-03': [
      '2026-10-14: Reviewed design token taxonomy. Elena demonstrated great leadership on WCAG 2.2 color contrast.',
      '2026-09-28: Quarterly goals aligned on design system release v2.0.',
    ],
  });

  useEffect(() => {
    const allEmps = MockService.getEmployees();
    const team = allEmps.filter(
      (e) => e.managerId === 'emp-02' || e.department === 'Engineering' || e.department === 'Product & Design'
    );
    setTeamMembers(team);
    if (team.length > 0) setSelectedMember(team[0]);
  }, []);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !oneOnOneNote.trim()) return;

    const currentNotes = notesHistory[selectedMember.id] || [];
    const dateStr = new Date().toISOString().split('T')[0];
    const newEntry = `${dateStr}: ${oneOnOneNote.trim()}`;

    setNotesHistory({
      ...notesHistory,
      [selectedMember.id]: [newEntry, ...currentNotes],
    });
    setOneOnOneNote('');
  };

  return (
    <DashboardLayout activeRole="manager" pageTitle="My Team & Direct Reports">
      <div className="mb-6">
        <h2 className="font-serif-display text-2xl text-[#102820]">Engineering & Design Squad</h2>
        <p className="text-xs text-[#7E8980]">
          Supervise your direct team, align sprint development, and record 1-on-1 performance feedback
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Team Members List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {teamMembers.map((emp) => {
            const isSelected = selectedMember?.id === emp.id;
            return (
              <div
                key={emp.id}
                onClick={() => setSelectedMember(emp)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#173D32] text-[#EAE9DF] border-[#173D32] shadow-md'
                    : 'bg-white border-[#E6EBE5] text-[#102820] hover:border-[#173D32]/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-11 h-11 rounded-xl object-cover border border-[#E6EBE5]"
                  />
                  <div>
                    <h4 className="font-bold text-sm">{emp.name}</h4>
                    <p className={`text-xs ${isSelected ? 'text-[#D7D8CE]' : 'text-[#7E8980]'}`}>
                      {emp.designation}
                    </p>
                    <span
                      className={`text-[10px] font-semibold mt-1 inline-block ${
                        isSelected ? 'text-[#C7F36B]' : 'text-[#173D32]'
                      }`}
                    >
                      {emp.department} • {emp.status}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 ${isSelected ? 'text-[#C7F36B]' : 'text-[#7E8980]'}`}
                />
              </div>
            );
          })}
        </div>

        {/* Selected Member Detail & 1-on-1 Workspace (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E6EBE5] shadow-xs">
          {selectedMember ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5]">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedMember.avatar}
                    alt={selectedMember.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#E6EBE5]"
                  />
                  <div>
                    <h3 className="font-serif-display text-2xl text-[#102820]">
                      {selectedMember.name}
                    </h3>
                    <p className="text-xs text-[#7E8980]">{selectedMember.designation}</p>
                    <span className="font-mono text-[10px] text-[#173D32] bg-[#173D32]/10 px-2 py-0.5 rounded font-semibold inline-block mt-1">
                      {selectedMember.employeeId}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#7E8980] uppercase tracking-wider block">
                    Remaining Leaves
                  </span>
                  <span className="font-bold text-lg text-[#173D32]">
                    {selectedMember.leaveBalances.totalRemaining} Days
                  </span>
                </div>
              </div>

              {/* Contact & Meta */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E6EBE5]">
                  <span className="text-[#7E8980] block mb-0.5">Email</span>
                  <span className="font-semibold text-[#102820] truncate block">
                    {selectedMember.email}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E6EBE5]">
                  <span className="text-[#7E8980] block mb-0.5">Location</span>
                  <span className="font-semibold text-[#102820]">{selectedMember.location}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E6EBE5]">
                  <span className="text-[#7E8980] block mb-0.5">Joining Date</span>
                  <span className="font-semibold text-[#102820]">{selectedMember.joiningDate}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E6EBE5]">
                  <span className="text-[#7E8980] block mb-0.5">Annual / Sick / Casual</span>
                  <span className="font-semibold text-[#102820]">
                    {selectedMember.leaveBalances.annual} / {selectedMember.leaveBalances.sick} /{' '}
                    {selectedMember.leaveBalances.casual}
                  </span>
                </div>
              </div>

              {/* 1-on-1 Notes Workspace */}
              <div>
                <h4 className="font-serif-display text-base text-[#102820] mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#173D32]" />
                  <span>1-on-1 Performance & Mentorship Notes</span>
                </h4>

                <form onSubmit={handleAddNote} className="space-y-2 mb-4">
                  <textarea
                    rows={2}
                    value={oneOnOneNote}
                    onChange={(e) => setOneOnOneNote(e.target.value)}
                    placeholder="Log feedback, career calibration, or sprint mentorship notes..."
                    className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
                    required
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820]"
                    >
                      Save Note
                    </button>
                  </div>
                </form>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(notesHistory[selectedMember.id] || []).length === 0 ? (
                    <p className="text-xs text-[#7E8980] italic">
                      No 1-on-1 notes recorded yet for this team member.
                    </p>
                  ) : (
                    (notesHistory[selectedMember.id] || []).map((note, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#F7F8F5] border border-[#E6EBE5] text-xs text-[#34443A] leading-relaxed"
                      >
                        {note}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-[#7E8980]">
              Select a team member to view their dossier and record 1-on-1 notes.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
