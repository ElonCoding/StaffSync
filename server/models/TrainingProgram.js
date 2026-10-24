import mongoose from 'mongoose';

const trainingSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: { type: String, required: [true, 'Training title is required'] },
    description: { type: String, required: [true, 'Description is required'] },
    instructor: { type: String, default: 'StaffSync Academy' },
    trainer: { type: String, default: 'StaffSync Academy' },
    department: { type: String, default: 'All Departments' },
    durationHours: { type: Number, default: 8 },
    modulesCount: { type: Number, default: 4 },
    startDate: { type: String },
    endDate: { type: String },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Active', 'Upcoming', 'Completed'],
      default: 'Active',
    },
    createdBy: { type: mongoose.Schema.Types.Mixed },
    assignedEmployees: [
      {
        employeeId: { type: String },
        employeeName: { type: String },
        department: { type: String },
        progressPercent: { type: Number, default: 0 },
        completed: { type: Boolean, default: false },
        completedAt: { type: String },
      },
    ],
    assignedTo: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { timestamps: true }
);

export const Training = mongoose.model('Training', trainingSchema);
export const TrainingProgram = Training;
export default Training;

