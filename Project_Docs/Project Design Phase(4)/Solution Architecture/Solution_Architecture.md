# Project Design Phase: Solution Architecture Specification

| Metadata Field | Value |
| :--- | :--- |
| **Document Type** | Technical Solution Architecture & Systems Engineering Specification |
| **Project Name** | **StaffSync — Enterprise Human Resource Management System (HRMS)** |
| **Version** | v1.0.0 (Production Release) |
| **Date** | 2026-10-27 |
| **Project Lead / Owner** | Parikshit Sharma |
| **Repository** | [https://github.com/ElonCoding/StaffSync](https://github.com/ElonCoding/StaffSync) |
| **Live Deployments** | Client: [staffsync-smoky.vercel.app](https://staffsync-smoky.vercel.app/) \| API: [staffsync-czzq.onrender.com](https://staffsync-czzq.onrender.com) |

---

## 1. Architectural Strategy & Design Principles
The **StaffSync** architecture is engineered to provide enterprise-grade reliability, sub-second interactive responsiveness, and uncompromising cryptographic security across all workforce administrative domains.

### Core Architectural Capabilities:
- **Decoupled 3-Tier Enterprise Topology**: Presentation, Business Logic, and Persistence layers operate independently with stateless REST contracts.
- **Strict Role-Based Access Control (RBAC)**: Cryptographically verified JWT bearer tokens govern operational permissions for `hr`, `manager`, and `employee` roles.
- **Zero-Mock Policy & Live Telemetry**: All data queries and state mutations run directly against cloud MongoDB Atlas collections with Mongoose schema constraints.
- **Cold-Start Resilience**: 60-second client-side timeout calibration accommodating cloud container wakeups without raising browser network exceptions.
- **Edge Content Delivery**: Global distribution of optimized single-page application (SPA) bundles via Vercel Global Edge Network with universal rewrite rules.

---

## 2. Solution Architecture Diagram

```mermaid
flowchart TD
    %% Global Styling
    classDef clientStyle fill:#F7F8F5,stroke:#173D32,stroke-width:2px,color:#102820;
    classDef apiStyle fill:#FFFFFF,stroke:#34785B,stroke-width:2px,color:#102820;
    classDef dbStyle fill:#EAE9DF,stroke:#173D32,stroke-width:2px,color:#102820;
    classDef cloudStyle fill:#FAFBFA,stroke:#7E8980,stroke-width:1.5px,stroke-dasharray: 4 4;

    %% 1. PRESENTATION LAYER
    subgraph Tier1 ["TIER 1: PRESENTATION LAYER (Vercel Global Edge Network)"]
        direction TB
        C1["Landing Page & 3D Hero<br/><i>(Three.js Canvas + Editorial UI)</i>"]:::clientStyle
        C2["Role Authentication Gateway<br/><i>(Sign In, Register, Forgot Password)</i>"]:::clientStyle
        C3["HR Admin Operations Portal<br/><i>(Directory CRUD, Org Leaves, Bulletins, Reports)</i>"]:::clientStyle
        C4["Team Manager Workspace<br/><i>(Subordinate Approvals, Team Attendance, Training)</i>"]:::clientStyle
        C5["Employee Self-Service Desk<br/><i>(Clock In/Out, Leave Applications, Upskilling)</i>"]:::clientStyle
        C_API["HTTP ApiClient Service<br/><i>(Token Interceptor, 60s Timeout, Cold-Start Shield)</i>"]:::clientStyle

        C1 & C2 & C3 & C4 & C5 --> C_API
    end

    %% 2. API GATEWAY & BUSINESS LOGIC TIER
    subgraph Tier2 ["TIER 2: APPLICATION & LOGIC LAYER (Render Cloud Web Service)"]
        direction TB
        subgraph Gateway ["Express 4 API Gateway & Security Pipeline"]
            M_CORS["CORS Middleware<br/><i>(staffsync-smoky.vercel.app + Preview Whitelist)</i>"]
            M_LOG["Request Telemetry Logger"]
            M_COOKIE["Cookie Parser & JSON Body Parser"]
            M_AUTH["authMiddleware.js<br/><i>(verifyToken + authorizeRoles Guard)</i>"]

            M_CORS --> M_LOG --> M_COOKIE --> M_AUTH
        end

        subgraph Controllers ["Modular REST Controllers (/api/*)"]
            CTRL_AUTH["authController<br/><i>(bcrypt hash, JWT sign)</i>"]
            CTRL_EMP["employeeController<br/><i>(Directory CRUD, Search)</i>"]
            CTRL_LEV["leaveController<br/><i>(Balance ledger, Collisions)</i>"]
            CTRL_ATT["attendanceController<br/><i>(Shift Telemetry, Timestamps)</i>"]
            CTRL_ANN["announcementController<br/><i>(Priority Bulletins)</i>"]
            CTRL_TRN["trainingController<br/><i>(HR & Manager Curricula)</i>"]
            CTRL_REP["reportController<br/><i>(Headcount, Ratios)</i>"]
        end

        M_AUTH --> CTRL_AUTH & CTRL_EMP & CTRL_LEV & CTRL_ATT & CTRL_ANN & CTRL_TRN & CTRL_REP
    end

    %% 3. PERSISTENCE TIER
    subgraph Tier3 ["TIER 3: DATA PERSISTENCE LAYER (MongoDB Atlas Cloud Cluster)"]
        direction TB
        DB_USERS[("users<br/><i>Credentials & Roles</i>")]:::dbStyle
        DB_EMP[("employees<br/><i>Profiles & Dossiers</i>")]:::dbStyle
        DB_LEAVES[("leaverequests<br/><i>Status & Balances</i>")]:::dbStyle
        DB_ATT[("attendances<br/><i>Shift Telemetry Logs</i>")]:::dbStyle
        DB_ANN[("announcements<br/><i>Priority Bulletins</i>")]:::dbStyle
        DB_TRN[("trainingprograms<br/><i>Curricula & Milestones</i>")]:::dbStyle
        DB_NOTIF[("notifications<br/><i>Real-time Alerts</i>")]:::dbStyle
    end

    %% INTER-TIER CONNECTIVITY
    C_API ==>|"HTTPS / TLS 1.3 & Bearer JWT"| M_CORS

    CTRL_AUTH <==>|"Mongoose ODM (Index: email)"| DB_USERS
    CTRL_EMP <==>|"Mongoose ODM (Index: employeeId)"| DB_EMP
    CTRL_LEV <==>|"Mongoose ODM (Atomic Decrement)"| DB_LEAVES & DB_EMP & DB_NOTIF
    CTRL_ATT <==>|"Mongoose ODM (Compound: empId+date)"| DB_ATT
    CTRL_ANN <==>|"Mongoose ODM (Urgency Scope)"| DB_ANN
    CTRL_TRN <==>|"Mongoose ODM (Cohort Milestones)"| DB_TRN
    CTRL_REP <==>|"Aggregated Pipeline Queries"| DB_EMP & DB_LEAVES & DB_ATT
```

---

## 3. Tier-by-Tier Architectural Breakdown

### 3.1 Presentation Tier (Frontend Client)
- **Technology Stack**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Three.js, Lucide React.
- **Routing & Navigation**: React Router v7 with protected route wrappers (`RequireAuth`, `RequireRole`).
- **State & Networking**: Centralized `ApiClient.js` handles authorization token injection, request cancellation via `AbortController`, and intelligent environment resolution (auto-pointing to Render in production).
- **Hosting**: Vercel Global Edge Network with `client/vercel.json` SPA rewrite rules.

### 3.2 Application Logic Tier (Backend REST Service)
- **Technology Stack**: Node.js 20+, Express 4 (ES Modules), Mongoose 8.
- **Security Pipeline**:
  - `cors`: Dynamic origin validation ensuring only verified client origins communicate with the API.
  - `bcryptjs`: One-way cryptographic password salting and hashing with cost factor 10.
  - `jsonwebtoken`: Stateless HMAC SHA-256 JWT generation with role and department claims.
  - `authMiddleware`: Enforces token validity, checks expiration, and evaluates role permissions.
- **Hosting**: Render Cloud Web Service with automated continuous deployment and health checks at `/api/health`.

### 3.3 Data Persistence Tier (Cloud Database)
- **Technology Stack**: MongoDB Atlas managed cloud cluster.
- **Data Modeling & Integrity**:
  - `users`: Stores core credentials, hashed passwords, and system roles.
  - `employees`: Stores comprehensive HR dossiers, job titles, and balance arrays (`annual`, `sick`, `casual`).
  - `leaverequests`: Enforces date range collision detection and status state machines (`Pending`, `Approved`, `Rejected`).
  - `attendances`: Records exact check-in/out timestamps and computes worked shift hours.
  - `trainingprograms`: Stores curricula, module counts, and enrolled employee cohort milestones.
  - `announcements`: Stores priority-tagged organizational bulletins.

---

## 4. Continuous Integration & Deployment Pipeline

```mermaid
flowchart LR
    A["Git Push / PR to main"] --> B["GitHub Actions CI Pipeline"]
    
    subgraph TestJob1 ["Job 1: Client Build & Lint"]
        C1["npm install"] --> C2["oxlint check"] --> C3["vite build"] --> C4["Bundle Verify"]
    end

    subgraph TestJob2 ["Job 2: Server Syntax & Imports"]
        S1["npm install"] --> S2["node --check server.js"] --> S3["Validate Models & Routes"]
    end

    subgraph DeployGate ["Job 3: Automated Cloud Triggers"]
        D1["Vercel CDN Edge Deploy"]
        D2["Render Container Deploy"]
    end

    B --> TestJob1 & TestJob2
    TestJob1 & TestJob2 --> DeployGate
```
