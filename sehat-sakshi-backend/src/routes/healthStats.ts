import express, { Request, Response } from 'express';
import { SymptomLog } from '../models/SymptomLog';
import { Order } from '../models/Order';
import { Reminder } from '../models/Reminder';
import { MedicalHistory } from '../models/MedicalHistory';
import { protect, AuthRequest } from '../middleware/auth';

const router = express.Router();

/**
 * GET /api/health-stats/dashboard
 * Get comprehensive health statistics for dashboard
 */
router.get('/dashboard', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;

    // Fetch symptom logs
    const symptomLogs = await SymptomLog.find({ userId }).sort({ createdAt: -1 });

    // Fetch orders
    const orders = await Order.find({ userId }).populate('medicineItems').sort({ createdAt: -1 });

    // Fetch reminders
    const reminders = await Reminder.find({ userId });

    // Calculate statistics
    const totalSymptoms = symptomLogs.length;
    const averageSeverity = calculateAverageSeverity(symptomLogs);
    const medicinesPurchased = orders.length;
    const appointmentsBooked = reminders.filter(r => r.type === 'appointment').length;

    // Weekly trend data
    const weeklyData = calculateWeeklyTrend(symptomLogs);

    // Symptom frequency
    const symptomFrequency = calculateSymptomFrequency(symptomLogs);

    // Severity trends
    const severityTrend = calculateSeverityTrend(symptomLogs);

    // Recent medicine purchases
    const medicineHistory = orders
      .slice(0, 10)
      .map(order => ({
        name: (order as any).medicineItems?.map((m: any) => m.name).join(', ') || 'Unknown',
        quantity: (order as any).medicineItems?.length || 1,
        date: order.createdAt?.toISOString().split('T')[0] || '',
        price: (order as any).medicineItems?.reduce((sum: number, m: any) => sum + (m.price || 0), 0) || 0,
      }));

    res.json({
      success: true,
      data: {
        totalSymptoms,
        averageSeverity,
        medicinesPurchased,
        appointmentsBooked,
        weeklyData,
        symptomFrequency,
        medicineHistory,
        severityTrend,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/health-stats/symptom-trends
 * Get detailed symptom trends over time
 */
router.get('/symptom-trends', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const days = parseInt(req.query.days as string) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const symptomLogs = await SymptomLog.find({
      userId,
      createdAt: { $gte: startDate },
    }).sort({ createdAt: -1 });

    const trends = calculateDetailedTrends(symptomLogs, days);

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        totalSymptoms: symptomLogs.length,
        trends,
      },
    });
  } catch (error) {
    console.error('Error fetching symptom trends:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching symptom trends',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/health-stats/health-summary
 * Get health summary based on medical history and recent logs
 */
router.get('/health-summary', protect, async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user as any)._id;

    const medicalHistory = await MedicalHistory.findOne({ userId });
    const recentSymptoms = await SymptomLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const healthRiskLevel = calculateHealthRisk(medicalHistory, recentSymptoms);

    res.json({
      success: true,
      data: {
        bloodGroup: medicalHistory?.bloodGroup || 'Not recorded',
        allergies: medicalHistory?.allergies || 'None',
        chronicConditions: medicalHistory?.chronicConditions || 'None',
        recentSymptomCount: recentSymptoms.length,
        healthRiskLevel,
        lastUpdated: medicalHistory?.updatedAt || null,
      },
    });
  } catch (error) {
    console.error('Error fetching health summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching health summary',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Helper functions
function calculateAverageSeverity(symptoms: any[]): string {
  if (symptoms.length === 0) return 'N/A';

  const severityMap: Record<string, number> = {
    mild: 1,
    moderate: 2,
    severe: 3,
  };

  const total = symptoms.reduce((sum, log) => {
    return sum + (severityMap[log.severity] || 1);
  }, 0);

  const average = total / symptoms.length;

  if (average >= 2.5) return 'High';
  if (average >= 1.5) return 'Medium';
  return 'Low';
}

function calculateWeeklyTrend(symptoms: any[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  return last7Days.map(date => {
    const daySymptoms = symptoms.filter(s =>
      new Date(s.createdAt).toISOString().split('T')[0] === date
    );

    const severity = daySymptoms.reduce((sum, s) => {
      const severityMap: Record<string, number> = {
        mild: 1,
        moderate: 2,
        severe: 3,
      };
      return sum + (severityMap[s.severity] || 1);
    }, 0);

    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      symptoms: daySymptoms.length,
      severity,
    };
  });
}

function calculateSymptomFrequency(symptoms: any[]) {
  const frequency: Record<string, number> = {};

  symptoms.forEach(log => {
    log.symptoms?.forEach((symptom: string) => {
      frequency[symptom] = (frequency[symptom] || 0) + 1;
    });
  });

  return Object.entries(frequency)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function calculateSeverityTrend(symptoms: any[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  return last7Days.map(date => {
    const daySymptoms = symptoms.filter(s =>
      new Date(s.createdAt).toISOString().split('T')[0] === date
    );

    const mild = daySymptoms.filter(s => s.severity === 'mild').length;
    const moderate = daySymptoms.filter(s => s.severity === 'moderate').length;
    const severe = daySymptoms.filter(s => s.severity === 'severe').length;

    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      mild,
      moderate,
      severe,
    };
  });
}

function calculateDetailedTrends(symptoms: any[], days: number) {
  const trends = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const daySymptoms = symptoms.filter(s =>
      new Date(s.createdAt).toISOString().split('T')[0] === dateStr
    );

    if (daySymptoms.length > 0) {
      trends.push({
        date: dateStr,
        count: daySymptoms.length,
        avgSeverity: calculateDayAverageSeverity(daySymptoms),
        symptoms: daySymptoms.map(s => ({
          name: s.symptoms?.join(', '),
          severity: s.severity,
          notes: s.notes,
        })),
      });
    }
  }

  return trends;
}

function calculateDayAverageSeverity(symptoms: any[]): string {
  const severityMap: Record<string, number> = {
    mild: 1,
    moderate: 2,
    severe: 3,
  };

  const total = symptoms.reduce((sum, s) => sum + (severityMap[s.severity] || 1), 0);
  const average = total / symptoms.length;

  if (average >= 2.5) return 'High';
  if (average >= 1.5) return 'Medium';
  return 'Low';
}

function calculateHealthRisk(medicalHistory: any, symptoms: any[]): string {
  if (symptoms.length === 0) return 'Low';

  const recentHighSeverity = symptoms
    .slice(0, 5)
    .some(s => s.severity === 'severe');

  if (recentHighSeverity) return 'High';

  const hasChronicConditions = medicalHistory?.chronicConditions;
  const hasAllergies = medicalHistory?.allergies;

  if (hasChronicConditions || hasAllergies) {
    const recentModerateSeverity = symptoms
      .slice(0, 5)
      .some(s => s.severity === 'moderate');
    return recentModerateSeverity ? 'Medium' : 'Low';
  }

  return 'Low';
}

export default router;
