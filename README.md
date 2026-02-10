# Ketteyuos - Wedding Invitation Platform

A modern, beautiful wedding invitation platform built with Next.js, Prisma, and PostgreSQL.

## 🚀 Live Demo

Visit: https://ketteyos.vercel.app

## Features

- ✨ Beautiful invitation templates
- 📱 Mobile-responsive design
- 🎵 Background music support
- 📸 Photo album galleries
- 👥 Guest list management
- 📊 RSVP tracking
- 🎨 Customizable themes

## Tech Stack

- **Framework:** Next.js 15
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Authentication:** JWT

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev
npx prisma db seed

# Run development server
npm run dev
```

Visit http://localhost:3000

## Login Credentials

**Admin:**
- Email: admin@admin.com
- Password: admin123

**Client:**
- Email: client@test.com
- Password: client123

## Deployment

This app is configured for automatic deployment to Vercel.

Every push to `main` branch triggers a new deployment.

## License

MIT
