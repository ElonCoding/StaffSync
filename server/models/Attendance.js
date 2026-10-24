import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  id: { type: String },
  employeeId: { type: String },
  employeeName: { type: String },
  department: { type: String },
  date: { type: String, required: true },
  checkInTime: { type: String },
  checkOutTime: { type: String },
  totalHours: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half Day', 'Late', 'On Leave'],
    default: 'Present',
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
