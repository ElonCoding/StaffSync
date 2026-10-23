import { Notification } from '../models/Notification.js';
import { memoryStore } from '../services/dataStore.js';

export async function getNotifications(req, res) {
  try {
    let list = [];
    try {
      list = await Notification.find().sort({ createdAt: -1 });
    } catch {
      list = memoryStore.notifications;
    }

    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications.',
      error: err.message,
    });
  }
}

export async function markAsRead(req, res) {
  try {
    const { id } = req.params;
    try {
      await Notification.findOneAndUpdate({ $or: [{ _id: id }, { id }] }, { read: true });
    } catch {
      // Memory fallback
    }

    const item = memoryStore.notifications.find((n) => n.id === id || n._id?.toString() === id);
    if (item) item.read = true;

    return res.json({
      success: true,
      message: 'Notification marked as read.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update notification.',
      error: err.message,
    });
  }
}

export async function markAllAsRead(req, res) {
  try {
    try {
      await Notification.updateMany({}, { read: true });
    } catch {
      // Memory fallback
    }

    memoryStore.notifications.forEach((n) => (n.read = true));

    return res.json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to clear unread notifications.',
      error: err.message,
    });
  }
}
