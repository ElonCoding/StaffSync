# Ideation Phase: Customer Problem Statements Specification

| Metadata Field | Value |
| :--- | :--- |
| **Document Type** | Customer / Stakeholder Problem Statement Specification |
| **Project Name** | **StaffSync — Enterprise Human Resource Management System (HRMS)** |
| **Version** | v1.0.0 (Production Release) |
| **Date** | 2026-10-27 |
| **Project Lead / Owner** | Parikshit Sharma |
| **Repository** | [https://github.com/ElonCoding/StaffSync](https://github.com/ElonCoding/StaffSync) |
| **Live Deployments** | Client: [staffsync-smoky.vercel.app](https://staffsync-smoky.vercel.app/) \| API: [staffsync-czzq.onrender.com](https://staffsync-czzq.onrender.com) |

---

## 1. Objective & Methodology
To formally articulate the exact operational friction, structural bottlenecks, and emotional impacts experienced by key organizational actors (Staff Employees, Team Managers, HR Administrators). By decomposing pain points into standardized `I am / I'm trying to / But / Because / Which makes me feel` frameworks, we ensure StaffSync's technical features directly alleviate real enterprise frustration.

---

## 2. Customer Problem Statement (PS) Matrix

| PS ID | I am (User / Actor) | I'm trying to... | But... | Because... | Which makes me feel... |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **PS-1** | **HR Director** *(Human Resources Administrator)* | Maintain a single, verified, and synchronized organizational directory across all departments. | Employee contact and emergency details are constantly outdated and inconsistent across departmental sheets. | Changes are made locally in disconnected spreadsheets without centralized database synchronization. | **Overwhelmed, disorganized, and legally vulnerable** during workplace emergencies. |
| **PS-2** | **Software Engineer** *(Staff Member / Employee)* | Request a 3-day personal vacation leave and plan travel with my family. | My request gets delayed or forgotten for days, leaving me uncertain whether it is approved. | Requests are routed through unorganized email chains and verbal chats that get buried in manager inboxes. | **Anxious, disregarded, and unable to plan personal commitments.** |
| **PS-3** | **Engineering Lead** *(Team Manager)* | Ensure adequate team sprint coverage while fairly approving subordinate time-off requests. | Multiple engineers inadvertently take leave on identical critical sprint release dates. | There is no automated schedule collision checking or shared team calendar visibility before approval. | **Stressed, under-resourced, and scrambling** to meet product deliverables. |
| **PS-4** | **Hybrid Employee** *(Remote & Onsite Staff)* | Accurately record my daily arrival and shift completion timestamps with zero friction. | The physical biometric scanner frequently fails, creates long queues, and does not support remote work. | Hardware attendance systems are rigid, location-bound, and lack instant mobile/web software telemetry. | **Distrusted, micro-managed, and frustrated** by administrative overhead. |
| **PS-5** | **Product Manager** *(Team Manager)* | Rapidly upskill junior team members in new technical competencies (e.g., TypeScript, modern testing). | I have to wait weeks for central HR to create courses or submit external training requisition forms. | Legacy corporate systems restrict curriculum creation exclusively to HR administrators, blocking manager agility. | **Powerless, delayed, and hindered** in building team engineering velocity. |
| **PS-6** | **Chief Operations Officer** *(Executive Leadership)* | Inspect monthly attendance consistency, headcount growth, and leave utilization rates. | I have to wait 5 business days after month-end for administrative staff to manually reconcile records. | Data is fragmented across multiple spreadsheets requiring manual formula recalculation. | **Blind to real-time workforce operational health** and unable to make agile resource allocations. |

---

## 3. Synthesis & Technical Countermeasures

| Problem ID | Root Architectural Cause | StaffSync Technical Countermeasure |
| :---: | :--- | :--- |
| **PS-1** | Data Siloing | **Unified MongoDB Atlas Personnel Dossier**: 100% dynamic cloud persistence with employee self-service contact updates. |
| **PS-2 & PS-3** | Unchecked Leave Workflows | **Automated Leave Balance Ledger**: Algorithmic date collision detection + 1-click manager approvals with atomic balance decrements. |
| **PS-4** | Inflexible Attendance Tracking | **Single-Click Telemetry**: Real-time Clock In / Clock Out with live shift stopwatch and location-agnostic web telemetry. |
| **PS-5** | Supervisory Role Imbalance | **Manager Training Curation Parity**: Backend route authorization (`authorizeRoles('hr', 'manager')`) empowering frontline managers to curate and track curricula. |
| **PS-6** | Delayed Executive Reporting | **Real-Time Analytics Gateway**: Express aggregation pipelines calculating live headcount, attendance rate, and leave volumes. |
