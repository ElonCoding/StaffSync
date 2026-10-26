# Project Design Phase-II: Data Flow Diagram & User Stories

| Metadata Field | Value |
| :--- | :--- |
| **Document Type** | Data Flow Diagram (DFD) & User Stories Specification |
| **Project Name** | **StaffSync — Enterprise Human Resource Management System (HRMS)** |
| **Version** | v1.0.0 (Production Release) |
| **Date** | 2026-10-27 |
| **Project Lead / Owner** | Parikshit Sharma |
| **Repository** | [https://github.com/ElonCoding/StaffSync](https://github.com/ElonCoding/StaffSync) |
| **Live Deployments** | Client: [staffsync-smoky.vercel.app](https://staffsync-smoky.vercel.app/) \| API: [staffsync-czzq.onrender.com](https://staffsync-czzq.onrender.com) |

---

## 1. Introduction to Data Flow Diagrams (DFD)
A **Data Flow Diagram (DFD)** maps the flow of information through the StaffSync platform. It captures external entities (Staff Employees, Team Managers, HR Administrators), core transactional business processes, data transformations, and underlying persistent cloud data stores (MongoDB Atlas collections).

---

## 2. DFD Level 0: Context Level Diagram (Industry Standard)

The Level 0 DFD provides a high-level view of the entire StaffSync HRMS boundary and interactions with authorized external organizational actors:

```mermaid
flowchart TD
    %% External Entities
    EMP["Staff Employee"]
    MGR["Team Manager"]
    HR["HR Administrator"]

    %% Core System Boundary
    SYSTEM(("0.0<br/><b>StaffSync HRMS Platform</b><br/>(React 19 + Express API)"))

    %% Persistence Layer
    DB[("MongoDB Atlas Cloud Cluster<br/>(users, employees, leaves, attendance, training, bulletins)")]

    %% Employee Interactions
    EMP -->|"Login Credentials (Email/Password)"| SYSTEM
    EMP -->|"Clock In / Clock Out Telemetry"| SYSTEM
    EMP -->|"Submit Leave Request (Type, Dates, Reason)"| SYSTEM
    EMP -->|"Training Course Progress (% Complete)"| SYSTEM
    SYSTEM -->|"JWT Token & Personal Dossier"| EMP
    SYSTEM -->|"Active Shift Timer & Attendance Logs"| EMP
    SYSTEM -->|"Leave Balance Ledger & Approval Alerts"| EMP
    SYSTEM -->|"Assigned Learning Tracks & Org Bulletins"| EMP

    %% Manager Interactions
    MGR -->|"Credentials & Auth"| SYSTEM
    MGR -->|"Leave Decisions (Approve/Reject + Comments)"| SYSTEM
    MGR -->|"Create Team Training Curriculum"| SYSTEM
    SYSTEM -->|"Team Attendance Registers"| MGR
    SYSTEM -->|"Pending Subordinate Leaves"| MGR
    SYSTEM -->|"Team Learning Milestone Tracking"| MGR

    %% HR Administrator Interactions
    HR -->|"Credentials & Full Admin Auth"| SYSTEM
    HR -->|"Employee CRUD (Create, Update, Delete Dossiers)"| SYSTEM
    HR -->|"Publish Priority Bulletins (High, Medium, General)"| SYSTEM
    HR -->|"Org-wide Leave Overrides & Policy Controls"| SYSTEM
    SYSTEM -->|"Executive Headcount & Attendance Analytics"| HR
    SYSTEM -->|"Audit Logs & Master Personnel Registry"| HR

    %% Internal Data Store Links
    SYSTEM <-->|"Mongoose ODM Queries & Mutations (TLS 1.3)"| DB
```

---

## 3. DFD Level 1: Subsystem Data Flow Diagram

The Level 1 DFD decomposes StaffSync into its 7 core operational subsystems and explicit data stores:

```mermaid
flowchart TD
    subgraph Actors ["External Actors"]
        EMP["Staff Employee"]
        MGR["Team Manager"]
        HR["HR Administrator"]
    end

    subgraph Processes ["StaffSync Subsystem Processes"]
        P1["1.0 Authentication & RBAC Guard<br/>(bcrypt + JWT Sign/Verify)"]
        P2["2.0 Employee Directory & Dossier Hub<br/>(Search, Filter, CRUD)"]
        P3["3.0 Leave Engine & Balance Ledger<br/>(Validation & Deduction)"]
        P4["4.0 Attendance Shift Telemetry<br/>(Clock In/Out, Hours Counter)"]
        P5["5.0 Internal Bulletins & Communications<br/>(Priority Broadcasting)"]
        P6["6.0 Curriculum & Learning Tracks<br/>(Course Curation & Progress)"]
        P7["7.0 Executive Workforce Analytics<br/>(Headcount, Ratios, Consistency)"]
    end

    subgraph DataStores ["MongoDB Atlas Collections"]
        D1[("D1: users")]
        D2[("D2: employees")]
        D3[("D3: leaverequests")]
        D4[("D4: attendances")]
        D5[("D5: announcements")]
        D6[("D6: trainingprograms")]
        D7[("D7: notifications")]
    end

    %% Auth Flow
    EMP & MGR & HR -->|"Submit Credentials"| P1
    P1 <-->|"Validate Credentials"| D1
    P1 <-->|"Fetch Profile"| D2
    P1 -->|"Issue Bearer JWT"| EMP & MGR & HR

    %% Directory Flow
    HR -->|"Manage Employee Dossier"| P2
    P2 <-->|"Read / Write Records"| D2
    P2 <-->|"Link User Account"| D1
    EMP & MGR -->|"Query Directory"| P2

    %% Leave Flow
    EMP -->|"Apply for Leave"| P3
    MGR & HR -->|"Approve / Reject"| P3
    P3 <-->|"Validate & Deduct Allowance"| D2
    P3 <-->|"Store Request State"| D3
    P3 -->|"Dispatch Status Alert"| D7

    %% Attendance Flow
    EMP -->|"Clock In / Out Telemetry"| P4
    P4 <-->|"Log Shift Timestamps & Hours"| D4
    P4 -->|"View Presence Logs"| MGR & HR

    %% Bulletins Flow
    HR -->|"Publish Priority Announcement"| P5
    P5 <-->|"Store Announcement"| D5
    P5 -->|"Broadcast to Role Audience"| EMP & MGR

    %% Training Flow
    MGR & HR -->|"Publish Curriculum"| P6
    EMP -->|"Update Module Progress"| P6
    P6 <-->|"Store Program & Milestones"| D6

    %% Analytics Flow
    P7 <-->|"Aggregate Headcount"| D2
    P7 <-->|"Aggregate Leave Ratios"| D3
    P7 <-->|"Aggregate Attendance Rates"| D4
    P7 -->|"Deliver Metrics Dashboard"| HR
```

---

## 4. DFD Level 2: Detailed Leave Approval Lifecycle Flow

```mermaid
flowchart LR
    A["Employee submits Leave Request"] --> B["Validate Dates (End >= Start)"]
    B --> C{"Check Balance (Annual/Sick/Casual)"}
    C -->|"Insufficient"| D["Reject with Balance Error"]
    C -->|"Sufficient"| E["Check Date Range Collisions"]
    E -->|"Collision"| F["Reject with Overlap Warning"]
    E -->|"No Collision"| G["Create Record in 'leaverequests' (Status: Pending)"]
    G --> H["Notify Manager / HR"]
    H --> I{"Manager Review"}
    I -->|"Reject"| J["Update Status: Rejected + Add Comments"]
    I -->|"Approve"| K["Update Status: Approved"]
    K --> L["Atomic Decrement from 'employees.leaveBalances'"]
    L --> M["Push Notification to Employee"]
```

---

## 5. User Stories & Acceptance Criteria Matrix

| User Type | Functional Requirement (Epic) | User Story / Task | Acceptance Criteria | Priority | Release |
| :--- | :--- | :--- | :--- | :---: | :---: |
| **All Users** | User Authentication | As a user, I can log in using my work email and password. | Returns signed JWT token; redirects to role dashboard (`/hr`, `/manager`, `/employee`). | **High** | **Sprint-1** |
| **All Users** | User Registration | As a new employee, I can register an account with my initial department and role. | Creates user record in `users` collection and provisions matching `employees` dossier. | **High** | **Sprint-1** |
| **Staff Member** | Attendance Telemetry | As an employee, I can clock in and out with a single click. | Logs timestamp, activates real-time session counter, and computes total shift hours upon clock-out. | **High** | **Sprint-1** |
| **Staff Member** | Leave Application | As an employee, I can submit leave requests and check my balance in real-time. | Validates leave allowance before submitting; displays status as `Pending`. | **High** | **Sprint-1** |
| **Team Manager** | Leave Approval Desk | As a manager, I can review, approve, or reject subordinate leave requests. | Status updates immediately; approved leaves automatically deduct days from employee balance. | **High** | **Sprint-2** |
| **Team Manager** | Team Skill Upgrading | As a manager, I can curate and publish technical training tracks for my team. | Modal validates curriculum fields (`POST /api/training`); curriculum card appears in team track grid. | **High** | **Sprint-2** |
| **HR Admin** | Workforce Directory | As an HR Admin, I can add, edit, and delete employee dossiers. | Changes persist directly to MongoDB Atlas; directory reloads dynamically without mock data. | **High** | **Sprint-1** |
| **HR Admin** | Organizational Bulletins | As an HR Admin, I can publish prioritized bulletins (`High`, `Medium`, `General`). | Bulletins display with priority color badges and are targeted to selected user roles. | **Medium** | **Sprint-2** |
| **All Users** | Directory Filtering | As a user, I can search and filter colleagues by department and active status. | Search bar instantly filters cards with zero full page reloads. | **Medium** | **Sprint-2** |
| **HR Admin** | Executive Analytics | As an executive, I can monitor org-wide attendance rates, headcount, and leave trends. | Metric cards render real-time calculations from live database collections. | **Medium** | **Sprint-2** |
