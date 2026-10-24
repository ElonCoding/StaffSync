import mongoose from 'mongoose';

const leavesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
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
  createdAt: { type: Date, default: Date.now },
});

export const Leave = mongoose.model('Leave', leavesSchema);
export default Leave;
