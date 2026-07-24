import { toKhmerNumber } from '@/lib/khmer-utils';

type BirthdayInput = Date | string | null | undefined;

function normalizeBirthdayInput(value: BirthdayInput): Date | null {
    if (!value) return null;

    if (value instanceof Date) {
        return new Date(value.getFullYear(), value.getMonth(), value.getDate());
    }

    const trimmed = value.trim();
    if (!trimmed) return null;

    const dateOnlyMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (dateOnlyMatch) {
        const [, year, month, day] = dateOnlyMatch;
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) return null;

    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

export function calculateAge(birthDate: BirthdayInput, referenceDate: BirthdayInput = new Date()): number | null {
    const normalizedBirthDate = normalizeBirthdayInput(birthDate);
    const normalizedReferenceDate = normalizeBirthdayInput(referenceDate);

    if (!normalizedBirthDate || !normalizedReferenceDate) return null;
    if (normalizedBirthDate > normalizedReferenceDate) return null;

    let age = normalizedReferenceDate.getFullYear() - normalizedBirthDate.getFullYear();
    const hasHadBirthdayThisYear =
        normalizedReferenceDate.getMonth() > normalizedBirthDate.getMonth() ||
        (
            normalizedReferenceDate.getMonth() === normalizedBirthDate.getMonth() &&
            normalizedReferenceDate.getDate() >= normalizedBirthDate.getDate()
        );

    if (!hasHadBirthdayThisYear) {
        age -= 1;
    }

    return age >= 0 ? age : null;
}

export function formatAgeLabel(age: number | null, language: 'kh' | 'en' = 'en'): string | null {
    if (age === null) return null;
    return language === 'kh' ? `${toKhmerNumber(age)} ឆ្នាំ` : `${age} years old`;
}
