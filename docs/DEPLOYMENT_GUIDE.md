# 🚀 Deployment Guide - Smart Hospital Management System

## Frontend Deployment (Netlify)

### Option A: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build frontend
cd frontend
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Option B: Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"Add new site" → "Import an existing project"**
3. Connect your GitHub repository
4. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
5. Add environment variables:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
6. Click **"Deploy site"**

### Fix React Router (SPA Routing)

Create `frontend/public/_redirects`:
```
/* /index.html 200
```

---

## Backend Deployment (Render)

### Setup

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up/login
3. Click **"New" → "Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name:** `smart-hospital-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

### Environment Variables on Render

Add all variables from `backend/.env`:
```
PORT=10000
NODE_ENV=production
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=https://your-app.netlify.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

> **Note:** Render uses port 10000 by default. The `PORT` env var is set automatically.

### After Deployment

1. Copy your Render backend URL (e.g., `https://smart-hospital-api.onrender.com`)
2. Update Netlify environment variable: `VITE_API_URL=https://smart-hospital-api.onrender.com/api`
3. Update Render environment variable: `FRONTEND_URL=https://your-app.netlify.app`
4. Redeploy both services

---

## Alternative: Railway Deployment

### Backend on Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
cd backend
railway init
railway up
```

---

## Production Checklist

### Security
- [ ] Change `JWT_SECRET` to a strong random string (32+ chars)
- [ ] Set `NODE_ENV=production`
- [ ] Use HTTPS for all URLs
- [ ] Review CORS origins (only allow your frontend URL)
- [ ] Enable Supabase RLS policies

### Performance
- [ ] Enable Supabase connection pooling
- [ ] Set appropriate rate limits
- [ ] Configure CDN for static assets (Netlify does this automatically)

### Monitoring
- [ ] Set up error logging (e.g., Sentry)
- [ ] Monitor Supabase usage in dashboard
- [ ] Set up uptime monitoring (e.g., UptimeRobot)

---

## Environment Variables Summary

### Backend Production
```env
PORT=10000
NODE_ENV=production
JWT_SECRET=<strong-random-32+-char-string>
JWT_EXPIRES_IN=7d
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=hospital@gmail.com
EMAIL_PASS=xxxx-xxxx-xxxx-xxxx
FRONTEND_URL=https://smart-hospital.netlify.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Frontend Production
```env
VITE_API_URL=https://smart-hospital-api.onrender.com/api
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```
