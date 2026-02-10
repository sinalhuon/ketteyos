import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { isSuperAdmin, setUserPermissions } from '@/lib/permissions';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const updateAdminSchema = z.object({
    name: z.string().optional(),
    role: z.enum(['ADMIN', 'SUPER_ADMIN']).optional(),
    isSuperAdmin: z.boolean().optional(),
    permissionIds: z.array(z.string()).optional(),
});

/**
 * GET /api/admin/admins/[id]
 * Get admin details
 */
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const admin = await prisma.user.findUnique({
            where: { id },
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
            }
        });

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({
            admin: {
                ...admin,
                permissions: admin.permissions.map(p => p.permission)
            }
        });

    } catch (error) {
        console.error('[API] Get admin error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * PATCH /api/admin/admins/[id]
 * Update admin permissions
 */
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only super admins can update admin permissions
        const isSuper = await isSuperAdmin(session.userId);
        if (!isSuper) {
            return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const result = updateAdminSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error }, { status: 400 });
        }

        const { name, role, isSuperAdmin: isSuper2, permissionIds } = result.data;

        // Check if admin exists
        const admin = await prisma.user.findUnique({
            where: { id }
        });

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        // Update admin with permissions
        const updatedAdmin = await prisma.$transaction(async (tx) => {
            // Update basic info
            const updated = await tx.user.update({
                where: { id },
                data: {
                    ...(name !== undefined && { name }),
                    ...(role !== undefined && { role }),
                    ...(isSuper2 !== undefined && { isSuperAdmin: isSuper2 }),
                }
            });

            // Update permissions if provided (only for non-super admins)
            if (permissionIds !== undefined && !updated.isSuperAdmin) {
                // Remove all existing permissions
                await tx.userPermission.deleteMany({
                    where: { userId: id }
                });

                // Add new permissions
                if (permissionIds.length > 0) {
                    await tx.userPermission.createMany({
                        data: permissionIds.map(permissionId => ({
                            userId: id,
                            permissionId,
                            granted: true
                        }))
                    });
                }
            }

            // Fetch updated user with permissions
            return await tx.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isSuperAdmin: true,
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            });
        });

        return NextResponse.json({ success: true, admin: updatedAdmin });

    } catch (error) {
        console.error('[API] Update admin error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/admins/[id]
 * Delete admin user
 */
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Only super admins can delete admins
        const isSuper = await isSuperAdmin(session.userId);
        if (!isSuper) {
            return NextResponse.json({ error: 'Forbidden: Super admin access required' }, { status: 403 });
        }

        const { id } = await params;

        // Cannot delete yourself
        if (id === session.userId) {
            return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
        }

        // Delete admin
        await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('[API] Delete admin error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
