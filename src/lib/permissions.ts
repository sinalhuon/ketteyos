/**
 * Permission utility functions
 * This file contains helper functions for checking and managing user permissions
 */

import { prisma } from '@/lib/prisma';

// Permission constants
export const PERMISSIONS = {
    // Users
    USERS_VIEW: 'users.view',
    USERS_CREATE: 'users.create',
    USERS_EDIT: 'users.edit',
    USERS_DELETE: 'users.delete',

    // Templates
    TEMPLATES_VIEW: 'templates.view',
    TEMPLATES_CREATE: 'templates.create',
    TEMPLATES_EDIT: 'templates.edit',
    TEMPLATES_DELETE: 'templates.delete',

    // Assets
    ASSETS_VIEW: 'assets.view',
    ASSETS_UPLOAD: 'assets.upload',
    ASSETS_DELETE: 'assets.delete',

    // Events
    EVENTS_VIEW_ALL: 'events.view_all',
    EVENTS_DELETE: 'events.delete',

    // Admins
    ADMINS_MANAGE: 'admins.manage',
} as const;

/**
 * Check if a user is a super admin
 */
export async function isSuperAdmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { isSuperAdmin: true, role: true }
    });

    return user?.isSuperAdmin === true || user?.role === 'SUPER_ADMIN';
}

/**
 * Check if a user has a specific permission
 * Super admins automatically have all permissions
 */
export async function hasPermission(userId: string, permissionName: string): Promise<boolean> {
    // Super admins have all permissions
    if (await isSuperAdmin(userId)) {
        return true;
    }

    // Check if user has the specific permission
    const permission = await prisma.userPermission.findFirst({
        where: {
            userId,
            permission: { name: permissionName },
            granted: true
        }
    });

    return permission !== null;
}

/**
 * Check if a user has any of the specified permissions
 */
export async function hasAnyPermission(userId: string, permissionNames: string[]): Promise<boolean> {
    // Super admins have all permissions
    if (await isSuperAdmin(userId)) {
        return true;
    }

    const permission = await prisma.userPermission.findFirst({
        where: {
            userId,
            permission: { name: { in: permissionNames } },
            granted: true
        }
    });

    return permission !== null;
}

/**
 * Get all permissions for a user
 */
export async function getUserPermissions(userId: string) {
    const userPermissions = await prisma.userPermission.findMany({
        where: {
            userId,
            granted: true
        },
        include: {
            permission: true
        }
    });

    return userPermissions.map(up => up.permission);
}

/**
 * Get all available permissions grouped by category
 */
export async function getAllPermissions() {
    const permissions = await prisma.permission.findMany({
        orderBy: [
            { category: 'asc' },
            { name: 'asc' }
        ]
    });

    // Group by category
    const grouped: Record<string, typeof permissions> = {};

    for (const permission of permissions) {
        if (!grouped[permission.category]) {
            grouped[permission.category] = [];
        }
        grouped[permission.category].push(permission);
    }

    return grouped;
}

/**
 * Grant permissions to a user
 */
export async function grantPermissions(userId: string, permissionIds: string[]) {
    const operations = permissionIds.map(permissionId =>
        prisma.userPermission.upsert({
            where: {
                userId_permissionId: {
                    userId,
                    permissionId
                }
            },
            update: { granted: true },
            create: {
                userId,
                permissionId,
                granted: true
            }
        })
    );

    await prisma.$transaction(operations);
}

/**
 * Revoke permissions from a user
 */
export async function revokePermissions(userId: string, permissionIds: string[]) {
    await prisma.userPermission.deleteMany({
        where: {
            userId,
            permissionId: { in: permissionIds }
        }
    });
}

/**
 * Set exact permissions for a user (replaces all existing permissions)
 */
export async function setUserPermissions(userId: string, permissionIds: string[]) {
    await prisma.$transaction(async (tx) => {
        // Remove all existing permissions
        await tx.userPermission.deleteMany({
            where: { userId }
        });

        // Add new permissions
        if (permissionIds.length > 0) {
            await tx.userPermission.createMany({
                data: permissionIds.map(permissionId => ({
                    userId,
                    permissionId,
                    granted: true
                }))
            });
        }
    });
}
