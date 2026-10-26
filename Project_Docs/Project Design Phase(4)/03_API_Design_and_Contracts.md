# Phase 4: Project Design Phase — REST API Design & Contracts

## 1. Global Conventions & Standards
- **Base URL**: `https://staffsync-czzq.onrender.com/api` (Production) / `http://localhost:5000/api` (Local)
- **Protocol**: HTTP/1.1 over TLS (HTTPS)
- **Data Exchange**: JSON (`Content-Type: application/json`)
- **Authentication**: Bearer Token in `Authorization` header (`Authorization: Bearer <JWT>`)

---

## 2. API Endpoints Specification

### 2.1 Authentication (`/api/auth`)
| Method | Endpoint | Access | Request Body | Success Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/login` | Public | `{ email, password }` | `200 { token, user }` | Authenticates against MongoDB, returns JWT |
| `POST` | `/register` | Public | `{ name, email, password, role, department }` | `201 { token, user }` | Registers user & provisions initial dossier |
| `GET` | `/me` | Authenticated | None | `200 { user, employee }` | Retrieves active user session dossier |
| `POST` | `/logout` | Authenticated | None | `200 { success: true }` | Clears active session context |

### 2.2 Employee Directory (`/api/employees`)
| Method | Endpoint | Access | Query / Body | Success Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Authenticated | `?search=&department=&status=` | `200 { employees: [] }` | Search and filter employee cards |
| `GET` | `/:id` | Authenticated | None | `200 { employee }` | Detailed employee dossier |
| `POST` | `/` | HR Only | Employee JSON schema | `201 { employee }` | Add new employee record |
| `PUT` | `/:id` | Self / HR | Update fields JSON | `200 { employee }` | Update contact & dossier details |
| `DELETE` | `/:id` | HR Only | None | `200 { success: true }` | Remove employee record |

### 2.3 Leave Management (`/api/leaves`)
| Method | Endpoint | Access | Query / Body | Success Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Authenticated | `?status=&employeeId=` | `200 { leaves: [] }` | Fetch leave requests |
| `POST` | `/` | Authenticated | `{ leaveType, startDate, endDate, reason }` | `201 { leave }` | Submit leave request |
| `PUT` | `/:id/status`| HR / Manager | `{ status: "Approved"|"Rejected", comments }` | `200 { leave }` | Review & update balance |

### 2.4 Attendance Telemetry (`/api/attendance`)
| Method | Endpoint | Access | Query / Body | Success Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Authenticated | `?date=&employeeId=` | `200 { attendance: [] }` | Query daily attendance logs |
| `POST` | `/clock-in` | Authenticated | `{ notes?: string }` | `201 { record }` | Start daily shift timestamp |
| `POST` | `/clock-out`| Authenticated | `{ notes?: string }` | `200 { record }` | Finish shift & compute hours |

### 2.5 Training Hub (`/api/training`)
| Method | Endpoint | Access | Query / Body | Success Response | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Authenticated | None | `200 { programs: [] }` | Fetch all active curricula |
| `POST` | `/` | HR / Manager | Curriculum JSON schema | `201 { program }` | Create new learning track |
| `PUT` | `/:id/progress` | Authenticated | `{ employeeId, progressPercent }` | `200 { program }` | Update learner milestone |

### 2.6 Announcements & System Health
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/announcements` | Authenticated | Get priority-tagged announcements |
| `POST` | `/api/announcements` | HR Only | Publish company bulletin |
| `GET` | `/api/health` | Public | Service health verification: `{"status":"healthy"}` |
