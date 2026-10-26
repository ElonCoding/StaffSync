# Phase 5: Performance Testing & Quality Assurance — User Acceptance Testing (UAT)

## 1. Domain Mapping & Template Reconciliation
The submitted testing scope originates from a generic freelance/job portal template. Below is the direct architectural alignment and reconciliation with **StaffSync Enterprise HRMS**:

| Generic Template Scope | StaffSync HRMS Equivalent Module | Production Implementation Evidence |
| :--- | :--- | :--- |
| **User Registration & Login** | Multi-Role Authentication Gateway | `POST /api/auth/login`, `POST /api/auth/register`, JWT verification |
| **Freelancer / Client Profiles** | Staff & Manager Dossier Management | `GET /api/employees/:id`, `PUT /api/employees/:id`, dynamic contact updates |
| **Job Posting & Application** | Training Curricula & Leave Requests | `POST /api/training`, `POST /api/leaves`, balance collision guards |
| **Messaging System** | Organizational Bulletins & Announcements | `GET /api/announcements`, `POST /api/announcements` with urgency tags |
| **Payment Gateway Integration** | Leave Balance Ledger & Shift Telemetry | Auto-deducting balances (Annual/Sick/Casual) & worked hours calculation |
| **Job Status Updates** | Request Lifecycle State Machines | Leave (`Pending` -> `Approved`/`Rejected`), Training (`In Progress` -> `Completed`) |
| **Search & Filter Functionality** | Workforce Directory Filtering | Instant query by Name, Department, and Active/On-Leave status |
| **Review & Rating System** | Manager Review & Milestone Auditing | Manager approval desk with reviewer comments & cohort completion tracking |

---

## 2. Requirements Traceability Matrix

| Requirement | Actor | Target Feature | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **REQ-UAT-01** | Staff Employee | Self-Service Leave Application | Submit dates within remaining balance → creates `Pending` request without errors |
| **REQ-UAT-02** | Manager / HR | Leave Approval & Balance Ledger | Review pending request → click Approve → balance automatically decrements |
| **REQ-UAT-03** | Manager / HR | Curriculum & Learning Tracks | Create curriculum with modules & duration → persists and appears in team catalog |
| **REQ-UAT-04** | All Users | Cryptographic Authentication | Input valid credentials → issues signed JWT token → redirects to role dashboard |
| **REQ-UAT-05** | HR Admin | Directory Governance & Personnel CRUD | Add/edit staff dossier → immediate reflection across directory queries |
| **REQ-UAT-06** | HR Admin | Internal Bulletins & Urgent Broadcasts | Publish announcement with priority tag (`High`) → targeted staff view notice |
| **REQ-UAT-07** | Staff Employee | Attendance Shift Telemetry | 1-click Clock In registers timestamp → active timer runs → Clock Out computes hours |

---

## 3. Comprehensive UAT Test Cases

### UAT-01: Authentication & Role Gateway Routing
- **Preconditions**: Verified accounts exist for HR, Manager, and Employee roles.
- **Test Steps**:
  1. Navigate to `/login`.
  2. Input email `sharmaparikshit405@gmail.com` and password `Admin123@!`.
  3. Click **Sign In to Dashboard**.
- **Expected Result**: Server responds with HTTP 200, JWT stored in `localStorage`, user redirected to `/hr/dashboard`.
- **Actual Result**: Instant authentication, valid JWT decoded, redirected to HR Dashboard.
- **Status**: **PASS**

### UAT-02: Employee Self-Service Leave Application
- **Preconditions**: Employee has 14 remaining Annual Leave days.
- **Test Steps**:
  1. Log in as Employee, open `/employee/leaves`.
  2. Click **Apply for Leave**.
  3. Select **Annual Leave**, specify 3-day duration, enter reason "Family vacation".
  4. Submit form.
- **Expected Result**: System verifies balance, saves request with status `Pending`, shows submission in leave table.
- **Actual Result**: `POST /api/leaves` returns 201 Created; table displays pending record.
- **Status**: **PASS**

### UAT-03: Manager Leave Review & Balance Deduction
- **Preconditions**: Pending leave request from UAT-02 exists.
- **Test Steps**:
  1. Log in as Manager, open `/manager/leaves`.
  2. Locate pending request, enter review comment "Approved, have a great time".
  3. Click **Approve**.
- **Expected Result**: Leave status changes to `Approved`; employee Annual Leave balance decrements from 14 to 11.
- **Actual Result**: `PUT /api/leaves/:id/status` returns updated record; balance decremented to 11.
- **Status**: **PASS**

### UAT-04: Manager Training Curriculum Creation
- **Preconditions**: Manager is logged in and navigates to `/manager/training`.
- **Test Steps**:
  1. Click **New Curriculum** button in header.
  2. Fill Title ("Advanced TypeScript Patterns"), Department ("Product & Engineering"), Duration ("12 hrs"), Modules ("6").
  3. Click **Publish Program**.
- **Expected Result**: Modal submits payload to `POST /api/training`; server validates manager role; track displays in grid.
- **Actual Result**: Record persisted in MongoDB Atlas; newly created card appears in manager training tracks.
- **Status**: **PASS**

### UAT-05: Attendance Clock-In / Clock-Out Telemetry
- **Preconditions**: Employee has not clocked in today.
- **Test Steps**:
  1. Navigate to `/employee/attendance`.
  2. Click **Clock In**. Verify session indicator displays active status with running timer.
  3. Click **Clock Out**.
- **Expected Result**: Server calculates total elapsed shift hours; attendance table displays `Present` record with exact timestamps.
- **Actual Result**: `POST /api/attendance/clock-in` and `clock-out` record valid ISO timestamps and compute hours.
- **Status**: **PASS**

### UAT-06: Priority Announcement Publishing
- **Preconditions**: HR Administrator session active.
- **Test Steps**:
  1. Navigate to `/hr/announcements`.
  2. Click **New Bulletin**.
  3. Set Priority to `High`, Target Audience to `All`, title "Q4 Strategy Meeting".
  4. Submit bulletin.
- **Expected Result**: Announcement persists to database and displays with red high-urgency badge on employee dashboards.
- **Actual Result**: Bulletin saved and visible across all authorized portal dashboards.
- **Status**: **PASS**

### UAT-07: Search, Filter & Department Querying
- **Preconditions**: Multiple employee dossiers in database across Engineering, HR, and Sales.
- **Test Steps**:
  1. Open Directory `/hr/employees`.
  2. Type "Parikshit" in search input.
  3. Select filter "Department: Engineering".
- **Expected Result**: Table filters in real-time, displaying matching employee dossiers without full page reload.
- **Actual Result**: Instant debounced filtering; non-matching records hidden.
- **Status**: **PASS**

### UAT-08: Cold-Start Recovery & Error Resilience
- **Preconditions**: Render backend sleeping in free-tier idle state.
- **Test Steps**:
  1. Trigger login request on `staffsync-smoky.vercel.app`.
  2. Observe network request behavior during 18s wake-up cycle.
- **Expected Result**: Client 60s timeout accommodates cold start without throwing premature "Failed to fetch"; authenticates successfully upon container readiness.
- **Actual Result**: Request completes cleanly upon container wakeup; zero false-positive aborts.
- **Status**: **PASS**

---

## 4. Acceptance Summary & Sign-Off

| Metric | Result | Target Benchmark | Verdict |
| :--- | :---: | :---: | :---: |
| **Total Test Scenarios** | 8 | 8 | 100% Executed |
| **Passed Scenarios** | 8 | 8 | 100% Pass Rate |
| **Failed / Blocked** | 0 | 0 | Zero Defect |
| **Zero Mock Compliance** | Verified | 100% Live MongoDB Atlas | Met |
| **Cross-Origin Security** | Verified | Vercel CDN <-> Render API | Met |

**Final UAT Verdict**: **ACCEPTED FOR PRODUCTION**
