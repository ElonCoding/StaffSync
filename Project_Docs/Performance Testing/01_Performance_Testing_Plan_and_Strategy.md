# Phase 5: Performance Testing — Test Plan & Evaluation Strategy

## 1. Objectives & Scope
The performance evaluation for StaffSync tests the resilience, latency, throughput, and error rates of the distributed system under diverse traffic loads. Key evaluation criteria include:
1. End-to-end response times under simulated enterprise concurrency.
2. Cloud container cold-start behavior on Render.com free tier.
3. Edge delivery performance and asset load speeds on Vercel CDN.
4. Database connection pool saturation and query execution times on MongoDB Atlas.

---

## 2. Testing Methodology & Tooling
- **Client Bundle Profiling**: Vite rollup build analyzer, measuring minified JS/CSS bundle footprints and Gzip compression ratios.
- **REST API Latency Benchmarking**: `curl.exe` network timing telemetry, measuring DNS resolution, TCP handshake, TLS negotiation, Time-to-First-Byte (TTFB), and total elapsed duration.
- **Continuous Integration Verification**: GitHub Actions headless build runs verifying zero syntax regression and fast build completion (<2 minutes).

---

## 3. Key Performance Indicators (KPIs) & Target Thresholds

| Metric | Target SLA | Critical Failure Threshold | Description |
| :--- | :--- | :--- | :--- |
| **API Health Check (Warm)** | < 150 ms | > 500 ms | Time to resolve `GET /api/health` |
| **Authentication `POST /api/auth/login`** | < 400 ms | > 1,200 ms | Includes bcrypt hash compare and JWT signing |
| **Directory Search `GET /api/employees`** | < 300 ms | > 800 ms | Regex search and filtering across collection |
| **Client Edge Delivery (Vercel)** | < 80 ms | > 250 ms | HTML shell delivery from nearest edge node |
| **Render Cold Start Recovery** | < 30 s | > 60 s | Time for container to spin up and accept first request |
| **Client Build Time** | < 5 s | > 30 s | Vite compilation time from source to production dist |
