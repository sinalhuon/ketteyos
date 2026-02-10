import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = forgotPasswordSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }

        const { email } = result.data;

        // Find user
        const user = await prisma.user.findUnique({ where: { email } });

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If that email exists, a reset link has been sent.'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

        // Save token to database
        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });

        // TODO: Send email with reset link
        // For now, log to console
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
        console.log('Password reset link:', resetUrl);
        console.log('Token expires at:', resetTokenExpiry);

        return NextResponse.json({
            success: true,
            message: 'If that email exists, a reset link has been sent.',
            // Remove this in production - only for development
            ...(process.env.NODE_ENV === 'development' && { resetUrl })
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
