import {
    Battambang,
    Cinzel,
    Content,
    Cormorant_Garamond,
    Great_Vibes,
    Hanuman,
    Inter,
    Lato,
    Libre_Baskerville,
    Montserrat,
    Poppins,
    Playfair_Display,
    Preahvihear,
    Siemreap,
    Suwannaphum,
} from 'next/font/google';
import localFont from 'next/font/local';

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-template-playfair',
});

const greatVibes = Great_Vibes({
    weight: '400',
    subsets: ['latin'],
    variable: '--font-template-great-vibes',
});

const lato = Lato({
    weight: ['300', '400', '700'],
    subsets: ['latin'],
    variable: '--font-template-lato',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-template-inter',
});

const cinzel = Cinzel({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    variable: '--font-template-cinzel',
});

const cormorantGaramond = Cormorant_Garamond({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    variable: '--font-template-cormorant-garamond',
});

const libreBaskerville = Libre_Baskerville({
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-template-libre-baskerville',
});

const montserrat = Montserrat({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    variable: '--font-template-montserrat',
});

const poppins = Poppins({
    weight: ['400', '500', '600', '700', '800'],
    subsets: ['latin'],
    variable: '--font-template-poppins',
});

const battambang = Battambang({
    weight: ['100', '300', '400', '700', '900'],
    subsets: ['khmer', 'latin'],
    variable: '--font-template-battambang',
});

const content = Content({
    weight: ['400', '700'],
    subsets: ['khmer'],
    variable: '--font-template-content',
});

const hanuman = Hanuman({
    weight: ['100', '300', '400', '700', '900'],
    subsets: ['khmer', 'latin'],
    variable: '--font-template-hanuman',
});

const preahvihear = Preahvihear({
    weight: '400',
    subsets: ['khmer', 'latin'],
    variable: '--font-template-preahvihear',
});

const siemreap = Siemreap({
    weight: '400',
    subsets: ['khmer'],
    variable: '--font-template-siemreap',
});

const suwannaphum = Suwannaphum({
    weight: ['100', '300', '400', '700', '900'],
    subsets: ['khmer', 'latin'],
    variable: '--font-template-suwannaphum',
});

const moul = localFont({
    src: '../../public/assets/fonts/Moul-Regular.ttf',
    variable: '--font-template-moul',
});

const koulen = localFont({
    src: '../../public/assets/fonts/Koulen-Regular.ttf',
    variable: '--font-template-koulen',
});

const kantumruy = localFont({
    src: [
        { path: '../../public/assets/fonts/KantumruyPro-Regular.ttf', weight: '400', style: 'normal' },
        { path: '../../public/assets/fonts/KantumruyPro-SemiBold.ttf', weight: '600', style: 'normal' },
        { path: '../../public/assets/fonts/KantumruyPro-Bold.ttf', weight: '700', style: 'normal' },
    ],
    variable: '--font-template-kantumruy',
});

const taprom = localFont({
    src: '../../public/assets/fonts/Taprom-Regular.ttf',
    variable: '--font-template-taprom',
});

export const templateFontVariables = [
    playfair.variable,
    greatVibes.variable,
    lato.variable,
    inter.variable,
    cinzel.variable,
    cormorantGaramond.variable,
    libreBaskerville.variable,
    montserrat.variable,
    poppins.variable,
    battambang.variable,
    content.variable,
    hanuman.variable,
    preahvihear.variable,
    siemreap.variable,
    suwannaphum.variable,
    moul.variable,
    koulen.variable,
    kantumruy.variable,
    taprom.variable,
].join(' ');

const FONT_MAP: Record<string, string> = {
    'Playfair Display, serif': 'var(--font-template-playfair), serif',
    'Great Vibes, cursive': 'var(--font-template-great-vibes), cursive',
    'Lato, sans-serif': 'var(--font-template-lato), sans-serif',
    'Inter, sans-serif': 'var(--font-template-inter), sans-serif',
    'Cinzel, serif': 'var(--font-template-cinzel), serif',
    'Cormorant Garamond, serif': 'var(--font-template-cormorant-garamond), serif',
    'Libre Baskerville, serif': 'var(--font-template-libre-baskerville), serif',
    'Montserrat, sans-serif': 'var(--font-template-montserrat), sans-serif',
    'Poppins, sans-serif': 'var(--font-template-poppins), sans-serif',
    'Battambang, sans-serif': 'var(--font-template-battambang), sans-serif',
    'Content, serif': 'var(--font-template-content), serif',
    'Hanuman, serif': 'var(--font-template-hanuman), serif',
    'Moul, serif': 'var(--font-template-moul), serif',
    'Preahvihear, sans-serif': 'var(--font-template-preahvihear), sans-serif',
    'Koulen, sans-serif': 'var(--font-template-koulen), sans-serif',
    'Kantumruy Pro, sans-serif': 'var(--font-template-kantumruy), sans-serif',
    'Taprom, serif': 'var(--font-template-taprom), serif',
    'Siemreap, sans-serif': 'var(--font-template-siemreap), sans-serif',
    'Suwannaphum, serif': 'var(--font-template-suwannaphum), serif',
    // Short key aliases
    'Moul': 'var(--font-template-moul), serif',
    'Koulen': 'var(--font-template-koulen), sans-serif',
    'Battambang': 'var(--font-template-battambang), sans-serif',
    'Content': 'var(--font-template-content), serif',
    'Hanuman': 'var(--font-template-hanuman), serif',
    'Preahvihear': 'var(--font-template-preahvihear), sans-serif',
    'Kantumruy Pro': 'var(--font-template-kantumruy), sans-serif',
    'Taprom': 'var(--font-template-taprom), serif',
    'Siemreap': 'var(--font-template-siemreap), sans-serif',
    'Suwannaphum': 'var(--font-template-suwannaphum), serif',
    'Playfair Display': 'var(--font-template-playfair), serif',
    'Great Vibes': 'var(--font-template-great-vibes), cursive',
    'Lato': 'var(--font-template-lato), sans-serif',
    'Inter': 'var(--font-template-inter), sans-serif',
    'Cinzel': 'var(--font-template-cinzel), serif',
    'Montserrat': 'var(--font-template-montserrat), sans-serif',
    'Poppins': 'var(--font-template-poppins), sans-serif',
};

export const headingFontChoices = [
    { label: 'Playfair Display', value: 'Playfair Display, serif' },
    { label: 'Cinzel', value: 'Cinzel, serif' },
    { label: 'Cormorant Garamond', value: 'Cormorant Garamond, serif' },
    { label: 'Great Vibes', value: 'Great Vibes, cursive' },
    { label: 'Inter', value: 'Inter, sans-serif' },
    { label: 'Libre Baskerville', value: 'Libre Baskerville, serif' },
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
    { label: 'Poppins', value: 'Poppins, sans-serif' },
];

export const bodyFontChoices = [
    { label: 'Lato', value: 'Lato, sans-serif' },
    { label: 'Inter', value: 'Inter, sans-serif' },
    { label: 'Libre Baskerville', value: 'Libre Baskerville, serif' },
    { label: 'Kantumruy Pro', value: 'Kantumruy Pro, sans-serif' },
    { label: 'Montserrat', value: 'Montserrat, sans-serif' },
    { label: 'Poppins', value: 'Poppins, sans-serif' },
];

export const khmerFontChoices = [
    { label: 'Koulen', value: 'Koulen, sans-serif' },
    { label: 'Moul', value: 'Moul, serif' },
    { label: 'Taprom', value: 'Taprom, serif' },
    { label: 'Kantumruy Pro', value: 'Kantumruy Pro, sans-serif' },
    { label: 'Battambang', value: 'Battambang, sans-serif' },
    { label: 'Content', value: 'Content, serif' },
    { label: 'Hanuman', value: 'Hanuman, serif' },
    { label: 'Preahvihear', value: 'Preahvihear, sans-serif' },
    { label: 'Siemreap', value: 'Siemreap, sans-serif' },
    { label: 'Suwannaphum', value: 'Suwannaphum, serif' },
];

export function resolveTemplateFontFamily(fontValue?: string | null, fallback = 'Inter, sans-serif') {
    if (!fontValue) return FONT_MAP[fallback] || fallback;
    if (FONT_MAP[fontValue]) return FONT_MAP[fontValue];
    const key = Object.keys(FONT_MAP).find(k => k.toLowerCase().includes(fontValue.toLowerCase()) || fontValue.toLowerCase().includes(k.split(',')[0].toLowerCase()));
    if (key) return FONT_MAP[key];
    return fontValue;
}

type TemplateFontConfig = {
    typography?: Record<string, string | null | undefined>;
    pages?: Record<string, { typography?: Record<string, string | null | undefined> }>;
};

export function getTemplateFontFamilies(templateConfig?: TemplateFontConfig) {
    const pageIntroTypo = templateConfig?.pages?.intro?.typography;
    const typography = { ...(templateConfig?.typography || {}), ...(pageIntroTypo || {}) };
    const englishHeading = resolveTemplateFontFamily(
        typography.englishHeadingFont || typography.headingFont,
        'Playfair Display, serif'
    );
    const englishBody = resolveTemplateFontFamily(
        typography.englishBodyFont || typography.bodyFont,
        'Lato, sans-serif'
    );
    const khmerHeading = resolveTemplateFontFamily(
        typography.khmerHeadingFont || typography.khmerFont,
        'Kantumruy Pro, sans-serif'
    );
    const khmerBody = resolveTemplateFontFamily(
        typography.khmerBodyFont || typography.khmerFont,
        'Kantumruy Pro, sans-serif'
    );
    const englishButton = resolveTemplateFontFamily(
        typography.englishButtonFont || typography.englishHeadingFont || typography.headingFont,
        'Playfair Display, serif'
    );
    const englishH1 = resolveTemplateFontFamily(
        typography.englishH1Font || typography.englishHeadingFont || typography.headingFont,
        'Playfair Display, serif'
    );
    const englishH2 = resolveTemplateFontFamily(
        typography.englishH2Font || typography.englishHeadingFont || typography.headingFont,
        'Playfair Display, serif'
    );
    const englishH3 = resolveTemplateFontFamily(
        typography.englishH3Font || typography.englishHeadingFont || typography.headingFont,
        'Playfair Display, serif'
    );
    const khmerButton = resolveTemplateFontFamily(
        typography.khmerButtonFont || typography.khmerBodyFont || typography.khmerFont,
        'Kantumruy Pro, sans-serif'
    );
    const khmerH1 = resolveTemplateFontFamily(
        typography.khmerH1Font || typography.khmerHeadingFont || typography.khmerFont,
        'Kantumruy Pro, sans-serif'
    );
    const khmerH2 = resolveTemplateFontFamily(
        typography.khmerH2Font || typography.khmerHeadingFont || typography.khmerFont,
        'Kantumruy Pro, sans-serif'
    );
    const khmerH3 = resolveTemplateFontFamily(
        typography.khmerH3Font || typography.khmerHeadingFont || typography.khmerFont,
        'Kantumruy Pro, sans-serif'
    );

    return {
        heading: englishHeading,
        body: englishBody,
        button: englishButton,
        h1: englishH1,
        h2: englishH2,
        h3: englishH3,
        khmer: khmerHeading,
        khmerHeading,
        khmerBody,
        khmerButton,
        khmerH1,
        khmerH2,
        khmerH3,
    };
}
