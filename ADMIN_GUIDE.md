# Admin Management Guide

## Accessing Admin Dashboard

### Admin Login
1. Go to: `https://ketteyos.com/login`
2. Use admin credentials:
   - **Email**: `admin@admin.com`
   - **Password**: `admin123` (change this immediately!)

### Admin Dashboard URL
After login, you'll be redirected to: `https://ketteyos.com/admin/dashboard`

**Direct link**: `https://ketteyos.com/admin/dashboard` (requires admin login)

---

## Admin Dashboard Features

### Available Pages
- **Overview** (`/admin/dashboard`) - System statistics and recent events
- **Client Management** (`/admin/users`) - View all registered users
- **Global Assets** (`/admin/assets`) - Manage background music and images
- **Templates** (`/admin/templates`) - Manage invitation templates

---

## Creating New Admin Users

### Method 1: Via phpMyAdmin (Recommended for Production)

1. **Go to phpMyAdmin** in cPanel
2. **Select your database**
3. **Click SQL tab**
4. **Run this SQL** (replace with your details):

```sql
-- Create new admin user
INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `createdAt`)
VALUES (
    UUID(),
    'youradmin@example.com',
    '$2a$10$YourHashedPasswordHere',
    'Admin Name',
    'ADMIN',
    NOW()
);
```

5. **Generate password hash**:
   - Use the password hash generator below
   - Or use: https://bcrypt-generator.com (10 rounds)

### Method 2: Using Seed Script (Local Development)

1. **Edit** `prisma/seed.ts`
2. **Add new admin**:

```typescript
const newAdmin = await prisma.user.upsert({
    where: { email: 'newadmin@example.com' },
    update: {},
    create: {
        email: 'newadmin@example.com',
        password: await bcrypt.hash('SecurePassword123!', 10),
        name: 'New Admin',
        role: 'ADMIN',
    },
});
```

3. **Run seed**:
```bash
npx prisma db seed
```

---

## Quick SQL Scripts

### 1. Create Admin User (Manual)

```sql
-- Step 1: Generate UUID (run this first)
SELECT UUID();

-- Step 2: Insert admin (use UUID from step 1)
INSERT INTO `User` (`id`, `email`, `password`, `name`, `role`, `createdAt`)
VALUES (
    'paste-uuid-here',
    'admin2@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhqG', -- password: admin123
    'Second Admin',
    'ADMIN',
    NOW()
);
```

### 2. Change Admin Password

```sql
-- Update password for admin@admin.com
UPDATE `User`
SET `password` = '$2a$10$NewHashedPasswordHere'
WHERE `email` = 'admin@admin.com';
```

### 3. Promote User to Admin

```sql
-- Make existing user an admin
UPDATE `User`
SET `role` = 'ADMIN'
WHERE `email` = 'user@example.com';
```

### 4. List All Admins

```sql
-- View all admin users
SELECT `id`, `email`, `name`, `createdAt`
FROM `User`
WHERE `role` = 'ADMIN';
```

### 5. Demote Admin to Client

```sql
-- Remove admin privileges
UPDATE `User`
SET `role` = 'CLIENT'
WHERE `email` = 'admin@example.com';
```

---

## Password Hash Generator

### Using Node.js (Local)

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YourPassword', 10, (err, hash) => console.log(hash));"
```

### Using Online Tool
1. Go to: https://bcrypt-generator.com
2. Enter your password
3. Set **Rounds**: 10
4. Copy the hash
5. Use in SQL INSERT statement

---

## Security Best Practices

### 1. Change Default Password Immediately
```sql
UPDATE `User`
SET `password` = '$2a$10$YourNewHashHere'
WHERE `email` = 'admin@admin.com';
```

### 2. Use Strong Passwords
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Example: `Admin@Secure2024!`

### 3. Limit Admin Accounts
- Only create admins when necessary
- Remove unused admin accounts

### 4. Regular Password Updates
- Change admin passwords every 90 days
- Never share admin credentials

---

## Common Admin Tasks

### View All Users
Go to: `/admin/users`

### View System Stats
Go to: `/admin/dashboard`

### Manage Templates
Go to: `/admin/templates`

### Add Background Music
Go to: `/admin/assets` → Click "Add Asset"

---

## Troubleshooting

### Can't Access Admin Dashboard
1. **Check role**: Run SQL to verify role is 'ADMIN'
```sql
SELECT `email`, `role` FROM `User` WHERE `email` = 'your@email.com';
```

2. **Clear browser cache** and login again

3. **Check session**: Logout and login again

### Forgot Admin Password
1. **Reset via phpMyAdmin**:
```sql
UPDATE `User`
SET `password` = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhqG'
WHERE `email` = 'admin@admin.com';
-- Password is now: admin123
```

2. **Login** with temporary password
3. **Change password** immediately

---

## Quick Reference

| Task | URL | SQL |
|------|-----|-----|
| Admin Login | `/login` | - |
| Admin Dashboard | `/admin/dashboard` | - |
| User Management | `/admin/users` | - |
| Create Admin | - | `INSERT INTO User ... role='ADMIN'` |
| Change Password | - | `UPDATE User SET password=...` |
| List Admins | - | `SELECT * FROM User WHERE role='ADMIN'` |

---

## Default Admin Credentials

**⚠️ CHANGE THESE IMMEDIATELY IN PRODUCTION!**

- **Email**: `admin@admin.com`
- **Password**: `admin123`
- **Dashboard**: `https://ketteyos.com/admin/dashboard`
