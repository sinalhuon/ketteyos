import { NextResponse } from 'next/server';

export async function GET() {
    // CSV template
    const csv = `Name,Email,Phone Number
John Doe,john@example.com,+1234567890
Jane Smith,jane@example.com,+0987654321`;

    return new NextResponse(csv, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="guest-template.csv"',
        },
    });
}
