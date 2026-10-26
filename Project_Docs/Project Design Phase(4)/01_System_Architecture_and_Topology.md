# Phase 4: Project Design Phase — System Architecture & Topology

## 1. High-Level Architectural Pattern
StaffSync is architected as a modern, decoupled client-server web application utilizing the **Model-View-Controller (MVC)** architectural pattern on the backend and a **Component-Driven Single-Page Application (SPA)** architecture on the frontend.

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|                Vite 8 + React 19 + TypeScript + Tailwind CSS            |
|                                                                         |
|  [ Landing Page & 3D ]   [ Auth Portal ]   [ HR / Mgr / Emp Desks ]     |
|             \                   |                  /                    |
|              +------------------+-----------------+                     |
|                                 |                                       |
|                    [ ApiClient (Token Interceptor) ]                    |
+---------------------------------+---------------------------------------+
                                  |
                                  | HTTPS / JSON (Bearer JWT)
                                  v
+---------------------------------+---------------------------------------+
|                              API GATEWAY                                |
|                   Express 4 REST Service on Node.js 20+                 |
|                                                                         |
|  Middleware Pipeline:                                                   |
|    - CORS Policy (Vercel CDN + Localhost Whitelist)                     |
|    - Request Logger                                                     |
|    - Cookie Parser & JSON Body Parser                                   |
|    - authMiddleware: verifyToken (JWT Validation)                       |
|    - authMiddleware: authorizeRoles (RBAC Guard)                        |
|                                                                         |
|  Controllers:                                                           |
|    [Auth] [Employee] [Leave] [Attendance] [Announcement] [Training]     |
+---------------------------------+---------------------------------------+
                                  |
                                  | Mongoose ODM / TLS Connection Pool
                                  v
+---------------------------------+---------------------------------------+
|                           PERSISTENCE LAYER                             |
|                      MongoDB Atlas Cloud Cluster                        |
|                                                                         |
|  Collections:                                                           |
|    - users            - attendances          - notifications            |
|    - employees        - announcements                                   |
|    - leaverequests    - trainingprograms                                |
+-------------------------------------------------------------------------+
```

---

## 2. Security Architecture & Pipeline
1. **Transport Layer**: 100% TLS/HTTPS across Vercel client, Render API, and MongoDB Atlas SRV.
2. **Authentication Flow**:
   - Client sends credentials (`POST /api/auth/login`).
   - Server fetches user document, checks password hash with `bcrypt.compare()`.
   - On match, server signs JWT payload with HMAC SHA-256 using `JWT_SECRET`.
   - Token is returned to client and stored in scoped `localStorage`.
3. **Authorization Guard Flow**:
   - `verifyToken` middleware extracts `Bearer <token>`, verifies signature and expiration.
   - Attaches decoded user payload (`req.user`) to request context.
   - `authorizeRoles('hr', 'manager')` evaluates `req.user.role` against required clearances; aborts with 403 Forbidden if unauthorized.

---

## 3. Deployment Topology
- **Client (Frontend)**: Deployed to Vercel Global Edge Network with continuous deployments from `main` branch. Assets served with Brotli/Gzip compression. Universal SPA rewrite redirects all routes to `/index.html`.
- **API (Backend)**: Containerized Node.js service running on Render Cloud, linked directly to GitHub repo. Automated health monitoring via `/api/health`.
- **Database**: 3-node replica set on MongoDB Atlas with automatic failover, daily snapshots, and encrypted storage-at-rest.
