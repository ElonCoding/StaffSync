import { TrainingProgram } from '../models/TrainingProgram.js';
import { memoryStore } from '../services/dataStore.js';

export async function getTrainingPrograms(req, res) {
  try {
    let list = [];
    try {
      list = await TrainingProgram.find().sort({ createdAt: -1 });
    } catch {
      list = memoryStore.trainings;
    }

    return res.json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve training programs.',
      error: err.message,
    });
  }
}

export async function createTrainingProgram(req, res) {
  try {
    const data = req.body;
    if (!data.title || !data.description || !data.instructor) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and instructor are required.',
      });
    }

    const newProg = {
      ...data,
      id: `tr-${Date.now().toString().slice(-4)}`,
      assignedEmployees: data.assignedEmployees || [],
    };

    try {
      const created = await TrainingProgram.create(newProg);
      memoryStore.trainings.unshift(created);
      return res.status(201).json({ success: true, data: created, message: 'Training program created.' });
    } catch {
      memoryStore.trainings.unshift(newProg);
      return res.status(201).json({ success: true, data: newProg, message: 'Training program created in memory.' });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create training program.',
      error: err.message,
    });
  }
}

export async function updateProgress(req, res) {
  try {
    const { id } = req.params;
    const { employeeId, progressPercent } = req.body;

    const progIdx = memoryStore.trainings.findIndex((t) => t.id === id || t._id?.toString() === id);
    if (progIdx === -1) {
      return res.status(404).json({
        success: false,
        message: 'Training program not found.',
      });
    }

    const prog = memoryStore.trainings[progIdx];
    const assign = prog.assignedEmployees.find((a) => a.employeeId === employeeId);
    if (assign) {
      assign.progressPercent = Math.min(100, Math.max(0, progressPercent));
      assign.completed = assign.progressPercent >= 100;
      if (assign.completed) assign.completedAt = new Date().toISOString().split('T')[0];
    } else {
      prog.assignedEmployees.push({
        employeeId,
        employeeName: req.user?.name || 'Enrolled Staff',
        progressPercent,
        completed: progressPercent >= 100,
      });
    }

    return res.json({
      success: true,
      data: prog,
      message: 'Training progress updated.',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update progress.',
      error: err.message,
    });
  }
}
