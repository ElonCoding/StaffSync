import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['leave', 'attendance', 'announcement', 'training', 'system'],
      default: 'system',
    },
    timestamp: {
      type: String,
      default: 'Just now',
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      default: '',
    },
    recipientRole: {
      type: String,
      enum: ['all', 'hr', 'manager', 'employee'],
      default: 'all',
    },
    recipientId: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
