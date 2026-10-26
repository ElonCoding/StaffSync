# Phase 2: Project Planning Phase — Risk Management & Mitigation Plan

## 1. Risk Assessment Matrix

| Risk ID | Risk Description | Severity | Probability | Mitigation Strategy & Implementation | Status |
| :--- | :--- | :---: | :---: | :--- | :---: |
| **RSK-01** | **Mock Data Leakage**: UI falling back to static fixtures causing false state. | High | Medium | Explicitly purged all mock fallback files; all client calls execute strictly against live MongoDB Atlas endpoints with error boundaries. | Mitigated |
| **RSK-02** | **Render Free-Tier Cold-Starts**: Backend spins down after 15m idle, causing initial requests to exceed 10s and fail. | High | High | Increased client `AbortController` timeout from 10s to 60s in `apiClient.js` with explicit "Server waking up" user messaging. | Mitigated |
| **RSK-03** | **Cross-Origin Resource Sharing (CORS) Block**: Frontend on `*.vercel.app` rejected by API gateway. | High | Medium | Dynamic origin verification in `server.js` allowing `https://staffsync-smoky.vercel.app`, preview domains, and local dev hosts. | Mitigated |
| **RSK-04** | **SPA Direct Route 404s**: User directly navigating or refreshing `/hr/dashboard` returning 404 from static host. | Medium | High | Created `client/vercel.json` with universal rewrite rule (`/(.*) -> /index.html`). | Mitigated |
| **RSK-05** | **Leave Balance Collisions**: Multiple simultaneous leave requests over-deducting employee allowance. | High | Low | Server-side transactional check before status mutation (`leaveController.js`), checking remaining balance before approval. | Mitigated |
| **RSK-06** | **JWT Token Hijacking & Expiration**: Token leakage or expired credentials leaving user in broken state. | Medium | Low | Expiration set to 7 days, stored in scoped local storage, auto-cleared on 401 response with redirection to `/login`. | Mitigated |
