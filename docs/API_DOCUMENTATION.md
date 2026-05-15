# 📡 API Documentation - Smart Hospital Management System

**Base URL:** `http://localhost:5000/api`

All protected routes require: `Authorization: Bearer <jwt_token>`

---

## Authentication (`/api/auth`)

### POST `/api/auth/register`
Register a new user (patient or doctor).

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "role": "patient",
  "phone": "+91 98765 43210",
  "date_of_birth": "1990-01-15",
  "gender": "male",
  "blood_group": "B+"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful!",
  "data": {
    "token": "eyJ...",
    "user": { "id": "uuid", "email": "...", "role": "patient" }
  }
}
```

---

### POST `/api/auth/login`
Login with email and password.

**Body:**
```json
{ "email": "user@example.com", "password": "password123" }
```

---

### GET `/api/auth/me` 🔒
Get current authenticated user profile.

---

### PUT `/api/auth/profile` 🔒
Update user profile (name, phone, avatar).

---

### PUT `/api/auth/change-password` 🔒
Change password.

**Body:**
```json
{ "current_password": "old123", "new_password": "new456" }
```

---

## Doctors (`/api/doctors`)

### GET `/api/doctors`
List all doctors (public).

**Query params:** `page`, `limit`, `department`, `search`, `is_available`

---

### GET `/api/doctors/:id`
Get doctor by ID (public).

---

### GET `/api/doctors/profile/me` 🔒 (Doctor only)
Get own doctor profile.

---

### PUT `/api/doctors/profile` 🔒 (Doctor only)
Update doctor profile.

**Body:**
```json
{
  "specialization": "Cardiology",
  "experience_years": 10,
  "consultation_fee": 800,
  "bio": "Experienced cardiologist...",
  "education": "MBBS, MD Cardiology"
}
```

---

### PUT `/api/doctors/availability` 🔒 (Doctor only)
Update availability schedule.

**Body:**
```json
{
  "is_available": true,
  "availability": [
    {
      "day_of_week": "monday",
      "start_time": "09:00",
      "end_time": "17:00",
      "slot_duration": 30,
      "is_available": true
    }
  ]
}
```

---

### GET `/api/doctors/analytics/stats` 🔒 (Doctor only)
Get doctor analytics.

---

### GET `/api/doctors/my/patients` 🔒 (Doctor only)
Get list of doctor's patients.

---

## Appointments (`/api/appointments`)

### GET `/api/appointments` 🔒
Get appointments (filtered by role).

**Query params:** `page`, `limit`, `status`, `date`

---

### POST `/api/appointments` 🔒 (Patient only)
Book a new appointment.

**Body:**
```json
{
  "doctor_id": "uuid",
  "appointment_date": "2024-12-25",
  "appointment_time": "10:00",
  "reason": "Chest pain",
  "type": "regular"
}
```

---

### GET `/api/appointments/slots/:doctorId` 🔒
Get available time slots for a doctor.

**Query params:** `date` (required, format: YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": [
    { "time": "09:00", "available": true },
    { "time": "09:30", "available": false }
  ]
}
```

---

### GET `/api/appointments/today` 🔒
Get today's appointments.

---

### GET `/api/appointments/:id` 🔒
Get single appointment details.

---

### PUT `/api/appointments/:id/status` 🔒 (Doctor/Admin)
Update appointment status.

**Body:**
```json
{ "status": "confirmed", "notes": "Optional doctor notes" }
```

**Valid statuses:** `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`, `no_show`

---

### DELETE `/api/appointments/:id` 🔒
Cancel appointment.

---

## Prescriptions (`/api/prescriptions`)

### GET `/api/prescriptions` 🔒
Get prescriptions (filtered by role).

---

### POST `/api/prescriptions` 🔒 (Doctor only)
Create a prescription.

**Body:**
```json
{
  "appointment_id": "uuid",
  "patient_id": "uuid",
  "diagnosis": "Hypertension",
  "medicines": [
    {
      "name": "Amlodipine",
      "dosage": "5mg",
      "frequency": "Once daily",
      "duration": "30 days"
    }
  ],
  "instructions": "Take after meals",
  "follow_up_date": "2024-01-15",
  "notes": "Monitor blood pressure"
}
```

---

### GET `/api/prescriptions/:id` 🔒
Get single prescription.

---

### PUT `/api/prescriptions/:id` 🔒 (Doctor only)
Update prescription.

---

## Payments (`/api/payments`)

### GET `/api/payments` 🔒
Get bills (filtered by role).

---

### POST `/api/payments` 🔒 (Doctor/Admin)
Create a bill.

**Body:**
```json
{
  "appointment_id": "uuid",
  "patient_id": "uuid",
  "items": [
    { "description": "Consultation Fee", "amount": 800 },
    { "description": "Lab Tests", "amount": 500 }
  ],
  "discount": 100,
  "notes": "Insurance covered"
}
```

---

### PUT `/api/payments/:id/pay` 🔒
Process payment.

**Body:**
```json
{
  "payment_method": "upi",
  "transaction_id": "TXN123456"
}
```

**Payment methods:** `cash`, `card`, `upi`, `insurance`, `online`

---

## Notifications (`/api/notifications`)

### GET `/api/notifications` 🔒
Get user notifications.

### PUT `/api/notifications/read-all` 🔒
Mark all as read.

### PUT `/api/notifications/:id/read` 🔒
Mark single notification as read.

### DELETE `/api/notifications/:id` 🔒
Delete notification.

---

## Queue (`/api/queue`)

### GET `/api/queue/:doctorId` 🔒
Get doctor's queue for a date.

**Query params:** `date` (optional, defaults to today)

---

### GET `/api/queue/position/:appointmentId` 🔒
Get patient's queue position.

**Response:**
```json
{
  "success": true,
  "data": {
    "token_code": "T003",
    "token_number": 3,
    "status": "waiting",
    "position": 2,
    "people_ahead": 1,
    "estimated_wait_minutes": 15
  }
}
```

---

### PUT `/api/queue/:tokenId/status` 🔒 (Doctor/Admin)
Update queue token status.

---

### POST `/api/queue/:doctorId/next` 🔒 (Doctor/Admin)
Call next patient in queue.

---

## Reports (`/api/reports`)

### GET `/api/reports` 🔒
Get patient reports.

### POST `/api/reports` 🔒 (Patient only)
Upload a report (multipart/form-data).

**Form fields:** `file`, `title`, `description`, `report_type`

### DELETE `/api/reports/:id` 🔒
Delete a report.

---

## Admin (`/api/admin`) 🔒 (Admin only)

### GET `/api/admin/dashboard`
Get dashboard statistics.

### GET `/api/admin/revenue`
Get revenue analytics.

### GET `/api/admin/doctors`
Get all doctors with user info.

### PUT `/api/admin/users/:id/toggle-status`
Activate/deactivate a user.

### GET `/api/admin/departments`
Get all departments.

### POST `/api/admin/departments`
Create a department.

### GET `/api/admin/beds`
Get bed availability.

### PUT `/api/admin/beds/:id`
Update bed status.

### GET `/api/admin/emergency`
Get emergency cases.

### POST `/api/admin/emergency`
Create emergency case.

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found |
| 409 | Conflict - Duplicate entry |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error |
