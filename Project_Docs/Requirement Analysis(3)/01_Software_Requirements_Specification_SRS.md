# Phase 3: Requirement Analysis — Software Requirements Specification (SRS)

## 1. Introduction
This Software Requirements Specification (SRS) specifies the functional and non-functional requirements for **StaffSync Enterprise HRMS**, following IEEE 830 standards.

---

## 2. Overall Description

### 2.1 Product Perspective
StaffSync is an autonomous, cloud-native web application providing workforce telemetry, organizational communication, employee records, leave administration, and training curation.

### 2.2 User Characteristics
1. **HR Administrator**: Possesses comprehensive administrative privileges over all employee profiles, leave requests, announcements, and organization-wide analytics.
2. **Team Manager**: Possesses supervisory privileges to approve/reject subordinate leaves, view team attendance telemetry, and curate/assign training programs.
3. **Staff Employee**: End user with self-service privileges to clock in/out, submit leave applications, view company announcements, and participate in assigned training courses.

---

## 3. Functional Requirements

### 3.1 Module 1: Authentication & Authorization (AUTH)
- **FR-AUTH-01**: The system shall authenticate users via valid work email and password.
- **FR-AUTH-02**: Passwords shall be hashed using `bcryptjs` with a work factor of 10 prior to persistence.
- **FR-AUTH-03**: Upon successful login, the system shall issue a signed JSON Web Token containing `id`, `role`, `email`, and `department`.
- **FR-AUTH-04**: The system shall reject unauthenticated requests to protected endpoints with HTTP 401 Unauthorized.
- **FR-AUTH-05**: The system shall reject authenticated requests lacking sufficient role clearance with HTTP 403 Forbidden.

### 3.2 Module 2: Employee Management (EMP)
- **FR-EMP-01**: HR Administrators shall be able to view, search, filter (by department and active status), and create new employee dossiers.
- **FR-EMP-02**: An employee dossier shall maintain personal data, job classification, emergency contact, joining date, and leave balances.
- **FR-EMP-03**: Employees shall be able to update their phone number and emergency contact details.

### 3.3 Module 3: Leave Management (LEV)
- **FR-LEV-01**: Employees shall be able to submit leave requests specifying leave type (Annual, Sick, Casual, Unpaid), start date, end date, and justification.
- **FR-LEV-02**: The system shall validate that the requested leave duration does not exceed the employee's current balance for that category.
- **FR-LEV-03**: Managers and HR Administrators shall be able to Approve or Reject pending leave requests with optional review comments.
- **FR-LEV-04**: When a leave request is Approved, the system shall automatically deduct the corresponding days from the employee's balance.

### 3.4 Module 4: Attendance Telemetry (ATT)
- **FR-ATT-01**: Employees shall be able to trigger a Clock-In action registering timestamp and date.
- **FR-ATT-02**: Employees with an active clock-in session shall be able to trigger a Clock-Out action.
- **FR-ATT-03**: The system shall compute total elapsed shift hours automatically upon clock-out.
- **FR-ATT-04**: The system shall maintain daily presence registers displaying status (`Present`, `Late`, `Half Day`, `Absent`).

### 3.5 Module 5: Bulletins & Announcements (ANN)
- **FR-ANN-01**: HR Administrators shall be able to publish announcements with urgency tags (`High`, `Medium`, `General`) and audience targets.
- **FR-ANN-02**: Employees and Managers shall see bulletins relevant to their role and audience scope.

### 3.6 Module 6: Learning & Skill Tracks (TRN)
- **FR-TRN-01**: Both HR Administrators and Team Managers shall be empowered to create new training curricula (`POST /api/training`).
- **FR-TRN-02**: The system shall track enrolled employees, individual progress percentage, and module completion milestones.

---

## 4. Non-Functional Requirements

### 4.1 Performance & Latency
- Page interactive load time shall not exceed 1.5 seconds on broadband connections.
- API endpoints shall respond in under 300ms under normal load (excluding initial cloud cold starts).
- Client requests shall accommodate cold-start wakeups up to 60 seconds with descriptive feedback.

### 4.2 Security
- Strict HTTPS enforcement across all client and API endpoints.
- Cross-Site Scripting (XSS) prevention via React's virtual DOM sanitization.
- CORS whitelist strictly governed to authorized origins.

### 4.3 Reliability & Availability
- High availability via Vercel edge distribution and MongoDB Atlas replica sets.
- Automated CI/CD build tests ensuring zero broken client syntax or missing server controller imports.
