# StaffSync — Enterprise Human Resource Management System (HRMS)

<div align="center">

![StaffSync Logo](client/public/image.svg)

**A high-performance workforce operating platform designed for modern enterprises.**  
Unifying verified employee directories, dynamic leave workflows, real-time attendance telemetry, team learning curricula, and executive analytics in an editorial, responsive workspace.

[![CI/CD Pipeline](https://github.com/parikshitsharma/StaffSync/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/parikshitsharma/StaffSync/actions/workflows/ci-cd.yml)
[![Node.js Version](https://img.shields.io/badge/Node.js-20.x%20%7C%2022.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas%20v8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary%20Attribution-173D32.svg)](LICENSE)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Mermaid Visual Workflows](#mermaid-visual-workflows)
  - [1. System Topology](#1-system-topology)
  - [2. Authentication & RBAC Flow](#2-authentication--rbac-flow)
  - [3. Database Entity Relationship Diagram](#3-database-entity-relationship-diagram)
  - [4. Leave Approval Lifecycle](#4-leave-approval-lifecycle)
  - [5. Automated CI/CD Pipeline](#5-automated-cicd-pipeline)
- [Tech Stack](#tech-stack)
- [Role-Based Access Control (RBAC) Matrix](#role-based-access-control-rbac-matrix)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Environment Configuration](#environment-configuration)
- [API Reference](#api-reference)
- [Project Directory Structure](#project-directory-structure)
- [Testing & Quality Verification](#testing--quality-verification)
- [CI/CD Automation](#cicd-automation)
- [Troubleshooting & FAQs](#troubleshooting--faqs)
- [License & Intellectual Property](#license--intellectual-property)

---

## Overview

**StaffSync** solves workforce fragmentation by replacing disconnected spreadsheets and legacy HR tools with an integrated system. 

Built with **React 19**, **Vite**, **Express**, and **MongoDB Atlas**, StaffSync runs strictly on dynamic, real-time database persistence—enforcing zero mock data leakages, strict JWT role governance, and synchronized workforce telemetry across Human Resources, Team Managers, and Staff Members.

---

## Key Features

- **Dynamic Identity & Profiles**: Strict MongoDB-backed authentication with bcrypt credential hashing, cryptographic JWT signing, and real-time contact updates.
- **Workforce Directory**: Department-level filtering, status toggling, and instant personnel lookups.
- **Leave Request Management**: Balance accounting (Annual, Sick, Casual), date range collision validation, manager review, and instant approvals.
- **Attendance Telemetry**: Single-click check-in/check-out telemetry, active session detection, and daily presence audit logs.
- **Curated Internal Communications**: Targeted bulletins and announcements prioritized by urgency (`High`, `Medium`, `General`) and audience.
- **Continuous Learning & Skill Tracks**: Interactive course catalogs, structured enrollment tracking, and milestone completion percentages.
- **Executive Workforce Reports**: Aggregated headcount distributions, attendance consistency rates, and leave volume analytics.
- **Strict Anti-Mock Security**: All queries and mutations execute against live MongoDB collections with object validation.

---

## System Architecture

StaffSync operates as a decoupled client-server web platform:

```
[ Browser / Client SPA ]
       │
       │ HTTP / JSON (Bearer JWT)
       ▼
[ Node.js + Express API Gateway (Port 5000) ]
       │
       ├── Middleware (JWT Verification & RBAC Guards)
       ├── Controllers (Auth, Employees, Leaves, Attendance, Announcements, Training, Reports)
       │
       ▼
[ MongoDB Atlas Managed Cloud Cluster ]
       └── Collections: users, employees, leaverequests, attendances, announcements, trainings, notifications
```

---

## Mermaid Visual Workflows

### 1. System Topology

```mermaid
graph TD
    subgraph Client ["Client Layer (Vite + React 19)"]
        Landing["Landing Page / 3D Canvas"]
        AuthUI["Auth Gateway (Sign In / Register)"]
        HRDash["HR Administrative Portal"]
        MgrDash["Manager Operations Desk"]
        EmpDash["Employee Self-Service Portal"]
        ApiClient["HTTP ApiClient (Token Interceptor)"]
    end

    subgraph Server ["Server Layer (Node.js + Express)"]
        Router["Express REST Router (/api/*)"]
        AuthMid["authMiddleware (verifyToken, authorizeRoles)"]
        AuthCtrl["authController"]
        EmpCtrl["employeeController"]
        LeaveCtrl["leaveController"]
        AttCtrl["attendanceController"]
        AnnCtrl["announcementController"]
        TrainCtrl["trainingController"]
        RepCtrl["reportController"]
    end

    subgraph Database ["Persistence Layer (MongoDB Atlas)"]
        UsersCol[("Users Collection")]
        EmpCol[("Employees Collection")]
        LeavesCol[("Leave Requests")]
        AttCol[("Attendance Records")]
        AnnCol[("Announcements")]
        TrainCol[("Training Tracks")]
        NotifCol[("Notifications")]
    end

    AuthUI --> ApiClient
    HRDash --> ApiClient
    MgrDash --> ApiClient
    EmpDash --> ApiClient

    ApiClient -->|"Bearer JWT + JSON"| Router
    Router --> AuthMid
    AuthMid --> AuthCtrl & EmpCtrl & LeaveCtrl & AttCtrl & AnnCtrl & TrainCtrl & RepCtrl

    AuthCtrl --> UsersCol & EmpCol
    EmpCtrl --> EmpCol & UsersCol
    LeaveCtrl --> LeavesCol & NotifCol
    AttCtrl --> AttCol
    AnnCtrl --> AnnCol
    TrainCtrl --> TrainCol
    RepCtrl --> EmpCol & LeavesCol & AttCol
```

### 2. Authentication & RBAC Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Staff / Manager / HR)
    participant Client as React SPA (LoginPage)
    participant API as Express API (/api/auth)
    participant DB as MongoDB Atlas

    User->>Client: Enters Work Email & Password
    Client->>API: POST /api/auth/login { email, password }
    API->>DB: User.findOne({ email })
    
    alt User Not Found in Database
        DB-->>API: null
        API-->>Client: 401 Unauthorized ("User not found in database")
        Client-->>User: Displays error notification
    else User Exists
        DB-->>API: userRecord (with password hash)
        API->>API: bcrypt.compare(password, hash)
        alt Password Mismatch
            API-->>Client: 401 Unauthorized ("Invalid credentials")
        else Password Valid
            API->>DB: Employee.findOne({ user: userRecord._id })
            DB-->>API: employeeRecord
            API->>API: jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
            API-->>Client: 200 OK { token, user }
            Client->>Client: localStorage.setItem('token', token)
            Client->>Client: Redirect to /hr/dashboard, /manager/dashboard, or /employee/dashboard
        end
    end
```

### 3. Database Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o| EMPLOYEE : "provisions"
    EMPLOYEE ||--o{ LEAVE_REQUEST : "submits"
    EMPLOYEE ||--o{ ATTENDANCE : "clocks"
    EMPLOYEE ||--o{ NOTIFICATION : "receives"
    USER ||--o{ ANNOUNCEMENT : "publishes"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role "hr | manager | employee"
        string employeeId
        string department
        string designation
        string phone
        string location
        string avatar
        date createdAt
    }

    EMPLOYEE {
        ObjectId _id PK
        ObjectId user FK
        string name
        string email UK
        string employeeId UK
        string department
        string designation
        string position
        string role
        string status "Active | Inactive | On Leave"
        string joiningDate
        string phone
        string location
        string managerName
        string emergencyContact
        object leaveBalances
        date createdAt
    }

    LEAVE_REQUEST {
        ObjectId _id PK
        string employeeId
        string employeeName
        string leaveType "Annual | Sick | Casual | Unpaid"
        string startDate
        string endDate
        number totalDays
        string reason
        string status "Pending | Approved | Rejected"
        string appliedDate
        string reviewedBy
        date reviewedAt
        string comments
    }

    ATTENDANCE {
        ObjectId _id PK
        string employeeId
        string employeeName
        string date
        string checkInTime
        string checkOutTime
        number totalHours
        string status "Present | Late | Half Day | Absent"
        string notes
    }

    ANNOUNCEMENT {
        ObjectId _id PK
        string title
        string content
        string priority "High | Medium | Low"
        string targetAudience "All | hr | manager | employee"
        string author
        string date
    }

    NOTIFICATION {
        ObjectId _id PK
        string recipientId
        string title
        string message
        string type "leave | attendance | announcement | general"
        boolean read
        date createdAt
    }
```

### 4. Leave Approval Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Employee fills ApplyLeaveModal
    Draft --> Pending: Submit POST /api/leaves
    
    state Pending {
        [*] --> InReview
        InReview --> CollisionCheck: Validate overlapping dates
        CollisionCheck --> ManagerDesk: Route to Manager / HR
    }

    Pending --> Approved: PUT /api/leaves/:id/status (status: "Approved")
    Pending --> Rejected: PUT /api/leaves/:id/status (status: "Rejected")

    state Approved {
        DeductBalance: Decrement Employee Leave Balances
        NotifyEmployeeApproved: Dispatch notification to staff
    }

    state Rejected {
        NotifyEmployeeRejected: Dispatch reason & comments
    }

    Approved --> [*]
    Rejected --> [*]
```

### 5. Automated CI/CD Pipeline

```mermaid
flowchart LR
    A[git push / PR to main] --> B{GitHub Actions Workflow}
    
    subgraph Job1 [Client Verification]
        C1[npm install] --> C2[oxlint / lint] --> C3[vite build] --> C4[Upload Artifacts]
    end

    subgraph Job2 [Server Verification]
        S1[npm install] --> S2[node --check server.js] --> S3[Validate ESM Controllers]
    end

    subgraph Job3 [Deploy Gate]
        D1[Verify Artifact Integrity] --> D2[Production Release Ready]
    end

    B --> Job1
    B --> Job2
    Job1 --> Job3
    Job2 --> Job3
```

---

## Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript | High-performance modular user interfaces |
| **Bundler & Build Tool**| Vite 8 | Lightning-fast HMR and optimized production bundling |
| **Styling & Design** | Tailwind CSS v4 | Semantic styling, warm-ivory / evergreen aesthetic |
| **3D Graphics** | Three.js | Interactive 3D synchronization geometry on landing view |
| **Icons & Typography** | Lucide React + Google Fonts | DM Serif Display, Inter typography, Iconsax design |
| **Routing** | React Router v7 | Protected client routing with role guards |
| **Backend Runtime** | Node.js v20+ (ES Modules) | High-concurrency event-driven server environment |
| **Web Server Framework**| Express 4 | RESTful API design with CORS & JSON body parsing |
| **Database** | MongoDB Atlas Cloud | Scalable document persistence with Mongoose ODM |
| **Security & Auth** | JWT + Bcrypt.js | Cryptographic tokens and salted password hashing |
| **Continuous Integration**| GitHub Actions | Automated build validation and integrity pipelines |

---

## Role-Based Access Control (RBAC) Matrix

| Portal Module | Employee | Team Manager | HR Administrator |
| :--- | :---: | :---: | :---: |
| **Personal Dashboard & Profile** | Read / Edit Self | Read / Edit Self | Full Admin Access |
| **Apply for Leave** | Yes | Yes | Yes |
| **Leave Approvals & Rejections** | View Status Only | Approve Team Leaves | Full Global Approvals |
| **Attendance Telemetry** | Clock In / Clock Out | Team Telemetry View | Org-wide Attendance Audit |
| **Directory Management** | View Colleague Cards | Team View Only | Add, Edit & Delete Staff |
| **Organization Announcements** | View Target Only | View & Acknowledge | Compose, Target & Delete |
| **Training Curricula** | Enroll & Track Self | Track Team Progress | Create & Assign Tracks |
| **Workforce Analytics** | Restricted | Team Performance | Full Strategic Reports |

---

## Prerequisites

Before setting up StaffSync locally, verify your system has:

- **Node.js**: `v20.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v10.0.0` or higher (bundled with Node.js)
- **Git**: `v2.40.0` or higher
- **MongoDB Atlas Connection URI**: An active MongoDB database cluster connection string

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/parikshitsharma/StaffSync.git
cd StaffSync
```

### 2. Backend Server Setup

```bash
# Navigate to the server folder
cd server

# Install dependencies
npm install

# Configure environment variables
# Create a .env file based on the example below
```

Create `server/.env`:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=staffsync_super_secure_production_secret_key_2026
JWT_EXPIRES_IN=7d
```

Start the backend development server:

```bash
npm run dev
# Or start directly with Node
node server.js
```

Verify backend health at: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 3. Frontend Client Setup

Open a second terminal window:

```bash
# Navigate to the client folder
cd client

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Environment Configuration

### Server (`server/.env`)

| Variable | Required | Description | Example |
| :--- | :---: | :--- | :--- |
| `PORT` | Optional | Port the Express server listens on | `5000` |
| `CLIENT_ORIGIN` | Optional | Allowed CORS origin for frontend | `http://localhost:5173` |
| `MONGODB_URI` | **Required** | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/staffsync` |
| `JWT_SECRET` | **Required** | Secret key for signing authorization JWTs | `your_cryptographic_secret_here` |
| `JWT_EXPIRES_IN`| Optional | Token expiration duration | `7d` |

### Client (`client/.env`)

| Variable | Required | Description | Default |
| :--- | :---: | :--- | :--- |
| `VITE_API_BASE_URL` | Optional | URL pointing to running backend REST API | `http://localhost:5000/api` |

---

## API Reference

All protected endpoints require an `Authorization: Bearer <JWT>` header.

### Authentication
- `POST /api/auth/register` — Register a verified user and create an initial employee dossier.
- `POST /api/auth/login` — Authenticate credentials against MongoDB Atlas; returns signed JWT.
- `GET /api/auth/me` — Retrieve active profile details from MongoDB Atlas.
- `POST /api/auth/logout` — Invalidate user session.

### Employees
- `GET /api/employees` — Search, filter by department/status, and paginate staff members.
- `GET /api/employees/:id` — Retrieve comprehensive employee dossier.
- `POST /api/employees` — Create an employee document (HR only).
- `PUT /api/employees/:id` — Update contact information, address, and profile details.
- `DELETE /api/employees/:id` — Remove employee record from directory (HR only).

### Leaves
- `GET /api/leaves` — Retrieve leave requests with status/employee filters.
- `POST /api/leaves` — Submit a leave application with balance checking.
- `PUT /api/leaves/:id/status` — Approve or reject leave request (Manager / HR only).

### Attendance
- `GET /api/attendance` — Fetch daily attendance registers and filter by date.
- `POST /api/attendance/clock-in` — Register employee arrival timestamp.
- `POST /api/attendance/clock-out` — Complete employee shift and compute total hours worked.
- `PUT /api/attendance/:id/status` — Modify attendance record status.

### Announcements & Bulletins
- `GET /api/announcements` — List active organizational bulletins.
- `POST /api/announcements` — Publish a prioritized bulletin (HR / Admin).
- `DELETE /api/announcements/:id` — Delete an announcement (HR / Admin).

### Training & Skill Tracks
- `GET /api/training` — Fetch organizational training catalog.
- `POST /api/training` — Create a new learning track.
- `PUT /api/training/:id/progress` — Record progress or completion percentage.

### Workforce Analytics
- `GET /api/reports/dashboard` — Aggregated workforce metrics, department counts, and ratios.

---

## Project Directory Structure

```
StaffSync/
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # GitHub Actions continuous integration pipeline
├── client/                       # Frontend SPA
│   ├── public/
│   │   ├── favicon.svg           # Scalable vector favicon (emblem)
│   │   ├── logo.svg              # Full StaffSync horizontal logo
│   │   ├── logo-icon.svg         # Square emblem mark
│   │   ├── image.svg             # Original master vector logo
│   │   └── image copy.svg        # Original master vector icon
│   ├── src/
│   │   ├── components/
│   │   │   ├── landing/          # Header, Hero, Features, ProductPreview, Footer
│   │   │   ├── layout/           # DashboardLayout (Sidebar, User Badge, Clock In)
│   │   │   ├── modals/           # AddEmployeeModal, ApplyLeaveModal
│   │   │   └── three/            # Interactive Three.js 3D canvas
│   │   ├── pages/
│   │   │   ├── hr/               # HR Admin portal (Dashboard, Employees, Leaves, etc.)
│   │   │   ├── manager/          # Manager desk (Team, Approvals, Attendance)
│   │   │   ├── employee/         # Staff portal (Profile, Leaves, Attendance)
│   │   │   ├── login/            # Secure sign in view
│   │   │   ├── signup/           # Account registration view
│   │   │   └── forgot-password/  # Password recovery view
│   │   ├── services/
│   │   │   └── apiClient.js      # Centralized HTTP client (auth interceptor)
│   │   ├── App.jsx               # Application routing gateway
│   │   └── index.css             # Design tokens & Tailwind entry
│   ├── package.json
│   └── vite.config.ts
├── server/                       # Backend REST Service
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas Mongoose connection logic
│   ├── Controllers/              # Real MongoDB controller logic
│   │   ├── authController.js     # Strict DB login, registration, and getMe
│   │   ├── employeeController.js # CRUD workforce directory endpoints
│   │   ├── leaveController.js    # Leave request balances & state machines
│   │   ├── attendanceController.js
│   │   ├── announcementController.js
│   │   ├── trainingController.js
│   │   ├── notificationController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   └── authMiddleware.js     # Cryptographic JWT validation & RBAC
│   ├── models/                   # Mongoose collection schemas
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── LeaveRequest.js
│   │   ├── Attendance.js
│   │   ├── Announcement.js
│   │   ├── TrainingProgram.js
│   │   └── Notification.js
│   ├── Routes/                   # Express route dispatchers
│   ├── server.js                 # API server initialization & middleware
│   └── package.json
├── LICENSE                       # Proprietary copyright license
└── README.md                     # Comprehensive documentation
```

---

## Testing & Quality Verification

Run validation routines locally:

```bash
# 1. Test Client Production Build
cd client
npm run build

# 2. Test Client Linting
npm run lint

# 3. Test Server Syntax & Imports
cd ../server
npm test
```

---

## CI/CD Automation

Every pull request or commit pushed to `main` or `master` initiates the automated GitHub Actions pipeline (`.github/workflows/ci-cd.yml`):

1. **Client Job**: Installs clean dependencies, runs code linters, and compiles the production distribution bundle with Vite.
2. **Server Job**: Checks Node.js syntax integrity and validates all ESM controller and database model imports.
3. **Deployment Gate**: Confirms artifact existence (`index.html`, minified CSS/JS) and prepares deployment readiness.

---

## Troubleshooting & FAQs

### 1. "User not found in database" (HTTP 401)
- **Cause**: The application uses live database authentication. Fake, test, or demo emails not registered in MongoDB Atlas are rejected.
- **Resolution**: Navigate to `/signup`, create an account with your desired role, and sign in.

### 2. MongoDB Atlas Connection Timeout
- **Cause**: Network firewall or IP access list restrictions in MongoDB Atlas.
- **Resolution**: In MongoDB Atlas, visit **Network Access** → Click **Add IP Address** → Choose **Allow Access from Anywhere** (`0.0.0.0/0`) for development.

### 3. Missing or Expired Token on Reload
- **Cause**: Expired JWT or cleared localStorage.
- **Resolution**: Sign in via `/login` to generate a fresh token signed with `JWT_SECRET`.

---

## License & Intellectual Property

**StaffSync is proprietary software.**  
Copyright © 2026 **Parikshit Sharma**. All rights reserved.

Unauthorized copying, cloning, reverse engineering, sublicensing, or redistribution of this software, its source code, and its design assets is **strictly prohibited**. 

In any authorized distribution, deployment, or derivative work, **prominent and conspicuous credit and attribution to the owner, Parikshit Sharma**, must be maintained in the user interface, documentation, and source code headers at all times.

For full legal terms and conditions, consult the official [LICENSE](LICENSE) file.
