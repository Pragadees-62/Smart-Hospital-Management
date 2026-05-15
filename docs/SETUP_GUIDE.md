# 🛠️ Setup Guide - Smart Hospital Management System

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18+ | [nodejs.org](https://nodejs.org) |
| npm | 9+ | Included with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com) |
| Supabase Account | Free | [supabase.com](https://supabase.com) |

---

## Step 1: Supabase Setup

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Choose your organization
4. Enter project name: `smart-hospital`
5. Set a strong database password (save it!)
6. Select region closest to you
7. Click **"Create new project"** and wait ~2 minutes

### 1.2 Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy and paste the contents of `database/schema.sql`
4. Click **"Run"** (Ctrl+Enter)
5. You should see "Success. No rows returned"

### 1.3 Run Seed Data (Optional but Recommended)
1. Create another new query
2. Copy and paste `database/seed_data.sql`
3. Click **"Run"**
4. This creates demo accounts for testing

### 1.4 Get API Keys
1. Go to **Settings → API**
2. Copy:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
   - **service_role key** (starts with `eyJ...`) - Keep this secret!

---

## Step 2: Backend Setup

### 2.1 Install Dependencies
```bash
cd backend
npm install
```

### 2.2 Configure Environment
Create/edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development

# JWT - Generate a strong random string
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=7d

# Supabase (from Step 1.4)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Email (optional - for email notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### 2.3 Start Backend
```bash
npm run dev
```

You should see:
```
🏥 ================================
   Smart Hospital Management System
================================
✅ Server running on port 5000
🌍 Environment: development
📡 API URL: http://localhost:5000
🔗 Health: http://localhost:5000/health
================================
```

### 2.4 Verify Backend
Open [http://localhost:5000/health](http://localhost:5000/health) - should return:
```json
{
  "success": true,
  "message": "🏥 Smart Hospital API is running!"
}
```

---

## Step 3: Frontend Setup

### 3.1 Install Dependencies
```bash
cd frontend
npm install
```

### 3.2 Configure Environment
Create/edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3.3 Start Frontend
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Step 4: Test the Application

### Demo Login Credentials
| Role | Email | Password |
|------|-------|----------|
| Patient | patient@demo.com | demo123 |
| Doctor | doctor@demo.com | demo123 |
| Admin | admin@demo.com | demo123 |

### Test Flow
1. **Login as Patient** → Book an appointment → Check queue token
2. **Login as Doctor** → Confirm appointment → Create prescription
3. **Login as Admin** → View dashboard analytics → Manage queue

---

## Troubleshooting

### "Cannot connect to Supabase"
- Check your `SUPABASE_URL` and keys in `.env`
- Ensure the Supabase project is active (not paused)

### "CORS error"
- Ensure `FRONTEND_URL=http://localhost:5173` in backend `.env`
- Restart the backend after changing `.env`

### "JWT_SECRET is not defined"
- Make sure `backend/.env` exists and has `JWT_SECRET` set

### "Email not sending"
- Email is non-blocking - the app works without it
- For Gmail: Enable 2FA and use App Password, not your regular password

### Port already in use
```bash
# Kill process on port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## Development Commands

```bash
# Backend
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start without auto-restart

# Frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```
