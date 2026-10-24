import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  checkInTime: { type: String },
  checkOutTime: { type: String },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half Day'],
    default: 'Present',
  },
  createdAt: { type: Date, default: Date.now },
});

attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
