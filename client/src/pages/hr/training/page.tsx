
import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { MockService } from '../../../lib/mockService';
import { ApiClient } from '../../../services/apiClient.js';
import { TrainingProgram } from '../../../lib/types';
import CreateTrainingModal from '../../../components/modals/CreateTrainingModal';

export default function HrTrainingPage() {
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

  const loadData = async () => {
    try {
      const res = await ApiClient.getTrainingPrograms();
      const serverPrograms = res.data || res.programs;
      if (Array.isArray(serverPrograms) && serverPrograms.length > 0) {
        setTrainings(serverPrograms);
        return;
      }
    } catch {
      // fallback
    }
    setTrainings(MockService.getTrainingPrograms());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staffsync_storage_update', loadData);
    return () => window.removeEventListener('staffsync_storage_update', loadData);
  }, []);

  return (
    <DashboardLayout activeRole="hr" pageTitle="Training & Professional Development">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif-display text-2xl text-[#102820]">Training & Upskilling</h2>
          <p className="text-xs text-[#7E8980]">
            Curate professional learning tracks, assign cohorts, and track completion milestones
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820] shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C7F36B]" />
          <span>New Curriculum</span>
        </button>
      </div>

      {/* Program Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {trainings.map((prog) => {
          const totalAssigned = prog.assignedEmployees.length;
          const completedCount = prog.assignedEmployees.filter((a) => a.completed).length;
          const avgProgress =
            totalAssigned > 0
              ? Math.round(
                  prog.assignedEmployees.reduce((acc, a) => acc + a.progressPercent, 0) /
                    totalAssigned
                )
              : 0;

          return (
            <div
              key={prog.id}
              className="bg-white rounded-3xl p-6 border border-[#E6EBE5] shadow-xs flex flex-col justify-between group hover:border-[#173D32]/30 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#7E8980] mb-3">
                  <span className="font-semibold text-[#173D32] bg-[#173D32]/10 px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider">
                    {prog.department}
                  </span>
                  <span
                    className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
                      prog.status === 'Active'
                        ? 'bg-[#34785B]/15 text-[#34785B]'
                        : 'bg-[#B7791F]/15 text-[#B7791F]'
                    }`}
                  >
                    {prog.status}
                  </span>
                </div>

                <h3 className="font-serif-display text-lg text-[#102820] mb-2 leading-snug">
                  {prog.title}
                </h3>
                <p className="text-xs text-[#7E8980] line-clamp-2 leading-relaxed mb-4">
                  {prog.description}
                </p>

                {/* Meta Pills */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#34443A] mb-5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#7E8980]" />
                    {prog.durationHours} hrs
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#7E8980]" />
                    {prog.modulesCount} modules
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#7E8980]" />
                    {totalAssigned} enrolled
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#7E8980]">Cohort Completion:</span>
                    <span className="font-bold text-[#102820]">{avgProgress}%</span>
                  </div>
                  <div className="w-full bg-[#F7F8F5] rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-[#173D32] h-full rounded-full transition-all duration-300"
                      style={{ width: `${avgProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E6EBE5] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#7E8980]">
                  {completedCount} of {totalAssigned} completed
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedProgram(prog)}
                  className="inline-flex items-center gap-1 text-[#173D32] font-semibold hover:underline"
                >
                  <span>Enrolled Staff</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enrolled Staff Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6EBE5] shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5] mb-5">
              <div>
                <h3 className="font-serif-display text-xl text-[#102820]">
                  Enrolled Employees
                </h3>
                <p className="text-xs text-[#7E8980]">{selectedProgram.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="p-1.5 rounded-lg text-[#7E8980] hover:text-[#102820]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto mb-6">
              {selectedProgram.assignedEmployees.map((assign, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-[#F7F8F5] border border-[#E6EBE5] flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-xs text-[#102820]">{assign.employeeName}</p>
                    <p className="text-[11px] text-[#7E8980]">{assign.department}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold text-[#173D32]">
                      {assign.progressPercent}%
                    </span>
                    {assign.completed ? (
                      <span className="px-2 py-0.5 rounded bg-[#34785B]/15 text-[#34785B] text-[10px] font-bold">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-[#B7791F]/15 text-[#B7791F] text-[10px] font-bold">
                        In Progress
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateTrainingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => loadData()}
      />
    </DashboardLayout>
  );
}
