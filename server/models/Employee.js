import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employeeId: { type: String },
  department: { type: String, required: true },
  position: { type: String },
  designation: { type: String },
  role: { type: String, default: 'employee' },
  status: { type: String, default: 'Active' },
  salary: { type: Number, default: 0 },
  joinDate: { type: Date, default: Date.now },
  joiningDate: { type: String },
  phone: { type: String },
  address: { type: String },
  location: { type: String },
  managerName: { type: String },
  leaveBalances: {
    annual: { type: Number, default: 15 },
    sick: { type: Number, default: 10 },
    casual: { type: Number, default: 5 },
    totalRemaining: { type: Number, default: 30 },
  },
  createdAt: { type: Date, default: Date.now },
});

export const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
