interface InvitationPersonaInput {
    eventType?: string | null;
    eventTitle?: string | null;
    groomFirstName?: string | null;
    groomLastName?: string | null;
    brideFirstName?: string | null;
    brideLastName?: string | null;
    groomFatherName?: string | null;
    groomMotherName?: string | null;
    brideFatherName?: string | null;
    brideMotherName?: string | null;
}

type InvitationLanguage = 'en' | 'kh';

export function getPreferredShortName(firstName?: string | null, lastName?: string | null, fallback?: string | null) {
    return firstName || lastName || fallback || '';
}

export function getLocalizedInvitationLabels(eventType?: string | null, language: InvitationLanguage = 'kh') {
    const normalizedEventType = eventType?.toLowerCase().replace(/[-\s]+/g, '_');
    const isBirthday = normalizedEventType === 'birthday';
    const isKnotTying = normalizedEventType === 'knot_tying';
    const isHousewarming = normalizedEventType === 'housewarming' || normalizedEventType === 'new_house' || Boolean(normalizedEventType?.includes('house'));
    const isMoviePremiere = normalizedEventType === 'movie_premiere' || Boolean(normalizedEventType?.includes('movie')) || Boolean(normalizedEventType?.includes('film'));

    if (isBirthday) {
        return {
            eventTitle: language === 'kh' ? 'រីករាយពិធីខួបកំណើត' : 'Birthday Party',
            celebrationLabel: language === 'kh' ? 'រីករាយពិធីខួបកំណើត' : 'Birthday Celebration',
            familyTitle: language === 'kh' ? 'ឪពុកម្តាយ / ក្រុមគ្រួសារ' : 'Parents / Family',
            roleTitle: language === 'kh' ? 'ម្ចាស់ខួបកំណើត' : 'Celebrant',
            venueTitle: language === 'kh' ? 'ទីតាំងកម្មវិធី' : 'Venue',
        };
    }

    if (isKnotTying) {
        return {
            eventTitle: language === 'kh' ? 'ពិធីកាត់ចំណងដៃ' : 'Knot Tying Ceremony',
            celebrationLabel: language === 'kh' ? 'ពិធីកាត់ចំណងដៃ' : 'Knot Tying Celebration',
            familyTitle: language === 'kh' ? 'ឪពុកម្តាយ' : 'Parents',
            roleTitle: language === 'kh' ? 'គូស្វាមីភរិយា' : 'Couple',
            venueTitle: language === 'kh' ? 'ទីតាំងកម្មវិធី' : 'Venue',
        };
    }

    if (isHousewarming) {
        return {
            eventTitle: language === 'kh' ? 'ពិធីឡើងគេហដ្ឋានថ្មី' : 'Housewarming Ceremony',
            celebrationLabel: language === 'kh' ? 'ពិធីឡើងគេហដ្ឋានថ្មី' : 'Housewarming Celebration',
            familyTitle: language === 'kh' ? 'ក្រុមគ្រួសារ' : 'Family',
            roleTitle: language === 'kh' ? 'ម្ចាស់គេហដ្ឋាន' : 'Host',
            venueTitle: language === 'kh' ? 'ទីតាំងគេហដ្ឋាន' : 'New Home',
        };
    }

    if (isMoviePremiere) {
        return {
            eventTitle: language === 'kh' ? 'សម្ភោធខ្សែភាពយន្ត' : 'Movie Premiere',
            celebrationLabel: language === 'kh' ? 'ពិធីសម្ភោធខ្សែភាពយន្ត' : 'Movie Premiere Event',
            familyTitle: language === 'kh' ? 'ផលិតករ / ម្ចាស់កម្មវិធី' : 'Producer / Host',
            roleTitle: language === 'kh' ? 'ផលិតករ / ម្ចាស់កម្មវិធី' : 'Producer / Host',
            venueTitle: language === 'kh' ? 'រោងភាពយន្ត / ទីតាំង' : 'Cinema / Venue',
        };
    }

    return {
        eventTitle: language === 'kh' ? 'សិរីមង្គលអាពាហ៍ពិពាហ៍' : 'Wedding Ceremony',
        celebrationLabel: language === 'kh' ? 'សិរីមង្គលអាពាហ៍ពិពាហ៍' : 'Wedding Celebration',
        familyTitle: language === 'kh' ? 'ឪពុកម្តាយ' : 'Parents',
        roleTitle: language === 'kh' ? 'គូស្វាមីភរិយា' : 'Couple',
        venueTitle: language === 'kh' ? 'ទីតាំងកម្មវិធី' : 'Venue',
    };
}

export function getInvitationPersona(input: InvitationPersonaInput) {
    const normalizedEventType = input.eventType?.toLowerCase().replace(/[-\s]+/g, '_');
    const isBirthday = normalizedEventType === 'birthday';
    const isCouple = normalizedEventType === 'wedding' || normalizedEventType === 'knot_tying';

    const groomParents = [input.groomFatherName, input.groomMotherName].filter(Boolean) as string[];
    const brideParents = [input.brideFatherName, input.brideMotherName].filter(Boolean) as string[];

    const primaryFirstName = getPreferredShortName(input.groomFirstName, input.groomLastName, input.eventTitle);
    const primaryLastName = input.groomLastName || input.brideLastName || '';
    const secondaryFirstName = isCouple ? getPreferredShortName(input.brideFirstName, input.brideLastName) : '';
    const secondaryLastName = isCouple ? (input.brideLastName || '') : '';

    const primaryParents = isBirthday
        ? (groomParents.length > 0 ? groomParents : brideParents)
        : groomParents;
    const secondaryParents = isCouple ? brideParents : [];

    const primaryFullName = [primaryFirstName, primaryLastName].filter(Boolean).join(' ');
    const primaryShortName = input.groomLastName || primaryFirstName;
    const secondaryShortName = isBirthday ? '' : (input.brideLastName || secondaryFirstName);
    const coupleLine = isBirthday
        ? primaryFullName || primaryShortName
        : [primaryShortName, secondaryShortName].filter(Boolean).join(' & ');

    return {
        isBirthday,
        isCouple,
        hasSecondaryPerson: isCouple && Boolean(secondaryFirstName || secondaryLastName),
        primaryFirstName,
        primaryLastName,
        secondaryFirstName,
        secondaryLastName,
        primaryShortName,
        secondaryShortName,
        primaryParents,
        secondaryParents,
        primaryFullName,
        coupleLine,
        inviteEyebrow: isBirthday ? 'To Celebrate The Birthday Of' : isCouple ? 'To The Wedding Of' : 'You Are Invited To',
        unionEyebrow: isBirthday ? 'Birthday Celebration' : isCouple ? 'The Union Of' : 'Hosted By',
        celebrationEyebrow: isBirthday ? 'A Joyful Birthday Celebration' : isCouple ? 'A Grand Ceremony' : 'A Special Ceremony',
        heroTitle: isBirthday ? 'Birthday Celebration' : isCouple ? 'The Wedding Of' : 'Special Event',
        primaryRole: isBirthday ? 'ម្ចាស់ខួបកំណើត' : isCouple ? 'Groom' : 'Host',
        secondaryRole: isCouple ? 'Bride' : '',
        primaryParentsTitle: isBirthday ? 'Parents / Family' : isCouple ? 'Groom Parents' : 'Host / Organizer',
        secondaryParentsTitle: isCouple ? 'Bride Parents' : '',
    };
}
