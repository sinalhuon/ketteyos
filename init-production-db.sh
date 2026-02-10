#!/bin/bash

# 🗄️ Initialize Vercel Neon Database
# Run this script after your Vercel deployment completes

echo "🗄️  Initializing Ketteyos Database on Vercel Neon"
echo "=================================================="
echo ""

# Get the database URL from Vercel
echo "📋 Step 1: Get your database URL"
echo "Go to: Vercel → Settings → Environment Variables"
echo "Find: POSTGRES_PRISMA_URL"
echo "Copy the full connection string"
echo ""
read -p "Paste your POSTGRES_PRISMA_URL here: " DB_URL

if [ -z "$DB_URL" ]; then
    echo "❌ Error: No database URL provided"
    exit 1
fi

# Set the environment variable
export DATABASE_URL="$DB_URL"

echo ""
echo "✅ Database URL set"
echo ""

# Run migrations
echo "📦 Step 2: Running database migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
    echo "❌ Migration failed!"
    exit 1
fi

echo ""
echo "✅ Migrations completed"
echo ""

# Seed database
echo "🌱 Step 3: Seeding database with initial data..."
npx prisma db seed

if [ $? -ne 0 ]; then
    echo "❌ Seeding failed!"
    exit 1
fi

echo ""
echo "🎉 Database initialized successfully!"
echo ""
echo "📋 What was created:"
echo "  ✅ All database tables (User, Event, Guest, Template, GlobalAsset)"
echo "  ✅ Admin user: admin@admin.com / admin123"
echo "  ✅ Default templates (Premium Gold, Classic Elegance)"
echo "  ✅ Sample music tracks"
echo ""
echo "🚀 Your app is ready!"
echo "Visit: https://ketteyos.vercel.app"
echo "Login: https://ketteyos.vercel.app/login"
echo ""
