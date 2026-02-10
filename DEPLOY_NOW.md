# ✅ Vercel Deployment Checklist

## 🎯 Current Status: READY TO DEPLOY

Your code is prepared and pushed to GitHub!

---

## 📋 Phase 1: Deploy to Vercel (NOW)

### Step 1: Go to Vercel
- Open: https://vercel.com
- Sign in with GitHub

### Step 2: Import Repository
- Click "Add New..." → "Project"
- Select "ketteyos"
- Click "Import"

### Step 3: Add Environment Variables
Add these 3 variables:

```
DATABASE_URL = postgresql://temp:temp@localhost:5432/temp
AUTH_SECRET = local-dev-secret-key-change-me  
NEXT_PUBLIC_BASE_URL = https://ketteyos.vercel.app
```

> ⚠️ DATABASE_URL is temporary - we'll fix it in Phase 2

### Step 4: Deploy
- Click "Deploy"
- Wait 2-3 minutes ☕

---

## 📋 Phase 2: Create Vercel Postgres (AFTER DEPLOYMENT)

### Step 1: Create Database
- In Vercel Dashboard → "Storage" tab
- Click "Create Database"
- Choose "Postgres"
- Name: `ketteyos-db`
- Region: Singapore (or closest)
- Click "Create"

### Step 2: Connect to Project
- Click "Connect Project"
- Select "ketteyos"
- Click "Connect"

### Step 3: Update DATABASE_URL
- Go to Settings → Environment Variables
- Find `POSTGRES_PRISMA_URL` (auto-created)
- Copy its value
- Edit `DATABASE_URL`
- Paste the `POSTGRES_PRISMA_URL` value
- Save

### Step 4: Redeploy
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"

---

## 📋 Phase 3: Initialize Database

Run these commands in your terminal:

```bash
# Get the POSTGRES_PRISMA_URL from Vercel
# Copy it from: Settings → Environment Variables → POSTGRES_PRISMA_URL

# Set it temporarily
export DATABASE_URL="paste_postgres_url_here"

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

---

## 🎉 Done! Test Your App

Visit your live app:
- **Homepage:** https://ketteyos.vercel.app
- **Admin Login:** https://ketteyos.vercel.app/login
  - Email: `admin@admin.com`
  - Password: `admin123`

---

## ⚠️ Important Notes

1. **First deployment will fail to connect to DB** - This is expected! Fix it in Phase 2.
2. **POSTGRES_PRISMA_URL vs POSTGRES_URL** - Use PRISMA version (has connection pooling)
3. **Migrations** - Must run `prisma migrate deploy` on production database
4. **Seed data** - Run `prisma db seed` to create admin user and templates

---

## 🆘 Need Help?

- **Build fails:** Check Vercel build logs
- **Database errors:** Verify DATABASE_URL is correct
- **404 errors:** Check routes exist in src/app/
- **Can't login:** Ensure database is seeded

---

**Ready?** Start with Phase 1 now! 🚀
