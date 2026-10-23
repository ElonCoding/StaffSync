import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorRole: {
      type: String,
      default: 'Leadership',
    },
    publishedAt: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Normal'],
      default: 'Normal',
    },
    audience: {
      type: String,
      default: 'All Employees',
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
