import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({})

async function main() {
    console.log('🌱 Starting database seed...');

    // Create default permissions
    console.log('📋 Creating permissions...');

    const defaultPermissions = [
        // Users
        { name: 'users.view', category: 'users', description: 'View all users' },
        { name: 'users.create', category: 'users', description: 'Create new users' },
        { name: 'users.edit', category: 'users', description: 'Edit user details' },
        { name: 'users.delete', category: 'users', description: 'Delete users' },

        // Templates
        { name: 'templates.view', category: 'templates', description: 'View templates' },
        { name: 'templates.create', category: 'templates', description: 'Create templates' },
        { name: 'templates.edit', category: 'templates', description: 'Edit templates' },
        { name: 'templates.delete', category: 'templates', description: 'Delete templates' },

        // Assets
        { name: 'assets.view', category: 'assets', description: 'View assets' },
        { name: 'assets.upload', category: 'assets', description: 'Upload new assets' },
        { name: 'assets.delete', category: 'assets', description: 'Delete assets' },

        // Events
        { name: 'events.view_all', category: 'events', description: 'View all user events' },
        { name: 'events.delete', category: 'events', description: 'Delete any event' },

        // Admins
        { name: 'admins.manage', category: 'admins', description: 'Manage admin users and permissions' },
    ];

    for (const perm of defaultPermissions) {
        await prisma.permission.upsert({
            where: { name: perm.name },
            update: {},
            create: perm
        });
    }
    console.log(`✅ Created ${defaultPermissions.length} permissions`);

    // Create Super Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: { isSuperAdmin: true, role: 'SUPER_ADMIN' },
        create: {
            email: 'admin@admin.com',
            password: adminPassword,
            name: 'Super Owner',
            role: 'SUPER_ADMIN',
            isSuperAdmin: true,
        },
    });
    console.log('✅ Created Super Admin:', admin.email);

    // Create Test Admin User (matching production)
    const testAdminPassword = await bcrypt.hash('admin123', 10);
    const testAdmin = await prisma.user.upsert({
        where: { email: 'sinalhuon@gmail.com' },
        update: { isSuperAdmin: true, role: 'SUPER_ADMIN' },
        create: {
            email: 'sinalhuon@gmail.com',
            password: testAdminPassword,
            name: 'Sinal Huon',
            role: 'SUPER_ADMIN',
            isSuperAdmin: true,
        },
    });
    console.log('✅ Created Test Super Admin:', testAdmin.email);

    // Create Test Client User
    const clientPassword = await bcrypt.hash('client123', 10);
    const client = await prisma.user.upsert({
        where: { email: 'client@test.com' },
        update: {},
        create: {
            email: 'client@test.com',
            password: clientPassword,
            name: 'Test Client',
            role: 'CLIENT',
        },
    });
    console.log('✅ Created Test Client:', client.email);

    // Templates
    const templates = [
        {
            codeKey: 'premium-gold',
            name: 'Premium Gold Book',
            description: 'Luxurious gold falling effect with 3D book opening.',
            category: 'Wedding',
            previewUrl: '/preview-gold.jpg'
        },
        {
            codeKey: 'classic-white',
            name: 'Classic White',
            description: 'Elegant white theme with subtle animations.',
            category: 'Wedding',
            previewUrl: '/preview-white.jpg'
        },
        {
            codeKey: 'modern-minimal',
            name: 'Modern Minimal',
            description: 'Clean and modern design with smooth transitions.',
            category: 'Wedding',
            previewUrl: '/preview-minimal.jpg'
        },
        {
            codeKey: 'birthday-celebration',
            name: 'Birthday Celebration',
            description: 'Fun and colorful birthday theme with confetti.',
            category: 'Birthday',
            previewUrl: '/preview-birthday.jpg'
        }
    ];

    for (const template of templates) {
        await prisma.template.upsert({
            where: { codeKey: template.codeKey },
            update: {},
            create: template
        });
    }
    console.log('✅ Created', templates.length, 'templates');

    // Global Assets
    const assets = [
        {
            name: 'Romantic Piano',
            type: 'MUSIC',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        },
        {
            name: 'Wedding March',
            type: 'MUSIC',
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
        }
    ];

    // Clear existing assets first
    await prisma.globalAsset.deleteMany({});

    for (const asset of assets) {
        await prisma.globalAsset.create({ data: asset });
    }
    console.log('✅ Created', assets.length, 'global assets');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📝 Login Credentials:');
    console.log('   Super Admin: admin@admin.com / admin123');
    console.log('   Test Super Admin: sinalhuon@gmail.com / admin123');
    console.log('   Client: client@test.com / client123');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Seed failed:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
