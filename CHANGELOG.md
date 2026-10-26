# Changelog

All notable changes to **StaffSync** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-27

### Initial Production Release (v1.0.0)

#### 🚀 Features & Capabilities
- **Strict Multi-Role Authentication & Security**:
  - Salting and one-way hashing with `bcryptjs` (work factor 10).
  - Cryptographically signed JSON Web Tokens (`jsonwebtoken`) with standard 7-day expiration.
  - Role-Based Access Control (RBAC) middleware guarding endpoints for `hr`, `manager`, and `employee`.
  - Zero-mock policy: 100% dynamic persistence against cloud-hosted MongoDB Atlas collections.
- **Workforce Directory & Profile Management**:
  - Centralized personnel directory with real-time text search and department-level filtering.
  - Comprehensive employee dossier view (contact info, emergency contacts, role, joining date).
  - Self-service contact update workflow for individual employees.
  - Full employee creation, editing, and deletion capabilities for HR Administrators.
- **Leave Request & Balances Workflow**:
  - Balance tracking across distinct categories (`Annual`, `Sick`, `Casual`, `Unpaid`).
  - Client-side and server-side date range validation and collision detection.
  - Manager & HR review desk with real-time approval/rejection and automatic balance deductions.
- **Real-Time Attendance Telemetry**:
  - 1-click arrival telemetry (Clock In) and shift completion (Clock Out).
  - Dynamic shift hour calculator and active session recording bar with live counter.
  - Daily presence registers classifying status (`Present`, `Late`, `Half Day`, `Absent`).
- **Internal Communications & Bulletins**:
  - Priority-classified organizational announcements (`High`, `Medium`, `General`).
  - Targeted audience delivery filtering (`All`, `hr`, `manager`, `employee`).
- **Curriculum & Upskilling Hub**:
  - Interactive training program catalog with module tracking and duration metrics.
  - Full role parity: both HR Administrators and Team Managers can create and publish new curricula.
  - Cohort enrollment and milestone progress tracking (`In Progress` -> `Completed`).
- **Workforce Analytics & Strategic Reports**:
  - Executive dashboard aggregating departmental headcount distributions, leave utilization ratios, and attendance adherence.

#### 🛠️ Architecture & Cloud Infrastructure
- **Frontend SPA**: React 19 + Vite 8 + TypeScript + Tailwind CSS v4, deployed to Vercel Global Edge Network with universal SPA rewrite rules.
- **Backend REST Service**: Node.js 20+ / Express 4, deployed as a containerized web service on Render with dynamic CORS whitelisting and health telemetry (`/api/health`).
- **Persistence**: Managed MongoDB Atlas replica set with TLS encryption at rest and in transit.
- **Resilience**: Calibrated client-side fetch timeout to 60 seconds to accommodate cloud container cold-starts.

#### 🧪 Quality Assurance & Testing
- Completed comprehensive User Acceptance Testing (`User_Acceptance_Testing_UAT.md`) with 100% pass rate across 8 test suites.
- Automated CI/CD pipeline via GitHub Actions (`.github/workflows/ci-cd.yml`) continuously verifying client compilation and server syntax.
