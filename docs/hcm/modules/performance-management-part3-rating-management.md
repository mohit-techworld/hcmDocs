---
title: "Performance Management - Part 3: Rating Management"
sidebar_position: 9
description: "This document provides a comprehensive guide to creating and managing performance ratings, covering individual ratings, score calculations, period."
---

# Performance Management Module - Part 3: Rating Management

This document provides a comprehensive guide to creating and managing performance ratings, covering individual ratings, score calculations, period handling, and the complete rating workflow.

## Table of Contents

1. [Overview](#overview)
2. [Rating Structure](#rating-structure)
3. [Frontend Components](#frontend-components)
4. [Score Calculation](#score-calculation)
5. [Period Handling](#period-handling)
6. [Backend API](#backend-api)
7. [Implementation Examples](#implementation-examples)
8. [Validation and Error Handling](#validation-and-error-handling)

## Overview

Performance Ratings evaluate employee performance against KPI sets for specific time periods. The system supports multiple frequencies, automatic score calculation, and hierarchical access control.

### Key Features

- **Individual Rating Creation**: Rate employees one-by-one with detailed KPI scoring
- **Automatic Score Calculation**: Quantitative KPIs calculated from achieved/target ratio
- **Period-Specific Ratings**: Support for daily, weekly, monthly, and yearly periods
- **KPI Set Validation**: Ensures ratings match existing KPI set structure
- **Upsert Logic**: Updates existing ratings or creates new ones
- **Version Tracking**: Records which KPI set version was used

## Rating Structure

### Complete Schema

```javascript
{
  _id: ObjectId,
  employeeId: ObjectId (ref: User),    // Required: Employee being rated
  ratedBy: ObjectId (ref: User),       // Manager who created rating
  frequency: String,                   // Required: "daily" | "weekly" | "monthly" | "yearly"
  version: Number,                     // KPI set version used
  date: Date,                          // For daily frequency
  year: Number,                        // For weekly/monthly/yearly
  month: Number,                       // For weekly/monthly (1-12)
  week: Number,                        // For weekly (1-52)
  kpis: [
    {
      kpiName: String,                 // Required: Must match KPI set
      type: String,                    // "quantitative" | "qualitative"
      marks: Number,                   // Max marks for this KPI
      target: Number,                   // Required for quantitative
      achieved: Number,                 // Required for quantitative
      score: Number,                   // Calculated or assigned score
      comment: String                  // Optional: KPI-specific feedback
    }
  ],
  totalScore: Number,                  // Sum of all KPI scores
  comment: String,                     // Optional: Overall feedback
  createdAt: Date,
  updatedAt: Date
}
```

### Example Rating

```javascript
{
  "_id": "64f8b2a1c4d5e6f7g8h9i0j2",
  "employeeId": "64f8b2a1c4d5e6f7g8h9i0j1",
  "ratedBy": "64f8b2a1c4d5e6f7g8h9i0j3",
  "frequency": "monthly",
  "version": 2,
  "year": 2024,
  "month": 3,
  "kpis": [
    {
      "kpiName": "Number of Sales",
      "type": "quantitative",
      "marks": 60,
      "target": 50,
      "achieved": 45,
      "score": 54,  // (45/50) * 60 = 54
      "comment": "Slightly below target, but good effort"
    },
    {
      "kpiName": "Product Knowledge",
      "type": "qualitative",
      "marks": 40,
      "score": 36,  // Manager-assigned
      "comment": "Excellent product knowledge demonstrated"
    }
  ],
  "totalScore": 90,  // 54 + 36
  "comment": "Good performance overall, but sales targets missed slightly.",
  "createdAt": "2024-03-15T10:30:00.000Z",
  "updatedAt": "2024-03-15T10:30:00.000Z"
}
```

## Frontend Components

### 1. GiveRatingDashboard Component

**Location:** `hcmFrontend/src/components/performance management razor/GiveRatingDashboard.jsx`

**Purpose:** Main container with tabs for Individual and Bulk rating.

**Structure:**

```javascript
function GiveRatingDashboard() {
  const [activeTab, setActiveTab] = useState("onebyone");

  return (
    <div>
      {/* Header */}
      <h1>Employee Ratings</h1>

      {/* Tabs */}
      <div>
        <button onClick={() => setActiveTab("onebyone")}>
          Individual Rating
        </button>
        <button onClick={() => setActiveTab("bulk")}>Bulk Rating</button>
      </div>

      {/* Content */}
      {activeTab === "onebyone" && <RateEmployee />}
      {activeTab === "bulk" && <BulkRating />}
    </div>
  );
}
```

### 2. RateEmployee Component

**Location:** `hcmFrontend/src/components/performance management razor/RateEmployee.jsx`

**Purpose:** Interface for rating individual employees.

#### Key Features

1. **Employee Selection**: Search and filter employees
2. **Frequency Selection**: Choose rating frequency
3. **Period Selection**: Date/week/month/year pickers
4. **KPI Set Loading**: Automatically loads KPIs for employee's designation
5. **Score Input**: Manual score entry with auto-calculation for quantitative
6. **Rating Submission**: Creates/updates rating

#### State Management

```javascript
function RateEmployee() {
  const {
    subordinates,
    fetchSubordinates,
    fetchKpiSet,
    kpiSet,
    createRating,
    loading,
  } = useRatingStore();

  // Employee selection
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDesignation, setFilterDesignation] = useState("");

  // Period selection
  const [frequency, setFrequency] = useState("daily");
  const [date, setDate] = useState(defaultDate);
  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(defaultMonth);
  const [week, setWeek] = useState("");

  // KPI data
  const [kpis, setKpis] = useState([]);
  const [comment, setComment] = useState("");

  // Load subordinates on mount
  useEffect(() => {
    fetchSubordinates();
  }, [fetchSubordinates]);
}
```

#### Detailed Implementation

**1. Opening Rating Modal**

```javascript
const handleOpenModal = (emp) => {
  setSelectedEmployee(emp);
  setShowModal(true);

  // Reset form to defaults
  setFrequency("daily");
  setDate(defaultDate);
  setYear(defaultYear);
  setMonth(defaultMonth);
  setWeek("");
  setComment("");
  setKpis([]);
  setAvailableWeeks([]);
};
```

**2. Loading KPI Set**

```javascript
useEffect(() => {
  if (!showModal || !selectedEmployee) return;

  const fetchData = async () => {
    try {
      // Fetch KPI set for employee's designation and selected frequency
      const data = await fetchKpiSet(selectedEmployee.designation, frequency);

      if (data) {
        // Initialize KPIs with empty scores
        const initialKpis = data.kpis.map((k) => ({
          ...k,
          achieved: 0,
          score: 0,
          comment: "",
        }));
        setKpis(initialKpis);
      }
    } catch (err) {
      toast.error("No KPI Set found for this designation + frequency");
      setKpis([]);
    }
  };

  fetchData();
}, [showModal, selectedEmployee, frequency, fetchKpiSet]);
```

**Example Flow:**

1. User selects employee "John Doe" (Sales Manager)
2. User selects frequency "monthly"
3. Component fetches KPI set for "Sales Manager" + "monthly"
4. Form populated with 3 KPIs from KPI set
5. User can now fill in ratings

**3. Handling Quantitative KPI Input**

```javascript
const handleAchievedChange = (index, newVal) => {
  setKpis((prev) =>
    prev.map((k, i) => {
      if (i !== index) return k;
      if (k.type !== "quantitative") return k;

      const achievedVal = Number(newVal || 0);
      const target = k.target || 1;
      const marks = k.marks || 0;

      // Calculate score: (achieved / target) * marks
      let newScore = (achievedVal / target) * marks;

      // Clamp score between 0 and marks
      if (newScore < 0) newScore = 0;
      if (newScore > marks) newScore = marks;

      return {
        ...k,
        achieved: achievedVal,
        score: newScore,
      };
    })
  );
};
```

**Example:**

```javascript
// KPI: Number of Sales
// marks: 60, target: 50

// User enters achieved: 45
// Calculation: (45 / 50) * 60 = 54
// Result: score = 54

// User enters achieved: 60 (exceeds target)
// Calculation: (60 / 50) * 60 = 72
// But clamped to marks (60)
// Result: score = 60
```

**4. Handling Score Input (Manual Override)**

```javascript
const handleScoreChange = (index, newVal) => {
  setKpis((prev) =>
    prev.map((k, i) => {
      if (i !== index) return k;

      let sVal = Number(newVal || 0);

      if (k.type === "quantitative") {
        const marks = k.marks || 0;
        const target = k.target || 1;

        // Clamp score
        if (sVal < 0) sVal = 0;
        if (sVal > marks) sVal = marks;

        // Calculate achieved from score (reverse calculation)
        const newAchieved = (sVal / marks) * target;

        return { ...k, score: sVal, achieved: newAchieved };
      } else {
        // Qualitative: just update score
        return { ...k, score: sVal };
      }
    })
  );
};
```

**Example:**

```javascript
// Quantitative KPI
// User manually sets score: 54
// Reverse calculation: (54 / 60) * 50 = 45
// Result: achieved = 45, score = 54

// Qualitative KPI
// User sets score: 36
// Result: score = 36 (no achieved field)
```

**5. Submitting Rating**

```javascript
const handleSubmitRating = async () => {
  if (!selectedEmployee) return;

  // Validate period fields
  if (frequency === "daily" && !date) {
    toast.error("Please select a date for daily frequency");
    return;
  }
  if (frequency === "weekly") {
    if (!year || !month || !week) {
      toast.error("Please select year, month, and week");
      return;
    }
  }
  if (frequency === "monthly" && (!year || !month)) {
    toast.error("Please select year & month");
    return;
  }
  if (frequency === "yearly" && !year) {
    toast.error("Please select year");
    return;
  }

  try {
    // Build payload
    const payload = {
      employeeId: selectedEmployee._id,
      frequency,
      version: kpiSet?.version || 1,
      date: frequency === "daily" ? date : undefined,
      year: ["weekly", "monthly", "yearly"].includes(frequency)
        ? year
        : undefined,
      month: ["weekly", "monthly"].includes(frequency) ? month : undefined,
      week: frequency === "weekly" ? week : undefined,
      kpis: kpis.map((k) => ({
        kpiName: k.kpiName,
        type: k.type,
        marks: k.marks,
        target: k.target,
        achieved: k.achieved,
        score: Number(k.score),
        comment: k.comment,
      })),
      totalScore: kpis.reduce((sum, k) => sum + Number(k.score || 0), 0),
      comment,
    };

    await createRating(payload);
    toast.success("Rating submitted successfully!");
    setShowModal(false);
  } catch (err) {
    toast.error(err?.response?.data?.message || err.message);
  }
};
```

**Example Payload:**

```javascript
{
  employeeId: "64f8b2a1c4d5e6f7g8h9i0j1",
  frequency: "monthly",
  version: 2,
  year: 2024,
  month: 3,
  kpis: [
    {
      kpiName: "Number of Sales",
      type: "quantitative",
      marks: 60,
      target: 50,
      achieved: 45,
      score: 54,
      comment: "Slightly below target"
    },
    {
      kpiName: "Product Knowledge",
      type: "qualitative",
      marks: 40,
      score: 36,
      comment: "Excellent knowledge"
    }
  ],
  totalScore: 90,
  comment: "Good performance overall"
}
```

### 3. RatingModal Component

**Location:** `hcmFrontend/src/components/performance management razor/modal/RatingModal.jsx`

**Purpose:** Modal dialog for entering rating details.

#### Key Sections

1. **Header**: Employee info and close button
2. **Period Selection**: Frequency and date/week/month/year pickers
3. **KPI Input Section**: Individual KPI scoring
4. **Overall Comment**: General feedback textarea
5. **Footer**: Total score display and submit button

#### KPI Input Fields

**For Quantitative KPIs:**

```javascript
<div>
  <label>Achieved</label>
  <input
    type="number"
    value={k.achieved || 0}
    onChange={(e) => handleAchievedChange(i, e.target.value)}
  />
</div>
<div>
  <label>Score</label>
  <input
    type="number"
    value={k.score || 0}
    onChange={(e) => handleScoreChange(i, e.target.value)}
  />
  <span>{k.score || 0}/{k.marks}</span>
</div>
```

**For Qualitative KPIs:**

```javascript
<div>
  <label>Score</label>
  <input
    type="number"
    min="0"
    max={k.marks}
    value={k.score || 0}
    onChange={(e) => handleScoreChange(i, e.target.value)}
  />
  <span>
    {k.score || 0}/{k.marks}
  </span>
</div>
```

## Score Calculation

### Quantitative KPI Score Formula

```javascript
score = (achieved / target) * marks;

// Clamped to range [0, marks]
if (score < 0) score = 0;
if (score > marks) score = marks;
```

### Qualitative KPI Score

- Manager assigns score manually
- Range: 0 to marks
- No automatic calculation

### Backend Calculation Function

```javascript
function calculateKpiScore(k) {
  if (k.type === "quantitative") {
    const marks = k.marks || 0;
    const target = k.target || 0;
    const achieved = k.achieved || 0;

    if (target <= 0) {
      return 0; // Invalid target
    }

    let ratio = achieved / target;
    if (ratio < 0) ratio = 0;
    if (ratio > 1) ratio = 1; // Cap at 100% of target

    return ratio * marks;
  } else {
    // Qualitative: Use provided score, clamped to [0, marks]
    const marks = k.marks || 0;
    let sVal = parseFloat(k.score) || 0;

    if (sVal < 0) sVal = 0;
    if (sVal > marks) sVal = marks;

    return sVal;
  }
}
```

### Calculation Examples

**Example 1: Quantitative KPI**

```javascript
// KPI: Number of Sales
// marks: 60, target: 50

// Case 1: Achieved = 45 (90% of target)
achieved = 45
score = (45 / 50) * 60 = 54

// Case 2: Achieved = 50 (100% of target)
achieved = 50
score = (50 / 50) * 60 = 60

// Case 3: Achieved = 60 (120% of target, but capped)
achieved = 60
score = (60 / 50) * 60 = 72
// But clamped to marks (60)
score = 60

// Case 4: Achieved = 0
achieved = 0
score = (0 / 50) * 60 = 0
```

**Example 2: Qualitative KPI**

```javascript
// KPI: Product Knowledge
// marks: 40

// Manager assigns score: 36
score = 36;

// Manager assigns score: 50 (exceeds marks, clamped)
score = 40; // Clamped to max marks

// Manager assigns score: -10 (negative, clamped)
score = 0; // Clamped to minimum
```

## Period Handling

### Period Identifiers by Frequency

| Frequency   | Required Fields         | Example Values                   |
| ----------- | ----------------------- | -------------------------------- |
| **Daily**   | `date`                  | `date: "2024-03-15"`             |
| **Weekly**  | `year`, `month`, `week` | `year: 2024, month: 3, week: 12` |
| **Monthly** | `year`, `month`         | `year: 2024, month: 3`           |
| **Yearly**  | `year`                  | `year: 2024`                     |

### Frontend Period Selection

**Daily:**

```javascript
{
  frequency === "daily" && (
    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
  );
}
```

**Weekly:**

```javascript
{
  frequency === "weekly" && (
    <>
      <input
        type="number"
        placeholder="2024"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="">Select Month</option>
        {[...Array(12)].map((_, i) => (
          <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
            {monthNames[i]}
          </option>
        ))}
      </select>
      {year && month && (
        <select value={week} onChange={(e) => setWeek(e.target.value)}>
          {availableWeeks.map((w) => (
            <option key={w.value} value={w.value}>
              {w.label}
            </option>
          ))}
        </select>
      )}
    </>
  );
}
```

**Monthly:**

```javascript
{
  frequency === "monthly" && (
    <>
      <input
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="2024"
      />
      <select value={month} onChange={(e) => setMonth(e.target.value)}>
        <option value="">Select Month</option>
        {monthOptions}
      </select>
    </>
  );
}
```

**Yearly:**

```javascript
{
  frequency === "yearly" && (
    <input
      type="number"
      value={year}
      onChange={(e) => setYear(e.target.value)}
      placeholder="2024"
    />
  );
}
```

### Week Calculation Utility

**Location:** `hcmFrontend/src/components/performance management razor/calendarUtils.jsx`

```javascript
export const getWeeksInMonth = (year, month) => {
  // month is 0-indexed in JavaScript Date
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const weeks = [];
  let currentWeekStart = firstDay;

  while (currentWeekStart <= lastDay) {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    if (weekEnd > lastDay) weekEnd = lastDay;

    const weekNum = getISOWeek(currentWeekStart);
    weeks.push({
      value: weekNum,
      label: `Week ${weekNum} (${format(currentWeekStart, "MMM d")} - ${format(
        weekEnd,
        "MMM d"
      )})`,
    });

    currentWeekStart = new Date(currentWeekStart);
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  }

  return weeks;
};
```

## Backend API

### Create/Update Rating

**Endpoint:** `POST /api/v1/ratings/create`

**Controller:** `createRating` in `userRating.controller.js`

#### Implementation Flow

```javascript
export const createRating = async (req, res) => {
  try {
    let {
      employeeId,
      frequency,
      version,
      date,
      year,
      month,
      week,
      kpis = [],
      totalScore,
      comment,
    } = req.body;

    // 1. Clean up qualitative KPIs (remove target/achieved)
    kpis = kpis.map((k) => {
      if (k.type === "qualitative") {
        delete k.target;
        delete k.achieved;
      }
      return k;
    });

    // 2. Recalculate all scores (server-side validation)
    kpis = kpis.map((k) => {
      const finalScore = calculateKpiScore(k);
      return {
        ...k,
        score: finalScore,
      };
    });

    // 3. Recalculate total score
    const backendTotalScore = kpis.reduce((sum, k) => sum + k.score, 0);
    totalScore = backendTotalScore;

    // 4. Validation
    if (!employeeId || !frequency) {
      return res.status(400).json({
        success: false,
        message: "employeeId & frequency are required.",
      });
    }

    const ratedBy = req.user._id;

    // 5. Verify employee exists
    const employee = await User.findById(employeeId).lean();
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // 6. Verify KPI set exists
    const kpiSet = await KpiSet.findOne({
      designation: employee.designation,
      frequency,
      version,
    }).lean();

    if (!kpiSet) {
      return res.status(400).json({
        success: false,
        message: `No KPI set found for designation=${employee.designation}, freq=${frequency}, version=${version}`,
      });
    }

    // 7. Build unique filter for upsert
    const filter = {
      employeeId,
      frequency,
      version: version || 1,
    };

    // Add period-specific fields
    if (frequency === "daily") {
      filter.date = new Date(date);
    } else if (frequency === "weekly") {
      filter.year = Number(year);
      filter.month = Number(month);
      filter.week = Number(week);
    } else if (frequency === "monthly") {
      filter.year = Number(year);
      filter.month = Number(month);
    } else if (frequency === "yearly") {
      filter.year = Number(year);
    }

    // 8. Prepare rating document
    const ratingDoc = {
      employeeId,
      ratedBy,
      frequency,
      version: version || 1,
      kpis,
      totalScore,
      comment: comment || "",
      ...(frequency === "daily" && { date: new Date(date) }),
      ...(frequency === "weekly" && {
        year: Number(year),
        month: Number(month),
        week: Number(week),
      }),
      ...(frequency === "monthly" && {
        year: Number(year),
        month: Number(month),
      }),
      ...(frequency === "yearly" && { year: Number(year) }),
    };

    // 9. Upsert (update if exists, create if not)
    const rating = await UserRating.findOneAndUpdate(filter, ratingDoc, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    return res.status(200).json({
      success: true,
      message: "Rating upserted successfully.",
      data: rating,
    });
  } catch (err) {
    console.error("Error creating rating:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};
```

#### Example Request

```http
POST /api/v1/ratings/create
Content-Type: application/json
Authorization: Bearer <token>

{
  "employeeId": "64f8b2a1c4d5e6f7g8h9i0j1",
  "frequency": "monthly",
  "version": 2,
  "year": 2024,
  "month": 3,
  "kpis": [
    {
      "kpiName": "Number of Sales",
      "type": "quantitative",
      "marks": 60,
      "target": 50,
      "achieved": 45,
      "score": 54,
      "comment": "Slightly below target"
    },
    {
      "kpiName": "Product Knowledge",
      "type": "qualitative",
      "marks": 40,
      "score": 36,
      "comment": "Excellent knowledge"
    }
  ],
  "totalScore": 90,
  "comment": "Good performance overall"
}
```

#### Example Response

```json
{
  "success": true,
  "message": "Rating upserted successfully.",
  "data": {
    "_id": "64f8b2a1c4d5e6f7g8h9i0j2",
    "employeeId": "64f8b2a1c4d5e6f7g8h9i0j1",
    "ratedBy": "64f8b2a1c4d5e6f7g8h9i0j3",
    "frequency": "monthly",
    "version": 2,
    "year": 2024,
    "month": 3,
    "kpis": [
      {
        "kpiName": "Number of Sales",
        "type": "quantitative",
        "marks": 60,
        "target": 50,
        "achieved": 45,
        "score": 54,
        "comment": "Slightly below target"
      },
      {
        "kpiName": "Product Knowledge",
        "type": "qualitative",
        "marks": 40,
        "score": 36,
        "comment": "Excellent knowledge"
      }
    ],
    "totalScore": 90,
    "comment": "Good performance overall",
    "createdAt": "2024-03-15T10:30:00.000Z",
    "updatedAt": "2024-03-15T10:30:00.000Z"
  }
}
```

## Implementation Examples

### Example 1: Complete Rating Flow

**Scenario:** Manager rates employee for March 2024 monthly performance.

**Step 1: Select Employee**

```javascript
// User searches and selects employee
const employee = {
  _id: "emp123",
  first_Name: "John",
  last_Name: "Doe",
  designation: "Sales Manager",
  employee_Id: "EMP001",
};

handleOpenModal(employee);
```

**Step 2: Select Frequency and Period**

```javascript
// User selects monthly frequency
setFrequency("monthly");
setYear("2024");
setMonth("03");
```

**Step 3: KPI Set Loaded**

```javascript
// Component automatically fetches KPI set
const kpiSet = await fetchKpiSet("Sales Manager", "monthly");
// Returns:
{
  version: 2,
  kpis: [
    { kpiName: "Number of Sales", type: "quantitative", marks: 60, target: 50 },
    { kpiName: "Product Knowledge", type: "qualitative", marks: 40 }
  ]
}

// Form populated with KPIs
setKpis([
  { kpiName: "Number of Sales", type: "quantitative", marks: 60, target: 50, achieved: 0, score: 0 },
  { kpiName: "Product Knowledge", type: "qualitative", marks: 40, score: 0 }
]);
```

**Step 4: Enter Ratings**

```javascript
// For quantitative KPI: Enter achieved value
handleAchievedChange(0, 45);
// Calculates: (45/50) * 60 = 54
// Updates: { achieved: 45, score: 54 }

// For qualitative KPI: Enter score directly
handleScoreChange(1, 36);
// Updates: { score: 36 }
```

**Step 5: Add Comments**

```javascript
// KPI-specific comments
handleCommentChange(0, "Slightly below target but good effort");
handleCommentChange(1, "Excellent product knowledge demonstrated");

// Overall comment
setComment("Good performance overall, but sales targets missed slightly.");
```

**Step 6: Submit Rating**

```javascript
const payload = {
  employeeId: "emp123",
  frequency: "monthly",
  version: 2,
  year: 2024,
  month: 3,
  kpis: [
    {
      kpiName: "Number of Sales",
      type: "quantitative",
      marks: 60,
      target: 50,
      achieved: 45,
      score: 54,
      comment: "Slightly below target but good effort",
    },
    {
      kpiName: "Product Knowledge",
      type: "qualitative",
      marks: 40,
      score: 36,
      comment: "Excellent product knowledge demonstrated",
    },
  ],
  totalScore: 90,
  comment: "Good performance overall, but sales targets missed slightly.",
};

await createRating(payload);
```

### Example 2: Updating Existing Rating

**Scenario:** Manager wants to update a rating that was already submitted.

**Flow:**

```javascript
// 1. Select same employee, frequency, and period
// 2. Backend uses upsert logic (findOneAndUpdate with upsert: true)
// 3. If rating exists with same filter, it's updated
// 4. If not, new rating is created

// Filter used for upsert:
{
  employeeId: "emp123",
  frequency: "monthly",
  version: 2,
  year: 2024,
  month: 3
}

// Result: Existing rating updated with new scores/comments
```

### Example 3: Daily Rating

**Scenario:** Create a daily rating for March 15, 2024.

```javascript
const payload = {
  employeeId: "emp123",
  frequency: "daily",
  version: 1,
  date: "2024-03-15",  // ISO date string
  kpis: [...],
  totalScore: 85,
  comment: "Good day, completed all tasks"
};

// Backend converts date string to Date object
filter.date = new Date("2024-03-15");
```

### Example 4: Weekly Rating

**Scenario:** Create a weekly rating for Week 12 of March 2024.

```javascript
const payload = {
  employeeId: "emp123",
  frequency: "weekly",
  version: 1,
  year: 2024,
  month: 3,      // March
  week: 12,      // Week number
  kpis: [...],
  totalScore: 88,
  comment: "Productive week"
};

// Backend stores:
{
  employeeId: "emp123",
  frequency: "weekly",
  year: 2024,
  month: 3,
  week: 12,
  ...
}
```

## Validation and Error Handling

### Frontend Validation

**1. Period Validation:**

```javascript
const validatePeriod = () => {
  if (frequency === "daily" && !date) {
    toast.error("Please select a date for daily frequency");
    return false;
  }
  if (frequency === "weekly") {
    if (!year || !month || !week) {
      toast.error("Please select year, month, and week");
      return false;
    }
  }
  if (frequency === "monthly" && (!year || !month)) {
    toast.error("Please select year & month");
    return false;
  }
  if (frequency === "yearly" && !year) {
    toast.error("Please select year");
    return false;
  }
  return true;
};
```

**2. Score Validation:**

```javascript
// Ensure scores are within valid range
const validateScores = () => {
  for (const kpi of kpis) {
    if (kpi.score < 0 || kpi.score > kpi.marks) {
      toast.error(`${kpi.kpiName}: Score must be between 0 and ${kpi.marks}`);
      return false;
    }
    if (kpi.type === "quantitative" && kpi.achieved < 0) {
      toast.error(`${kpi.kpiName}: Achieved value cannot be negative`);
      return false;
    }
  }
  return true;
};
```

### Backend Validation

**1. Required Fields:**

```javascript
if (!employeeId || !frequency) {
  return res.status(400).json({
    success: false,
    message: "employeeId & frequency are required.",
  });
}
```

**2. Employee Existence:**

```javascript
const employee = await User.findById(employeeId).lean();
if (!employee) {
  return res.status(404).json({
    success: false,
    message: "Employee not found.",
  });
}
```

**3. KPI Set Validation:**

```javascript
const kpiSet = await KpiSet.findOne({
  designation: employee.designation,
  frequency,
  version,
}).lean();

if (!kpiSet) {
  return res.status(400).json({
    success: false,
    message: `No KPI set found for designation=${employee.designation}, freq=${frequency}, version=${version}`,
  });
}
```

**4. Score Recalculation:**

```javascript
// Backend always recalculates scores for validation
kpis = kpis.map((k) => {
  const finalScore = calculateKpiScore(k);
  return { ...k, score: finalScore };
});

// Overwrite totalScore with recalculated sum
totalScore = kpis.reduce((sum, k) => sum + k.score, 0);
```

### Error Responses

**400 Bad Request:**

```json
{
  "success": false,
  "message": "employeeId & frequency are required."
}
```

**404 Not Found:**

```json
{
  "success": false,
  "message": "Employee not found."
}
```

**400 KPI Set Not Found:**

```json
{
  "success": false,
  "message": "No KPI set found for designation=Sales Manager, freq=monthly, version=2"
}
```

**500 Server Error:**

```json
{
  "success": false,
  "message": "Server Error"
}
```

## State Management

### Rating Store

**Location:** `hcmFrontend/src/store/useRatingNewStore.js`

**Key Methods:**

```javascript
const useRatingStore = create((set, get) => ({
  // Fetch subordinates (team members)
  fetchSubordinates: async () => {
    const res = await axiosInstance.get("/subordinates");
    set({ subordinates: res.data.data || [] });
  },

  // Fetch KPI set for designation and frequency
  fetchKpiSet: async (designation, frequency) => {
    const query = `designation=${designation}&frequency=${frequency}`;
    const res = await axiosInstance.get(`/kpis?${query}`);
    set({ kpiSet: res.data.data });
    return res.data.data;
  },

  // Create/update rating
  createRating: async (payload) => {
    const res = await axiosInstance.post("/ratings/create", payload);
    return res.data;
  },
}));
```

## Next Steps

Continue reading:

- [Part 1: Overview & Architecture](./performance-management-part1-overview.md)
- [Part 2: KPI Management](./performance-management-part2-kpi-management.md)
- [Part 4: Bulk Operations](./performance-management-part4-bulk-operations.md)
- [Part 5: Dashboards and Analytics](./performance-management-part5-dashboards-analytics.md)
- [Part 6: API Reference](./performance-management-part6-api-reference.md)

---

**Last Updated:** 2024  
**Maintained By:** Development Team
