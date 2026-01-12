# Health Dashboard - Architecture & System Design

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SEHAT SAATHI APP                            │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                     USER INTERFACE LAYER                    │ │
│  │                                                              │ │
│  │  ┌─────────────────┐      ┌──────────────────────────────┐ │ │
│  │  │   NAVBAR        │      │   HEALTH DASHBOARD PAGE      │ │ │
│  │  ├─────────────────┤      ├──────────────────────────────┤ │ │
│  │  │ Dashboard Link  │◄────►│ /dashboard Route             │ │ │
│  │  │ (Auth Check)    │      │ (/src/pages/HealthDashboard)│ │ │
│  │  └─────────────────┘      └──────────────────────────────┘ │ │
│  │                                        │                     │ │
│  │                                        ▼                     │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │         HEALTH DASHBOARD COMPONENT                  │  │ │
│  │  │      (/src/components/HealthDashboard.tsx)         │  │ │
│  │  │                                                     │  │ │
│  │  │  ┌─────────────────────────────────────────────┐  │  │ │
│  │  │  │  STATISTICS CARDS (4)                       │  │  │ │
│  │  │  │  - Total Symptoms                           │  │  │ │
│  │  │  │  - Average Severity                         │  │  │ │
│  │  │  │  - Medicines Purchased                      │  │  │ │
│  │  │  │  - Appointments Booked                      │  │  │ │
│  │  │  └─────────────────────────────────────────────┘  │  │ │
│  │  │                                                     │  │ │
│  │  │  ┌─────────────────────────────────────────────┐  │  │ │
│  │  │  │  EXPORT BUTTONS                             │  │  │ │
│  │  │  │  - Export as PDF                            │  │  │ │
│  │  │  │  - Export as CSV                            │  │  │ │
│  │  │  └─────────────────────────────────────────────┘  │  │ │
│  │  │                                                     │  │ │
│  │  │  ┌─────────────────────────────────────────────┐  │  │ │
│  │  │  │  TABBED INTERFACE                           │  │  │ │
│  │  │  ├──────────────────────────────────────────┤  │  │ │
│  │  │  │ TAB 1: OVERVIEW                           │  │  │ │
│  │  │  │ - Weekly Symptom Trends (Line Chart)      │  │  │ │
│  │  │  │ - Recharts Library                        │  │  │ │
│  │  │  ├──────────────────────────────────────────┤  │  │ │
│  │  │  │ TAB 2: ANALYTICS                          │  │  │ │
│  │  │  │ - Symptom Frequency (Pie Chart)           │  │  │ │
│  │  │  │ - Severity Trends (Stacked Bar)           │  │  │ │
│  │  │  ├──────────────────────────────────────────┤  │  │ │
│  │  │  │ TAB 3: HISTORY                            │  │  │ │
│  │  │  │ - Medicine Purchase History (Table)       │  │  │ │
│  │  │  └─────────────────────────────────────────────┘  │  │ │
│  │  │                                                     │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                              │                                   │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                  Data Fetching │ (localStorage + API)
                               ▼
            ┌──────────────────────────────────────┐
            │      DATA LAYER                      │
            │                                      │
            │  CLIENT-SIDE (localStorage)          │
            │  ├─ Symptoms                         │
            │  ├─ Medicine Purchases               │
            │  ├─ Appointments                     │
            │  └─ User Preferences                 │
            │                                      │
            │  SERVER-SIDE (MongoDB)               │
            │  ├─ SymptomLog Collection            │
            │  ├─ Order Collection                 │
            │  ├─ Reminder Collection              │
            │  ├─ MedicalHistory Collection        │
            │  └─ User Collection                  │
            │                                      │
            └──────────────────────────────────────┘
                      ▲           ▲
                      │           │
        ┌─────────────┴───────────┴──────────────┐
        │                                        │
        ▼                                        ▼
   ┌──────────────────┐            ┌────────────────────┐
   │   EXPORT         │            │  BACKEND API       │
   │   UTILITIES      │            │  ROUTES            │
   │                  │            │                    │
   │  exportDashboard │            │ /api/health-stats/ │
   │  ToPDF()         │            │ ├─ /dashboard      │
   │                  │            │ ├─ /symptom-trends │
   │  exportDashboard │            │ └─ /health-summary │
   │  ToCSV()         │            │                    │
   │                  │            │ + Auth Middleware  │
   │  Uses jsPDF &    │            │ + Calculations     │
   │  autoTable       │            │ + Error Handling   │
   │                  │            │                    │
   └──────────────────┘            └────────────────────┘
```

## 📊 Data Flow Diagram

```
USER ACTIONS
    │
    ├─ Click Dashboard Link
    │   ├─ Route: /dashboard
    │   └─ Load: HealthDashboard Component
    │
    ├─ Component Mount
    │   ├─ Fetch localStorage data
    │   ├─ Process statistics
    │   └─ Render UI
    │
    ├─ View Charts
    │   ├─ Click tabs
    │   └─ Recharts renders visualization
    │
    ├─ Export Data
    │   ├─ Click Export button
    │   ├─ Generate PDF/CSV
    │   └─ Browser downloads file
    │
    └─ Switch Language
        ├─ LanguageContext updates
        └─ UI re-renders with translations


BACKEND DATA PROCESSING
    │
    ├─ GET /api/health-stats/dashboard
    │   ├─ Auth Middleware validation
    │   ├─ Query MongoDB collections
    │   ├─ Calculate statistics
    │   └─ Return aggregated data
    │
    ├─ GET /api/health-stats/symptom-trends
    │   ├─ Filter by date range
    │   ├─ Process symptom logs
    │   ├─ Generate trends
    │   └─ Return trend data
    │
    └─ GET /api/health-stats/health-summary
        ├─ Fetch medical history
        ├─ Get recent symptoms
        ├─ Calculate health risk
        └─ Return summary data
```

## 🔄 Component Relationship Diagram

```
App.tsx
   │
   ├─ ThemeProvider
   ├─ LanguageProvider
   ├─ AuthProvider
   ├─ CartProvider
   │
   ├─ Navbar
   │  └─ [Dashboard Link] ──┐
   │                        │
   └─ Routes               │
      ├─ / (Index)         │
      ├─ /symptoms         │
      ├─ /tips             │
      ├─ /dashboard ◄──────┘
      │  └─ HealthDashboard Component
      │     ├─ Statistics Cards (4)
      │     ├─ Export Buttons (2)
      │     ├─ Tabs (3)
      │     │  ├─ Overview
      │     │  │  └─ LineChart (Recharts)
      │     │  ├─ Analytics
      │     │  │  ├─ PieChart (Recharts)
      │     │  │  └─ BarChart (Recharts)
      │     │  └─ History
      │     │     └─ Table Component
      │     │
      │     └─ Helper Functions
      │        ├─ fetchDashboardStats()
      │        ├─ calculateWeeklyData()
      │        ├─ calculateSymptomFrequency()
      │        ├─ calculateSeverityTrend()
      │        ├─ calculateAverageSeverity()
      │        ├─ handleExportPDF()
      │        └─ handleExportCSV()
      │
      ├─ /store
      ├─ /assistant
      └─ ... (other routes)
```

## 🗄️ Data Model

```
User Profile
├─ ID
├─ Email
├─ Name
└─ Role (patient/doctor/admin)

MedicalHistory
├─ UserID (FK)
├─ Blood Group
├─ Allergies
├─ Chronic Conditions
├─ Surgeries
├─ Current Medications
└─ Last Updated

SymptomLog (Many)
├─ ID
├─ UserID (FK)
├─ Symptoms []
├─ Severity (mild/moderate/severe)
├─ Notes
├─ Triage Result
│  ├─ Level
│  └─ Recommendation
└─ Timestamp

Order (Many)
├─ ID
├─ UserID (FK)
├─ Medicines []
│  ├─ Name
│  ├─ Quantity
│  └─ Price
├─ Total Price
└─ Timestamp

Reminder (Many)
├─ ID
├─ UserID (FK)
├─ Type (medication/appointment/health-tip)
├─ Description
├─ Due Date
└─ Status (pending/completed)
```

## 🔐 Authentication & Authorization

```
LOGIN FLOW
    │
    ├─ User enters credentials
    ├─ Backend validates
    ├─ JWT token generated
    └─ Token stored in localStorage
         │
         ▼
PROTECTED ROUTE ACCESS
    │
    ├─ Check if user authenticated
    ├─ Show/hide Dashboard link
    └─ Dashboard accessible when logged in
         │
         ▼
API CALL WITH AUTH
    │
    ├─ Request includes token header
    ├─ Backend validates token
    ├─ authMiddleware checks authorization
    └─ Allow/deny based on permissions
```

## 📱 Responsive Design Breakpoints

```
Mobile (< 768px)
├─ Single column layout
├─ Cards stack vertically
├─ Charts full width
├─ Simplified navigation
└─ Touch-friendly buttons

Tablet (768px - 1024px)
├─ 2 column grid
├─ Cards side by side
├─ Charts responsive
├─ Better spacing
└─ Balanced layout

Desktop (> 1024px)
├─ 4 column grid
├─ All cards visible
├─ Charts optimized width
├─ Maximum information
└─ Ideal for viewing
```

## 🔄 State Management Flow

```
Component Mount
    │
    ├─ Initialize state
    │  ├─ stats: null
    │  └─ loading: true
    │
    ├─ useEffect called
    │  └─ fetchDashboardStats()
    │
    ├─ Fetch data
    │  ├─ Get from localStorage
    │  ├─ Or fetch from API
    │  └─ Process data
    │
    ├─ Update state
    │  ├─ stats: DashboardStats
    │  └─ loading: false
    │
    └─ Render UI
       ├─ Show statistics
       ├─ Render charts
       └─ Enable interactions
```

## 🎯 Feature Dependencies

```
HealthDashboard
├─ React (UI rendering)
├─ Recharts (visualizations)
├─ Tailwind CSS (styling)
├─ lucide-react (icons)
├─ sonner (notifications)
├─ LanguageContext (i18n)
├─ localStorage API (data storage)
├─ exportUtils (PDF/CSV generation)
│  ├─ jsPDF
│  └─ jspdf-autotable
└─ React Router (navigation)

Backend API
├─ Express (server)
├─ Mongoose (database ORM)
├─ MongoDB (database)
├─ JWT (authentication)
└─ CORS (cross-origin)
```

## 📈 Calculation Algorithms

### Average Severity Calculation
```
BEGIN
  severityMap = { mild: 1, moderate: 2, severe: 3 }
  total = 0
  count = 0
  
  FOR EACH symptom IN symptoms
    total += severityMap[symptom.severity]
    count += 1
  END FOR
  
  average = total / count
  
  IF average >= 2.5
    RETURN "High"
  ELSE IF average >= 1.5
    RETURN "Medium"
  ELSE
    RETURN "Low"
  END IF
END
```

### Symptom Frequency Ranking
```
BEGIN
  frequency = {}
  
  FOR EACH log IN symptomLogs
    FOR EACH symptom IN log.symptoms
      frequency[symptom] += 1
    END FOR
  END FOR
  
  ranked = SORT(frequency, BY: value DESC)
  topFive = ranked.slice(0, 5)
  
  RETURN topFive
END
```

### Weekly Trend Generation
```
BEGIN
  weeklyData = []
  
  FOR day = 6 DOWN TO 0
    date = TODAY - day DAYS
    daySymptoms = FILTER(symptoms, BY: date)
    
    symptomCount = daySymptoms.length
    severityPoints = SUM(daySymptoms.severity)
    
    weeklyData.push({
      date: date.dayName(),
      symptoms: symptomCount,
      severity: severityPoints
    })
  END FOR
  
  RETURN weeklyData
END
```

## 🚀 Performance Considerations

```
OPTIMIZATION STRATEGIES
├─ Data Caching
│  ├─ localStorage for client data
│  ├─ React Query for API data
│  └─ Memoization for calculations
│
├─ Lazy Loading
│  ├─ Charts load on tab click
│  ├─ Images optimized
│  └─ Code splitting
│
├─ Efficient Calculations
│  ├─ O(n) algorithms
│  ├─ Single pass processing
│  └─ Minimal re-renders
│
├─ Resource Optimization
│  ├─ SVG charts instead of canvas
│  ├─ Minimal DOM updates
│  └─ CSS animations over JS
│
└─ Export Optimization
   ├─ Client-side generation
   ├─ No server overhead
   └─ Instant downloads
```

---

This architecture ensures:
✅ **Scalability** - Can handle large datasets
✅ **Maintainability** - Clear separation of concerns
✅ **Performance** - Optimized calculations and rendering
✅ **Security** - Authentication on sensitive routes
✅ **Accessibility** - Works for all users
✅ **Responsiveness** - Adapts to all devices
