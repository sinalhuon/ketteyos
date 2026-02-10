// Khmer date/time conversion utilities

const KHMER_NUMBERS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];

const KHMER_MONTHS = [
    'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
    'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];

const KHMER_DAYS = [
    'អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'
];

const TIME_PERIODS = {
    morning: 'ព្រឹក',
    afternoon: 'រសៀល',
    evening: 'ល្ងាច',
    night: 'យប់'
};

/**
 * Convert English number to Khmer numerals
 */
export function toKhmerNumber(num: number): string {
    return num.toString().split('').map(digit => KHMER_NUMBERS[parseInt(digit)]).join('');
}

/**
 * Get time period in Khmer based on hour
 */
function getTimePeriod(hour: number): string {
    if (hour >= 5 && hour < 12) return TIME_PERIODS.morning;
    if (hour >= 12 && hour < 17) return TIME_PERIODS.afternoon;
    if (hour >= 17 && hour < 20) return TIME_PERIODS.evening;
    return TIME_PERIODS.night;
}

/**
 * Convert date to full Khmer format
 * Example: "ថ្ងៃអាទិត្យ ទី២៧ ខែកុម្ភះ ឆ្នាំ២០២៦"
 */
export function toKhmerDate(date: Date): string {
    const dayName = KHMER_DAYS[date.getDay()];
    const day = toKhmerNumber(date.getDate());
    const month = KHMER_MONTHS[date.getMonth()];
    const year = toKhmerNumber(date.getFullYear());

    return `ថ្ងៃ${dayName} ទី${day} ខែ${month} ឆ្នាំ${year}`;
}

export function toKhmerTime(date: Date): string {
    const hour = date.getHours();
    const minute = date.getMinutes();

    // Convert to 12-hour format
    const hour12 = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
    const period = getTimePeriod(hour);

    const khmerHour = toKhmerNumber(hour12).padStart(2, '០');
    const khmerMinute = toKhmerNumber(minute).padStart(2, '០');

    return `ម៉ោង ${khmerHour} : ${khmerMinute}នាទី${period}`;
}

/**
 * Parse a time string (e.g., "7:30 AM", "14:30", "2:30 PM") and format it to Khmer
 */
export function parseAndFormatKhmerTime(timeStr: string): string {
    if (!timeStr) return '';

    try {
        // Try to parse standard time formats
        // 1. Check for AM/PM
        const isPM = timeStr.toUpperCase().includes('PM');
        const isAM = timeStr.toUpperCase().includes('AM');

        // Remove spaces and AM/PM for easier parsing
        let cleanTime = timeStr.toUpperCase()
            .replace('AM', '')
            .replace('PM', '')
            .trim();

        const parts = cleanTime.split(/[:. ]/);
        let hour = parseInt(parts[0]);
        let minute = parts.length > 1 ? parseInt(parts[1]) : 0;

        if (isNaN(hour)) return timeStr; // Fallback to original if can't parse

        // Adjust hour based on AM/PM if provided
        if (isPM && hour < 12) hour += 12;
        if (isAM && hour === 12) hour = 0;

        // Create a dummy date object to reuse toKhmerTime logic
        const date = new Date();
        date.setHours(hour, minute);

        return toKhmerTime(date);
    } catch (e) {
        return timeStr; // Fallback
    }
}

/**
 * Generate full Khmer date-time text
 * Example: "ដែលនឹងប្រព្រឹត្តទៅ ចាប់ពីម៉ោង ៥ ល្ងាច\nថ្ងៃអាទិត្យ ទី២៧ ខែកុម្ភះ ឆ្នាំ២០២៦"
 */
export function toKhmerDateTime(date: Date): string {
    const khmerTime = toKhmerTime(date);
    const khmerDate = toKhmerDate(date);

    return `ដែលនឹងប្រព្រឹត្តទៅ ចាប់ពី${khmerTime}\n${khmerDate}`;
}

/**
 * Get separate time and date parts for different styling
 */
export function getKhmerDateTimeParts(date: Date) {
    const khmerTime = toKhmerTime(date);
    const khmerDate = toKhmerDate(date);

    return {
        timePart: `ដែលនឹងប្រព្រឹត្តទៅ ចាប់ពី${khmerTime}`,
        datePart: khmerDate
    };
}

/**
 * Get couple name labels in Khmer
 */
export function getCoupleTitles() {
    return {
        groom: 'កូនប្រុសនាម',
        bride: 'កូនស្រីនាម'
    };
}
