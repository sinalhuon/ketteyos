# 🚀 Vercel Deployment with Postgres - Step by Step

## Phase 1: Initial Deployment (5 minutes)

### Step 1: Go to Vercel
1. Open https://vercel.com
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### Step 2: Import Your Repository
1. Click **"Add New..."** → **"Project"**
2. Find **"ketteyos"** in the list
3. Click **"Import"**

### Step 3: Configure Environment Variables
Click **"Environment Variables"** and add these:

```
DATABASE_URL = postgresql://temp:temp@localhost:5432/temp
AUTH_SECRET = local-dev-secret-key-change-me
NEXT_PUBLIC_BASE_URL = https://ketteyos.vercel.app
```

> Note: The DATABASE_URL is temporary. We'll fix it in Phase 2.

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes ☕
3. You'll see "Congratulations!" when done

**Expected:** Deployment succeeds but database won't work yet.

---

## Phase 2: Set Up Vercel Postgres (2 minutes)

### Step 1: Create Database
1. In Vercel Dashboard → Click **"Storage"** tab
2. Click **"Create Database"**
3. Choose **"Postgres"**
4. Database name: `ketteyos-db`
5. Region: Choose closest to you (e.g., Singapore)
6. Click **"Create"**

### Step 2: Connect to Project
1. After creation, click **"Connect Project"**
2. Select your **"ketteyos"** project
3. Click **"Connect"**

Vercel automatically adds these environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← **This is the one we need**
- `POSTGRES_URL_NON_POOLING`

### Step 3: Update DATABASE_URL
1. Go to **Settings** → **Environment Variables**
2. Find `DATABASE_URL`
3. Click **"Edit"**
4. Copy the value from `POSTGRES_PRISMA_URL`
5. Paste it into `DATABASE_URL`
6. Click **"Save"**

---

## Phase 3: Update Code for PostgreSQL (5 minutes)

### Step 1: Update Prisma Schema
Open `prisma/schema.prisma` and change:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "mysql"
  url      = env("DATABASE_URL")
}
```

### Step 2: Create Migration
```bash
cd /Volumes/SAMSUNG1TB/FLutter_project/Ketteyuos/invitation-app

# Create new migration for PostgreSQL
npx prisma migrate dev --name switch_to_postgres
```

### Step 3: Push to GitHub
```bash
git add .
git commit -m "Switch to PostgreSQL for Vercel deployment"
git push
```

**Vercel will auto-deploy!** 🎉

---

## Phase 4: Initialize Database (2 minutes)

### Step 1: Run Migrations on Production
In your terminal:

```bash
# Set the production DATABASE_URL temporarily
export DATABASE_URL="[paste POSTGRES_PRISMA_URL from Vercel]"

# Run migrations
npx prisma migrate deploy

# Seed the database
npx prisma db seed
```

### Step 2: Verify Deployment
1. Go to your Vercel deployment URL
2. Try to login with admin credentials
3. Test creating an event

---

## 🎯 Your Live URLs

After deployment:
- **App:** `https://ketteyos.vercel.app`
- **Admin:** `https://ketteyos.vercel.app/admin`
- **Login:** `https://ketteyos.vercel.app/login`

---

## 📋 Quick Reference

### Environment Variables (Final)
```
DATABASE_URL = [from POSTGRES_PRISMA_URL]
AUTH_SECRET = local-dev-secret-key-change-me
NEXT_PUBLIC_BASE_URL = https://ketteyos.vercel.app
```

### Admin Login (After Seeding)
```
Email: admin@admin.com
Password: admin123
```

---

## ⚠️ Troubleshooting

### "Build failed"
- Check Vercel build logs
- Ensure all TypeScript errors are fixed
- Run `npm run build` locally first

### "Database connection failed"
- Verify `DATABASE_URL` matches `POSTGRES_PRISMA_URL`
- Check database is in same region as deployment
- Ensure migrations ran successfully

### "Page not found"
- Clear Vercel cache and redeploy
- Check routes exist in `src/app/`

---

## 🎉 Success Checklist

- [ ] Deployed to Vercel
- [ ] Vercel Postgres created
- [ ] Environment variables updated
- [ ] Code updated to PostgreSQL
- [ ] Migrations deployed
- [ ] Database seeded
- [ ] Admin login works
- [ ] Can create events

---

**Need help?** Let me know which phase you're on!
