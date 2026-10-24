import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  joinDate: { type: Date, required: true },
  phone: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
