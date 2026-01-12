# Health Dashboard - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Run the Application

**Frontend**:
```bash
cd /Users/architmittal/Desktop/CODE/OPENSOURCE_HEALTH/sehat-saathi-guide
npm run dev
# or
bun dev
```

**Backend**:
```bash
cd sehat-sakshi-backend
npm run dev
# or
bun dev
```

### Step 2: Add Test Data

1. Go to `http://localhost:5173/symptoms`
2. Add some sample symptoms (e.g., Headache, Fever, Cough)
3. Click "Submit" to save
4. Repeat 2-3 times with different dates

### Step 3: Access Dashboard

1. Click "Dashboard" in the navbar (visible when logged in)
   - Or go to `http://localhost:5173/dashboard`
2. You should see statistics cards populated with data

### Step 4: Explore Features

**View Charts**:
- Click "Overview" tab → See weekly trends
- Click "Analytics" tab → See symptom frequency and severity breakdown
- Click "History" tab → See medicine purchase history

**Export Data**:
- Click "Export as PDF" → Downloads health report
- Click "Export as CSV" → Downloads spreadsheet data

**Switch Language**:
- Use language selector in navbar
- Dashboard text changes to selected language

## 📊 What You'll See

### Statistics Cards
```
┌─────────────────┬──────────────────┬──────────────────┬─────────────────┐
│ Total Symptoms  │  Avg Severity    │ Medicines Bought │  Appointments   │
│       5         │      Medium      │        2         │        1        │
└─────────────────┴──────────────────┴──────────────────┴─────────────────┘
```

### Weekly Trends Chart
Line chart showing:
- Blue line: Number of symptoms per day
- Red line: Severity points per day

### Symptom Frequency Chart
Pie chart showing:
- Top 5 most reported symptoms
- Percentage distribution
- Color-coded slices

### Severity Breakdown
Stacked bar chart showing:
- Green bars: Mild symptoms
- Yellow bars: Moderate symptoms
- Red bars: Severe symptoms

## 🎯 Common Tasks

### Add More Test Data Quickly

```bash
# Open DevTools Console (F12) and run:

// Add 5 random symptoms
const symptoms = [
  {id:'1', name:'Headache', date:'2026-01-12', time:'09:00', severity:'low', description:'Minor headache'},
  {id:'2', name:'Fever', date:'2026-01-12', time:'10:00', severity:'high', description:'High temperature'},
  {id:'3', name:'Cough', date:'2026-01-11', time:'14:00', severity:'medium', description:'Persistent cough'},
  {id:'4', name:'Nausea', date:'2026-01-11', time:'15:30', severity:'medium', description:'Mild nausea'},
  {id:'5', name:'Fatigue', date:'2026-01-10', time:'08:00', severity:'low', description:'General tiredness'}
];
localStorage.setItem('symptoms', JSON.stringify(symptoms));

// Refresh dashboard
window.location.reload();
```

### Export and View Report

1. Click "Export as PDF"
2. Open the downloaded file
3. View the health report with all statistics
4. Print or save as needed

### View Dashboard Data in Console

```bash
# In DevTools Console:
JSON.parse(localStorage.getItem('symptoms'))
JSON.parse(localStorage.getItem('cartHistory'))
JSON.parse(localStorage.getItem('appointments'))
```

## 🔧 Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Dashboard shows "No data available" | Add symptoms using Symptom Tracker first |
| Charts look blank | Refresh the page |
| Export buttons don't work | Check browser download permissions |
| Language not changing | Clear cache and refresh |
| Backend API errors | Make sure backend is running on correct port |

## 📱 Testing on Mobile

```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
# or
hostname -I  # Linux

# Access from mobile on same network
http://<your-ip>:5173/dashboard
```

## 🎨 Customizing the Dashboard

### Change Colors

Edit `src/components/HealthDashboard.tsx`:
```typescript
const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];
```

### Add New Statistics Card

1. Add field to `DashboardStats` interface
2. Calculate value in `fetchDashboardStats()`
3. Add new Card component in JSX

### Add New Chart

1. Import chart type from recharts
2. Add data calculation function
3. Add Tab and chart component

## 📊 API Endpoints (Backend Only)

### Get Dashboard Data
```bash
curl -X GET http://localhost:5000/api/health-stats/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Symptom Trends
```bash
curl -X GET "http://localhost:5000/api/health-stats/symptom-trends?days=30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Health Summary
```bash
curl -X GET http://localhost:5000/api/health-stats/health-summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🧪 Test Scenarios

### Scenario 1: View Weekly Trends
1. Add symptoms on different days
2. Go to Dashboard → Overview tab
3. Verify line chart shows trend

### Scenario 2: Export and Share
1. Add some symptoms
2. Click "Export as PDF"
3. Open file and verify content
4. Share with doctor/family

### Scenario 3: Multilingual Dashboard
1. Add symptoms in app
2. Open Dashboard
3. Change language using navbar selector
4. Verify all text is translated
5. Try exporting in different language

### Scenario 4: Mobile Responsiveness
1. Open Dashboard on mobile
2. Verify cards stack vertically
3. Verify charts are readable
4. Try exporting
5. Verify zoom/scroll works

## 📈 Feature Highlights

✅ **Real-time Statistics**: Updates as you add symptoms
✅ **Interactive Charts**: Hover for detailed information
✅ **Multi-language Support**: Works in 6 languages
✅ **Professional Reports**: Export to PDF with formatting
✅ **Responsive Design**: Works on all devices
✅ **Dark Mode**: Full theme support
✅ **No Data Loss**: Works offline via localStorage

## 🚀 Performance Notes

- Dashboard loads in < 1 second with 100+ symptoms
- Charts render smoothly with React Query optimization
- Exports generate instantly client-side
- No external API calls for basic dashboard

## 📞 Getting Help

### Common Questions

**Q: Why is my dashboard empty?**
A: You need to add symptoms first using the Symptom Tracker.

**Q: Can I delete my data?**
A: Yes, clear localStorage in DevTools → Application → Local Storage

**Q: Does this sync to backend?**
A: Currently uses localStorage only. Backend sync coming soon.

**Q: Can I print the dashboard?**
A: Yes, use browser print (Ctrl+P) or export as PDF.

**Q: How do I change the theme?**
A: Click the moon/sun icon in navbar to toggle dark mode.

## 🎓 Learning Resources

- `HEALTH_DASHBOARD_DOCS.md` - Detailed technical documentation
- `DASHBOARD_IMPLEMENTATION_GUIDE.md` - Implementation details
- Component source: `src/components/HealthDashboard.tsx`
- Backend source: `sehat-sakshi-backend/src/routes/healthStats.ts`

## ✨ Tips & Tricks

1. **Keyboard Shortcuts**
   - Ctrl+P: Print dashboard
   - Ctrl+Shift+J: Open DevTools console

2. **Data Management**
   - Export weekly reports
   - Keep backup of important data
   - Monitor severity trends

3. **Health Tracking**
   - Log symptoms consistently
   - Add detailed descriptions
   - Note time of symptoms

4. **Sharing Reports**
   - Export as PDF for doctors
   - Share CSV with family
   - Keep copies for records

---

**Happy Tracking!** 🏥💪
