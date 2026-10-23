# StaffSync — Modern Human Resource Management System (HRMS)

StaffSync centralizes employee directories, leave management, daily attendance tracking, team training curricula, prioritized internal announcements, and executive workforce reporting in a unified, editorial workspace.

---

## Architecture Overview

StaffSync is structured into two dedicated services:

```
StaffSync/
├── client/     # Frontend SPA built with Vite, React, TailwindCSS, and Three.js
└── server/     # Backend REST API built with Node.js, Express, and MongoDB
```

---

## 1. Client (`client/`)

- **Tech Stack**: React 19, Vite, Tailwind CSS, Three.js, Lucide Icons, React Router.
- **Key Modules**:
  - Interactive 3D synchronization sculpture
  - Comprehensive workforce & department directory
  - Leave approval workflows & calendar
  - Real-time attendance monitoring & check-in
  - Organization announcements & alerts
  - Training curricula & employee skill development

### Setup & Development
```bash
cd client
npm install
npm run dev
```

---

## 2. Server (`server/`)

- **Tech Stack**: Node.js, Express, MongoDB (Mongoose), JWT Authentication, Bcrypt.
- **Key API Endpoints**:
  - `/api/auth` — Authentication, JWT registration, session validation
  - `/api/employees` — Staff records, roles, departments, profile management
  - `/api/attendance` — Clock in/out tracking, status logs, timesheet telemetry
  - `/api/leaves` — Applications, balances, approvals, status updates
  - `/api/announcements` — Company bulletins, target roles, alerts
  - `/api/training` — Course catalogs, employee enrollment, completion rates
  - `/api/reports` — Workforce analytics, headcount trends, attendance metrics

### Setup & Development
```bash
cd server
npm install
npm run dev
```

---

## License
MIT License.
