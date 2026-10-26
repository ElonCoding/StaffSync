# Project Design Phase-II: Technology Stack (Architecture & Stack)

| Metadata Field | Value |
| :--- | :--- |
| **Document Type** | Technology Stack & Technical Architecture Specification |
| **Project Name** | **StaffSync — Enterprise Human Resource Management System (HRMS)** |
| **Version** | v1.0.0 (Production Release) |
| **Date** | 2026-10-27 |
| **Project Lead / Owner** | Parikshit Sharma |
| **Repository** | [https://github.com/ElonCoding/StaffSync](https://github.com/ElonCoding/StaffSync) |
| **Live Deployments** | Client: [staffsync-smoky.vercel.app](https://staffsync-smoky.vercel.app/) \| API: [staffsync-czzq.onrender.com](https://staffsync-czzq.onrender.com) |

---

## 1. Technical Architecture
The **StaffSync** platform is architected around a modern, decoupled **3-tier cloud enterprise architecture**:

1. **Presentation Layer (Client SPA)**: Built with **React 19**, **TypeScript**, and **Vite 8**, styled with **Tailwind CSS v4** design tokens, and rendered with **Three.js** interactive 3D geometry on the landing hero. Deployed to the **Vercel Global Edge Network** with universal SPA client-side routing.
2. **Business Logic & API Gateway (Application Tier)**: Built with **Node.js 20+** and **Express 4 (ES Modules)**, incorporating middleware for cryptographic JWT authentication (`jsonwebtoken`), password salting (`bcryptjs`), cookie parsing (`cookie-parser`), and dynamic CORS origin authorization. Hosted on **Render Cloud Web Services**.
3. **Data Persistence Tier (Database Layer)**: High-availability cloud clustering via **MongoDB Atlas** with the **Mongoose 8 ODM**, enforcing strict schema constraints, indexed lookups, and encrypted transport-layer security (TLS).

```
[ Client Presentation Tier ] ── HTTPS / Bearer JWT ──> [ Application Logic Tier ] ── Mongoose / TLS ──> [ Data Persistence Tier ]
   • React 19 + TypeScript                                • Node.js 20+ & Express 4                     • MongoDB Atlas Cluster
   • Vite 8 & Tailwind CSS v4                             • JWT & Bcrypt Middleware                     • Collections: users, employees,
   • Vercel Global Edge CDN                               • Render Web Service                              leaves, attendance, training
```

---

## 2. Table-1: Components & Technologies

| S.No | Component | Description | Technology & Version |
| :--- | :--- | :--- | :--- |
| **1** | **User Interface (Presentation Layer)** | Web-based responsive portal for HR Admins, Team Managers, and Staff Members. | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Three.js |
| **2** | **Application Logic — Core Services** | Authentication, employee directory, leave management, and attendance shift telemetry. | Node.js 20+, Express 4, bcryptjs 2.4, jsonwebtoken 9.0 |
| **3** | **Application Logic — Advanced Modules** | Training curricula curation, priority announcement broadcasting, and executive analytics. | Express REST Router, cookie-parser, dynamic CORS middleware |
| **4** | **Data Persistence & Storage Layer** | Cloud document database storing user credentials, employee dossiers, leave records, attendance logs, and learning tracks. | MongoDB Atlas Cloud Cluster, Mongoose ODM 8.24 |
| **5** | **Cloud Hosting & CDN Delivery** | Production hosting infrastructure with edge caching, automated SSL, and health monitoring. | Vercel (Frontend Client) + Render (Backend REST API) |
| **6** | **Continuous Integration / Continuous Delivery** | Automated validation pipeline running build verification, linting, and syntax checks on git push. | GitHub Actions (`.github/workflows/ci-cd.yml`) |

---

## 3. Table-2: Application Characteristics

| S.No | Characteristic | Description | Implementation Technology |
| :--- | :--- | :--- | :--- |
| **1** | **Modern Open-Source Frameworks** | Unified modern JavaScript/TypeScript stack enabling high developer velocity and strict typing. | React 19, Node.js, Express, Tailwind CSS v4 |
| **2** | **Scalable 3-Tier MVC Architecture** | Decoupled client-server architecture with RESTful API contracts and stateless JWT authentication. | MVC Pattern, Express Controllers, RESTful HTTP |
| **3** | **Strict Anti-Mock Security** | 100% dynamic cloud persistence with zero static fallback stubs or fake data leakages. | MongoDB Atlas cloud collections, Mongoose schemas |
| **4** | **Cloud Resilience & Cold-Start Tolerance** | Calibrated 60-second request timeout accommodating Render free-tier container wakeups without throwing browser errors. | Client-side `AbortController` in `apiClient.js` |
| **5** | **Responsive Design & High-Craft Aesthetics** | Editorial Warm Ivory (`#EAE9DF`) and Evergreen (`#173D32`) color palette with Google Fonts typography (`DM Serif Display`, `Inter`). | Semantic Tailwind tokens, custom typography |
| **6** | **Role Parity & Supervisory Empowerment** | Role-based permission matrix allowing both HR Administrators and Team Managers to create and publish training tracks. | `authorizeRoles('hr', 'manager')` route guards |

---

## 4. References & Documentation Standards
- [React 19 Official Documentation](https://react.dev/)
- [Vite Next Generation Frontend Tooling](https://vite.dev/)
- [Express.js Best Practices & Security Guidelines](https://expressjs.com/)
- [MongoDB Atlas Mongoose ODM Guide](https://mongoosejs.com/)
- [RFC 7519: JSON Web Token (JWT) Standard](https://datatracker.ietf.org/doc/html/rfc7519)
- [StaffSync GitHub Repository](https://github.com/ElonCoding/StaffSync)
