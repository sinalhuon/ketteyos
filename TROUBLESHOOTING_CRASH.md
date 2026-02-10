# CRITICAL: Server Resource Lockout ("Unable to fork")

You are seeing errors like:
- `cagefs_enter: Unable to fork`
- `lve_suwrapper: Unable to fork`
- `You have reached the processes number limit 90 times`

**This means your hosting account has hit its maximum limit of running processes.** The server uses "processes" to do *everything*, including showing you the cPanel dashboard.

## 🛑 YOU CANNOT FIX THIS YOURSELF RIGHT NOW
Because your account is full of "zombie" processes, you cannot start new ones to kill the old ones. It's a deadlock.

## ✅ OPTION 1: THE "WAIT" METHOD (Try this first)
1.  **Close all cPanel tabs.**
2.  **Wait 15-20 minutes.**
3.  Do **NOT** try to load the page.
    *   *Why?* Processes often have a timeout. If you stop poking them, they might die on their own, freeing up space.

## ✅ OPTION 2: CONTACT SUPPORT (Fastest)
If waiting doesn't work, you must contact your hosting support (Live Chat or Ticket).
Copy-paste this message:

> "Hello, my cPanel account is locked with 'Unable to fork' errors because I have hit my max process limit. I cannot access the terminal or Process Manager to kill them. **Please kill all running processes for my user account immediately.**"

---

## 🚀 ONCE UNLOCKED (Prevent it happening again)

**BEFORE** you try to start the app again, you **MUST** reduce resource usage or it will crash instantly:

1.  Go to **cPanel > Setup Node.js App**.
2.  Click **Edit** on your application.
3.  Scroll to **Environment Variables**.
4.  **Add this variable:**
    *   **Name:** `UV_THREADPOOL_SIZE`
    *   **Value:** `1`
5.  **Save**.
6.  **Click Restart Application**.
