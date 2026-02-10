# Local Development Database Setup

## Prerequisites

You need MySQL installed locally. Choose one:

### Option 1: Install MySQL (Recommended)
```bash
brew install mysql
brew services start mysql
```

### Option 2: Use MAMP (If you have it)
- Start MAMP
- MySQL runs on port 8889 by default

### Option 3: Use Docker
```bash
docker run --name mysql-dev -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8
```

---

## Setup Steps

### 1. Create Local Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE kettekyu_local;

# Create user (optional, or use root)
CREATE USER 'kettekyu_dev'@'localhost' IDENTIFIED BY 'dev_password';
GRANT ALL PRIVILEGES ON kettekyu_local.* TO 'kettekyu_dev'@'localhost';
FLUSH PRIVILEGES;

# Exit
exit;
```

### 2. Update Local .env

Edit `/Volumes/SAMSUNG1TB/FLutter_project/Ketteyuos/invitation-app/.env`:

```env
# Local MySQL Database
DATABASE_URL="mysql://root:root@localhost:3306/kettekyu_local"

# Or if you created a user:
# DATABASE_URL="mysql://kettekyu_dev:dev_password@localhost:3306/kettekyu_local"

# Auth Secret
AUTH_SECRET="local-dev-secret-key-change-me"

# Base URL for local
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Run Prisma Migrations

```bash
cd /Volumes/SAMSUNG1TB/FLutter_project/Ketteyuos/invitation-app

# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database with admin user and templates
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## Default Admin Credentials

After seeding, you can login with:

- **Email**: `admin@admin.com`
- **Password**: `admin123`

---

## Troubleshooting

### MySQL Connection Error

**Error**: `Can't connect to MySQL server`

**Fix**:
```bash
# Check if MySQL is running
brew services list

# Start MySQL
brew services start mysql

# Or restart
brew services restart mysql
```

### Port Already in Use

**Error**: `Port 3306 already in use`

**Fix**: Change port in DATABASE_URL:
```env
DATABASE_URL="mysql://root:root@localhost:3307/kettekyu_local"
```

### Prisma Client Not Generated

**Error**: `@prisma/client did not initialize`

**Fix**:
```bash
npx prisma generate
```

### Migration Issues

**Error**: `Migration failed`

**Fix**: Reset database and try again:
```bash
npx prisma db push --force-reset
npx prisma db seed
```

---

## Quick Commands

```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma db push --force-reset

# Seed again
npx prisma db seed

# Check database
mysql -u root -p kettekyu_local
```

---

## Testing Workflow

1. **Make changes** to code
2. **Test locally** at `http://localhost:3000`
3. **Verify** everything works
4. **Build** with `node scripts/prepare-hosting.js`
5. **Deploy** to production

This way you never break production! 🎉
