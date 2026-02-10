import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isSuperAdmin } from '@/lib/permissions';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const createAdminSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    role: z.enum(['ADMIN', 'SUPER_ADMIN']).default('ADMIN'),
    isSuperAdmin: z.boolean().default(false),
    permissionIds: z.array(z.string()).optional(),
});

/**
 * GET /api/admin/users
 * List all admin users
 */
export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only super admins can view all admins
        const isSuper = await isSuperAdmin(session.userId);
        if (!isSuper) {
            return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { role: 'ADMIN' },
                    { role: 'SUPER_ADMIN' }
                ]
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isSuperAdmin: true,
                createdAt: true,
                createdBy: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                permissions: {
                    where: { granted: true },
                    include: {
                        permission: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Format response
        const formattedUsers = users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isSuperAdmin: user.isSuperAdmin,
            createdAt: user.createdAt,
            createdBy: user.createdBy,
            permissions: user.permissions.map(p => p.permission)
        }));

        return NextResponse.json({ users: formattedUsers });

    } catch (error) {
        console.error('[API] Get users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * POST /api/admin/users
 * Create a new admin user
 */
export async function POST(request: Request) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only super admins can create admins
        const isSuper = await isSuperAdmin(session.userId);
        if (!isSuper) {
            return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 });
        }

        const body = await request.json();
        const result = createAdminSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error }, { status: 400 });
        }

        const { email, password, name, role, isSuperAdmin: isSuper2, permissionIds } = result.data;

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin user with permissions
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: isSuper2 ? 'SUPER_ADMIN' : role,
                isSuperAdmin: isSuper2,
                createdById: session.userId,
                // Add permissions if provided (only for non-super admins)
                ...(permissionIds && permissionIds.length > 0 && !isSuper2 && {
                    permissions: {
                        create: permissionIds.map(permissionId => ({
                            permissionId,
                            granted: true
                        }))
                    }
                })
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isSuperAdmin: true,
                createdAt: true,
                permissions: {
                    include: {
                        permission: true
                    }
                }
            }
        });

        return NextResponse.json({ success: true, user: newUser }, { status: 201 });

    } catch (error) {
        console.error('[API] Create user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
