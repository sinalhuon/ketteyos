# Production Database Setup Guide

## 1. Import Database Dump

I have created a SQL dump of your local database named `production_dump.sql` in the project root.

1.  **Download** `production_dump.sql` to your local computer (if you are viewing this on a remote server).
2.  Log in to your **cPanel**.
3.  Open **phpMyAdmin**.
4.  Select your production database: `kettkady_ketteyosDB` from the left sidebar.
5.  Click the **Import** tab at the top.
6.  Choose the `production_dump.sql` file.
7.  Click **Go**.

## 2. Configure Environment Variables

In your cPanel **Setup Node.js App** configuration, ensure the `DATABASE_URL` environment variable is set to:

```
mysql://kettkady_ketteyos:Kettayos168@localhost:3306/kettkady_ketteyosDB
```

(Note: Ensure the password `Kettayos168` is correct and matches what you set for the user `kettkady_ketteyos`).

## 3. Verify

After importing and setting the environment variable, restart your Node.js application in cPanel.
