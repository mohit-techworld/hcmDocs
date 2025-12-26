---
title: Recruitment Module
sidebar_position: 4
---

# Hiring Hub Module – Documentation

The **Hiring Hub** is the recruitment part of your HRMS **Human Maximizer**.  
It handles everything from **manpower request (MRF)** to **job posting**, **candidate applications**, **interviews**, and **offer letters**.

This document explains the Hiring Hub in **simple and clear language** so that:

- New developers can understand the code and flow.
- Product / QA can understand how the module works.
- You can easily extend or debug it later.

--- 

## 1. Big Picture: How Hiring Hub Works

The Hiring Hub follows this main flow:

```text
MRF (Manpower Requisition Form)
      ↓  (Approved)
Job / Vacancy
      ↓  (Public Apply link / QR)
Candidate Applications
      ↓ (Screening, Interviews, Decisions)
Offer Letter
      ↓
Employee Onboarding (outside Hiring Hub)
```

**In short:**  
Managers request new positions → HR creates job openings → candidates apply → interviews happen → decisions and offers are made.

---

## 2. Where the Code Lives

### 2.1 Backend (Node + Express + MongoDB)

Recruitment-related backend code is under:

```text
src/
  routes/v1/recruitment/
    mrf.route.js           // MRF API
    job.route.js           // Jobs/Vacancies API
    candidate.route.js     // Candidates API
    interview.route.js     // Interviews API (if separate)
    offerLetter.route.js   // Offers API (if separate)
    public.route.js        // Public job apply + referrer lookup

  controllers/recruitment/
    mrf.controller.js
    job.controller.js
    candidate.controller.js
    interview.controller.js
    offerLetter.controller.js
    public.controller.js

  models/recruitment/
    mrf.model.js
    job.model.js
    candidate.model.js
    interview.model.js
    offerLetter.model.js
```

Most APIs are under:  
`/api/v1/recruitment/...`  
Public APIs are under:  
`/api/v1/recruitment/public/...`

### 2.2 Frontend (React)

Recruitment-related pages:

```text
src/pages/recruit management/
  MRFPage.jsx             // Manage MRFs
  JobsPage.jsx            // Manage Jobs/Vacancies
  CandidatesPage.jsx      // Manage Candidates & pipeline
  MyInterviewsPage.jsx    // Interviewer panel
  Apply.jsx               // Public job application page

src/components/recruit management/
  RecruitDashboard.jsx    // Hiring Hub analytics dashboard
```

Common services:

```text
src/service/recruitService.js     // fetchOverview, metrics, trends, candidates
src/service/axiosInstance.js     // Authenticated axios
src/service/publicAxios.js       // Public axios for Apply page
```

---

## 3. Main Concepts (Domain Models)

### 3.1 MRF (Manpower Requisition Form)

**What it is:**  
An MRF is a request for new manpower.  
For example, “We need 3 Sales Executives in Mumbai.”

**Important fields:**

- `title` – Job title (e.g., "Sales Executive")
- `department` – e.g., "Sales", "IT", "HR"
- `vacancyCount` – Number of positions requested
- `employmentType` – e.g., "Full-Time", "Part-Time", "Intern"
- `salaryFrom`, `salaryTo` – salary range (optional)
- `location` – where the person will work
- `reportingManager` – who the new hire will report to:
  - Contains `employee_Id`, `first_Name`, `last_Name`, etc.
- `justification` – reason for this MRF
- `status` – `"Pending" | "Approved" | "Rejected"`
- `createdAt`, `updatedAt` – timestamps

### 3.2 Job / Vacancy

**What it is:**  
A Job or Vacancy is a live job opening created from an Approved MRF.

**Important fields:**

- `jobTitle` – name of the position
- `jobDepartment` – department name
- `employmentType` – list of selected types
- `mrfId` – link back to the MRF
- `vacancyStatus` – `"Open" | "On Hold" | "Closed" | "Completed" | "Draft"`
- `vacancyCount` – how many people to hire for this job
- `jobDescription` – text of JD
- `jobLocations` – location(s)
- `applyURL` – URL to public Apply form
- `qrCode` (via QR API) – image for QR scanning

### 3.3 Candidate

**What it is:**  
A Candidate is a person who applied for a job.

**Important fields:**

- `name`, `email`, `contactNumber`, `address` (optional)
- `source` – `"Portal" | "Referral" | "Walk-in" | "QR" | ...`
- `job` – embedded info about the job:
  - `jobTitle`, `jobDepartment`, `employmentType[]`
- `stage` – current pipeline stage:
  - examples: "Screening", "Technical Round 1", "Technical Round 2", "HR Round", "Final", "Offer"
- `status` – decision status:
  - examples: "New", "Selected", "Rejected", "On Hold", "In Process"
- `resume` – URL to resume file
- `rounds` – list of interview rounds
- `hrNotes` – history of HR decisions (`status`, `remarks`, `decidedAt`)
- `createdAt`, `updatedAt`

**Round example:**

```json
{
  "name": "Technical Round 1",
  "status": "Completed",
  "dateTime": "2025-11-10T10:00:00.000Z",
  "interviewerId": "userId",
  "interviewerName": "John Doe",
  "interviewerEmployeeId": "EMP001",
  "feedback": {
    "technicalScore": 8,
    "communicationScore": 7,
    "recommendation": "Selected",
    "remarks": "Strong skills"
  }
}
```

### 3.4 Offer Letter

**What it is:**  
Offer Letter entity linked to candidate and job.

**Likely fields:**

- `candidateId`, `jobId`
- `status` – "Draft", "Sent", "Accepted", "Rejected"
- `sentAt`, `acceptedAt`, `rejectedAt`

The dashboard links to this module via “Send Offer Letter” actions.

---

## 4. Important APIs (High-Level)

This is not a full Swagger spec, but a simple overview of important endpoints.

### 4.1 MRF APIs

- `GET /recruitment/mrf`
  - Query: `status?`, `department?`, `q?`
  - Returns list of MRFs and `meta.counters = { all, approved, pending, rejected }`.

- `POST /recruitment/mrf`
  - Body: MRF fields.
  - Creates a new MRF (status: "Pending").

- `PUT /recruitment/mrf/:id/approve`
  - Approves an MRF.

- `PUT /recruitment/mrf/:id/reject`
  - Rejects an MRF.

### 4.2 Jobs APIs

- `GET /recruitment/jobs`
  - Query: `department?`, `status?`
  - Returns list of Jobs and `meta.counters = { all, open, completed, draft }`.

- `POST /recruitment/jobs`
  - Body: FormData (job fields + optional JD file).
  - Creates a new job/vacancy.

- `PUT /recruitment/jobs/:id/status`
  - Body: `{ vacancyStatus }` (e.g., "On Hold", "Open", "Closed").

- `GET /recruitment/jobs/:id/qr`
  - Returns apply URL + QR image for the job.

### 4.3 Public Apply APIs

- `GET /recruitment/public/jobs/open`
  - Returns open jobs for selection on public Apply page.

- `GET /recruitment/public/jobs/:jobId`
  - Returns details of a specific job.

- `GET /recruitment/public/employee/:empId`
  - Fetches employee details for referral (auto-fills referrer name).

- `POST /recruitment/public/jobs/:jobId/apply`
  - FormData: `fullName`, `email`, `contactNumber`, `address`, `source`, `referrerEmployeeId`, `referrerName`, `resume`.
  - Creates candidate linked to that job.

### 4.4 Candidates APIs

- `GET /recruitment/candidates`
  - Filters (status, stage, department, search) via query.
  - Used by CandidatesPage and Dashboard.

- `GET /recruitment/candidates/:id`
  - Detailed candidate view: including job info, rounds, feedback.

- `PUT /recruitment/candidates/:id/next`
  - Body: `{ stage }`
  - Moves candidate to next stage.

- `PUT /recruitment/candidates/:id/status`
  - Body: `{ status, remarks }`
  - Updates candidate status and appends to `hrNotes`.

- `POST /recruitment/candidates/:id/assign`
  - Body: `{ roundName, interviewerId, dateTime }`
  - Assigns interviewer and schedules interview.

- `POST /recruitment/candidates/:id/feedback`
  - Body: scores, recommendation, remarks.
  - Saves feedback for a round and marks it Completed.

### 4.5 Dashboard APIs

Implemented in `recruitService.js`:

- `fetchOverview()`
  - Returns top-level counts:
    - openPositions, applicants, pendingPositions, onboarding.

- `fetchRecruitmentMetrics()`
  - Returns:
    - `statusSplit: [{ _id: statusName, count }]`
    - `candidatesByStage: [{ _id: stageName, count }]`

- `fetchApplicationTrends(monthCursor)`
  - Returns per-day counts (for a given month):
    - labels: [day1, day2, ...]
    - applied[], shortlisted[], selected[]

- `fetchCandidates()`
  - Returns candidates data for dashboard analytics & list.

---

## 5. Frontend Pages and Their Behavior

### 5.1 MRF Page (`MRFPage.jsx`)

**Route:** `/dashboard/recruitment/mrf`

**What it shows:**

- MRF cards with:
  - Title, department, vacancies, location, reporting manager.
  - Status pill: Pending / Approved / Rejected.
- Filters:
  - Search by title.
  - Filter by department.
  - Status tabs: All, Approved, Pending, Rejected.
- Actions:
  - “Raise Manpower Request” → opens MRF form modal.
  - Reporting manager can Approve/Reject Pending MRFs.

**MRF Form modal:**

- Fields: title, department, vacancyCount, employmentType, salaryFrom/To, location, reportingManager, justification.
- On submit: `POST /recruitment/mrf`.

When an MRF is **Approved**, it can be turned into a job (vacancy) on the **Jobs page**.

---

### 5.2 Jobs Page (`JobsPage.jsx`)

**Route:** `/dashboard/recruitment/jobs`

**What it shows:**

- Tabs: All, Open, On Hold, Completed.
- Filters: search (jobTitle & department), department dropdown.
- Jobs table with columns:
  - Job (title + location)
  - Department
  - Status (Open / On Hold / Completed)
  - Actions (Hold/Unhold, Close, QR, Post to Synergy)

**Behavior:**

- **Hold/Unhold** button:
  - Toggles `vacancyStatus` between `"Open"` and `"On Hold"`.

- **Close** button:
  - Sets `vacancyStatus` to `"Closed"` (“Completed” in UI).

- **QR** button:
  - Opens modal showing QR image and apply URL for the job.

- **Post to Synergy** button:
  - Opens Synergy modal where HR can post job announcement to internal feed.

**Approved MRFs button:**

- Opens modal listing all MRFs with `status="Approved"`.
- For each MRF card:
  - Shows department, vacancies, status.
  - If **no vacancy** has been created using this MRF:
    - Shows **“Create Vacancy”** button.
  - If a vacancy **already exists** with this MRF’s `_id` as `mrfId`:
    - Hides the button and shows a pill **“Vacancy already created”**.

**Create Vacancy modal:**

- Pre-filled from the chosen MRF.
- HR can adjust:
  - Job title, department, employment type, vacancy count, salary, location, job description.
- Optional JD file upload.
- On submit: `POST /recruitment/jobs`.

---

### 5.3 Candidates Page (`CandidatesPage.jsx`)

**Route:** `/dashboard/recruitment/candidates`

**What it shows:**

- Filters:
  - Status dropdown: All, Applied, Selected, On Hold, Rejected.
  - Department dropdown.
  - Round filter dropdown: Screening, Technical Round 1, Technical Round 2, HR Round, Final.
  - Search by candidate name, email, or job title.
- Card view for each candidate:
  - Name, email.
  - Role applied (jobTitle).
  - Department (jobDepartment).
  - Stage (Screening / Interview / HR / Final etc).
  - Status (New / Selected / Rejected / On Hold).

**Actions on each card:**

1. **View**  
   Opens a detailed modal showing:

   - Candidate info (email, phone, address if available).
   - Job info (role, department).
   - Applied date & resume (View Resume button).
   - Source (Portal, Referral, etc.).
   - Current stage and status.
   - Interview rounds table (per round: interviewer, status, scores, recommendation, remarks).

2. **Move Next**  
   Opens modal to choose the next stage (round).  
   Calls `PUT /recruitment/candidates/:id/next` with `{stage}`.

3. **Assign**  
   Opens modal to select an interviewer and date/time:
   - Fetches active users (`/user/get-all-active`).
   - HR picks interviewer and schedule.
   - Calls `POST /recruitment/candidates/:id/assign`.

4. **Decide**  
   Allows HR to set candidate status to Selected / On Hold / Rejected:
   - Shows Remarks modal.
   - Calls `PUT /recruitment/candidates/:id/status` with `{status, remarks}`.
   - Also adds a new entry into `hrNotes` on the frontend (and backend).

---

### 5.4 My Interviews Page (`MyInterviewsPage.jsx`)

**Route:** `/dashboard/recruitment/my-interviews`

**What it shows:**

- “Assigned to Me” table of interviews:
  - Candidate name & email.
  - Stage.
  - Action column:
    - If interview not completed: **“Take Interview / Give Feedback”** button.
    - If completed: shows “Completed” badge.
  - Candidate Profile column:
    - **View** button opens full candidate detail modal.

**Feedback modal:**

- Title: “Interview Feedback – [Candidate Name] (Round: X)”
- Fields:
  - Technical Score (0–10)
  - Communication Score (0–10)
  - Strengths
  - Weaknesses
  - Recommendation (Selected / On Hold / Rejected)
  - Remarks
- On submit:
  - `POST /recruitment/candidates/:id/feedback` with roundName and feedback data.
  - Locally moves the item from “assigned” to “completed” without waiting for additional API calls.

**View candidate modal (My Interviews):**

- Same view as CandidatesPage’s view modal.
- Shows Application info, Stage, Status, Department, Resume, Interview rounds with scores & feedback.

---

### 5.5 Public Apply Page (`Apply.jsx`)

**Route:** `/apply/:jobId`

**What it does:**

- Allows external candidate to apply for an open job.

**Fields:**

- Dropdown “Applied Post” – chooses from open jobs (`/recruitment/public/jobs/open`).  
- Full Name, Contact Number, Email.
- Source (Portal, Referral, Walk-in, QR).
- If Source is Referral:
  - Referrer Employee ID – auto fetches name using `/recruitment/public/employee/:id`.
  - Referrer’s Name – auto-filled, read-only.
- Address (optional).
- Resume upload (PDF/DOC/DOCX).

**On submit:**

- Builds `FormData` with all fields + resume.
- `POST /recruitment/public/jobs/:jobId/apply`.
- On success:
  - Shows success toast.
  - Resets form and clears file input.
  - This candidate will now appear in candidates list and dashboard.

---

### 5.6 Hiring Hub Dashboard (`RecruitDashboard.jsx`)

**Route:** `/dashboard/recruitment`

This is the main analytics screen for Hiring Hub.

#### 1) Top KPI Cards

Four cards:

1. **All Jobs** – from `/recruitment/jobs` meta.counters.all
2. **MRF Pending** – from `/recruitment/mrf` meta.counters.pending
3. **MRF Rejected** – from `/recruitment/mrf` meta.counters.rejected
4. **Open Jobs** – from `/recruitment/jobs` meta.counters.open

Each card:

- Has an icon, big number, label.
- Shows “View all →” on the right.
- Navigates to the appropriate page on click (Jobs or MRF).

#### 2) Applications Chart

- Bar chart (Chart.js) showing **per-day** counts for the selected month.
- Data from `fetchApplicationTrends(monthCursor)`:
  - `applied`, `selected`, `shortlisted` (treated as Rejected in chart).
- Month selector uses `shiftMonth(-1/+1)` and prevents going into future months.

#### 3) Job-wise Analytics

- **Top 5 Jobs by Applications**  
  Computed from candidates:
  - Group by `job.jobTitle` and count candidates.
  - Show horizontal bars sorted by count.

- **Job-wise Conversion**  
  Computed from candidates:
  - For each job: `total` candidates vs `selected` count.
  - Shows a table:

  | Job Title | Applicants | Selected | Conversion % |  

  - Conversion colored (green/yellow/red) based on percentage.

#### 4) MRF Analytics

- **MRFs by Department**  
  From `/recruitment/mrf` list.  
  Groups by `department` and `status` (Approved, Pending, Rejected) and shows a stacked bar chart.

- **MRFs Pending with You (Alert Card)**  
  Shows total pending MRFs (global).  
  Button `View all` navigates to MRF page.

*(You can refine this later to show only MRFs pending for current manager using `isMyMRF` logic.)*

#### 5) Source Analytics

From `candidates[]`:

- **Source distribution pie chart**
  - Groups candidates by `source` (Portal, Referral, Walk-in, QR, Unknown).

- **Source conversion bar chart**
  - For each source:
    - Applied = total candidates with that source.
    - Selected = where `status === "Selected"`.
  - Bar chart shows Applied vs Selected per source.

#### 6) Interview Analytics

From `candidates[].rounds`:

- **Interviews This Month**

  - For the current month:
    - Scheduled = number of rounds with `status === "scheduled" | "pending"`.
    - Completed = number of rounds with `status === "completed"`.


- **Interview Outcomes**

  - For **completed** rounds:
    - Reads `feedback.recommendation`:
      - "Selected" → Selected
      - contains "Hold" → On Hold
      - contains "Reject" → Rejected
      - anything else → Pending
  - Shows doughnut chart of counts per outcome.

#### 7) SLA: Time to Hire & Aging

- **Average Time to Hire**
  - For candidates with `status === "Selected"`:
    - Uses `createdAt` as applied date.
    - Uses `hrNotes` entry with status "Selected" (or updatedAt) as decided date.
    - Calculates days between.
    - Groups by month of décision and plots **average days** per month.

- **Aging – Open Candidates**
  - Considers candidates **not** in Selected/Rejected status.
  - Calculates days since `createdAt` and groups into buckets:
    - `0–7`, `8–14`, `15–30`, `31+` days.
  - Shows bar chart with counts per bucket.

#### 8) Open Positions by Department

- Uses static department list:
  - IT, HR, Finance, Operations, Sales, Marketing, Product, Support, Design, QA/Testing.
- From `/recruitment/jobs` list, for jobs with status not Closed or Completed:
  - Counts per `jobDepartment`.
- Donut chart shows open positions per department plus legend and total in center.

#### 9) Hiring Pulse

Uses overview + metrics:

- Open Positions: `openings` (prefer overview or job.open).
- Total Applicants: `overview.applicants` or `candidates.length`.
- Interviews / Applicants:
  - From `candidatesByStage` (“Interview” stages) vs total applicants.
- Offer Acceptance:

  ```js
  selectedCount = statusSplit["Selected"];
  rejectedCount = statusSplit["Rejected"];
  offersAcceptanceRate = selectedCount + rejectedCount > 0
    ? Math.round(selectedCount / (selectedCount + rejectedCount) * 100)
    : 0;
  ```

Shows small cards with value and short explanation.

#### 10) Applicants List with Tabs & Pagination

Tabs in this order:

1. **All Applicants** – no additional filter.
2. **Interviewing** – candidates with:
   - `rounds.length > 0`, or
   - `stage` includes `"interview"`.
3. **Selected** – `status === "Selected"`.
4. **Rejected** – `status === "Rejected"`.
5. **Job Offer** – same `status === "Selected"` candidates, but this tab shows a **“Send Offer Letter”** button for each row.

Other features:

- Search: by candidate name, email or job title.
- Sort: by name, role, or date.
- Department filter: by clicking department in donut (dashboard sets `activeDepartment`).
- Pagination:
  - Only shows 10 candidates per page (`PAGE_SIZE = 10`).
  - Pagination controls at bottom:
    - Prev / Next buttons.
    - Page number buttons (1, 2, 3, ...).
    - Text: `Page X of Y – Showing N of M filtered applicants`.

**Send Offer Letter button:**

- Only visible in **Job Offer** tab.
- On click:

  ```js
  nav("/dashboard/recruitment/offer-letter", {
    state: { candidateId: c._id },
  });
  ```

  This passes candidateId to your offer letter module.

---

## 6. Business Flows (Step-by-Step)

### 6.1 MRF Flow (Request → Approval → Vacancy)

1. **Manager raises MRF** on MRF page.
2. MRF `status = "Pending"`.
3. Reporting manager logs in, sees Pending MRFs, clicks Approve/Reject.
4. Approved MRFs show up in **Jobs → Approved MRFs** modal.
5. HR clicks **Create Vacancy** for an approved MRF.
6. Once a Job is created for that MRF:
   - The MRF card shows `Vacancy already created` instead of Create Vacancy.

### 6.2 Job & Candidate Flow

1. HR publishes job with public apply link / QR.
2. Candidate applies via Apply page (`/apply/:jobId`).
3. Candidate is created with initial stage + status and appears in:
   - Candidates page
   - Dashboard Applicants list
   - Analytics (source, stage, status, etc.).
4. HR uses Candidates page to:
   - View details.
   - Move to next stage (technical, HR, final).
   - Assign interviews.
   - Decide on status (Selected, On Hold, Rejected).

### 6.3 Interview Flow

1. HR assigns interviewers for a candidate using Assign in Candidates page.
2. Interviewers see assigned candidates in **MyInterviewsPage**.
3. Interviewers click **Take Interview / Give Feedback** and fill the feedback form:
   - tech/comm scores, strengths, weaknesses, recommendation, remarks.
4. Feedback is saved and round status becomes Completed.
5. Dashboard’s Interview section shows:
   - Interviews scheduled/completed this month.
   - Breakdown of outcomes (Selected / On Hold / Rejected).

### 6.4 Offer Flow

1. Selected candidates can be seen:
   - In Candidates page (status = Selected).
   - In Dashboard’s Applicants section, **Job Offer** tab.
2. In Job Offer tab, each candidate row has **Send Offer Letter** button.
3. On click, user is taken to Offer Letter module with `candidateId` in navigation state.
4. Offer letter is generated and sent from that module (not covered in this doc).

---

## 7. Roles & Permissions (Simple View)

You can configure real RBAC later, but generally:

- **HR / Recruiter**
  - Access dashboard, Jobs, MRFs, Candidates.
  - Create vacancies.
  - Assign interviews, change stages and statuses.
  - Send offer letters.

- **Line Manager**
  - Raise MRFs.
  - See MRFs where they are reporting manager.
  - Approve or Reject MRFs.

- **Interviewer**
  - See “My Interviews” (assigned interviews only).
  - View candidate profile.
  - Submit feedback.

- **Admin**
  - Everything (for system setup and troubleshooting).

---

## 8. How to Extend Hiring Hub

### Add a New Stage

1. Backend:
   - Make sure the new stage name is allowed and used in your logic (if you have enums/validation).
2. Frontend:
   - Add stage name in:
     - CandidatesPage round dropdown (`ROUNDS` list).
     - Any stage filters or orderings in Dashboard if you use them.
3. Analytics:
   - If `fetchRecruitmentMetrics` groups by stage, the new stage will appear automatically.
   - You may want to define display order for funnels.

### Add a New Status

1. Backend:
   - Update any status enums/checks in controllers or models.
2. Frontend:
   - Add status to Candidates page filters (Status dropdown).
   - Add to dashboard statusSplit-based charts if needed.

### Add a New Source

1. When `Apply.jsx` “Source” dropdown is updated with a new source, the dashboard’s source widgets will display it automatically (because they group by the `source` field).

---

## 9. Summary

The Hiring Hub module is made of:

- **MRF** – request positions.
- **Jobs** – create vacancies from approved MRFs.
- **Candidates** – manage pipeline and interviews.
- **My Interviews** – interviewer panel to give feedback.
- **Apply** – public job application form.
- **Dashboard** – one place to see everything: jobs, MRFs, pipeline, sources, interviews, and SLAs.

All of this is built using:

- Node.js/Express + MongoDB (backend).
- React + Chart.js + Tailwind/DaisyUI (frontend).
- A few well-defined APIs and models.

This document should give you (and your team) a clear mental model of how everything fits together, so you can maintain and grow the Hiring Hub with confidence.
