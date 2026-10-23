import { Announcement } from '../models/Announcement.js';
import { memoryStore } from '../services/dataStore.js';

export async function getAnnouncements(req, res) {
  try {
    let list = [];
    try {
      list = await Announcement.find().sort({ pinned: -1, createdAt: -1 });
    } catch {
      list = memoryStore.announcements;
    }

    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve announcements.',
      error: err.message,
    });
  }
}

export async function createAnnouncement(req, res) {
  try {
    const { title, content, priority, audience, pinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required.',
      });
    }

    const newAnc = {
      id: `anc-${Date.now().toString().slice(-4)}`,
      title,
      content,
      authorName: req.user?.name || 'Leadership',
      authorRole: req.user?.role === 'hr' ? 'Head of People' : 'Leadership',
      publishedAt: new Date().toISOString().split('T')[0],
      priority: priority || 'Normal',
      audience: audience || 'All Employees',
      pinned: !!pinned,
    };

    try {
      const created = await Announcement.create(newAnc);
      memoryStore.announcements.unshift(created);
      return res.status(201).json({ success: true, data: created, message: 'Announcement published.' });
    } catch {
      memoryStore.announcements.unshift(newAnc);
      return res.status(201).json({ success: true, data: newAnc, message: 'Announcement published in memory.' });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create announcement.',
      error: err.message,
    });
  }
}

export async function deleteAnnouncement(req, res) {
  try {
    const { id } = req.params;
    try {
      await Announcement.findOneAndDelete({ $or: [{ _id: id }, { id }] });
    } catch {
      // Memory fallback
    }

    memoryStore.announcements = memoryStore.announcements.filter((a) => a.id !== id && a._id?.toString() !== id);

    return res.json({
      success: true,
      message: 'Announcement deleted.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete announcement.',
      error: err.message,
    });
  }
}
