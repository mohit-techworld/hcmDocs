---
title: "Performance Management - Part 4: Bulk Operations"
sidebar_position: 10
description: "This document provides a comprehensive guide to bulk rating operations, including Excel template generation, bulk uploads for current and past periods."
---

# Performance Management Module - Part 4: Bulk Operations

This document provides a comprehensive guide to bulk rating operations, including Excel template generation, bulk uploads for current and past periods, validation, and error handling.

## Table of Contents

1. [Overview](#overview)
2. [Bulk Rating (Current Period)](#bulk-rating-current-period)
3. [Bulk Upload Past Ratings](#bulk-upload-past-ratings)
4. [Excel Template Structure](#excel-template-structure)
5. [Backend Processing](#backend-processing)
6. [Implementation Examples](#implementation-examples)
7. [Error Handling](#error-handling)

## Overview

Bulk operations allow managers to rate multiple employees efficiently using Excel templates. The system supports:

- **Current Period Bulk Rating**: Rate team members for the current period
- **Past Period Bulk Upload**: Upload historical ratings for date ranges
- **Excel Template Generation**: Auto-generated templates with employee and KPI data
- **Validation**: Comprehensive validation with detailed error reporting
- **Error Recovery**: Partial success handling with error details

### Use Cases

1. **Monthly Team Reviews**: Rate entire team at month-end
2. **Historical Data Migration**: Import past performance data
3. **Batch Updates**: Update multiple ratings simultaneously
4. **Data Correction**: Fix errors in bulk

## Bulk Rating (Current Period)

**Component:** `BulkRating.jsx`

**Location:** `hcmFrontend/src/components/performance management razor/BulkRating.jsx`

### Features

- Generate Excel template for current period
- Upload filled Excel file
- Real-time validation feedback
- Error reporting with row numbers

### Component Structure

```javascript
function BulkRating() {
  const { generateBulkTemplate, uploadBulkRatings, loading } = useRatingStore();
  const { designations, fetchDesignations } = useDesignationStore();

  // Period selection
  const [frequency, setFrequency] = useState("daily");
  const [date, setDate] = useState(defaultDate);
  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(defaultMonth);
  const [week, setWeek] = useState("");
  const [designation, setDesignation] = useState(""); // Optional filter

  // File handling
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");

  // Error tracking
  const [errorCount, setErrorCount] = useState(0);
  const [bulkErrors, setBulkErrors] = useState([]);

  // ... rest of component
}
```

### Step-by-Step Flow

#### Step 1: Select Period and Designation

```javascript
// User selects:
frequency = "monthly";
year = "2024";
month = "03";
designation = "Sales Manager"; // Optional: filter by designation
```

#### Step 2: Generate Template

```javascript
const handleDownloadTemplate = async () => {
  try {
    // Build query parameters
    let params = { frequency };

    if (frequency === "daily") {
      params.date = date;
    }
    if (frequency === "weekly") {
      params.year = year;
      params.month = month;
      params.week = week;
    }
    if (frequency === "monthly") {
      params.year = year;
      params.month = month;
    }
    if (frequency === "yearly") {
      params.year = year;
    }

    // Optional: Filter by designation
    if (designation) {
      params.designation = designation;
    }

    // Request template from backend
    const res = await generateBulkTemplate(params);

    // Create blob and download
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "bulk_rating_template.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Template downloaded successfully!");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Error downloading template");
  }
};
```

**Example Request:**

```http
GET /api/v1/ratings/template?frequency=monthly&year=2024&month=3&designation=Sales%20Manager
Authorization: Bearer <token>
```

**Response:** Excel file download

#### Step 3: Fill Template

The Excel template contains:

- One row per employee per KPI
- Pre-filled employee information
- KPI details (name, type, marks, target)
- Columns for: Score, Achieved (quantitative), Comment, Overall Feedback

**Example Excel Structure:**

| Unique \_id | Employee Name | Designation   | KPI Name          | Type         | Max Marks | Target | Score | Achieved | Comment    | Frequency | Year | Month | Version | Overall Feedback |
| ----------- | ------------- | ------------- | ----------------- | ------------ | --------- | ------ | ----- | -------- | ---------- | --------- | ---- | ----- | ------- | ---------------- |
| emp123      | John Doe      | Sales Manager | Number of Sales   | quantitative | 60        | 50     | 54    | 45       | Good       | monthly   | 2024 | 3     | 2       | Great work       |
| emp123      | John Doe      | Sales Manager | Product Knowledge | qualitative  | 40        | -      | 36    | -        | Excellent  | monthly   | 2024 | 3     | 2       | Great work       |
| emp456      | Jane Smith    | Sales Manager | Number of Sales   | quantitative | 60        | 50     | 60    | 50       | Met target | monthly   | 2024 | 3     | 2       | Outstanding      |

#### Step 4: Upload Filled Template

```javascript
const handleUpload = async () => {
  if (!file) {
    toast.error("Please select an Excel file to upload");
    return;
  }

  // Reset errors
  setErrorCount(0);
  setBulkErrors([]);

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadBulkRatings(formData);

    // Check for partial errors
    if (res.data.errorCount && res.data.errorCount > 0) {
      setErrorCount(res.data.errorCount);
      setBulkErrors(res.data.errors);
    }

    toast.success(
      `Bulk ratings uploaded. Inserted: ${res.data.newCount || 0}, Updated: ${
        res.data.updatedCount || 0
      }`
    );

    // Reset file input
    setFile(null);
    setFileName("No file selected");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Error uploading file");
  }
};
```

**Example Request:**

```http
POST /api/v1/ratings/bulk-upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- file: [Excel file]
```

**Example Response:**

```json
{
  "success": true,
  "message": "Bulk ratings processed successfully",
  "data": {
    "newCount": 5,
    "updatedCount": 2,
    "errorCount": 1,
    "errors": [
      {
        "rowNumber": 8,
        "errors": ["Score cannot exceed Max Marks"]
      }
    ]
  }
}
```

## Bulk Upload Past Ratings

**Component:** `BulkUploadPast.jsx`

**Location:** `hcmFrontend/src/components/performance management razor/BulkUploadPast.jsx`

### Features

- Upload ratings for past date ranges
- Support for all frequencies (daily, weekly, monthly, yearly)
- Date range selection
- Employee-specific or all employees
- Template includes existing ratings (for reference)

### Component Structure

```javascript
function BulkUploadPast() {
  const {
    generatePastRatingsTemplate,
    uploadPastRatings,
    fetchSubordinates,
    subordinates: employees,
    loading,
  } = useRatingStore();

  // Employee selection
  const [employeeId, setEmployeeId] = useState("");
  const [employeeInput, setEmployeeInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Frequency and date range
  const [frequency, setFrequency] = useState("daily");
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [weekRange, setWeekRange] = useState({
    startYear: "",
    startWeek: "",
    endYear: "",
    endWeek: "",
  });
  const [monthRange, setMonthRange] = useState({
    startYear: "",
    startMonth: "",
    endYear: "",
    endMonth: "",
  });
  const [yearRange, setYearRange] = useState({ startYear: "", endYear: "" });

  // File handling
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");

  // Error tracking
  const [errorCount, setErrorCount] = useState(0);
  const [bulkErrors, setBulkErrors] = useState([]);
}
```

### Step-by-Step Flow

#### Step 1: Select Employee (Optional)

```javascript
// Option 1: Select specific employee
const handleSelectEmployee = (emp) => {
  setEmployeeId(emp._id);
  setEmployeeInput(`${emp.first_Name} ${emp.last_Name} (${emp.employee_Id})`);
  setShowDropdown(false);
};

// Option 2: Leave empty for all employees
// employeeId = ""
```

#### Step 2: Select Frequency and Date Range

**Daily Range:**

```javascript
frequency = "daily";
dateRange = {
  startDate: "2024-01-01",
  endDate: "2024-01-31",
};
```

**Weekly Range:**

```javascript
frequency = "weekly";
weekRange = {
  startYear: "2024",
  startWeek: "1",
  endYear: "2024",
  endWeek: "12",
};
```

**Monthly Range:**

```javascript
frequency = "monthly";
monthRange = {
  startYear: "2024",
  startMonth: "1",
  endYear: "2024",
  endMonth: "3",
};
```

**Yearly Range:**

```javascript
frequency = "yearly";
yearRange = {
  startYear: "2023",
  endYear: "2024",
};
```

#### Step 3: Generate Past Ratings Template

```javascript
const handleDownloadTemplate = async () => {
  try {
    // Validate range
    if (!isFormValid()) {
      toast.error("Please fill all required fields");
      return;
    }

    // Build parameters
    let params = {
      frequency,
      employeeId: employeeId || undefined, // Optional
    };

    // Add range parameters based on frequency
    if (frequency === "daily") {
      params.startDate = dateRange.startDate;
      params.endDate = dateRange.endDate;
    } else if (frequency === "weekly") {
      params.startYear = weekRange.startYear;
      params.startWeek = weekRange.startWeek;
      params.endYear = weekRange.endYear;
      params.endWeek = weekRange.endWeek;
    } else if (frequency === "monthly") {
      params.startYear = monthRange.startYear;
      params.startMonth = monthRange.startMonth;
      params.endYear = monthRange.endYear;
      params.endMonth = monthRange.endMonth;
    } else if (frequency === "yearly") {
      params.startYear = yearRange.startYear;
      params.endYear = yearRange.endYear;
    }

    // Request template
    const res = await generatePastRatingsTemplate(params);

    // Download file
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `past_ratings_${frequency}_template.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    toast.success("Template downloaded successfully!");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Error downloading template");
  }
};
```

**Example Request:**

```http
GET /api/v1/ratings/past-template?frequency=monthly&startYear=2024&startMonth=1&endYear=2024&endMonth=3&employeeId=emp123
Authorization: Bearer <token>
```

#### Step 4: Fill and Upload Template

```javascript
const handleUpload = async () => {
  if (!file) {
    toast.error("Please select an Excel file to upload");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadPastRatings(formData);

    if (res.data.errorCount && res.data.errorCount > 0) {
      setErrorCount(res.data.errorCount);
      setBulkErrors(res.data.errors);
    }

    toast.success(
      `Past ratings uploaded. Inserted: ${res.data.newCount || 0}, Updated: ${
        res.data.updatedCount || 0
      }`
    );

    setFile(null);
    setFileName("No file selected");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Error uploading file");
  }
};
```

## Excel Template Structure

### Current Period Template

**Columns:**

1. **Unique \_id**: Employee MongoDB \_id
2. **Employee Name**: Full name (read-only, for reference)
3. **Designation**: Job role (read-only)
4. **KPI Name**: KPI identifier (read-only)
5. **Type**: "quantitative" or "qualitative" (read-only)
6. **Max Marks**: Maximum score for this KPI (read-only)
7. **Target**: Target value for quantitative KPIs (read-only)
8. **Score**: **Editable** - Enter score (0 to Max Marks)
9. **Achieved**: **Editable** - For quantitative KPIs only
10. **Comment**: **Editable** - KPI-specific feedback
11. **Frequency**: Rating frequency (read-only)
12. **Date/Year/Month/Week**: Period identifiers (read-only)
13. **Version**: KPI set version (read-only)
14. **Overall Feedback**: **Editable** - General comment (same for all KPIs of one employee)

### Past Ratings Template

**Additional Features:**

- Includes existing ratings (if any) for reference
- Multiple rows per employee (one per period in range)
- Pre-filled with existing data (can be edited)

**Example Structure:**

| Unique \_id | Employee Name | KPI Name          | Type         | Max Marks | Target | Score | Achieved | Date       | Year | Month | Overall Feedback |
| ----------- | ------------- | ----------------- | ------------ | --------- | ------ | ----- | -------- | ---------- | ---- | ----- | ---------------- |
| emp123      | John Doe      | Number of Sales   | quantitative | 60        | 50     | 54    | 45       | 2024-01-15 | 2024 | 1     | Good performance |
| emp123      | John Doe      | Product Knowledge | qualitative  | 40        | -      | 36    | -        | 2024-01-15 | 2024 | 1     | Good performance |
| emp123      | John Doe      | Number of Sales   | quantitative | 60        | 50     | 60    | 50       | 2024-02-15 | 2024 | 2     | Excellent work   |
| emp123      | John Doe      | Product Knowledge | qualitative  | 40        | -      | 38    | -        | 2024-02-15 | 2024 | 2     | Excellent work   |

## Backend Processing

### Generate Bulk Template

**Endpoint:** `GET /api/v1/ratings/template`

**Controller:** `generateBulkTemplate` in `userRating.controller.js`

#### Implementation

```javascript
export const generateBulkTemplate = async (req, res) => {
  try {
    const { frequency, date, year, month, week, designation } = req.query;
    const managerId = req.user._id;

    // 1. Fetch manager's subordinates
    const subordinates = await getSubordinates(managerId);

    // Filter by designation if provided
    let filteredSubordinates = subordinates;
    if (designation) {
      filteredSubordinates = subordinates.filter(
        (emp) => emp.designation === designation
      );
    }

    if (filteredSubordinates.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "No subordinates found for this manager or no matching designation.",
        file: null,
      });
    }

    // 2. Fetch KPI sets for each unique designation-frequency
    const designationFreqMap = new Map();

    for (const emp of filteredSubordinates) {
      const key = `${emp.designation}-${frequency}`;
      if (!designationFreqMap.has(key)) {
        const kpiSet = await KpiSet.findOne({
          designation: emp.designation,
          frequency,
        })
          .sort({ version: -1 })
          .lean();

        if (kpiSet) {
          designationFreqMap.set(key, kpiSet);
        }
      }
    }

    if (designationFreqMap.size === 0) {
      return res.status(200).json({
        success: true,
        message: "No KPI sets found for these subordinates.",
        file: null,
      });
    }

    // 3. Build Excel workbook
    const workbook = new ExcelJS.Workbook();

    // Create one sheet per KPI (or combined sheet)
    const sheet = workbook.addWorksheet("Ratings");

    // 4. Define headers
    const headers = [
      "Unique _id",
      "Employee Name",
      "Designation",
      "KPI Name",
      "Type",
      "Max Marks",
      "Target",
      "Score",
      "Achieved",
      "Comment",
      "Frequency",
      "Date",
      "Year",
      "Month",
      "Week",
      "Version",
      "Overall Feedback",
    ];

    sheet.addRow(headers);

    // 5. Add data rows
    for (const emp of filteredSubordinates) {
      const key = `${emp.designation}-${frequency}`;
      const kpiSet = designationFreqMap.get(key);

      if (!kpiSet) continue;

      for (const kpi of kpiSet.kpis) {
        const row = [
          emp._id.toString(),
          `${emp.first_Name} ${emp.last_Name}`,
          emp.designation,
          kpi.kpiName,
          kpi.type,
          kpi.marks,
          kpi.type === "quantitative" ? kpi.target : "",
          "", // Score - to be filled
          "", // Achieved - to be filled (quantitative only)
          "", // Comment - to be filled
          frequency,
          frequency === "daily" ? date : "",
          ["weekly", "monthly", "yearly"].includes(frequency) ? year : "",
          ["weekly", "monthly"].includes(frequency) ? month : "",
          frequency === "weekly" ? week : "",
          kpiSet.version,
          "", // Overall Feedback - to be filled
        ];
        sheet.addRow(row);
      }
    }

    // 6. Style headers
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF4472C4" },
    };
    sheet.getRow(1).font = { color: { argb: "FFFFFFFF" }, bold: true };

    // 7. Generate buffer and send
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="bulk_rating_template.xlsx"`
    );

    res.send(buffer);
  } catch (err) {
    console.error("Error generating template:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};
```

### Generate Past Ratings Template

**Endpoint:** `GET /api/v1/ratings/past-template`

**Controller:** `generatePastRatingsTemplate` in `userRating.controller.js`

#### Key Differences from Current Template

1. **Date Range**: Generates rows for all periods in the range
2. **Existing Ratings**: Includes existing ratings if they exist
3. **Multiple Periods**: One row per period per employee per KPI

#### Implementation Flow

```javascript
export const generatePastRatingsTemplate = async (req, res) => {
  try {
    const {
      frequency,
      employeeId,
      startDate,
      endDate,
      startYear,
      startMonth,
      startWeek,
      endYear,
      endMonth,
      endWeek,
    } = req.query;

    const managerId = req.user._id;

    // 1. Get employees (specific or all subordinates)
    let employees = [];
    if (employeeId) {
      const emp = await User.findById(employeeId);
      if (emp) employees = [emp];
    } else {
      employees = await getSubordinates(managerId);
    }

    // 2. Generate date range based on frequency
    let periods = [];

    if (frequency === "daily") {
      // Generate all dates between startDate and endDate
      const start = new Date(startDate);
      const end = new Date(endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        periods.push({ date: new Date(d) });
      }
    } else if (frequency === "weekly") {
      // Generate all weeks between start and end
      // ... week calculation logic
    } else if (frequency === "monthly") {
      // Generate all months between start and end
      const start = { year: Number(startYear), month: Number(startMonth) };
      const end = { year: Number(endYear), month: Number(endMonth) };
      // ... month range generation
    }

    // 3. Fetch existing ratings for reference
    const existingRatings = await UserRating.find({
      employeeId: { $in: employees.map((e) => e._id) },
      frequency,
      // ... period filters
    }).lean();

    // 4. Build Excel with all periods
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Past Ratings");

    // Add headers
    sheet.addRow([...headers]);

    // Add rows for each employee, period, and KPI
    for (const emp of employees) {
      const kpiSet = await getKpiSetForEmployee(emp, frequency);
      if (!kpiSet) continue;

      for (const period of periods) {
        // Check if rating exists
        const existing = existingRatings.find(
          (r) =>
            r.employeeId.toString() === emp._id.toString() &&
            matchesPeriod(r, period, frequency)
        );

        for (const kpi of kpiSet.kpis) {
          const row = [
            emp._id.toString(),
            `${emp.first_Name} ${emp.last_Name}`,
            emp.designation,
            kpi.kpiName,
            kpi.type,
            kpi.marks,
            kpi.type === "quantitative" ? kpi.target : "",
            existing
              ? existing.kpis.find((k) => k.kpiName === kpi.kpiName)?.score ||
                ""
              : "",
            existing
              ? existing.kpis.find((k) => k.kpiName === kpi.kpiName)
                  ?.achieved || ""
              : "",
            existing
              ? existing.kpis.find((k) => k.kpiName === kpi.kpiName)?.comment ||
                ""
              : "",
            frequency,
            period.date || "",
            period.year || "",
            period.month || "",
            period.week || "",
            kpiSet.version,
            existing ? existing.comment || "" : "",
          ];
          sheet.addRow(row);
        }
      }
    }

    // 5. Send file
    const buffer = await workbook.xlsx.writeBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="past_ratings_template.xlsx"`
    );
    res.send(buffer);
  } catch (err) {
    console.error("Error generating past template:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
```

### Upload Bulk Ratings

**Endpoint:** `POST /api/v1/ratings/bulk-upload`

**Controller:** `uploadBulkRatings` in `userRating.controller.js`

#### Processing Flow

```javascript
export const uploadBulkRatings = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }

    // 1. Parse Excel file
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(req.file.buffer);

    // 2. Read all rows from all sheets
    let allRows = [];
    for (const sheet of wb.worksheets) {
      const headerRow = sheet.getRow(1);
      const headers = headerRow.values.slice(1); // Remove first empty cell

      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header

        const obj = {};
        headers.forEach((h, idx) => {
          const key = String(h).trim();
          const val = row.getCell(idx + 1).value;
          obj[key] = val == null ? "" : val;
        });
        allRows.push(obj);
      });
    }

    if (allRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Uploaded Excel is empty or invalid.",
      });
    }

    // 3. Validate rows
    const managerId = req.user._id;
    const validRows = [];
    const errorRows = [];

    allRows.forEach((row, index) => {
      const errors = [];

      // Extract values
      const uniqueId = row["Unique _id"];
      const kpiName = row["KPI Name"];
      const frequency = row["Frequency"];
      const score = parseFloat(row["Score"] || "0");
      const maxMarks = parseFloat(row["Max Marks"] || "0");
      const type = row["Type"];

      // Validation
      if (!uniqueId) errors.push("Missing Unique _id");
      if (!kpiName) errors.push("Missing KPI Name");
      if (!frequency) errors.push("Missing Frequency");

      if (score > maxMarks) {
        errors.push("Score cannot exceed Max Marks");
      }

      if (type === "quantitative") {
        const achieved = parseFloat(row["Achieved"] || "0");
        const target = parseFloat(row["Target"] || "0");
        if (target <= 0) {
          errors.push("Target must be greater than 0 for quantitative KPIs");
        }
      }

      if (errors.length > 0) {
        errorRows.push({ rowNumber: index + 2, errors }); // +2 for header and 1-based
      } else {
        validRows.push({
          employeeId: uniqueId,
          kpiName,
          type,
          maxMarks,
          target:
            type === "quantitative" ? parseFloat(row["Target"]) : undefined,
          achieved:
            type === "quantitative" ? parseFloat(row["Achieved"]) : undefined,
          score,
          comment: row["Comment"] || "",
          frequency,
          date: row["Date"] ? new Date(row["Date"]) : undefined,
          year: row["Year"] ? Number(row["Year"]) : undefined,
          month: row["Month"] ? Number(row["Month"]) : undefined,
          week: row["Week"] ? Number(row["Week"]) : undefined,
          version: Number(row["Version"]) || 1,
          overallFeedback: row["Overall Feedback"] || "",
        });
      }
    });

    // 4. Group rows by employee + period (create rating documents)
    const ratingMap = {};

    for (const item of validRows) {
      // Create unique key for rating document
      const key = [
        item.employeeId,
        item.frequency,
        item.date?.toISOString() || "",
        item.month || "",
        item.week || "",
        item.year || "",
        item.version,
      ].join("-");

      if (!ratingMap[key]) {
        ratingMap[key] = {
          employeeId: item.employeeId,
          ratedBy: managerId,
          frequency: item.frequency,
          version: item.version,
          date: item.date,
          month: item.month,
          week: item.week,
          year: item.year,
          kpis: [],
          overallFeedback: "",
        };
      }

      // Add KPI to rating
      ratingMap[key].kpis.push({
        kpiName: item.kpiName,
        type: item.type,
        marks: item.maxMarks,
        target: item.type === "quantitative" ? item.target : undefined,
        achieved: item.type === "quantitative" ? item.achieved : undefined,
        score: item.score,
        comment: item.comment,
      });

      if (item.overallFeedback.trim()) {
        ratingMap[key].overallFeedback = item.overallFeedback.trim();
      }
    }

    // 5. Recalculate scores (server-side validation)
    const ratingDocs = Object.values(ratingMap).map((rd) => {
      const recalculatedKpis = rd.kpis.map((k) => ({
        ...k,
        score: calculateKpiScore(k), // Recalculate for validation
      }));
      const totalScore = recalculatedKpis.reduce((s, k) => s + k.score, 0);
      return {
        ...rd,
        kpis: recalculatedKpis,
        totalScore,
        comment: rd.overallFeedback || "",
      };
    });

    // 6. Upsert ratings
    let newCount = 0;
    let updatedCount = 0;

    for (const doc of ratingDocs) {
      const filter = {
        employeeId: doc.employeeId,
        frequency: doc.frequency,
        version: doc.version,
        ...(doc.date && { date: doc.date }),
        ...(doc.year && { year: doc.year }),
        ...(doc.month && { month: doc.month }),
        ...(doc.week && { week: doc.week }),
      };

      const existing = await UserRating.findOne(filter);

      if (existing) {
        await UserRating.findOneAndUpdate(filter, doc, { new: true });
        updatedCount++;
      } else {
        await UserRating.create(doc);
        newCount++;
      }
    }

    // 7. Return results
    return res.status(200).json({
      success: true,
      message: "Bulk ratings processed successfully",
      data: {
        newCount,
        updatedCount,
        errorCount: errorRows.length,
        errors: errorRows,
      },
    });
  } catch (err) {
    console.error("Error uploading bulk ratings:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};
```

## Implementation Examples

### Example 1: Monthly Bulk Rating for Team

**Scenario:** Manager wants to rate entire team for March 2024.

**Step 1: Generate Template**

```javascript
// User selects:
frequency = "monthly";
year = "2024";
month = "3";
designation = "Sales Manager"; // Optional

// Click "Download Template"
// Excel file downloaded with:
// - All Sales Manager employees
// - All KPIs for monthly frequency
// - Pre-filled period information
```

**Step 2: Fill Template**

**Excel Content:**

```
Row 2: John Doe, Number of Sales, Score: 54, Achieved: 45
Row 3: John Doe, Product Knowledge, Score: 36
Row 4: Jane Smith, Number of Sales, Score: 60, Achieved: 50
Row 5: Jane Smith, Product Knowledge, Score: 38
...
```

**Step 3: Upload**

```javascript
// Select filled Excel file
// Click "Upload"
// Backend processes:
// - Validates all rows
// - Groups by employee + period
// - Creates/updates ratings
// - Returns: { newCount: 5, updatedCount: 2, errorCount: 0 }
```

### Example 2: Upload Past Daily Ratings

**Scenario:** Upload daily ratings for January 2024 for specific employee.

**Step 1: Select Employee and Range**

```javascript
employeeId = "emp123";
frequency = "daily";
dateRange = {
  startDate: "2024-01-01",
  endDate: "2024-01-31",
};
```

**Step 2: Generate Template**

```javascript
// Template includes:
// - 31 rows (one per day)
// - All KPIs for each day
// - Existing ratings pre-filled (if any)
// Total: 31 days × 2 KPIs = 62 rows
```

**Step 3: Fill and Upload**

```javascript
// User fills scores for each day
// Upload file
// Backend creates 31 rating documents (one per day)
```

### Example 3: Bulk Update Existing Ratings

**Scenario:** Correct scores for multiple employees.

**Step 1: Generate Template (includes existing data)**

```javascript
// Template downloaded with current ratings pre-filled
// User can see existing scores
```

**Step 2: Modify Scores**

```javascript
// User updates scores in Excel
// Example: Change John's "Number of Sales" score from 54 to 60
```

**Step 3: Upload**

```javascript
// Backend uses upsert logic
// Existing ratings are updated (not duplicated)
// Result: { newCount: 0, updatedCount: 10 }
```

## Error Handling

### Validation Errors

**Row-Level Errors:**

```javascript
// Example error response
{
  "success": true,
  "data": {
    "newCount": 8,
    "updatedCount": 2,
    "errorCount": 2,
    "errors": [
      {
        "rowNumber": 5,
        "errors": [
          "Score cannot exceed Max Marks",
          "Missing Achieved value for quantitative KPI"
        ]
      },
      {
        "rowNumber": 12,
        "errors": [
          "Missing Unique _id"
        ]
      }
    ]
  }
}
```

### Frontend Error Display

```javascript
// Display errors to user
{
  bulkErrors.length > 0 && (
    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
        {errorCount} error(s) found:
      </h4>
      <ul className="list-disc list-inside space-y-1">
        {bulkErrors.map((error, idx) => (
          <li key={idx} className="text-sm text-red-700 dark:text-red-300">
            Row {error.rowNumber}: {error.errors.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Common Validation Rules

1. **Required Fields:**

   - Unique \_id (employee ID)
   - KPI Name
   - Frequency
   - Score

2. **Score Validation:**

   - Must be number
   - Must be between 0 and Max Marks
   - For quantitative: Achieved must be provided

3. **Period Validation:**

   - Date format for daily
   - Year, month, week for weekly
   - Year, month for monthly
   - Year for yearly

4. **KPI Set Validation:**
   - KPI must exist in KPI set
   - Version must match
   - Type must match

## Best Practices

### Template Generation

1. **Filter by Designation**: Use designation filter to reduce template size
2. **Verify KPI Sets**: Ensure KPI sets exist before generating template
3. **Clear Instructions**: Include instructions in template header

### Bulk Upload

1. **Validate Before Upload**: Check file format and required columns
2. **Handle Partial Success**: Show both success and error counts
3. **Error Recovery**: Provide downloadable error report
4. **Progress Indication**: Show upload progress for large files

### Data Integrity

1. **Server-Side Recalculation**: Always recalculate scores on backend
2. **Upsert Logic**: Use upsert to avoid duplicates
3. **Version Tracking**: Ensure ratings reference correct KPI set version
4. **Audit Trail**: Log bulk operations for tracking

## Next Steps

Continue reading:

- [Part 1: Overview & Architecture](./performance-management-part1-overview.md)
- [Part 2: KPI Management](./performance-management-part2-kpi-management.md)
- [Part 3: Rating Management](./performance-management-part3-rating-management.md)
- [Part 5: Dashboards and Analytics](./performance-management-part5-dashboards-analytics.md)
- [Part 6: API Reference](./performance-management-part6-api-reference.md)

---

**Last Updated:** 2024  
**Maintained By:** Development Team
