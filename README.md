# 🏥 Smart Hospital Management System

A modern, full-stack hospital management platform with real-time features, role-based dashboards, appointment booking, AI symptom checking, billing, live queue tracking, prescriptions, and analytics.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite, Tailwind CSS v4, Framer Motion, Recharts |
| Backend | Node.js + Express.js, JWT Auth, Multer |
| Database | Supabase PostgreSQL |
| Real-time | Supabase Realtime |
| Auth | JWT + bcryptjs |
| Email | Nodemailer (Gmail SMTP) |

---

## 📁 Project Structure

```
smart-hospital-management-system/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express API
├── database/          # SQL schema, seed data, policies
│   ├── schema.sql     # Main database schema
│   ├── seed_data.sql  # Demo data
│   ├── rls-policies.sql
│   ├── triggers.sql
│   └── indexes.sql
├── docs/              # Documentation
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run these files **in order**:
   - `database/schema.sql`
   - `database/seed_data.sql`
   - `database/triggers.sql`
   - `database/indexes.sql`
3. Copy your project URL, anon key, and service role key

### 3. Configure Environment Variables

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Application

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Patient | patient@demo.com | demo123 |
| Doctor | doctor@demo.com | demo123 |
| Admin | admin@demo.com | demo123 |

> **Note:** Run `database/seed_data.sql` to create demo accounts.

---

## 🌟 Features

### Patient Module
- ✅ Dashboard with health summary
- ✅ Book appointments with doctor search & filters
- ✅ Live queue token tracking
- ✅ View & download prescriptions (PDF print)
- ✅ Upload medical reports
- ✅ Payment history & online payment
- ✅ Real-time notifications
- ✅ Profile management

### Doctor Module
- ✅ Dashboard with today's appointments
- ✅ Accept/reject/manage appointments
- ✅ Create prescriptions with medicine details
- ✅ Manage weekly availability schedule
- ✅ View patient history
- ✅ Analytics with charts

### Admin Module
- ✅ Hospital analytics dashboard
- ✅ Manage doctors (activate/deactivate)
- ✅ Manage patients
- ✅ All appointments overview
- ✅ Department management
- ✅ Revenue analytics with charts
- ✅ Emergency case monitoring
- ✅ Live queue management

### Smart Features
- ✅ Real-time queue updates (Supabase Realtime)
- ✅ Real-time notifications
- ✅ Email notifications (appointment confirmation, welcome)
- ✅ Double-booking prevention
- ✅ Time slot generation
- ✅ Queue token system
- ✅ Role-based access control
- ✅ JWT authentication
- ✅ Rate limiting
- ✅ File upload (reports)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/doctors` | List all doctors |
| GET | `/api/appointments/slots/:doctorId` | Get available slots |
| POST | `/api/appointments` | Book appointment |
| GET | `/api/appointments` | Get appointments |
| PUT | `/api/appointments/:id/status` | Update status |
| GET | `/api/prescriptions` | Get prescriptions |
| POST | `/api/prescriptions` | Create prescription |
| GET | `/api/payments` | Get bills |
| PUT | `/api/payments/:id/pay` | Process payment |
| GET | `/api/notifications` | Get notifications |
| GET | `/api/queue/:doctorId` | Get doctor queue |
| POST | `/api/queue/:doctorId/next` | Call next patient |
| GET | `/api/admin/dashboard` | Admin stats |
| GET | `/api/admin/revenue` | Revenue analytics |

---

## 🚀 Deployment

### Frontend (Netlify)

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist/` folder to Netlify
3. Set environment variables in Netlify dashboard:
   - `VITE_API_URL` = your backend URL
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
4. Add `_redirects` file in `public/`:
   ```
   /* /index.html 200
   ```

### Backend (Render)

1. Push backend to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables from `.env`
6. Update `FRONTEND_URL` to your Netlify URL

---

## 🗄️ Database Schema

14 tables with full relationships:

- `users` - Base authentication
- `patients` - Patient profiles
- `doctors` - Doctor profiles
- `admins` - Admin profiles
- `departments` - Hospital departments
- `appointments` - Appointment bookings
- `queue_tokens` - Live queue management
- `prescriptions` - Medical prescriptions
- `billing` - Payment records
- `notifications` - User notifications
- `reports` - Medical reports
- `emergency_cases` - Emergency tracking
- `beds` - Bed availability
- `doctor_availability` - Doctor schedules

---

## 🔒 Security

- JWT authentication with 7-day expiry
- bcrypt password hashing (salt rounds: 12)
- Role-based access control (patient/doctor/admin)
- Rate limiting (100 req/15min, 20 for auth)
- Helmet.js security headers
- CORS configuration
- Input validation (express-validator)
- Row Level Security (Supabase RLS)
- Environment variables for secrets

---

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail
2. Go to Google Account → Security → App Passwords
3. Generate an app password for "Mail"
4. Use that password as `EMAIL_PASS` in `.env`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Built With

- [React](https://react.dev/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Express.js](https://expressjs.com/) - Backend framework
- [Supabase](https://supabase.com/) - Database & real-time
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Recharts](https://recharts.org/) - Charts

---

*Smart Hospital Management System - Making healthcare management smarter* 🏥
