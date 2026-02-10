const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Determine paths
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'deployment');
const nextDir = path.join(rootDir, '.next');
const publicDir = path.join(rootDir, 'public');
const prismaDir = path.join(rootDir, 'prisma');

console.log('🚀 Preparing for Shared Hosting Deployment...');

// 1. Clean previous deployment
if (fs.existsSync(distDir)) {
    console.log('🧹 Cleaning previous deployment...');
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// 2. Build the application
console.log('🏗️  Building Next.js application...');
try {
    // Provide a dummy MySQL URL to satisfy Prisma schema validation during build
    // This allows `next build` to proceed even if no local DB is running,
    // provided we don't have static pages trying to fetch data at build time.
    const env = { ...process.env, DATABASE_URL: 'mysql://dummy:dummy@localhost:3306/dummy' };
    execSync('npm run build', { stdio: 'inherit', cwd: rootDir, env });
} catch (error) {
    console.error('❌ Build failed!');
    process.exit(1);
}

// 3. Copy Standalone Output
console.log('📦 Copying standalone build...');
const standaloneDir = path.join(nextDir, 'standalone');
if (!fs.existsSync(standaloneDir)) {
    console.error('❌ Standalone build not found! Ensure "output: \'standalone\'" is in next.config.ts');
    process.exit(1);
}

// Recursive copy function
function copyRecursiveSync(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

copyRecursiveSync(standaloneDir, distDir);

// 4. Copy Static Assets (.next/static -> .next/static)
console.log('🎨 Copying static assets...');
const destNextDir = path.join(distDir, '.next');
if (!fs.existsSync(destNextDir)) fs.mkdirSync(destNextDir);
copyRecursiveSync(path.join(nextDir, 'static'), path.join(destNextDir, 'static'));

// 5. Copy Public Directory
console.log('📂 Copying public directory...');
copyRecursiveSync(publicDir, path.join(distDir, 'public'));

// 6. Copy Prisma (for schema/migrations)
console.log('🗄️  Copying Prisma configuration...');
copyRecursiveSync(prismaDir, path.join(distDir, 'prisma'));

// 7. Create server entry wrapper (optional, for cPanel usually 'server.js' is fine)
// Standalone creates 'server.js', so we are good.

// 8. Copy package-lock.json (for consistent installs on server)
if (fs.existsSync(path.join(rootDir, 'package-lock.json'))) {
    console.log('🔒 Copying package-lock.json...');
    fs.copyFileSync(path.join(rootDir, 'package-lock.json'), path.join(distDir, 'package-lock.json'));
}

// 9. Bundle into ZIP file
console.log('🤐 Zipping deployment package (excluding node_modules)...');
try {
    // Zip the CONTENTS of the deployment folder BUT EXCLUDE node_modules
    // cPanel/CloudLinux wants to manage node_modules itself.
    // Also, Mac binary modules won't work on Linux anyway.
    execSync('cd deployment && zip -r ../deployment.zip . -x "node_modules/*"', { stdio: 'inherit', cwd: rootDir });
    console.log('✅ Success! Created deployment.zip');
    console.log('👉 Upload "deployment.zip" to your hosting File Manager and extract it.');
    console.log('👉 DELETE any existing "node_modules" folder on the server before extracting if re-deploying.');
} catch (error) {
    console.error('❌ Zip failed! You may need to zip the "deployment" folder manually (exclude node_modules).');
}

console.log('----------------------------------------');
console.log('✅ DONE. Ready to upload.');
