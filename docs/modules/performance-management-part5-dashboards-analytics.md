---
title: "Performance Management - Part 5: Dashboards and Analytics"
sidebar_position: 11
description: "This document provides a comprehensive guide to performance dashboards and analytics, covering manager views, employee self-views, super admin dashboards."
---

# Performance Management Module - Part 5: Dashboards and Analytics

This document provides a comprehensive guide to performance dashboards and analytics, covering manager views, employee self-views, super admin dashboards, and advanced analytics visualizations.

## Table of Contents

1. [Overview](#overview)
2. [Manager Dashboard](#manager-dashboard)
3. [Super Admin Dashboard](#super-admin-dashboard)
4. [Employee Self-View](#employee-self-view)
5. [Analytics Components](#analytics-components)
6. [Analytics API](#analytics-api)
7. [Implementation Examples](#implementation-examples)

## Overview

The Performance Management module provides comprehensive dashboards and analytics at three levels:

- **Employee Level**: Personal performance history and trends
- **Manager Level**: Team performance overview and analytics
- **Super Admin Level**: Organization-wide performance metrics

### Key Features

- **Performance Overview Cards**: Quick stats and metrics
- **Trend Analysis**: Time-series charts showing performance over time
- **Distribution Analysis**: Performance category breakdowns
- **Top Performers**: Identify best and worst performers
- **KPI Performance**: Individual KPI analysis
- **Heatmaps**: Visual performance patterns
- **Aggregated Views**: Period-based aggregations
- **Filtering**: Advanced filters by date, department, designation

## Manager Dashboard

**Component:** `ManagerDashboard.jsx`

**Location:** `hcmFrontend/src/components/performance management razor/ManagerDashboard.jsx`

### Purpose

Provides managers with a comprehensive view of their team's performance, including overview metrics, detailed ratings table, and advanced analytics.

### Key Features

1. **Team Overview Cards**

   - Total team members
   - Average performance score
   - Ratings completed
   - Performance trends

2. **Team Performance Table**

   - List of all team members
   - Individual performance scores
   - Period-based views
   - Quick actions (view details, rate)

3. **Team Analytics**
   - Performance trends over time
   - Category distributions
   - Top/bottom performers
   - KPI-level analysis

### Component Structure

```javascript
function ManagerDashboard() {
  const {
    getTeamRatingsAdvanced,
    getTeamRatingsAdvancedAggregated,
    getManagerTeamAggregated,
    loading,
  } = useRatingStore();

  // Filter state
  const [frequency, setFrequency] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  // Data state
  const [teamRatings, setTeamRatings] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Fetch team ratings
  const fetchTeamRatings = async () => {
    const params = {
      frequency,
      startDate,
      endDate,
      department,
      designation,
    };
    const data = await getTeamRatingsAdvanced(params);
    setTeamRatings(data.data);
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    const params = {
      frequency,
      startDate,
      endDate,
      department,
      designation,
    };
    const data = await getManagerTeamAggregated(params);
    setAnalyticsData(data.data);
  };
}
```

### Overview Cards

```javascript
// Calculate overview metrics
const totalMembers = teamRatings.length;
const avgScore =
  teamRatings.reduce((sum, r) => sum + r.totalScore, 0) / totalMembers;
const completedRatings = teamRatings.filter((r) => r.hasRating).length;
const completionRate = (completedRatings / totalMembers) * 100;

// Display cards
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <Card title="Team Members" value={totalMembers} icon={<FiUsers />} />
  <Card title="Avg Score" value={avgScore.toFixed(1)} icon={<FiTrendingUp />} />
  <Card title="Completed" value={completedRatings} icon={<FiCheck />} />
  <Card
    title="Completion Rate"
    value={`${completionRate.toFixed(1)}%`}
    icon={<FiBarChart />}
  />
</div>;
```

### Team Performance Table

```javascript
// Display team members with ratings
<table>
  <thead>
    <tr>
      <th>Employee</th>
      <th>Designation</th>
      <th>Period</th>
      <th>Total Score</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {teamRatings.map((rating) => (
      <tr key={rating._id}>
        <td>
          <div className="flex items-center">
            <img
              src={rating.employee.user_Avatar}
              className="w-8 h-8 rounded-full"
            />
            <span>
              {rating.employee.first_Name} {rating.employee.last_Name}
            </span>
          </div>
        </td>
        <td>{rating.employee.designation}</td>
        <td>{formatPeriod(rating)}</td>
        <td>
          <span className={getScoreColor(rating.totalScore)}>
            {rating.totalScore}
          </span>
        </td>
        <td>
          {rating.hasRating ? (
            <span className="badge-success">Rated</span>
          ) : (
            <span className="badge-warning">Pending</span>
          )}
        </td>
        <td>
          <button onClick={() => viewDetails(rating.employee._id)}>
            View Details
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
```

### Analytics Integration

```javascript
// Render analytics component
{
  analyticsData && (
    <TeamPerformanceAnalytics data={analyticsData} frequency={frequency} />
  );
}
```

## Super Admin Dashboard

**Component:** `SuperAdminDashboard.jsx`

**Location:** `hcmFrontend/src/components/performance management razor/SuperAdminDashboard.jsx`

### Purpose

Provides organization-wide performance insights for super admins, including department-level views, organization analytics, and top performers.

### Key Features

1. **Organization Overview**

   - Total employees
   - Organization average score
   - Department breakdown
   - Designation breakdown

2. **Department Performance**

   - Department-wise averages
   - Department rankings
   - Department trends

3. **Organization Analytics**
   - Organization-wide trends
   - Performance distributions
   - Top performers (org-wide)
   - Heatmaps by department/designation

### Component Structure

```javascript
function SuperAdminDashboard() {
  const {
    getOrganizationRatingsAdvanced,
    getOrganizationRatingsAdvancedAggregated,
    getSuperAdminOrgAggregated,
    getOrganizationTopPerformer,
    loading,
  } = useRatingStore();

  // Filters
  const [frequency, setFrequency] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  // Data
  const [orgRatings, setOrgRatings] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);

  // Fetch organization ratings
  const fetchOrgRatings = async () => {
    const params = { frequency, startDate, endDate, department, designation };
    const data = await getOrganizationRatingsAdvanced(params);
    setOrgRatings(data.data);
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    const params = { frequency, startDate, endDate, department, designation };
    const data = await getSuperAdminOrgAggregated(params);
    setAnalyticsData(data.data);
  };

  // Fetch top performers
  const fetchTopPerformers = async () => {
    const params = { frequency, limit: 10 };
    const data = await getOrganizationTopPerformer(params);
    setTopPerformers(data.data);
  };
}
```

## Employee Self-View

**Component:** `MyPerformanceAdvanced.jsx`

**Location:** `hcmFrontend/src/components/performance management razor/MyPerformanceAdvanced.jsx`

### Purpose

Allows employees to view their own performance history, trends, and detailed KPI breakdowns.

### Key Features

1. **Personal Performance History**

   - All ratings for selected period
   - Period-based aggregations
   - Average performance score

2. **Trend Analysis**

   - Performance over time charts
   - KPI-level trends
   - Period comparisons

3. **KPI Details**
   - Individual KPI performance
   - KPI-specific comments
   - Target vs achieved analysis

### Component Structure

```javascript
function MyPerformanceAdvanced() {
  const employeeId = useAuthStore((state) => state._id);
  const { getEmployeeAggregatedRatings, loading } = useRatingStore();

  // Filter state
  const [frequency, setFrequency] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Data state
  const [aggregatedData, setAggregatedData] = useState([]);
  const [employeeData, setEmployeeData] = useState(null);
  const [rawRatings, setRawRatings] = useState([]);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedRawRating, setSelectedRawRating] = useState(null);

  // Fetch aggregated ratings
  const fetchRatings = async () => {
    const params = {
      periodType: frequency,
      startDate,
      endDate,
      // ... other period params
    };
    const data = await getEmployeeAggregatedRatings(employeeId, params);
    setAggregatedData(data.data);
    setEmployeeData(data.employee);
    setRawRatings(data.filteredRatings);
  };
}
```

### Aggregated View

```javascript
// Display aggregated ratings by period
{
  aggregatedData.map((period) => (
    <div key={period.period} className="rating-card">
      <div className="period-header">
        <h3>{period.period}</h3>
        <span className="score">{period.averageScore}/100</span>
      </div>
      <div className="kpi-breakdown">
        {period.kpis.map((kpi) => (
          <div key={kpi.kpiName} className="kpi-item">
            <span>{kpi.kpiName}</span>
            <span>
              {kpi.avgScore}/{kpi.marks}
            </span>
          </div>
        ))}
      </div>
      <button onClick={() => viewPeriodDetails(period)}>View Details</button>
    </div>
  ));
}
```

## Analytics Components

### TeamPerformanceAnalytics

**Location:** `hcmFrontend/src/components/performance management razor/Analytics/TeamPerformanceAnalytics.jsx`

### Purpose

Provides comprehensive analytics visualizations for team performance.

### Charts and Visualizations

#### 1. Performance Trend Chart

```javascript
// Line chart showing performance over time
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="period" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line
      type="monotone"
      dataKey="totalScore"
      stroke="#6366F1"
      strokeWidth={2}
    />
    <Line
      type="monotone"
      dataKey="normalizedScore"
      stroke="#10B981"
      strokeWidth={2}
    />
  </LineChart>
</ResponsiveContainer>
```

**Data Structure:**

```javascript
chartData = [
  { period: "2024-01-01", totalScore: 85, normalizedScore: 85 },
  { period: "2024-01-02", totalScore: 90, normalizedScore: 90 },
  // ...
];
```

#### 2. Category Distribution

```javascript
// Pie chart showing performance categories
<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={categoryDist}
      dataKey="value"
      nameKey="category"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {categoryDist.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

**Data Structure:**

```javascript
categoryDist = [
  { category: "Excellent", value: 5, periods: ["2024-01-01", "2024-01-02"] },
  { category: "Good", value: 10, periods: ["2024-01-03", ...] },
  { category: "Average", value: 3, periods: [...] },
  { category: "Needs Improvement", value: 1, periods: [...] }
]
```

#### 3. KPI Performance Chart

```javascript
// Bar chart showing average performance per KPI
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={avgKpiPerf}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="kpiName" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="avgScore" fill="#6366F1" />
    <Bar dataKey="maxMarks" fill="#E5E7EB" />
  </BarChart>
</ResponsiveContainer>
```

**Data Structure:**

```javascript
avgKpiPerf = [
  { kpiName: "Number of Sales", avgScore: 54, maxMarks: 60 },
  { kpiName: "Product Knowledge", avgScore: 36, maxMarks: 40 },
];
```

#### 4. Scatter Plot

```javascript
// Scatter plot: Target vs Achieved
<ResponsiveContainer width="100%" height={300}>
  <ScatterChart>
    <CartesianGrid />
    <XAxis type="number" dataKey="target" name="Target" />
    <YAxis type="number" dataKey="achieved" name="Achieved" />
    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
    <Scatter name="Performance" data={scatterData} fill="#6366F1" />
  </ScatterChart>
</ResponsiveContainer>
```

**Data Structure:**

```javascript
scatterData = [
  { target: 50, achieved: 45, employee: "John Doe" },
  { target: 50, achieved: 50, employee: "Jane Smith" },
  // ...
];
```

#### 5. Heatmap

```javascript
// Heatmap showing performance by employee and period
<div className="heatmap-grid">
  {heatmap.map((row) => (
    <div key={row.employee} className="heatmap-row">
      <div className="employee-name">{row.employee}</div>
      {row.periods.map((period) => (
        <div
          key={period.period}
          className="heatmap-cell"
          style={{ backgroundColor: getHeatmapColor(period.score) }}
          title={`${period.period}: ${period.score}`}
        />
      ))}
    </div>
  ))}
</div>
```

**Data Structure:**

```javascript
heatmap = [
  {
    employee: "John Doe",
    periods: [
      { period: "2024-01-01", score: 85 },
      { period: "2024-01-02", score: 90 },
      // ...
    ],
  },
  // ...
];
```

#### 6. Top/Bottom Performers

```javascript
// Display top and bottom performers
<div className="grid grid-cols-2 gap-4">
  <div className="top-performers">
    <h3>Top Performers</h3>
    {topPerformers.map((performer, idx) => (
      <div key={performer._id} className="performer-card">
        <span className="rank">#{idx + 1}</span>
        <span className="name">{performer.employee.first_Name}</span>
        <span className="score">{performer.avgScore}</span>
      </div>
    ))}
  </div>
  <div className="bottom-performers">
    <h3>Needs Improvement</h3>
    {bottomPerformers.map((performer, idx) => (
      <div key={performer._id} className="performer-card">
        <span className="rank">#{idx + 1}</span>
        <span className="name">{performer.employee.first_Name}</span>
        <span className="score">{performer.avgScore}</span>
      </div>
    ))}
  </div>
</div>
```

## Analytics API

### Manager Team Analytics

**Endpoint:** `GET /api/v1/ratings/manager/team/analytics`

**Controller:** `getManagerTeamAnalytics` in `userRating.controller.js`

#### Query Parameters

```javascript
{
  frequency: "daily" | "weekly" | "monthly" | "yearly",
  startDate: "2024-01-01",  // For daily
  endDate: "2024-01-31",    // For daily
  startYear: 2024,           // For weekly/monthly/yearly
  endYear: 2024,
  startMonth: 1,             // For weekly/monthly
  endMonth: 3,
  startWeek: 1,              // For weekly
  endWeek: 12,
  department: "Engineering", // Optional filter
  designation: "Developer"   // Optional filter
}
```

#### Response Structure

```json
{
  "success": true,
  "data": {
    "periods": ["2024-01-01", "2024-01-02", ...],
    "aggregatedTeam": [
      {
        "periodLabel": "2024-01-01",
        "periodStartDate": "2024-01-01T00:00:00Z",
        "periodEndDate": "2024-01-02T00:00:00Z",
        "summary": {
          "totalScore": 850,
          "totalTarget": 1000,
          "totalAchieved": 900,
          "percentOfTarget": 90,
          "category": "Good"
        }
      }
    ],
    "rawRatingsTeam": [...],
    "chartDataTeam": [
      {
        "period": "2024-01-01",
        "totalTarget": 1000,
        "totalAchieved": 900,
        "totalScore": 850,
        "percentOfTarget": 90,
        "normalizedScore": 85
      }
    ],
    "categoryDist": [
      {
        "category": "Excellent",
        "value": 5,
        "periods": ["2024-01-01", ...]
      }
    ],
    "avgKpiPerf": [
      {
        "kpiName": "Number of Sales",
        "avgScore": 54,
        "maxMarks": 60
      }
    ],
    "scatterData": [
      {
        "target": 50,
        "achieved": 45,
        "employee": "John Doe"
      }
    ],
    "avgDailyKpi": {...},
    "normalizedBuckets": [...],
    "employeeAggregates": [
      {
        "employee": {...},
        "avgScore": 85,
        "ratingCount": 10
      }
    ],
    "topPerformers": [...],
    "bottomPerformers": [...],
    "heatmap": [...],
    "movingAverage": [85, 87, 89, ...],
    "periodChange": [null, 2.35, 2.30, ...]
  }
}
```

### Super Admin Organization Analytics

**Endpoint:** `GET /api/v1/ratings/superadmin/org/analytics`

**Controller:** `getSuperadminOrgAnalytics` in `userRating.controller.js`

#### Query Parameters

Same as manager analytics, but applies to entire organization.

#### Response Structure

Similar to manager analytics, but includes organization-wide data.

### Employee Aggregated Ratings

**Endpoint:** `GET /api/v1/ratings/employee/:employeeId/aggregate`

**Controller:** `getEmployeeAggregatedRatings` in `userRating.controller.js`

#### Query Parameters

```javascript
{
  periodType: "daily" | "weekly" | "monthly" | "yearly",
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  // ... other period params
}
```

#### Response Structure

```json
{
  "success": true,
  "employee": {
    "_id": "emp123",
    "first_Name": "John",
    "last_Name": "Doe",
    "designation": "Sales Manager"
  },
  "aggregatedBy": "daily",
  "data": [
    {
      "period": "2024-01-01",
      "averageScore": 85,
      "kpis": [
        {
          "kpiName": "Number of Sales",
          "avgScore": 54,
          "marks": 60
        }
      ],
      "ratingCount": 1
    }
  ],
  "averageRating": 85,
  "ratingCount": 10
}
```

## Implementation Examples

### Example 1: Manager Viewing Team Performance

**Scenario:** Manager wants to see team performance for January 2024.

**Step 1: Set Filters**

```javascript
setFrequency("daily");
setStartDate("2024-01-01");
setEndDate("2024-01-31");
setDepartment(""); // All departments
setDesignation(""); // All designations
```

**Step 2: Fetch Data**

```javascript
// Fetch team ratings
const teamData = await getTeamRatingsAdvanced({
  frequency: "daily",
  startDate: "2024-01-01",
  endDate: "2024-01-31",
});

// Fetch analytics
const analytics = await getManagerTeamAggregated({
  frequency: "daily",
  startDate: "2024-01-01",
  endDate: "2024-01-31",
});
```

**Step 3: Display Results**

```javascript
// Overview cards
<OverviewCards
  totalMembers={teamData.length}
  avgScore={calculateAverage(teamData)}
  completedRatings={teamData.filter(r => r.hasRating).length}
/>

// Performance table
<TeamTable ratings={teamData} />

// Analytics charts
<TeamPerformanceAnalytics data={analytics.data} />
```

### Example 2: Employee Viewing Own Performance

**Scenario:** Employee wants to see their performance for Q1 2024.

**Step 1: Set Filters**

```javascript
setFrequency("monthly");
setStartYear("2024");
setStartMonth("1");
setEndYear("2024");
setEndMonth("3");
```

**Step 2: Fetch Aggregated Data**

```javascript
const data = await getEmployeeAggregatedRatings(employeeId, {
  periodType: "monthly",
  startYear: 2024,
  startMonth: 1,
  endYear: 2024,
  endMonth: 3
});

// Returns:
{
  employee: {...},
  aggregatedBy: "monthly",
  data: [
    { period: "January 2024", averageScore: 85, kpis: [...] },
    { period: "February 2024", averageScore: 88, kpis: [...] },
    { period: "March 2024", averageScore: 90, kpis: [...] }
  ],
  averageRating: 87.67,
  ratingCount: 3
}
```

**Step 3: Display Trends**

```javascript
// Trend chart
<LineChart
  data={data.data.map((p) => ({
    period: p.period,
    score: p.averageScore,
  }))}
/>;

// Period cards
{
  data.data.map((period) => (
    <PeriodCard
      period={period.period}
      score={period.averageScore}
      onClick={() => viewPeriodDetails(period)}
    />
  ));
}
```

### Example 3: Super Admin Viewing Organization Analytics

**Scenario:** Super admin wants organization-wide performance for 2024.

**Step 1: Set Filters**

```javascript
setFrequency("monthly");
setStartYear("2024");
setStartMonth("1");
setEndYear("2024");
setEndMonth("12");
```

**Step 2: Fetch Analytics**

```javascript
const analytics = await getSuperAdminOrgAggregated({
  frequency: "monthly",
  startYear: 2024,
  startMonth: 1,
  endYear: 2024,
  endMonth: 12,
});
```

**Step 3: Display Organization Metrics**

```javascript
// Department breakdown
<DepartmentChart data={analytics.data.departmentBreakdown} />

// Organization trend
<LineChart data={analytics.data.chartDataTeam} />

// Top performers
<TopPerformersList performers={analytics.data.topPerformers} />
```

## Analytics Data Processing

### Backend Aggregation Logic

#### 1. Period Definition

```javascript
// Build period definitions based on frequency
let periodDefs = [];

switch (frequency) {
  case "daily":
    let cur = new Date(startDate);
    let end = new Date(endDate);
    while (cur <= end) {
      periodDefs.push({
        periodLabel: cur.toISOString().slice(0, 10),
        periodStartDate: new Date(cur),
        periodEndDate: new Date(cur.setDate(cur.getDate() + 1)),
      });
    }
    break;
  case "monthly":
    for (let y = startYear; y <= endYear; y++) {
      for (let m = startMonth; m <= endMonth; m++) {
        periodDefs.push({
          periodLabel: `${monthNames[m - 1]} ${y}`,
          periodStartDate: new Date(y, m - 1, 1),
          periodEndDate: new Date(y, m, 1),
        });
      }
    }
    break;
  // ... other frequencies
}
```

#### 2. Rating Aggregation

```javascript
// Aggregate ratings by period
function aggregateDailyRatingsByPeriods(ratings, periodDefs) {
  return periodDefs.map((period) => {
    const periodRatings = ratings.filter((r) => {
      const rDate = new Date(r.date);
      return rDate >= period.periodStartDate && rDate < period.periodEndDate;
    });

    const summary = {
      totalScore: periodRatings.reduce((sum, r) => sum + r.totalScore, 0),
      totalTarget: periodRatings.reduce((sum, r) => {
        return (
          sum +
          r.kpis
            .filter((k) => k.type === "quantitative")
            .reduce((s, k) => s + (k.target || 0), 0)
        );
      }, 0),
      totalAchieved: periodRatings.reduce((sum, r) => {
        return (
          sum +
          r.kpis
            .filter((k) => k.type === "quantitative")
            .reduce((s, k) => s + (k.achieved || 0), 0)
        );
      }, 0),
      ratingCount: periodRatings.length,
    };

    return {
      ...period,
      summary,
      ratings: periodRatings,
    };
  });
}
```

#### 3. Category Classification

```javascript
function getPerformanceCategory(percentOfTarget) {
  if (percentOfTarget >= 100) return "Excellent";
  if (percentOfTarget >= 80) return "Good";
  if (percentOfTarget >= 60) return "Average";
  return "Needs Improvement";
}
```

#### 4. Moving Average Calculation

```javascript
const movAvgWindow = 3;
const movingAverage = percentSeries.map((_, i) => {
  const slice = percentSeries.slice(Math.max(0, i - movAvgWindow + 1), i + 1);
  const sum = slice.reduce((a, b) => a + b, 0);
  return Math.round((sum / slice.length) * 100) / 100;
});
```

#### 5. Period Change Calculation

```javascript
const periodChange = percentSeries.map((v, i) => {
  if (i === 0) return null;
  const change = ((v - percentSeries[i - 1]) / percentSeries[i - 1]) * 100;
  return Math.round(change * 100) / 100;
});
```

## Next Steps

Continue reading:

- [Part 1: Overview & Architecture](./performance-management-part1-overview.md)
- [Part 2: KPI Management](./performance-management-part2-kpi-management.md)
- [Part 3: Rating Management](./performance-management-part3-rating-management.md)
- [Part 4: Bulk Operations](./performance-management-part4-bulk-operations.md)
- [Part 6: API Reference](./performance-management-part6-api-reference.md)

---

**Last Updated:** 2024  
**Maintained By:** Development Team
