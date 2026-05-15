# 🚀 How to Start Smart Hospital

## One-time Database Setup
Run this in Supabase SQL Editor (only needed once):
```
database/feedback.sql
```

---

## Start Backend (Terminal 1)
```cmd
cd "e:\New folder (2)\Downloads\Smart Hospital Management System\backend"
npm run dev
```
Runs on: http://localhost:5000

---

## Start Patient Portal (Terminal 2)
```cmd
cd "e:\New folder (2)\Downloads\Smart Hospital Management System\frontend"
npm run dev:patient
```
Opens: **http://localhost:5173**
Login as: `patient@demo.com` / `demo123`

---

## Start Doctor Portal (Terminal 3)
```cmd
cd "e:\New folder (2)\Downloads\Smart Hospital Management System\frontend"
npm run dev:doctor
```
Opens: **http://localhost:5151**
Login as: `doctor@demo.com` / `demo123`

---

## Features

### Doctor Portal (5151)
1. Login → Appointments
2. Click **Confirm** on a pending appointment
3. Click **Start + Timer** → 30-minute countdown appears bottom-right
4. Timer turns amber at 5 min, red at 2 min, shows "Time's up!" at 0
5. Click **Complete** on timer OR on the appointment card
6. Click **Prescribe** to add medicines during consultation

### Patient Portal (5173)
1. Login → My Appointments
2. Completed appointments show a ⭐ **Rate** button
3. Click it → star rating modal (1-5 stars + optional comment)
4. Submit → doctor's rating auto-updates in database
5. Already-rated appointments show your rating inline

### Portal Separation
- Doctors logging in on port 5173 are auto-redirected to 5151
- Patients logging in on port 5151 are auto-redirected to 5173
- Login page shows links to both portals at the bottom
