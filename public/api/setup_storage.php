<?php
// public/api/setup_storage.php
// Run this script ONCE to set up safe, persistent storage for your uploads.

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Storage Setup 🛠️</h1>";

// 1. Define Paths
// __DIR__ is .../public/api
$publicDir = realpath(__DIR__ . '/..'); // .../public
$baseDir = dirname($publicDir); // The directory containing public (e.g. .../invitation-app)
// We want to store uploads ONE LEVEL UP from the public folder so they aren't deleted when you clear 'public'
// If on shared hosting, $baseDir might be your home directory or the parent of public_html
$persistentDir = $baseDir . '/persistent_uploads';
$symlinkPath = $publicDir . '/uploads';

echo "<strong>Base Directory:</strong> " . htmlspecialchars($baseDir) . "<br>";
echo "<strong>Persistent Storage Target:</strong> " . htmlspecialchars($persistentDir) . "<br>";
echo "<strong>Public Link Location:</strong> " . htmlspecialchars($symlinkPath) . "<br><hr>";

// 2. Create Persistent Directory
if (!file_exists($persistentDir)) {
    if (mkdir($persistentDir, 0755, true)) {
        echo "✅ Created persistent directory.<br>";
    } else {
        die("❌ Failed to create persistent directory. Check permissions for $baseDir");
    }
} else {
    echo "ℹ️ Persistent directory already exists.<br>";
}

// 3. Migrate Existing Files (if any)
if (file_exists($symlinkPath) && is_dir($symlinkPath) && !is_link($symlinkPath)) {
    echo "🔄 'uploads' is a normal folder. Migrating files...<br>";

    // Recursive Move Function
    function moveDir($src, $dest)
    {
        $files = scandir($src);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..')
                continue;

            $srcFile = "$src/$file";
            $destFile = "$dest/$file";

            if (is_dir($srcFile)) {
                if (!file_exists($destFile))
                    mkdir($destFile);
                moveDir($srcFile, $destFile);
                rmdir($srcFile);
            } else {
                rename($srcFile, $destFile);
            }
        }
    }

    // Attempt migration
    try {
        moveDir($symlinkPath, $persistentDir);
        echo "✅ Files moved to persistent storage.<br>";

        // Remove the empty old directory
        rmdir($symlinkPath);
        echo "✅ Removed old uploads folder.<br>";

    } catch (Exception $e) {
        die("❌ Error moving files: " . $e->getMessage());
    }
} elseif (is_link($symlinkPath)) {
    echo "ℹ️ 'uploads' is already a symlink. No migration needed.<br>";
}

// 4. Create Symlink
if (!file_exists($symlinkPath)) {
    if (symlink($persistentDir, $symlinkPath)) {
        echo "✅ <strong>SUCCESS!</strong> Symlink created.<br>";
        echo "Files uploaded to <code>public/uploads</code> will now actually save to <code>../persistent_uploads</code>.<br>";
    } else {
        echo "❌ Failed to create symlink. <br>";
        echo "Try creating it manually via SSH: <code>ln -s $persistentDir $symlinkPath</code><br>";
    }
} else {
    if (is_link($symlinkPath)) {
        $linkTarget = readlink($symlinkPath);
        echo "✅ Symlink active! Pointing to: " . htmlspecialchars($linkTarget) . "<br>";
    } else {
        echo "❌ 'uploads' still exists as a regular folder. Migration might have failed.<br>";
    }
}

echo "<hr><a href='/'>Go Home</a>";
?>