
# Employee Attendance System

A full-stack Employee Attendance System with separate dashboards for Employees and Managers. Built with React, Node.js, and MongoDB/PostgreSQL.

---

## Table of Contents

* [Tech Stack](#tech-stack)
* [Features](#features)
* [Pages](#pages)
* [Database Schema](#database-schema)
* [API Endpoints](#api-endpoints)
* [Setup Instructions](#setup-instructions)
* [Environment Variables](#environment-variables)
* [Running the Project](#running-the-project)
* [Seed Data](#seed-data)
* [Screenshots](#screenshots)
* [License](#license)

---

## Tech Stack

* **Frontend:** React + Redux Toolkit / Zustand
* **Backend:** Node.js + Express
* **Database:** MongoDB or PostgreSQL

---

## Features

### Employee

* Register/Login
* Mark attendance (Check In / Check Out)
* View my attendance history (calendar or table)
* Monthly summary (Present / Absent / Late days)
* Dashboard with stats

### Manager

* Login
* View all employees attendance
* Filter by employee, date, status
* Team attendance summary
* Export attendance reports (CSV)
* Dashboard with team stats

---

## Pages

### Employee

* Login/Register
* Dashboard
* Mark Attendance
* My Attendance History
* Profile

### Manager

* Login
* Dashboard
* All Employees Attendance
* Team Calendar View
* Reports

---

## Database Schema

### Users

| Field      | Type   | Description           |
| ---------- | ------ | --------------------- |
| id         | string | Unique identifier     |
| name       | string | User's name           |
| email      | string | User email            |
| password   | string | Hashed password       |
| role       | string | employee/manager      |
| employeeId | string | Unique employee ID    |
| department | string | Department name       |
| createdAt  | Date   | Account creation date |

### Attendance

| Field        | Type     | Description                  |
| ------------ | -------- | ---------------------------- |
| id           | string   | Unique identifier            |
| userId       | string   | Reference to user            |
| date         | Date     | Attendance date              |
| checkInTime  | DateTime | Check-in time                |
| checkOutTime | DateTime | Check-out time               |
| status       | string   | present/absent/late/half-day |
| totalHours   | number   | Total hours worked           |
| createdAt    | Date     | Record creation date         |

---

## API Endpoints

### Auth

* `POST /api/auth/register` → Register user
* `POST /api/auth/login` → Login
* `GET /api/auth/me` → Get current user

### Attendance (Employee)

* `POST /api/attendance/checkin` → Check in
* `POST /api/attendance/checkout` → Check out
* `GET /api/attendance/my-history` → My attendance
* `GET /api/attendance/my-summary` → Monthly summary
* `GET /api/attendance/today` → Today's status

### Attendance (Manager)

* `GET /api/attendance/all` → All employees
* `GET /api/attendance/employee/:id` → Specific employee
* `GET /api/attendance/summary` → Team summary
* `GET /api/attendance/export` → Export CSV
* `GET /api/attendance/today-status` → Who's present today

### Dashboard

* `GET /api/dashboard/employee` → Employee stats
* `GET /api/dashboard/manager` → Manager stats

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/subhashinivellaturi/employee-attendance-system.git
cd employee-attendance-system
```

### 2. Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Create `.env` file

Copy the example `.env.example` and configure your environment variables:

```bash
cp .env.example .env
```

**Example `.env` variables:**

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the project

#### Backend

```bash
cd backend
npm run dev
```

#### Frontend

```bash
cd frontend
npm start
```

### 5. Seed data (sample users and attendance)

```bash
cd backend
node seed.js
```

---



---

## License

MIT License

---

✅ **Deliverables included in the repo**

1. `README.md` (with setup, run instructions, environment variables, and screenshots)
2. `.env.example`
3. Clean project code
4. Seed data for testing
5. Working application


