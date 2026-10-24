import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    message: { type: String },
    authorName: { type: String, default: 'Leadership' },
    authorRole: { type: String, default: 'Head of People' },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
    },
    publishedAt: { type: String },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Normal', 'low'],
      default: 'Normal',
    },
    audience: {
      type: String,
      default: 'All Employees',
    },
    targetAudience: {
      type: String,
      default: 'All',
    },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
