# Quick Fix: Admin Access Issue

## Problem
After changing a user's role to 'ADMIN' in the database, accessing `/admin/dashboard` still redirects to `/dashboard`.

## Why This Happens
The session cookie stores the user's role when they login. If you change the role in the database directly, the old session still has the old role (`CLIENT`).

## Solution

### Step 1: Logout
1. Go to your website
2. Click **Logout** button
3. This clears the old session cookie

### Step 2: Login Again
1. Go to `https://ketteyos.com/login`
2. Login with your admin credentials:
   - Email: `sinalhuon@gmail.com`
   - Password: (your password)

### Step 3: Access Admin Dashboard
After login, you'll be automatically redirected to:
`https://ketteyos.com/admin/dashboard`

---

## Alternative: Clear Browser Cookies

If logout doesn't work:

1. **Open DevTools** (F12)
2. **Go to Application tab** → Cookies
3. **Delete the `session` cookie**
4. **Refresh the page**
5. **Login again**

---

## For Future Admin Creation

To avoid this issue, always create admin users BEFORE they register:

1. **Create admin in database** (using SQL)
2. **User registers** with that email
3. **They login** → Automatically get admin access

OR

1. **User registers normally**
2. **Promote to admin** in database
3. **User logs out and logs in again** → Gets admin access

---

## Verify Admin Access

After logging in, check:
- URL should be `/admin/dashboard`
- Sidebar should show "Admin Portal"
- You should see admin menu items

If still redirected to `/dashboard`, check:
1. Database role is 'ADMIN' (not 'admin' or 'Admin')
2. Session cookie was cleared
3. No browser cache issues
