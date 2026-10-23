import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      ref: 'Employee',
    },
    employeeName: {
      type: String,
      required: true,
    },
    employeeAvatar: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      enum: ['Annual', 'Sick', 'Casual', 'Parental', 'Unpaid'],
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    submittedAt: {
      type: String,
      default: () => new Date().toLocaleString(),
    },
    reviewedBy: {
      type: String,
      default: '',
    },
    reviewedAt: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
export default LeaveRequest;
