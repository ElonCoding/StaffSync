# Phase 2: Project Planning Phase — Work Breakdown Structure (WBS)

```
StaffSync HRMS Platform
│
├── 1.0 Infrastructure & Architecture
│   ├── 1.1 Cloud Persistence (MongoDB Atlas Cluster Setup & Connection Pooling)
│   ├── 1.2 REST API Server Framework (Node.js, Express, Middleware)
│   ├── 1.3 Client Application Scaffolding (Vite 8, React 19, TypeScript)
│   └── 1.4 CI/CD Pipeline (.github/workflows/ci-cd.yml with GitHub Actions)
│
├── 2.0 Identity, Security & RBAC
│   ├── 2.1 Password Salting & Cryptographic Hashing (bcryptjs)
│   ├── 2.2 JWT Authentication Engine (Sign, Verify, Expiration Handling)
│   ├── 2.3 Express RBAC Middleware (verifyToken, authorizeRoles)
│   └── 2.4 Client-side Protected Routes & Role Gateways
│
├── 3.0 Core HR Modules
│   ├── 3.1 Employee Directory & Dossier Management
│   │   ├── 3.1.1 Employee Profile CRUD Endpoints
│   │   ├── 3.1.2 Directory Search, Filtering, and Pagination
│   │   └── 3.1.3 Add Employee Modal with Live Persistence
│   ├── 3.2 Leave Request Lifecycle
│   │   ├── 3.2.1 Leave Request Schema & Balance Modeling
│   │   ├── 3.2.2 Application Validation (Collision Detection, Balance Checks)
│   │   └── 3.2.3 Manager Approval Desk with Real-time State Mutations
│   ├── 3.3 Attendance Telemetry
│   │   ├── 3.3.1 Clock-In / Clock-Out Endpoints with Shift Calculation
│   │   ├── 3.3.2 Active Telemetry Status Bar & Time Counter
│   │   └── 3.3.3 Daily Presence Log & Audit Registers
│   ├── 3.4 Internal Bulletins & Communications
│   │   ├── 3.4.1 Priority-Tagged Announcement Model
│   │   └── 3.4.2 Organization Bulletin Board UI
│   └── 3.5 Training & Skill Upgrading
│       ├── 3.5.1 Curriculum Model & Progress Tracking
│       └── 3.5.2 Manager & HR Training Creation Modals
│
├── 4.0 Frontend Experience & Design System
│   ├── 4.1 Editorial Theme Implementation (Warm Ivory / Evergreen Palette)
│   ├── 4.2 Interactive Three.js Geometric Visuals for Landing Experience
│   ├── 4.3 Responsive Sidebar Navigation & Real-time Profile Status
│   └── 4.4 Mobile-Optimized Breakpoints and Modal Transitions
│
└── 5.0 Quality Assurance, Deployment & Hardening
    ├── 5.1 Anti-Mock Audit (Decommissioning of Static/Mock Stubs)
    ├── 5.2 Render Web Service Deployment & Health Monitoring
    ├── 5.3 Vercel Edge Frontend Hosting & SPA Rewrites Configuration
    └── 5.4 Cold-Start Resilience Calibration (60-second fetch tolerance)
```
