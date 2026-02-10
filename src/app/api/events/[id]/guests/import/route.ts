import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

interface GuestRow {
    Name: string;
    Email?: string;
    'Phone Number'?: string;
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: eventId } = await params;

        // Verify event ownership
        const event = await prisma.event.findFirst({
            where: {
                id: eventId,
                userId: session.userId,
            },
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Get file from form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Read file buffer
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        // Parse file based on extension
        let guests: GuestRow[] = [];
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.csv')) {
            // Parse CSV
            const text = new TextDecoder().decode(uint8Array);
            const lines = text.split('\n').filter(line => line.trim());

            if (lines.length < 2) {
                return NextResponse.json({ error: 'CSV file is empty' }, { status: 400 });
            }

            const headers = lines[0].split(',').map(h => h.trim());

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                const guest: any = {};

                headers.forEach((header, index) => {
                    guest[header] = values[index] || '';
                });

                guests.push(guest);
            }
        } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
            // Parse Excel
            const workbook = XLSX.read(uint8Array, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            guests = XLSX.utils.sheet_to_json(worksheet);
        } else {
            return NextResponse.json({
                error: 'Invalid file format. Please upload CSV or Excel file.'
            }, { status: 400 });
        }

        // Validate and create guests
        const errors: string[] = [];
        const created: any[] = [];

        for (let i = 0; i < guests.length; i++) {
            const row = guests[i];
            const rowNum = i + 2; // +2 because index starts at 0 and header is row 1

            if (!row.Name || !row.Name.trim()) {
                errors.push(`Row ${rowNum}: Name is required`);
                continue;
            }

            try {
                const guest = await prisma.guest.create({
                    data: {
                        name: row.Name.trim(),
                        email: row.Email?.trim() || null,
                        phoneNumber: row['Phone Number']?.trim() || null,
                        eventId: eventId,
                    },
                });
                created.push(guest);
            } catch (error: any) {
                errors.push(`Row ${rowNum}: ${error.message}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Imported ${created.length} guests`,
            created: created.length,
            errors: errors.length > 0 ? errors : undefined,
        });

    } catch (error) {
        console.error('Import error:', error);
        return NextResponse.json({ error: 'Failed to import guests' }, { status: 500 });
    }
}
