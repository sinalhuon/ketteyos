# ⚠️ CRITICAL: DO THIS BEFORE RESTARTING YOUR APP

Your server is accessible again, but **DO NOT restart the app yet** or it will crash immediately.

## Step 1: Stop the App (if running)

1. Go to **cPanel > Setup Node.js App**
2. Find your application
3. Click **Stop App** (if it's running)

## Step 2: Add Thread Limit

1. Click **Edit** on your application
2. Scroll to **Environment Variables**
3. Click **Add Variable**
4. Add these:
   - **Name:** `UV_THREADPOOL_SIZE`
   - **Value:** `1`
5. Click **Save**

## Step 3: Restart

1. Click **Restart Application**
2. Wait 30 seconds
3. Test your website

## Why This Works

- `UV_THREADPOOL_SIZE=1` tells Node.js to use only 1 worker thread instead of 4-8
- This keeps you under the shared hosting process limit
- Your app will be slightly slower but **won't crash**

## Alternative: Consider VPS Hosting

If you need better performance, shared hosting may not be suitable for Node.js apps. Consider:
- VPS (Virtual Private Server)
- DigitalOcean Droplet
- AWS Lightsail
- Vercel/Railway (for Next.js specifically)
