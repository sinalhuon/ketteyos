# 🚀 Vercel Deployment Guide

## Prerequisites
- GitHub account (free)
- Vercel account (free) - Sign up at https://vercel.com

## Step-by-Step Deployment

### 1. Push Code to GitHub

```bash
# Initialize git (if not already done)
cd /Volumes/SAMSUNG1TB/FLutter_project/Ketteyuos/invitation-app
git init

# Create .gitignore (already exists)
# Add all files
git add .
git commit -m "Initial commit - Kettekyuos Invitation App"

# Create a new repository on GitHub (https://github.com/new)
# Then connect and push:
git remote add origin https://github.com/YOUR_USERNAME/kettekyuos-app.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel Dashboard (Easiest)
1. Go to https://vercel.com
2. Click "Sign Up" (use GitHub to sign in)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"
7. Wait 2-3 minutes ✅ Done!

#### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? kettekyuos-app
# - Directory? ./
# - Override settings? No
```

### 3. Configure Environment Variables

In Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add these variables:

```
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**IMPORTANT:** For production, you'll need to switch from SQLite to PostgreSQL (see below).

### 4. Database Setup (Production)

SQLite doesn't work on Vercel (serverless). You need a hosted database.

#### Option A: Vercel Postgres (Recommended - Free Tier)
1. In Vercel Dashboard → Storage → Create Database
2. Select "Postgres"
3. Copy the `DATABASE_URL` connection string
4. Update Environment Variables with the new `DATABASE_URL`
5. Run migrations:
```bash
# Update your local .env with Vercel Postgres URL
npx prisma migrate deploy
npx prisma db seed
```

#### Option B: Supabase (Free PostgreSQL)
1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Format: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
5. Add to Vercel Environment Variables

#### Option C: Railway (Free $5/month credit)
1. Go to https://railway.app
2. Create PostgreSQL database
3. Copy connection string
4. Add to Vercel Environment Variables

### 5. Update Prisma Schema for Production

Change `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npx prisma migrate dev --name switch_to_postgres
git add .
git commit -m "Switch to PostgreSQL for production"
git push
```

Vercel will auto-deploy on push!

### 6. Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `kettekyuos.com`)
3. Update DNS records as instructed
4. SSL certificate is automatic ✅

---

## 🎉 Your App URLs

- **Production:** `https://kettekyuos-app.vercel.app`
- **Custom Domain:** `https://yourdomain.com` (if configured)

---

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies are in `package.json`
- Fix TypeScript errors

### Database Connection Issues
- Verify `DATABASE_URL` in Environment Variables
- Ensure database is accessible from Vercel's IP ranges
- Check Prisma schema matches database type

### File Uploads Not Working
- Uploaded files are **ephemeral** on Vercel (serverless)
- Solution: Use cloud storage (Cloudinary, AWS S3, Vercel Blob)
- See `FILE_UPLOAD_MIGRATION.md` for guide

---

## Next Steps After Deployment

1. ✅ Test all features on production URL
2. ✅ Create admin account
3. ✅ Upload global assets (music, templates)
4. ✅ Test invitation creation and sharing
5. ✅ Monitor Vercel Analytics

---

## Free Tier Limits

Vercel Free Tier includes:
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments for PRs
- ✅ Serverless functions (12 second timeout)

**You won't hit these limits unless you go viral!** 🚀
