
import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { MockService } from '../../../lib/mockService';
import { TrainingProgram, Employee } from '../../../lib/types';

export default function ManagerTrainingPage() {
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

  const loadData = () => {
    setTrainings(MockService.getTrainingPrograms());
    const allEmps = MockService.getEmployees();
    setTeamMembers(
      allEmps.filter(
        (e) => e.department === 'Engineering' || e.department === 'Product & Design'
      )
    );
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staffsync_storage_update', loadData);
    return () => window.removeEventListener('staffsync_storage_update', loadData);
  }, []);

  return (
    <DashboardLayout activeRole="manager" pageTitle="Team Skill Development & Learning">
      <div className="mb-6">
        <h2 className="font-serif-display text-2xl text-[#102820]">Skill Development Tracks</h2>
        <p className="text-xs text-[#7E8980]">
          Assign and monitor technical competencies and compliance training for your team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainings.map((prog) => {
          const teamAssigned = prog.assignedEmployees.filter(
            (a) => a.department === 'Engineering' || a.department === 'Product & Design'
          );

          return (
            <div
              key={prog.id}
              className="bg-white rounded-3xl p-6 border border-[#E6EBE5] shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="font-semibold text-[#173D32] bg-[#173D32]/10 px-2.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider block w-fit mb-3">
                  {prog.department}
                </span>
                <h3 className="font-serif-display text-lg text-[#102820] mb-2">{prog.title}</h3>
                <p className="text-xs text-[#7E8980] line-clamp-2 leading-relaxed mb-4">
                  {prog.description}
                </p>

                <div className="flex items-center gap-3 text-xs text-[#34443A] mb-5">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#7E8980]" />
                    {prog.durationHours} hrs
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#7E8980]" />
                    {prog.modulesCount} modules
                  </span>
                </div>

                <div className="border-t border-[#E6EBE5] pt-3">
                  <span className="text-[11px] font-semibold text-[#102820] block mb-2">
                    Team Members Enrolled ({teamAssigned.length}):
                  </span>
                  <div className="space-y-2">
                    {teamAssigned.map((a, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-[#34443A]">{a.employeeName}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-semibold text-[#173D32]">
                            {a.progressPercent}%
                          </span>
                          {a.completed && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#34785B]" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E6EBE5] text-[11px] text-[#7E8980]">
                Led by: {prog.instructor}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
