import { memoryStore } from '../services/dataStore.js';

export async function getWorkforceSummary(req, res) {
  try {
    const totalEmployees = memoryStore.employees.length;
    const departmentCounts = {};
    memoryStore.employees.forEach((emp) => {
      departmentCounts[emp.department] = (departmentCounts[emp.department] || 0) + 1;
    });

    const approvedLeaves = memoryStore.leaves.filter((l) => l.status === 'Approved');
    const totalLeaveDays = approvedLeaves.reduce((acc, l) => acc + l.days, 0);

    const today = new Date().toISOString().split('T')[0];
    const todayAtt = memoryStore.attendance.filter((a) => a.date === today);
    const presentToday = todayAtt.filter((a) => a.status === 'Present' || a.status === 'Late').length;

    return res.json({
      success: true,
      data: {
        totalEmployees,
        departmentDistribution: departmentCounts,
        presentToday,
        onLeaveToday: todayAtt.filter((a) => a.status === 'On Leave').length,
        totalLeaveDaysConsumed: totalLeaveDays,
        complianceRate: todayAtt.length > 0 ? Math.round((presentToday / todayAtt.length) * 100) : 96,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to compute workforce analytics.',
      error: err.message,
    });
  }
}
