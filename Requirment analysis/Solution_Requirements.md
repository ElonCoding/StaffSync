# Project Design Phase-II: Solution Requirements (Functional & Non-functional)

| Metadata Field | Value |
| :--- | :--- |
| **Document Type** | Solution Requirements Specification (SRS) |
| **Project Name** | **StaffSync — Enterprise Human Resource Management System (HRMS)** |
| **Version** | v1.0.0 (Production Release) |
| **Date** | 2026-10-27 |
| **Project Lead / Owner** | Parikshit Sharma |
| **Repository** | [https://github.com/ElonCoding/StaffSync](https://github.com/ElonCoding/StaffSync) |
| **Live Deployments** | Client: [staffsync-smoky.vercel.app](https://staffsync-smoky.vercel.app/) \| API: [staffsync-czzq.onrender.com](https://staffsync-czzq.onrender.com) |

---

## 1. Functional Requirements (FR)

The functional requirements describe the core operational features and transactional workflows implemented across the StaffSync platform:

| FR No. | Functional Requirement (Epic) | Sub Requirement (Story / Sub-Task) | Implementation Evidence |
| :--- | :--- | :--- | :--- |
| **FR-1** | **User Authentication & RBAC** | • Secure Sign Up with department & role assignment<br/>• Password-based login using salted `bcryptjs` hashing<br/>• Cryptographic JWT issuance (7-day validity)<br/>• Role guards for `hr`, `manager`, and `employee`<br/>• Session persistence & secure logout | `authController.js`<br/>`authMiddleware.js`<br/>`POST /api/auth/login`<br/>`POST /api/auth/register` |
| **FR-2** | **Workforce Directory & Profiles** | • Search colleagues by name, email, or role<br/>• Filter directory by Department and Active/On-Leave status<br/>• Comprehensive employee dossier view<br/>• Self-service contact update (phone, emergency contact)<br/>• HR Admin CRUD controls to add/edit/delete personnel | `employeeController.js`<br/>`GET /api/employees`<br/>`PUT /api/employees/:id`<br/>`AddEmployeeModal.tsx` |
| **FR-3** | **Leave Request & Balances Ledger** | • Category allowances (`Annual`, `Sick`, `Casual`, `Unpaid`)<br/>• Pre-submission balance sufficiency check<br/>• Date range collision & overlap prevention<br/>• Manager & HR approval desk with optional review notes<br/>• Atomic leave balance decrement upon approval | `leaveController.js`<br/>`POST /api/leaves`<br/>`PUT /api/leaves/:id/status`<br/>`ApplyLeaveModal.tsx` |
| **FR-4** | **Attendance Shift Telemetry** | • 1-click arrival telemetry (Clock In)<br/>• Active session indicator with real-time shift stopwatch<br/>• Shift completion (Clock Out) with auto-calculated total hours<br/>• Daily presence registers (`Present`, `Late`, `Half Day`, `Absent`) | `attendanceController.js`<br/>`POST /api/attendance/clock-in`<br/>`POST /api/attendance/clock-out` |
| **FR-5** | **Organizational Communications** | • Priority-classified bulletins (`High`, `Medium`, `General`)<br/>• Target audience filtering (`All`, `hr`, `manager`, `employee`)<br/>• High-priority color-coded visual alerts on staff dashboards<br/>• HR Admin bulletin composition and deletion | `announcementController.js`<br/>`GET /api/announcements`<br/>`POST /api/announcements` |
| **FR-6** | **Learning & Skill Upgrading Hub** | • Interactive curriculum tracks with duration & module counts<br/>• Role parity: HR Admins and Team Managers create tracks<br/>• Cohort enrollment and milestone progress tracking<br/>• Progress percentage updating (`In Progress` -> `Completed`) | `trainingController.js`<br/>`POST /api/training`<br/>`PUT /api/training/:id/progress`<br/>`CreateTrainingModal.tsx` |
| **FR-7** | **Workforce Reporting & Analytics** | • Aggregated organizational headcount by department<br/>• Attendance consistency and punctuality percentages<br/>• Leave utilization volumes and pending request ratios | `reportController.js`<br/>`GET /api/reports/dashboard` |

---

## 2. Non-Functional Requirements (NFR)

The non-functional requirements define the architectural quality attributes, security standards, and performance benchmarks governing StaffSync:

| NFR No. | Non-Functional Requirement | Description & Technical Specification | Production Implementation |
| :--- | :--- | :--- | :--- |
| **NFR-1** | **Usability & UX** | The platform offers an editorial, humanistic Warm Ivory (`#EAE9DF`) and Evergreen (`#173D32`) aesthetic with DM Serif Display headings and Inter body copy. Interfaces are responsive across mobile, tablet, and widescreen desktop breakpoints. | Tailwind CSS v4 design tokens, Lucide icons, Three.js 3D landing hero. |
| **NFR-2** | **Security & Cryptography** | All data in transit is protected via TLS/HTTPS. Passwords are salted and hashed with `bcryptjs` (work factor 10). Authorization uses stateless HMAC SHA-256 JWTs. CORS policy restricts access to authorized origins. Strict anti-mock policy ensures zero static mock data. | `bcryptjs`, `jsonwebtoken`, `cors` origin whitelist in `server.js`. |
| **NFR-3** | **Reliability & Data Integrity** | Data consistency is guaranteed via MongoDB Atlas replica sets. Status mutations (e.g., leave approvals and balance deductions) execute with atomic database checks to prevent race conditions and over-deductions. | Mongoose schemas with indexed foreign keys and validation constraints. |
| **NFR-4** | **Performance & Cold-Start Tolerance** | Client assets deliver via Vercel Edge CDN in under 80ms. Warm API endpoints respond in under 200ms. To accommodate cloud container cold-starts on Render free-tier, client `AbortController` timeout is calibrated to 60 seconds with friendly user feedback. | Vite 8 minification (Brotli/Gzip), 60s timeout in `apiClient.js`. |
| **NFR-5** | **Availability & SLA** | The distributed architecture maintains 99.9% availability. Client is distributed across global edge points, while backend incorporates automated health-check telemetry at `/api/health`. | Vercel Global Edge Network + Render Cloud Service. |
| **NFR-6** | **Scalability & Maintainability** | The decoupled 3-tier architecture separates UI from REST API business logic and persistence. Modular controllers and routes allow rapid scaling and independent deployment. | Express modular routers + React 19 component hierarchy. |
