
import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Clock,
  CheckCircle2,
  Play,
  ArrowRight,
} from 'lucide-react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { MockService } from '../../../lib/mockService';
import { TrainingProgram } from '../../../lib/types';

export default function EmployeeTrainingPage() {
  const [trainings, setTrainings] = useState<TrainingProgram[]>([]);
  const [feedback, setFeedback] = useState('');

  const loadData = () => {
    const all = MockService.getTrainingPrograms();
    // Filter programs Elena Rostova is enrolled in
    const enrolled = all.filter((t) =>
      t.assignedEmployees.some((a) => a.employeeId === 'emp-03')
    );
    setTrainings(enrolled);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('staffsync_storage_update', loadData);
    return () => window.removeEventListener('staffsync_storage_update', loadData);
  }, []);

  const handleAdvanceProgress = (prog: TrainingProgram) => {
    const myAssign = prog.assignedEmployees.find((a) => a.employeeId === 'emp-03');
    const currentProgress = myAssign ? myAssign.progressPercent : 0;
    const newProgress = Math.min(100, currentProgress + 20);

    MockService.updateTrainingProgress(prog.id, 'emp-03', newProgress);
    loadData();
    setFeedback(`Progress updated for "${prog.title}": ${newProgress}% complete.`);
    setTimeout(() => setFeedback(''), 3000);
  };

  return (
    <DashboardLayout activeRole="employee" pageTitle="My Training & Development">
      <div className="mb-6">
        <h2 className="font-serif-display text-2xl text-[#102820]">My Learning Curricula</h2>
        <p className="text-xs text-[#7E8980]">
          Complete assigned technical competencies and track your certification milestones
        </p>
      </div>

      {feedback && (
        <div className="mb-6 p-3 rounded-xl bg-[#34785B]/15 border border-[#34785B]/30 text-xs text-[#34785B] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trainings.map((prog) => {
          const myAssign = prog.assignedEmployees.find((a) => a.employeeId === 'emp-03');
          const progress = myAssign ? myAssign.progressPercent : 0;
          const isCompleted = myAssign?.completed || progress >= 100;

          return (
            <div
              key={prog.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E6EBE5] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-[#173D32] bg-[#173D32]/10 px-2.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                    {prog.department}
                  </span>
                  <span
                    className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
                      isCompleted
                        ? 'bg-[#34785B]/15 text-[#34785B]'
                        : 'bg-[#B7791F]/15 text-[#B7791F]'
                    }`}
                  >
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                </div>

                <h3 className="font-serif-display text-xl text-[#102820] mb-2">{prog.title}</h3>
                <p className="text-xs text-[#7E8980] leading-relaxed mb-5">{prog.description}</p>

                <div className="flex items-center gap-4 text-xs text-[#34443A] mb-6">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#7E8980]" />
                    {prog.durationHours} hours total
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#7E8980]" />
                    {prog.modulesCount} learning modules
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 mb-6">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#7E8980]">Course Completion</span>
                    <span className="font-bold text-[#102820]">{progress}%</span>
                  </div>
                  <div className="w-full bg-[#F7F8F5] rounded-full h-2.5 overflow-hidden border border-[#E6EBE5]">
                    <div
                      className="bg-[#173D32] h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E6EBE5] flex items-center justify-between">
                <span className="text-[11px] text-[#7E8980]">Instructor: {prog.instructor}</span>

                {!isCompleted ? (
                  <button
                    type="button"
                    onClick={() => handleAdvanceProgress(prog)}
                    className="px-4 py-2 rounded-xl bg-[#173D32] text-[#EAE9DF] text-xs font-semibold hover:bg-[#102820] flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Play className="w-3 h-3 text-[#C7F36B] fill-current" />
                    <span>Complete Next Module (+20%)</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#34785B]">
                    <CheckCircle2 className="w-4 h-4" />
                    Curriculum Mastered
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
