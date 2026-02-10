// Event type definitions and utilities

export const EVENT_TYPES = {
    wedding: {
        value: 'wedding',
        label: 'ពិធីមង្គលការ',
        detailTitle: 'សិរីមង្គលអាពាហ៍ពិពាហ៍'
    },
    birthday: {
        value: 'birthday',
        label: 'ពិធីខូបកំណើត',
        detailTitle: 'ពិធីខូបកំណើត'
    },
    housewarming: {
        value: 'housewarming',
        label: 'ពិធីឡើងគេហដ្ឋានថ្មី',
        detailTitle: 'ពិធីឡើងគេហដ្ឋានថ្មី'
    },
    other: {
        value: 'other',
        label: 'ផ្សេងៗ',
        detailTitle: 'ពិធី'
    }
} as const;

export type EventType = keyof typeof EVENT_TYPES;

/**
 * Get event type label for dropdown
 */
export function getEventTypeLabel(type: EventType): string {
    return EVENT_TYPES[type]?.label || EVENT_TYPES.other.label;
}

/**
 * Get event title for invitation detail page
 */
export function getEventDetailTitle(type: EventType): string {
    return EVENT_TYPES[type]?.detailTitle || EVENT_TYPES.other.detailTitle;
}

/**
 * Get all event types for dropdown
 */
export function getAllEventTypes() {
    return Object.values(EVENT_TYPES);
}
