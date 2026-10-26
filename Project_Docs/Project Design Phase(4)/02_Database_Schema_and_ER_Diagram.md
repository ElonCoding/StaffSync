# Phase 4: Project Design Phase — Database Schema & ER Diagram

## 1. Entity-Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o| EMPLOYEE : "provisions"
    EMPLOYEE ||--o{ LEAVE_REQUEST : "submits"
    EMPLOYEE ||--o{ ATTENDANCE : "clocks"
    EMPLOYEE ||--o{ NOTIFICATION : "receives"
    USER ||--o{ ANNOUNCEMENT : "publishes"
    TRAINING_PROGRAM ||--o{ ENROLLED_EMPLOYEE : "contains"

    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        string role "hr | manager | employee"
        string employeeId
        string department
        string designation
        string phone
        string location
        string avatar
        date createdAt
    }

    EMPLOYEE {
        ObjectId _id PK
        ObjectId user FK
        string name
        string email UK
        string employeeId UK
        string department
        string designation
        string position
        string role
        string status "Active | Inactive | On Leave"
        string joiningDate
        string phone
        string location
        string managerName
        string emergencyContact
        object leaveBalances "annual, sick, casual"
        date createdAt
    }

    LEAVE_REQUEST {
        ObjectId _id PK
        string employeeId
        string employeeName
        string leaveType "Annual | Sick | Casual | Unpaid"
        string startDate
        string endDate
        number totalDays
        string reason
        string status "Pending | Approved | Rejected"
        string appliedDate
        string reviewedBy
        date reviewedAt
        string comments
    }

    ATTENDANCE {
        ObjectId _id PK
        string employeeId
        string employeeName
        string date
        string checkInTime
        string checkOutTime
        number totalHours
        string status "Present | Late | Half Day | Absent"
        string notes
    }

    ANNOUNCEMENT {
        ObjectId _id PK
        string title
        string content
        string priority "High | Medium | Low"
        string targetAudience "All | hr | manager | employee"
        string author
        string date
    }

    TRAINING_PROGRAM {
        ObjectId _id PK
        string title
        string description
        string department
        string instructor
        number durationHours
        number modulesCount
        string startDate
        string endDate
        string status "Active | Completed | Upcoming"
        array assignedEmployees
    }

    NOTIFICATION {
        ObjectId _id PK
        string recipientId
        string title
        string message
        string type "leave | attendance | announcement | general"
        boolean read
        date createdAt
    }
```

---

## 2. Indexing Strategy for High Throughput
- `User.email`: Unique index for instant lookups during authentication.
- `Employee.employeeId`: Unique index ensuring no duplicate workforce IDs across departments.
- `Employee.user`: Foreign key index linking credentials to employee profiles.
- `Attendance.employeeId` + `Attendance.date`: Compound index ensuring single-query resolution of daily attendance and fast date-range filtering.
- `LeaveRequest.employeeId`: Indexed for rapid history rendering on self-service portals.
