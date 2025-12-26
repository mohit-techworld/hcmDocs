---
title: "Performance Management - Part 2: KPI Management"
sidebar_position: 8
---

# Performance Management Module - Part 2: KPI Management

This document provides a comprehensive guide to KPI Set Management, covering how to create, update, and manage Key Performance Indicator templates for different designations and frequencies.

## Table of Contents

1. [Overview](#overview)
2. [KPI Set Structure](#kpi-set-structure)
3. [Frontend Component: SetKpisNew](#frontend-component-setkpisnew)
4. [Backend API](#backend-api)
5. [Version Management](#version-management)
6. [Implementation Examples](#implementation-examples)
7. [Validation Rules](#validation-rules)
8. [Common Use Cases](#common-use-cases)

## Overview

KPI Sets are templates that define performance indicators for specific job roles (designations) and evaluation frequencies. They serve as the foundation for performance ratings, ensuring consistency and standardization across the organization.

### Key Concepts

- **Designation**: Job role/title (e.g., "Sales Manager", "Software Engineer")
- **Frequency**: Evaluation interval (daily, weekly, monthly, yearly)
- **Version**: Immutable version number for historical tracking
- **KPI**: Individual performance indicator with name, type, marks, and optional target
- **Total Marks**: Sum of all KPI marks (must equal 100)

### KPI Types

1. **Quantitative KPIs**: Measurable, numeric targets

   - Requires `target` value
   - Score calculated: `(achieved / target) * marks`
   - Example: "Number of Sales" with target 50

2. **Qualitative KPIs**: Subjective evaluations
   - No target required
   - Score assigned by manager (0 to marks)
   - Example: "Product Knowledge" with marks 40

## KPI Set Structure

### Complete Schema

```javascript
{
  _id: ObjectId,
  designation: String,              // Required: Job role
  frequency: String,                 // Required: "daily" | "weekly" | "monthly" | "yearly"
  version: Number,                   // Auto-incremented, unique per designation-frequency
  kpis: [
    {
      kpiName: String,               // Required: KPI name
      type: String,                  // Required: "quantitative" | "qualitative"
      marks: Number,                 // Required: Weight/points (min: 0)
      target: Number,                // Required for quantitative (min: 0)
      category: String               // Optional: Category grouping
    }
  ],
  totalMarks: Number,                // Required: Sum of all KPI marks (must equal sum)
  createdBy: String,                 // Required: User identifier
  updatedBy: String,                 // Optional: User identifier
  createdAt: Date,
  updatedAt: Date
}
```

### Example KPI Set

```javascript
{
  "_id": "64f8b2a1c4d5e6f7g8h9i0j1",
  "designation": "Sales Manager",
  "frequency": "monthly",
  "version": 2,
  "kpis": [
    {
      "kpiName": "Number of Sales",
      "type": "quantitative",
      "marks": 60,
      "target": 50,
      "category": "Sales"
    },
    {
      "kpiName": "Customer Satisfaction",
      "type": "quantitative",
      "marks": 20,
      "target": 4.5,
      "category": "Customer Service"
    },
    {
      "kpiName": "Product Knowledge",
      "type": "qualitative",
      "marks": 20,
      "category": "Skills"
    }
  ],
  "totalMarks": 100,
  "createdBy": "admin123",
  "updatedBy": "admin123",
  "createdAt": "2024-01-25T10:30:00.000Z",
  "updatedAt": "2024-01-27T12:00:00.000Z"
}
```

## Frontend Component: SetKpisNew

**Location:** `hcmFrontend/src/components/performance management razor/SetKpisNew.jsx`

### Component Overview

The `SetKpisNew` component provides a complete interface for managing KPI sets with real-time validation, version management, and intuitive UI.

### Key Features

1. **Designation Selection**: Dropdown to select job role
2. **Frequency Selection**: Choose evaluation frequency
3. **Version Management**: View and specify version numbers
4. **KPI CRUD Operations**: Add, edit, delete KPIs
5. **Real-time Validation**: Total marks validation (must equal 100)
6. **Progress Indicator**: Visual feedback for marks completion
7. **Form State Management**: Tracks changes for update operations

### State Management

**Zustand Store:** `useKpiNewStore`

```javascript
import useKpiSetStore from "../../store/useKpiNewStore";

const {
  kpiSet, // Current KPI set
  loading, // Loading state
  error, // Error message
  createKpiSet, // Create function
  getKpiSet, // Fetch function
  updateKpiSet, // Update function
  deleteKpiSet, // Delete function
} = useKpiSetStore();
```

### Component Structure

```javascript
function SetKpis() {
  // Store hooks
  const {
    designations,
    loading: designationLoading,
    fetchDesignations,
  } = useDesignationStore();

  const {
    createKpiSet,
    getKpiSet,
    kpiSet,
    updateKpiSet,
    deleteKpiSet,
    loading: kpiLoading,
  } = useKpiSetStore();

  // Local state
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [version, setVersion] = useState("");
  const [kpis, setKpis] = useState([]);
  const [totalMarks, setTotalMarks] = useState(100);

  // KPI form fields
  const [kpiName, setKpiName] = useState("");
  const [marks, setMarks] = useState("");
  const [type, setType] = useState("quantitative");
  const [target, setTarget] = useState("");
  const [category, setCategory] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  // Track changes
  const [hasEdited, setHasEdited] = useState(false);

  // Auto-fetch KPI set when designation/frequency/version changes
  useEffect(() => {
    if (!selectedDesignation) return;
    handleAutoFetchKpiSet();
  }, [selectedDesignation, frequency, version]);

  // Calculate total marks when KPIs change
  useEffect(() => {
    setTotalMarks(computeMarkSum(kpis));
  }, [kpis]);

  // ... rest of component
}
```

### Detailed Implementation

#### 1. Auto-Fetch KPI Set

```javascript
const handleAutoFetchKpiSet = async () => {
  try {
    const data = await getKpiSet({
      designation: selectedDesignation,
      frequency,
      version: version || "", // Empty string = latest version
    });

    // Populate form with fetched data
    setKpis(data?.kpis || []);
    setEditIndex(null);
    setHasEdited(false);
  } catch (err) {
    if (err.response?.status === 404) {
      // No KPI set exists - show empty form
      setKpis([]);
      setEditIndex(null);
      setHasEdited(false);
      useKpiSetStore.setState({ kpiSet: null });
    } else {
      toast.error(err.response?.data?.message || err.message);
    }
  }
};
```

**Example Flow:**

1. User selects "Sales Manager" designation
2. User selects "monthly" frequency
3. Component automatically fetches latest KPI set
4. If found: Form populated with existing KPIs
5. If not found: Empty form shown for new KPI set

#### 2. Add/Update KPI

```javascript
const handleAddOrUpdateKpi = () => {
  // Validation
  if (!kpiName.trim()) {
    toast.error("Enter KPI name");
    return;
  }
  if (!marks) {
    toast.error("Enter KPI marks");
    return;
  }

  // Build KPI object
  const newItem = {
    kpiName,
    marks: Number(marks),
    type,
    category,
    // Only add target for quantitative KPIs
    ...(type === "quantitative" ? { target: Number(target) || 0 } : {}),
  };

  if (editIndex !== null) {
    // Update existing KPI
    const updated = [...kpis];
    updated[editIndex] = newItem;

    // Validate total marks
    if (computeMarkSum(updated) > 100) {
      toast.error("Total marks cannot exceed 100!");
      return;
    }

    setKpis(updated);
    setEditIndex(null);
    toast.success("KPI updated!");
  } else {
    // Add new KPI
    const sum = computeMarkSum([...kpis, newItem]);
    if (sum > 100) {
      toast.error("Total marks cannot exceed 100!");
      return;
    }
    setKpis([...kpis, newItem]);
    toast.success("KPI added!");
  }

  // Reset form
  setKpiName("");
  setMarks("");
  setType("quantitative");
  setTarget("");
  setCategory("");
  setHasEdited(true); // Mark as edited for update button
};
```

**Example Usage:**

```javascript
// Adding a new KPI
// User fills form:
kpiName: "Customer Retention";
type: "quantitative";
marks: 30;
target: 85;
category: "Customer Service";

// Clicks "Add KPI"
// Result: KPI added to list, total marks updated
```

#### 3. Edit KPI

```javascript
const handleEditKpi = (index) => {
  const item = kpis[index];

  // Populate form with KPI data
  setKpiName(item.kpiName);
  setMarks(item.marks);
  setType(item.type);
  setTarget(item.target || "");
  setCategory(item.category || "");
  setEditIndex(index); // Mark which KPI is being edited
  setFormExpanded(true);
  setHasEdited(true);
};
```

**Example Flow:**

1. User clicks edit button on a KPI row
2. Form fields populated with KPI data
3. User modifies values
4. Clicks "Update KPI"
5. KPI updated in list, total marks recalculated

#### 4. Delete KPI

```javascript
const handleDeleteKpi = (index) => {
  setKpis(kpis.filter((_, i) => i !== index));
  setHasEdited(true);
  toast.success("KPI removed.");
};
```

#### 5. Create KPI Set

```javascript
const handleCreateKpiSet = async () => {
  // Validation
  if (!selectedDesignation) {
    return toast.error("Select a designation.");
  }
  if (!frequency) {
    return toast.error("Select a frequency.");
  }

  const sum = computeMarkSum(kpis);
  if (sum !== 100) {
    return toast.error("Total KPI marks must equal 100.");
  }

  // Prepare payload
  const payload = {
    designation: selectedDesignation,
    frequency,
    version: version ? Number(version) : undefined, // Auto-increment if not provided
    kpis,
    totalMarks: sum,
    createdBy: "adminUser", // Should come from auth store
  };

  try {
    const result = await createKpiSet(payload);
    toast.success("KPI Set created!");

    // Update store with new KPI set
    useKpiSetStore.setState({ kpiSet: result.data });
    setKpis(result.data.kpis || []);
    setHasEdited(false);
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};
```

**Example Request:**

```javascript
// Payload sent to API
{
  designation: "Sales Manager",
  frequency: "monthly",
  kpis: [
    {
      kpiName: "Number of Sales",
      type: "quantitative",
      marks: 60,
      target: 50,
      category: "Sales"
    },
    {
      kpiName: "Product Knowledge",
      type: "qualitative",
      marks: 40,
      category: "Skills"
    }
  ],
  totalMarks: 100,
  createdBy: "admin123"
}

// Backend automatically sets version to 1 (first version)
// Response includes created KPI set with _id and version
```

#### 6. Update KPI Set

```javascript
const handleUpdateKpiSet = async () => {
  if (!kpiSet?._id) {
    toast.error("No KPI set loaded to update (fetch or create first).");
    return;
  }

  const sum = computeMarkSum(kpis);
  if (sum !== 100) {
    toast.error("Total KPI marks must equal 100.");
    return;
  }

  const payload = {
    designation: selectedDesignation,
    frequency,
    kpis,
    totalMarks: sum,
    // Include version only if specified
    ...(version !== "" ? { version: Number(version) } : {}),
    updatedBy: "adminUser",
  };

  try {
    await updateKpiSet(kpiSet._id, payload);
    toast.success("KPI Set updated!");
    // Refresh UI with latest data
    handleAutoFetchKpiSet();
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};
```

**Important Note:** The update operation modifies the existing document. For immutable versioning (creating new version), you should use the create endpoint with a new version number.

#### 7. Delete KPI Set

```javascript
const confirmDeleteKpiSet = async () => {
  if (!kpiSet?._id) return toast.error("No KPI set to delete.");

  try {
    await deleteKpiSet(kpiSet._id);
    toast.success("KPI Set deleted!");
    setKpis([]);
    useKpiSetStore.setState({ kpiSet: null });
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

const handleDeleteKpiSet = () => {
  // Show confirmation dialog
  setConfirmTitle("Delete KPI Set?");
  setConfirmMessage(
    "Are you sure you want to permanently delete this KPI Set?"
  );
  setConfirmAction(() => confirmDeleteKpiSet);
  setConfirmOpen(true);
};
```

### UI Features

#### Progress Indicator

```javascript
// Calculate completion status
const completionStatus =
  totalMarks === 100
    ? "complete"
    : totalMarks > 90
    ? "almost"
    : totalMarks > 50
    ? "halfway"
    : "incomplete";

const progressColors = {
  complete: "bg-emerald-500",
  almost: "bg-yellow-500",
  halfway: "bg-blue-500",
  incomplete: "bg-red-500",
};

// Display progress bar
<div className="w-full bg-gray-200 rounded-full h-2">
  <div
    className={`h-2 rounded-full transition-all ${progressColors[completionStatus]}`}
    style={{ width: `${totalMarks}%` }}
  />
</div>
<p className="text-sm text-gray-600">
  Total Marks: {totalMarks}/100
</p>
```

#### Button States

```javascript
// Determine button states
const isExistingSet = !!kpiSet?._id;
const isCreateEnabled = !isExistingSet && totalMarks === 100 && kpis.length > 0;
const isUpdateEnabled = isExistingSet && hasEdited && totalMarks === 100;
const isDeleteEnabled = isExistingSet;

// Render buttons conditionally
{
  isCreateEnabled && (
    <button onClick={handleCreateKpiSet}>Create KPI Set</button>
  );
}

{
  isUpdateEnabled && (
    <button onClick={handleUpdateKpiSet}>Update KPI Set</button>
  );
}

{
  isDeleteEnabled && (
    <button onClick={handleDeleteKpiSet}>Delete KPI Set</button>
  );
}
```

## Backend API

### Routes

**Location:** `hcmBackendv2/src/routes/v1/performance/kpiSet.route.js`

| Method | Endpoint      | Controller      | Auth | Description                |
| ------ | ------------- | --------------- | ---- | -------------------------- |
| POST   | `/create`     | `createKpiSet`  | JWT  | Create new KPI set         |
| GET    | `/`           | `getKpiSet`     | JWT  | Get KPI set (with filters) |
| GET    | `/all`        | `getAllKpiSets` | JWT  | Get all KPI sets           |
| PUT    | `/update/:id` | `updateKpiSet`  | JWT  | Update existing KPI set    |
| DELETE | `/delete/:id` | `deleteKpiSet`  | JWT  | Delete KPI set             |

### Controller Implementation

**Location:** `hcmBackendv2/src/controllers/performance/kpiSet.controller.js`

#### Create KPI Set

```javascript
export const createKpiSet = async (req, res) => {
  try {
    const { designation, frequency, kpis, totalMarks, createdBy, version } =
      req.body;

    // Auto-increment version if not provided
    let newVersion = version;
    if (!newVersion) {
      const latestSet = await KpiSet.findOne({ designation, frequency })
        .sort({ version: -1 })
        .lean();

      newVersion = latestSet ? latestSet.version + 1 : 1;
    }

    // Create new KPI set
    const newKpiSet = new KpiSet({
      designation,
      frequency,
      version: newVersion,
      kpis,
      totalMarks,
      createdBy,
    });

    await newKpiSet.save();

    return res.status(201).json({
      success: true,
      message: `KPI Set created successfully with version ${newVersion}`,
      data: newKpiSet,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key error (unique index violation)
      return res.status(400).json({
        success: false,
        message:
          "A KPI set with this (designation, frequency, version) already exists.",
      });
    }

    console.error("Error creating KPI set:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};
```

**Example Request:**

```http
POST /api/v1/kpis/create
Content-Type: application/json
Authorization: Bearer <token>

{
  "designation": "Sales Manager",
  "frequency": "monthly",
  "kpis": [
    {
      "kpiName": "Number of Sales",
      "type": "quantitative",
      "marks": 60,
      "target": 50,
      "category": "Sales"
    },
    {
      "kpiName": "Product Knowledge",
      "type": "qualitative",
      "marks": 40,
      "category": "Skills"
    }
  ],
  "totalMarks": 100,
  "createdBy": "admin123"
}
```

**Example Response:**

```json
{
  "success": true,
  "message": "KPI Set created successfully with version 1",
  "data": {
    "_id": "64f8b2a1c4d5e6f7g8h9i0j1",
    "designation": "Sales Manager",
    "frequency": "monthly",
    "version": 1,
    "kpis": [
      {
        "kpiName": "Number of Sales",
        "type": "quantitative",
        "marks": 60,
        "target": 50,
        "category": "Sales"
      },
      {
        "kpiName": "Product Knowledge",
        "type": "qualitative",
        "marks": 40,
        "category": "Skills"
      }
    ],
    "totalMarks": 100,
    "createdBy": "admin123",
    "createdAt": "2024-01-25T10:30:00.000Z",
    "updatedAt": "2024-01-25T10:30:00.000Z"
  }
}
```

#### Get KPI Set

```javascript
export const getKpiSet = async (req, res) => {
  try {
    const { designation, frequency, version } = req.query;

    // Validation
    if (!designation || !frequency) {
      return res.status(400).json({
        success: false,
        message: "designation and frequency are required.",
      });
    }

    const baseQuery = { designation, frequency };

    let kpiSet;
    if (version) {
      // Get specific version
      kpiSet = await KpiSet.findOne({
        ...baseQuery,
        version: Number(version),
      });
    } else {
      // Get latest version
      const sets = await KpiSet.find(baseQuery).sort({ version: -1 }).limit(1);
      kpiSet = sets[0];
    }

    if (!kpiSet) {
      return res.status(404).json({
        success: false,
        message: "KPI Set not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: kpiSet,
    });
  } catch (err) {
    console.error("Error fetching KPI set:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
```

**Example Requests:**

```http
# Get latest version
GET /api/v1/kpis?designation=Sales%20Manager&frequency=monthly
Authorization: Bearer <token>

# Get specific version
GET /api/v1/kpis?designation=Sales%20Manager&frequency=monthly&version=2
Authorization: Bearer <token>
```

#### Update KPI Set

```javascript
export const updateKpiSet = async (req, res) => {
  try {
    const { id } = req.params;
    const { designation, frequency, kpis, totalMarks, version, updatedBy } =
      req.body;

    const existingDoc = await KpiSet.findById(id);
    if (!existingDoc) {
      return res.status(404).json({
        success: false,
        message: "KPI Set not found.",
      });
    }

    // Update fields
    existingDoc.designation = designation || existingDoc.designation;
    existingDoc.frequency = frequency || existingDoc.frequency;
    if (version !== undefined) existingDoc.version = version;
    if (kpis) existingDoc.kpis = kpis;
    if (totalMarks !== undefined) existingDoc.totalMarks = totalMarks;
    if (updatedBy) existingDoc.updatedBy = updatedBy;

    const updatedKpiSet = await existingDoc.save();

    return res.status(200).json({
      success: true,
      message: "KPI Set updated successfully",
      data: updatedKpiSet,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message:
          "Another KPI set already has the same (designation, frequency, version).",
      });
    }

    console.error("Error updating KPI set:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};
```

**Note:** This updates the existing document. For immutable versioning, create a new KPI set with incremented version.

#### Delete KPI Set

```javascript
export const deleteKpiSet = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await KpiSet.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "KPI Set not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "KPI Set permanently deleted.",
    });
  } catch (err) {
    console.error("Error deleting KPI set:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
```

## Version Management

### How Versioning Works

1. **First KPI Set**: Version starts at 1
2. **Subsequent Versions**: Auto-incremented from latest version
3. **Manual Version**: Can specify version number explicitly
4. **Unique Constraint**: (designation, frequency, version) must be unique

### Version Increment Logic

```javascript
// Backend logic
let newVersion = version; // Use provided version if exists
if (!newVersion) {
  // Find latest version for this designation-frequency
  const latestSet = await KpiSet.findOne({ designation, frequency })
    .sort({ version: -1 })
    .lean();

  // Increment from latest or start at 1
  newVersion = latestSet ? latestSet.version + 1 : 1;
}
```

### Example Version History

```
Designation: Sales Manager, Frequency: Monthly

Version 1 (Created Jan 2024):
- KPI 1: Number of Sales (60 marks)
- KPI 2: Product Knowledge (40 marks)
- Total: 100 marks

Version 2 (Created Mar 2024):
- KPI 1: Number of Sales (60 marks)
- KPI 2: Customer Satisfaction (20 marks) [NEW]
- KPI 3: Product Knowledge (20 marks) [REDUCED from 40]
- Total: 100 marks

Version 3 (Created Jun 2024):
- KPI 1: Number of Sales (50 marks) [REDUCED]
- KPI 2: Customer Satisfaction (30 marks) [INCREASED]
- KPI 3: Product Knowledge (20 marks)
- Total: 100 marks
```

### Best Practices for Versioning

1. **Create New Version for Changes**: Don't update existing versions used in ratings
2. **Document Changes**: Use comments or change logs to track modifications
3. **Version Naming**: Consider semantic versioning for major/minor changes
4. **Migration Strategy**: Plan how to handle ratings using old versions

## Implementation Examples

### Example 1: Creating a Complete KPI Set

**Scenario:** Create a monthly KPI set for "Software Engineer" with 3 KPIs.

**Step-by-Step:**

```javascript
// 1. Select designation and frequency
setSelectedDesignation("Software Engineer");
setFrequency("monthly");

// 2. Add first KPI (Quantitative)
setKpiName("Code Quality Score");
setType("quantitative");
setMarks(40);
setTarget(8.5); // Out of 10
setCategory("Technical");
handleAddOrUpdateKpi(); // Adds to list

// 3. Add second KPI (Quantitative)
setKpiName("Tasks Completed");
setType("quantitative");
setMarks(30);
setTarget(20); // Tasks per month
setCategory("Productivity");
handleAddOrUpdateKpi();

// 4. Add third KPI (Qualitative)
setKpiName("Team Collaboration");
setType("qualitative");
setMarks(30);
setCategory("Soft Skills");
handleAddOrUpdateKpi();

// 5. Verify total marks = 100
// totalMarks should be 100

// 6. Create KPI set
handleCreateKpiSet();
```

**Result:**

```javascript
{
  designation: "Software Engineer",
  frequency: "monthly",
  version: 1,
  kpis: [
    { kpiName: "Code Quality Score", type: "quantitative", marks: 40, target: 8.5 },
    { kpiName: "Tasks Completed", type: "quantitative", marks: 30, target: 20 },
    { kpiName: "Team Collaboration", type: "qualitative", marks: 30 }
  ],
  totalMarks: 100
}
```

### Example 2: Updating an Existing KPI Set

**Scenario:** Add a new KPI to existing set (creates new version).

```javascript
// 1. Fetch existing KPI set
await getKpiSet({
  designation: "Sales Manager",
  frequency: "monthly"
});
// Returns version 1 with 2 KPIs

// 2. Add new KPI
setKpiName("Customer Retention");
setType("quantitative");
setMarks(25);
setTarget(85);
setCategory("Customer Service");
handleAddOrUpdateKpi();

// 3. Adjust existing KPI marks to maintain 100 total
// Original: KPI1 (60) + KPI2 (40) = 100
// New: KPI1 (60) + KPI2 (15) + KPI3 (25) = 100
// Edit KPI2 to reduce marks from 40 to 15

// 4. Create new version (not update!)
const payload = {
  designation: "Sales Manager",
  frequency: "monthly",
  version: 2,  // Explicitly set to 2
  kpis: [...], // Updated KPI list
  totalMarks: 100,
  createdBy: "admin123"
};
await createKpiSet(payload);
```

### Example 3: Fetching and Displaying KPI Set

```javascript
// Fetch latest version
const fetchKpiSet = async () => {
  try {
    const data = await getKpiSet({
      designation: "Sales Manager",
      frequency: "monthly",
      // version not specified = latest
    });

    console.log("KPI Set:", data);
    // {
    //   designation: "Sales Manager",
    //   frequency: "monthly",
    //   version: 2,
    //   kpis: [...],
    //   totalMarks: 100
    // }

    // Display in UI
    setKpis(data.kpis);
  } catch (error) {
    if (error.response?.status === 404) {
      console.log("No KPI set found - show empty form");
    }
  }
};

// Fetch specific version
const fetchVersion1 = async () => {
  const data = await getKpiSet({
    designation: "Sales Manager",
    frequency: "monthly",
    version: 1, // Specific version
  });
};
```

## Validation Rules

### Frontend Validation

1. **KPI Name**: Required, non-empty string
2. **Marks**: Required, number, minimum 0
3. **Type**: Required, must be "quantitative" or "qualitative"
4. **Target**: Required for quantitative KPIs, number, minimum 0
5. **Total Marks**: Must equal exactly 100
6. **Designation**: Required for create/update
7. **Frequency**: Required for create/update

### Backend Validation

**Model Schema Validation:**

```javascript
// KPI Schema
{
  kpiName: { type: String, required: true },
  type: {
    type: String,
    enum: ["quantitative", "qualitative"],
    required: true
  },
  marks: {
    type: Number,
    required: true,
    min: [0, "Marks cannot be negative"]
  },
  target: {
    type: Number,
    min: [0, "Target cannot be negative"]
  },
  category: { type: String }
}

// KPI Set Schema
{
  designation: { type: String, required: true, index: true },
  frequency: {
    type: String,
    enum: ["daily", "weekly", "monthly", "yearly"],
    required: true
  },
  version: { type: Number, default: 1 },
  kpis: {
    type: [kpiSchema],
    validate: {
      validator: function (arr) {
        // Quantitative KPIs must have target
        return arr.every(item =>
          item.type !== "quantitative" ||
          (item.target !== null && item.target !== undefined)
        );
      },
      message: "For quantitative KPIs, 'target' must be provided."
    }
  },
  totalMarks: {
    type: Number,
    required: true,
    min: [0, "totalMarks cannot be negative"]
  }
}

// Pre-save validation
kpiSetSchema.pre("save", function (next) {
  const sum = this.kpis.reduce((acc, kpi) => acc + kpi.marks, 0);
  if (sum !== this.totalMarks) {
    return next(new Error("Sum of KPI marks must equal totalMarks"));
  }
  next();
});

// Unique index
kpiSetSchema.index(
  { designation: 1, frequency: 1, version: 1 },
  { unique: true }
);
```

### Validation Examples

**Valid KPI Set:**

```javascript
{
  designation: "Sales Manager",
  frequency: "monthly",
  kpis: [
    { kpiName: "Sales", type: "quantitative", marks: 60, target: 50 },
    { kpiName: "Knowledge", type: "qualitative", marks: 40 }
  ],
  totalMarks: 100  // ✅ Matches sum of marks
}
```

**Invalid Examples:**

```javascript
// ❌ Total marks mismatch
{
  kpis: [
    { marks: 60 },
    { marks: 50 }  // Total would be 110
  ],
  totalMarks: 100
}

// ❌ Missing target for quantitative
{
  kpiName: "Sales",
  type: "quantitative",
  marks: 60
  // target missing ❌
}

// ❌ Negative marks
{
  marks: -10  // ❌
}

// ❌ Invalid frequency
{
  frequency: "biweekly"  // ❌ Not in enum
}
```

## Common Use Cases

### Use Case 1: Setting Up KPIs for New Designation

**Scenario:** Company hires first "Data Scientist" and needs to create KPIs.

**Steps:**

1. **Navigate to KPI Management**

   ```javascript
   // Route: /performance/kpi-management
   // Component: SetKpisNew
   ```

2. **Select Designation**

   ```javascript
   // Dropdown shows all designations
   // Select: "Data Scientist"
   setSelectedDesignation("Data Scientist");
   ```

3. **Select Frequency**

   ```javascript
   // Choose evaluation frequency
   setFrequency("monthly");
   ```

4. **Add KPIs**

   ```javascript
   // Add KPI 1: Model Accuracy (Quantitative)
   {
     kpiName: "Model Accuracy",
     type: "quantitative",
     marks: 50,
     target: 0.95,  // 95% accuracy
     category: "Technical"
   }

   // Add KPI 2: Research Publications (Quantitative)
   {
     kpiName: "Research Publications",
     type: "quantitative",
     marks: 30,
     target: 2,  // 2 papers per month
     category: "Research"
   }

   // Add KPI 3: Team Collaboration (Qualitative)
   {
     kpiName: "Team Collaboration",
     type: "qualitative",
     marks: 20,
     category: "Soft Skills"
   }
   ```

5. **Create KPI Set**
   ```javascript
   // Verify total marks = 100
   // Click "Create KPI Set"
   // Backend creates version 1
   ```

### Use Case 2: Updating KPIs Mid-Year

**Scenario:** Need to add a new KPI to existing set without affecting past ratings.

**Steps:**

1. **Fetch Current KPI Set**

   ```javascript
   await getKpiSet({
     designation: "Sales Manager",
     frequency: "monthly",
   });
   // Returns version 1
   ```

2. **Create New Version**

   ```javascript
   // Don't update version 1!
   // Instead, create version 2 with new KPI

   const newKpiSet = {
     designation: "Sales Manager",
     frequency: "monthly",
     version: 2, // New version
     kpis: [
       // Existing KPIs
       ...existingKpis,
       // New KPI
       {
         kpiName: "Customer Retention",
         type: "quantitative",
         marks: 20,
         target: 85,
       },
     ],
     // Adjust other KPIs to maintain 100 total
     totalMarks: 100,
   };

   await createKpiSet(newKpiSet);
   ```

3. **Result**
   - Version 1: Still exists, used by past ratings
   - Version 2: New version, used by future ratings

### Use Case 3: Copying KPIs Between Frequencies

**Scenario:** Create weekly KPIs based on monthly KPIs.

**Steps:**

```javascript
// 1. Fetch monthly KPI set
const monthlyKpis = await getKpiSet({
  designation: "Sales Manager",
  frequency: "monthly",
});

// 2. Adjust targets for weekly frequency
const weeklyKpis = monthlyKpis.kpis.map((kpi) => {
  if (kpi.type === "quantitative") {
    // Divide monthly target by 4 for weekly
    return {
      ...kpi,
      target: kpi.target / 4,
    };
  }
  return kpi;
});

// 3. Create weekly KPI set
await createKpiSet({
  designation: "Sales Manager",
  frequency: "weekly",
  kpis: weeklyKpis,
  totalMarks: 100,
  createdBy: "admin123",
});
```

## Error Handling

### Common Errors and Solutions

#### 1. Total Marks Validation Error

**Error:**

```json
{
  "success": false,
  "message": "Sum of KPI marks must equal totalMarks"
}
```

**Solution:**

```javascript
// Frontend validation before submit
const sum = kpis.reduce((acc, kpi) => acc + kpi.marks, 0);
if (sum !== 100) {
  toast.error("Total KPI marks must equal 100.");
  return;
}
```

#### 2. Duplicate Version Error

**Error:**

```json
{
  "success": false,
  "message": "A KPI set with this (designation, frequency, version) already exists."
}
```

**Solution:**

```javascript
// Don't specify version - let backend auto-increment
const payload = {
  designation: "Sales Manager",
  frequency: "monthly",
  // version: 2,  // Remove this
  kpis: [...],
  totalMarks: 100
};
```

#### 3. Missing Target for Quantitative KPI

**Error:**

```json
{
  "message": "For quantitative KPIs, 'target' must be provided."
}
```

**Solution:**

```javascript
// Always include target for quantitative KPIs
if (type === "quantitative") {
  if (!target || target <= 0) {
    toast.error("Target is required for quantitative KPIs");
    return;
  }
}
```

## Next Steps

Continue reading:

- [Part 1: Overview & Architecture](./performance-management-part1-overview.md)
- [Part 3: Rating Management](./performance-management-part3-rating-management.md)
- [Part 4: Bulk Operations](./performance-management-part4-bulk-operations.md)
- [Part 5: Dashboards and Analytics](./performance-management-part5-dashboards-analytics.md)
- [Part 6: API Reference](./performance-management-part6-api-reference.md)

---

**Last Updated:** 2024  
**Maintained By:** Development Team
