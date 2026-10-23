import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['hr', 'manager', 'employee'],
      default: 'employee',
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    joiningDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Probation', 'Terminated'],
      default: 'Active',
    },
    managerId: {
      type: String,
      default: '',
    },
    managerName: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    leaveBalances: {
      annual: { type: Number, default: 15 },
      sick: { type: Number, default: 10 },
      casual: { type: Number, default: 5 },
      totalRemaining: { type: Number, default: 30 },
    },
  },
  {
    timestamps: true,
  }
);

export const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
