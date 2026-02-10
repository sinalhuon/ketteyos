# Deployment Guide for Shared Hosting (cPanel)

This guide explains how to deploy your Next.js Invitation App to a shared hosting provider using cPanel and Node.js.

## Prerequisites

1.  **Hosting Plan**: Must support **Node.js** (e.g., "Setup Node.js App" in cPanel).
2.  **Domain/Subdomain**: Connected to your hosting.
3.  **Database**: A MySQL database (created via cPanel MySQL Wizard).

## Step 1: Prepare the Package

Run the helper script on your local machine to build and package the application:

```bash
node scripts/prepare-hosting.js
```

This will create a `deployment` folder in your project root.

## Step 2: Upload to Hosting

1.  **Compress**: Zip the contents of the `deployment` folder (select all files inside -> Right Click -> Compress). Name it `app.zip`.
    *   *Do NOT zip the folder itself, zip the CONTENTS.*
2.  **Upload**:
    *   Go to **cPanel > File Manager**.
    *   Navigate to `public_html`.
    *   **Create a folder** (e.g., `invitation-app` or `ketteyos`).
    *   Upload `deployment.zip` into this new folder.
    *   **Extract** `deployment.zip` inside the folder.

## Step 3: Configure Node.js in cPanel

1.  Go to **cPanel > Setup Node.js App**.
2.  Click **Create Application**.
3.  **Node.js Version**: Select **Current** or **v20.x** (must match roughly what you developed on).
4.  **Application Mode**: `Production`.
5.  **Application Root**: `public_html/ketteyos` (or whatever folder you created).
6.  **Application URL**: Select your domain.
7.  **Application Startup File**: Enter `server.js`.
8.  Click **Create**.

## Step 4: Install Dependencies

1.  In the "Setup Node.js App" page, verify the app is created.
2.  Click **Enter to the virtual environment** (copy the command provided, e.g., `source /home/user/nodevenv/...`).
3.  Open **Terminal** in cPanel (or use SSH).
4.  Paste the command to enter the virtual environment.
5.  **Important**: CloudLinux requires `node_modules` to be managed by the virtual environment. If the `node_modules` folder exists from your upload, **you must rename or delete it**:
    ```bash
    rm -rf node_modules
    ```
6.  Run:
    ```bash
    npm install
    ```
    *This installs the necessary dependencies defined in `package.json`.*

## Step 5: Database Setup

1.  **Create Database**:
    *   Go to **cPanel > MySQL® Database Wizard**.
    *   Create a new database (e.g., `myuser_invitation`).
    *   Create a new user (e.g., `myuser_admin`).
    *   Add user to database with **ALL PRIVILEGES**.
    *   **Note down**: Database Name, Username, and Password.

2.  **Configure Environment**:
    *   In **Setup Node.js App**, click **Environment variables**.
    *   Add `DATABASE_URL` with value:
        `mysql://kettkady_ketteyos:YOUR_DB_PASSWORD@localhost:3306/kettkady_kettekyuosDB`
        *(Replace YOUR_DB_PASSWORD with the password you set for the user)*.

3.  **Run Migrations (Manual Way)**:
    *   Since the server has low memory, we cannot run `prisma migrate` there.
    *   I have generated a file named `migration.sql` in your project folder.
    *   Open **cPanel > phpMyAdmin**.
    *   Select your database (`kettkady_kettekyuosDB`) from the left sidebar.
    *   Click the **Import** tab at the top.
    *   Choose the `migration.sql` file from your computer.
    *   Click **Go** (bottom right).
    *   *This will create all the necessary tables instantly without using server memory.*

## Step 6: Restart

1.  Go back to **Setup Node.js App**.
2.  Click **Restart Application**.
3.  Visit your website!

## Troubleshooting

-   **500 Error**: Check `stderr.log` in your application root directory.
-   **Database Connection Error**: Double-check your `DATABASE_URL` in environment variables. Ensure the user has permissions.
-   **Missing Images**: Ensure the `public` folder was uploaded and contains your assets.
