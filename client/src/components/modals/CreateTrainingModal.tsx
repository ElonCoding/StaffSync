
import React, { useState } from 'react';
import { X, GraduationCap, CheckCircle2 } from 'lucide-react';
import { TrainingProgram } from '../../lib/types';
import { MockService } from '../../lib/mockService';
import { ApiClient } from '../../services/apiClient.js';

interface CreateTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProgram: TrainingProgram) => void;
}

export default function CreateTrainingModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateTrainingModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('StaffSync Learning Guild');
  const [department, setDepartment] = useState('Product & Engineering');
  const [durationHours, setDurationHours] = useState(10);
  const [modulesCount, setModulesCount] = useState(5);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      instructor,
      department,
      durationHours,
      modulesCount,
      startDate,
      endDate,
      status: 'Active' as const,
      assignedEmployees: [],
    };

    try {
      await ApiClient.createTrainingProgram(payload);
    } catch (err) {
      console.warn('API training creation fallback:', err);
    }

    const newProg = MockService.createTrainingProgram(payload);
    setIsSubmitting(false);
    onSuccess(newProg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#E6EBE5] shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#E6EBE5] mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#173D32] text-[#EAE9DF] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-[#C7F36B]" />
            </div>
            <div>
              <h3 className="font-serif-display text-xl text-[#102820]">Create Training Curriculum</h3>
              <p className="text-xs text-[#7E8980]">Design a professional upskilling program</p>
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
          <div>
            <label className="block text-xs font-semibold text-[#102820] mb-1">Curriculum Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Modern Microservice Resilience & Observability"
              className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Instructor / Provider</label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32] bg-white"
              >
                <option value="Product & Engineering">Product & Engineering</option>
                <option value="People Operations">People Operations</option>
                <option value="Company-Wide">Company-Wide</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Duration (Hours)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={durationHours}
                onChange={(e) => setDurationHours(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#102820] mb-1">Number of Modules</label>
              <input
                type="number"
                min="1"
                max="20"
                value={modulesCount}
                onChange={(e) => setModulesCount(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#102820] mb-1">Curriculum Overview</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline the learning objectives and core competencies..."
              className="w-full px-3 py-2 rounded-xl border border-[#E6EBE5] text-xs outline-none focus:border-[#173D32]"
              required
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
              <span>Launch Curriculum</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
