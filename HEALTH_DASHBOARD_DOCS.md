# Health Dashboard & Statistics Feature

## 🎯 Overview

The Health Dashboard is a comprehensive analytics and visualization feature that helps users track, analyze, and understand their health data over time. It provides interactive charts, statistics, and exportable reports.

## ✨ Features

### 1. **Dashboard Statistics Cards**
- **Total Symptoms**: Cumulative count of all recorded symptoms
- **Average Severity**: Overall health severity level (Low/Medium/High)
- **Medicines Purchased**: Total count of medicine purchases from store
- **Appointments Booked**: Total health appointments scheduled

### 2. **Analytics Visualizations**

#### Overview Tab
- **Weekly Symptom Trends**: Line chart showing symptom frequency and severity over the last 7 days
- Real-time data updates from localStorage

#### Analytics Tab
- **Symptom Frequency Chart**: Pie chart showing top 5 most reported symptoms
- **Severity Trends**: Stacked bar chart showing mild/moderate/severe symptom distribution

#### History Tab
- **Medicine Purchase History**: Table of recent medicine purchases with details
- Sortable columns with date, quantity, and price information

### 3. **Export Functionality**
- **Export as PDF**: Generate professional health report in PDF format
- **Export as CSV**: Export data for use in spreadsheet applications
- Support for bilingual exports (English & Hindi)

## 🛠️ Technical Implementation

### Frontend Components

#### HealthDashboard.tsx
**Location**: `/src/components/HealthDashboard.tsx`

**Key Features**:
- React functional component with hooks
- Uses Recharts for data visualization
- Integrates with LanguageContext for multilingual support
- Manages state using localStorage data
- Responsive design with Tailwind CSS

**Main Functions**:
```typescript
- fetchDashboardStats(): Aggregates health data from localStorage
- calculateWeeklyData(): Generates 7-day trend data
- calculateSymptomFrequency(): Ranks symptoms by frequency
- calculateSeverityTrend(): Tracks severity distribution over time
- calculateAverageSeverity(): Computes overall health severity
```

**Data Flow**:
1. Component mounts → Fetches data from localStorage
2. Processes raw data into chart-ready format
3. Renders visualizations using Recharts
4. Handles export operations

### Backend Routes

#### healthStats.ts
**Location**: `/sehat-sakshi-backend/src/routes/healthStats.ts`

**Endpoints**:

1. **GET `/api/health-stats/dashboard`**
   - Returns comprehensive dashboard statistics
   - Requires authentication
   - Response includes all dashboard metrics

2. **GET `/api/health-stats/symptom-trends`**
   - Query: `days` (default: 30)
   - Returns detailed symptom trends for specified period
   - Includes individual symptom logs

3. **GET `/api/health-stats/health-summary`**
   - Returns health summary based on medical history
   - Calculates health risk level
   - Includes allergies, chronic conditions, blood group

**Helper Functions**:
```typescript
- calculateAverageSeverity(): Computes average severity
- calculateWeeklyTrend(): Generates 7-day trend data
- calculateSymptomFrequency(): Ranks symptoms by occurrence
- calculateSeverityTrend(): Creates severity distribution
- calculateDetailedTrends(): Generates multi-day trend analysis
- calculateHealthRisk(): Assesses overall health risk level
```

### Export Utilities

#### exportUtils.ts Updates
**New Functions**:

1. **exportDashboardToPDF(stats, language)**
   - Generates PDF with statistics summary
   - Includes tables for symptoms and medicine history
   - Supports bilingual output
   - Uses jsPDF & autoTable libraries

2. **exportDashboardToCSV(stats, language)**
   - Exports statistics as CSV format
   - Includes frequency and history data
   - Browser-based download

## 📊 Data Structure

### DashboardStats Interface
```typescript
interface DashboardStats {
  totalSymptoms: number;
  averageSeverity: string;        // "Low" | "Medium" | "High"
  medicinesPurchased: number;
  appointmentsBooked: number;
  weeklyData: WeeklyData[];
  symptomFrequency: SymptomFrequency[];
  medicineHistory: MedicineHistory[];
  severityTrend: SeverityTrend[];
}

interface WeeklyData {
  date: string;
  symptoms: number;
  severity: number;
}

interface SymptomFrequency {
  name: string;
  value: number;
}

interface MedicineHistory {
  name: string;
  quantity: number;
  date: string;
  price: number;
}

interface SeverityTrend {
  date: string;
  mild: number;
  moderate: number;
  severe: number;
}
```

## 🌍 Localization

Full support for 6 languages:
- **English** (en)
- **Hindi** (hi)
- **Bengali** (bn)
- **Marathi** (mr)
- **Bhojpuri** (bho)
- **Maithili** (mai)

All UI text, chart labels, and exports are localized.

## 🔗 Integration Points

### Routing
**App.tsx**:
```tsx
<Route path="/dashboard" element={<HealthDashboard />} />
```

### Navbar Integration
Dashboard link appears conditionally for authenticated users:
```tsx
...(isAuthenticated ? [{ path: '/dashboard', label: 'Dashboard', icon: Activity }] : [])
```

### Context Integration
- **LanguageContext**: For language selection
- **AuthContext**: For user authentication status
- **Cart/Medicine data**: Via localStorage

## 📱 Usage Guide

### Viewing the Dashboard

1. **Navigate to Dashboard**
   - Click "Dashboard" in navbar (visible when logged in)
   - Or navigate directly to `/dashboard`

2. **View Statistics**
   - Check status cards at the top
   - Review current health metrics

3. **Analyze Trends**
   - Click "Analytics" tab
   - View symptom frequency (pie chart)
   - Check severity trends (stacked bar chart)

4. **Review History**
   - Click "History" tab
   - View recent medicine purchases
   - Check transaction details

5. **Export Data**
   - Click "Export as PDF" or "Export as CSV"
   - Download report to your device
   - Use for medical records or sharing

## 🎨 Design Features

- **Responsive Layout**: Works on mobile, tablet, and desktop
- **Interactive Charts**: Hover for detailed information
- **Color-coded Severity**: 
  - Green (Low)
  - Yellow (Medium)
  - Red (High)
- **Dark Mode Support**: Full theme integration
- **Loading States**: Smooth loading experience
- **Empty States**: Helpful message when no data available

## 🔐 Security & Privacy

- All data accessed from user's localStorage
- No external API calls for basic dashboard
- Backend routes require authentication middleware
- Export files generated client-side
- No data stored remotely by default

## 🚀 Performance Optimizations

- Efficient data aggregation algorithms
- Memoized calculations using React hooks
- Lazy-loaded charts with Recharts
- Minimal re-renders on data updates
- CSV/PDF generation happens client-side

## 📋 Future Enhancements

1. **Cloud Sync**: Persist dashboard data to server
2. **Shared Reports**: Share health reports with family/doctors
3. **Advanced Filters**: Filter by date range, symptom type
4. **Predictions**: ML-based health trend predictions
5. **Comparative Analytics**: Compare current vs past periods
6. **Mobile App Export**: Better mobile export experience
7. **Integration with Wearables**: Sync with fitness trackers
8. **Real-time Alerts**: Notify for unusual patterns

## 🐛 Known Limitations

1. Currently uses localStorage (not synced across devices)
2. Max 5 top symptoms displayed in frequency chart
3. Limited to 10 recent medicine entries in history
4. 7-day trend window is fixed
5. Requires browser localStorage support

## 📝 Testing Checklist

- [ ] Dashboard loads without error
- [ ] Statistics cards display correct values
- [ ] Charts render properly with sample data
- [ ] Tab switching works smoothly
- [ ] PDF export generates without errors
- [ ] CSV export downloads correctly
- [ ] Responsive layout works on mobile
- [ ] Localization works for all 6 languages
- [ ] Export includes correct language strings
- [ ] Empty state displays when no data available

## 💡 Tips for Users

1. **Regular Tracking**: Use symptom tracker regularly for accurate trends
2. **Complete Purchases**: Complete medicine purchases to see in history
3. **Book Appointments**: Schedule appointments to track usage
4. **Export Regularly**: Keep copies of your health reports
5. **Review Trends**: Check dashboard weekly to spot patterns

## 📞 Support

For issues or questions about the Health Dashboard:
1. Check the technical documentation above
2. Review component source code
3. Check browser console for errors
4. Verify localStorage is enabled
5. Contact development team with detailed error messages
