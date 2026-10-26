# Phase 2: Project Planning Phase — Project Charter & Scope Statement

## 1. Project Charter Overview
- **Project Name**: StaffSync (Enterprise Human Resource Management System)
- **Project Sponsor**: Enterprise Operations & Engineering Division
- **Principal Author / Owner**: Parikshit Sharma
- **Version**: 1.0.0 (Production Release)
- **Core Mission**: Modernize internal workforce telemetry, directory records, and administrative approvals through an integrated, cloud-native web application.

---

## 2. In-Scope Deliverables

1. **Secure Identity & Authentication Engine**:
   - User registration and login backed strictly by live MongoDB Atlas records.
   - Salted password hashing via `bcryptjs` and role-encoded JSON Web Tokens (`jsonwebtoken`).
   - Profile management with dynamic contact details and emergency info.

2. **Employee Directory Management**:
   - Centralized searchable catalog with department filtering and status indicators.
   - Comprehensive employee dossier view (personal info, job details, leave balances).
   - Administrative CRUD capability restricted to HR credentials.

3. **Leave Request & Balances Workflow**:
   - Employee self-service application modal with balance validation (Annual, Sick, Casual).
   - Date range overlap checks and automatic day-count calculations.
   - Manager/HR review desk with one-click Approve/Reject actions and automatic balance adjustment.

4. **Attendance Telemetry Module**:
   - Real-time Check-In and Check-Out actions with timestamp logging.
   - Daily attendance register view with status classification (Present, Late, Half Day, Absent).
   - Active session tracking and automatic total worked hours calculation.

5. **Internal Communications & Bulletins**:
   - Prioritized organizational announcements (`High`, `Medium`, `General`).
   - Role-targeted broadcasts and administrative management.

6. **Curriculum & Upskilling Hub**:
   - Training catalog creation and cohort assignment accessible to HR and Managers.
   - Individual progress tracking and completion milestone verification.

7. **Workforce Reporting & Analytics**:
   - Executive dashboard aggregating departmental headcounts, attendance adherence, and leave ratios.

---

## 3. Out-of-Scope (Deferred to Future Iterations)
- External third-party payroll disbursement integrations (e.g., Stripe Connect, Razorpay Payroll).
- Hardware biometric clock-in device firmware flashing (software telemetry supported).
- Multi-language localization (English provided as primary enterprise standard).

---

## 4. Key Success Milestones
- **M1**: Cloud MongoDB Atlas cluster and REST API foundation live.
- **M2**: Zero mock service cutover — all client calls hit real endpoints.
- **M3**: Responsive Warm Ivory/Evergreen UI integration with Three.js graphics.
- **M4**: Role parity achieved (Managers empowered to create training tracks).
- **M5**: Production deployment verified on Vercel CDN and Render Web Services.
