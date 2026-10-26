# Phase 3: Requirement Analysis — Use Case Specifications

## Use Case 1: Employee Clock-In / Clock-Out Telemetry
- **Primary Actor**: Staff Employee
- **Preconditions**: Employee is logged into StaffSync with an active session.
- **Trigger**: Employee clicks the "Clock In" button in the navigation header or attendance dashboard.
- **Main Success Scenario**:
  1. System checks for existing attendance record for current date and employee ID.
  2. If none exists, system creates a record with `checkInTime` set to current ISO timestamp and status `Present` (or `Late` if past standard threshold).
  3. Header updates to display active recording indicator with real-time timer.
  4. Employee clicks "Clock Out" at end of shift.
  5. System records `checkOutTime` and calculates `totalHours = (checkOut - checkIn) / 3600000`.
  6. Attendance register updates in real time.
- **Alternative Flow**: If already clocked in, system prevents duplicate clock-in and shows option to Clock Out only.

---

## Use Case 2: Apply for Leave
- **Primary Actor**: Staff Employee
- **Preconditions**: Employee has authenticated session.
- **Trigger**: Employee clicks "Apply for Leave" modal trigger.
- **Main Success Scenario**:
  1. System displays employee's current leave balances (Annual, Sick, Casual).
  2. Employee selects leave type, start date, end date, and enters justification reason.
  3. Client validates that `endDate >= startDate` and requested duration does not exceed available balance.
  4. Client dispatches `POST /api/leaves` with bearer token.
  5. Server validates no overlapping approved/pending leaves exist for this date range.
  6. Server creates `LeaveRequest` with status `Pending` and generates notification for the manager.
  7. Leave history table displays the new pending submission.
- **Alternative Flow (Insufficient Balance)**: System displays error alert: *"Insufficient leave balance for requested duration"* and disables submission.

---

## Use Case 3: Leave Request Review & Deduction
- **Primary Actor**: Team Manager / HR Administrator
- **Preconditions**: Pending leave requests exist in database.
- **Trigger**: Manager opens Approvals desk on `/manager/leaves` or `/hr/leaves`.
- **Main Success Scenario**:
  1. Manager reviews applicant details, date range, requested category, and employee justification.
  2. Manager clicks "Approve" (or "Reject").
  3. Client sends `PUT /api/leaves/:id/status` with `{ status: "Approved", comments: "..." }`.
  4. Server verifies reviewer authorization.
  5. Server updates leave status to `Approved` and decrements employee's corresponding leave balance.
  6. Server creates approval notification for the employee.
  7. UI reflects status change immediately without full page reload.

---

## Use Case 4: Manager Curriculum Creation
- **Primary Actor**: Team Manager
- **Preconditions**: Manager is logged in and navigates to `/manager/training`.
- **Trigger**: Manager clicks "New Curriculum" button in page header.
- **Main Success Scenario**:
  1. System opens `CreateTrainingModal`.
  2. Manager inputs curriculum title, description, instructor, department, duration hours, modules count, and target dates.
  3. Client dispatches `POST /api/training` with payload.
  4. Server `trainingRoutes.js` verifies role authorization (`hr` or `manager`).
  5. Server persists new `TrainingProgram` record in MongoDB Atlas.
  6. Modal closes, and manager training track catalog reloads with new curriculum card visible.
