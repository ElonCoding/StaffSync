import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      default: '',
    },
    progressPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const trainingProgramSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    durationHours: {
      type: Number,
      default: 10,
    },
    modulesCount: {
      type: Number,
      default: 5,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Upcoming', 'Completed'],
      default: 'Active',
    },
    assignedEmployees: [assignmentSchema],
  },
  {
    timestamps: true,
  }
);

export const TrainingProgram = mongoose.model('TrainingProgram', trainingProgramSchema);
export default TrainingProgram;
