import mongoose from 'mongoose';

const leavesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.Mixed },
  id: { type: String },
  employeeId: { type: String },
  employeeName: { type: String },
  employeeAvatar: { type: String },
  department: { type: String },
  leaveType: { type: String, default: 'Annual' },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  days: { type: Number, default: 1 },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  approverRole: {
    type: String,
    enum: ['HR', 'Manager'],
  },
  reviewedBy: { type: String },
  reviewedAt: { type: String },
  rejectionReason: { type: String },
  submittedAt: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Leave = mongoose.model('Leave', leavesSchema);
export const LeaveRequest = Leave;
export default Leave;

