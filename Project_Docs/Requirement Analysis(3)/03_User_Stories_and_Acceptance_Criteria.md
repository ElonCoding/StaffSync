# Phase 3: Requirement Analysis — User Stories & Acceptance Criteria

## 1. Epic: Secure Identity & Role Routing
- **US-01**: *As a prospective employee or admin, I want to securely register and sign in to StaffSync, so that I can access my designated operational dashboard.*
  - **Scenario**: Successful Login & Role Redirection
    - **Given** a user is on the `/login` page
    - **When** the user inputs valid work email and password and submits
    - **Then** the system returns a valid signed JWT
    - **And** redirects HR users to `/hr/dashboard`, managers to `/manager/dashboard`, and employees to `/employee/dashboard`.
  - **Scenario**: Invalid Credentials
    - **Given** a user enters an incorrect password or unregistered email
    - **When** the form is submitted
    - **Then** the API responds with HTTP 401
    - **And** the UI displays: *"Invalid email or password. Please try again."*

---

## 2. Epic: Dynamic Workforce Directory
- **US-02**: *As an HR Administrator, I want to add, edit, and search employee dossiers, so that our organizational record is always current.*
  - **Scenario**: Adding an Employee Record
    - **Given** an HR Admin opens the `AddEmployeeModal`
    - **When** all mandatory fields (Name, Email, Role, Department, Joining Date) are filled and submitted
    - **Then** the record persists to MongoDB Atlas
    - **And** appears immediately in the directory list with default leave allowances.

---

## 3. Epic: Leave Processing
- **US-03**: *As an employee, I want to apply for leaves and view my remaining allowances, so that I can plan time off transparently.*
  - **Scenario**: Applying for leave within balance
    - **Given** an employee has 14 remaining Annual Leave days
    - **When** the employee requests a 3-day leave
    - **Then** the request is created with `Pending` status
    - **And** upon approval by a manager, remaining balance reflects 11 days.

---

## 4. Epic: Attendance Telemetry
- **US-04**: *As an employee, I want to log my arrival and departure with a single click, so that my attendance record is accurately tracked.*
  - **Scenario**: Clock-in and shift calculation
    - **Given** an employee has not clocked in today
    - **When** they click "Clock In"
    - **Then** the server registers the current timestamp
    - **And** displays an active session pill with worked hour timer until "Clock Out" is triggered.

---

## 5. Epic: Manager Training Curation
- **US-05**: *As a Team Manager, I want to create training tracks for my department, so that I can directly address technical skill gaps.*
  - **Scenario**: Manager creates curriculum
    - **Given** a manager is on `/manager/training`
    - **When** they click "New Curriculum", provide track details, and submit
    - **Then** the server verifies the manager role and saves the curriculum
    - **And** the track appears in the team learning view ready for enrollment.
