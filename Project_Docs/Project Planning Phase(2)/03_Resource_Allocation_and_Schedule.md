# Phase 2: Project Planning Phase — Resource Allocation & Sprint Schedule

## 1. Technological & Tooling Resources

| Component | Selected Technology | Version | Justification |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React + TypeScript | 19.x | Component lifecycle hooks, strict typing, high render efficiency |
| **Bundler & Build Tool**| Vite | 8.x | Near-instant HMR, optimized production tree-shaking |
| **Styling Engine** | Tailwind CSS | 4.x | Utility-first CSS, custom design tokens, rapid responsive layout |
| **Backend Runtime** | Node.js (ESM) | 20+ / 22+ | Event-driven architecture, native ES Modules support |
| **Web Server** | Express | 4.x | Robust middleware ecosystem, RESTful routing simplicity |
| **Database & ODM** | MongoDB Atlas / Mongoose | 8.x | High-availability cloud clustering, schema flexibility, document indexing |
| **Security & Crypto** | jsonwebtoken + bcryptjs | Standard | Stateless token claims, salted password encryption |
| **3D Engine** | Three.js | Standard | Interactive landing page geometry |
| **Hosting Platform** | Vercel (Client) + Render (API) | Cloud | Global CDN edge delivery coupled with containerized Node service |

---

## 2. Iterative Sprint Schedule

```mermaid
gantt
    title StaffSync Development & Delivery Timeline
    dateFormat  YYYY-MM-DD
    section Sprint 1: Foundation
    Requirements & Ideation         :done,    des1, 2026-10-01, 2026-10-05
    MongoDB Atlas & Server Setup    :done,    des2, 2026-10-06, 2026-10-10
    Vite + React 19 Scaffolding     :done,    des3, 2026-10-08, 2026-10-12
    section Sprint 2: Core Modules
    Auth & JWT Middleware           :done,    des4, 2026-10-13, 2026-10-16
    Employee Directory & Dossier    :done,    des5, 2026-10-16, 2026-10-19
    Leave Request Engine            :done,    des6, 2026-10-19, 2026-10-22
    Attendance Telemetry            :done,    des7, 2026-10-21, 2026-10-23
    section Sprint 3: Polish & Role Parity
    Training Hub & Manager Creation :done,    des8, 2026-10-23, 2026-10-24
    Announcement Board & Reports    :done,    des9, 2026-10-24, 2026-10-25
    Anti-Mock System Audit          :done,    des10, 2026-10-25, 2026-10-25
    section Sprint 4: Deployment & CI/CD
    Render Backend Deployment       :done,    des11, 2026-10-25, 2026-10-26
    Vercel Client Edge Delivery     :done,    des12, 2026-10-25, 2026-10-26
    Documentation & Verification    :active,  des13, 2026-10-26, 2026-10-27
```
