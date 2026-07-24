import { TemplateConfig, LayoutType } from '../types';
import { colorSchemes } from '../styles/colorSchemes';
import { typographyOptions } from '../styles/typography';
import { animationPresets } from '../styles/animations';

export const defaultTemplateConfigs: Record<LayoutType, TemplateConfig> = {
  default: {
    id: 'default',
    name: 'Golden Premium',
    description: 'Elegant gold-themed design with video backgrounds',
    layoutType: 'default',
    colorScheme: colorSchemes.gold,
    typography: typographyOptions.default,
    animations: animationPresets.default,
    openButtonTextColor: '#4A3511',
    background: {
      type: 'video',
      src: '/uploads/video/1770281380424-second_screen.mp4',
      opacity: 0.5,
      blendMode: 'screen'
    },
    arrangement: {
      photoPosition: 'center',
      textAlignment: 'center',
      buttonPosition: 'bottom',
      sectionOrder: ['intro', 'logo', 'title', 'parents', 'couple', 'details', 'venue', 'schedule', 'gallery'],
      spacing: 'normal'
    }
  },

  modern: {
    id: 'modern',
    name: 'Modern Minimal',
    description: 'Clean, contemporary design with geometric elements',
    layoutType: 'modern',
    colorScheme: colorSchemes.modern,
    typography: typographyOptions.modern,
    animations: animationPresets.modern,
    background: {
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      opacity: 1
    },
    arrangement: {
      photoPosition: 'top',
      textAlignment: 'left',
      buttonPosition: 'floating',
      sectionOrder: ['intro', 'title', 'couple', 'details', 'venue', 'schedule', 'gallery'],
      spacing: 'compact'
    }
  },

  traditional: {
    id: 'traditional',
    name: 'Traditional Heritage',
    description: 'Classic wedding aesthetics with ornate decorations',
    layoutType: 'traditional',
    colorScheme: colorSchemes.traditional,
    typography: typographyOptions.traditional,
    animations: animationPresets.traditional,
    background: {
      type: 'video',
      src: '/uploads/video/traditional-background.mp4',
      opacity: 0.4,
      blendMode: 'overlay'
    },
    arrangement: {
      photoPosition: 'center',
      textAlignment: 'center',
      buttonPosition: 'bottom',
      sectionOrder: ['intro', 'logo', 'title', 'parents', 'couple', 'details', 'venue', 'schedule', 'gallery'],
      spacing: 'spacious'
    }
  },

  romantic: {
    id: 'romantic',
    name: 'Romantic Dreams',
    description: 'Soft pastel colors with floral elements',
    layoutType: 'romantic',
    colorScheme: colorSchemes.romantic,
    typography: typographyOptions.romantic,
    animations: animationPresets.romantic,
    background: {
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 50%, #FFC0CB 100%)',
      opacity: 0.8
    },
    arrangement: {
      photoPosition: 'background',
      textAlignment: 'center',
      buttonPosition: 'floating',
      sectionOrder: ['intro', 'title', 'couple', 'details', 'parents', 'venue', 'schedule', 'gallery'],
      spacing: 'normal'
    }
  },

  'movie-ceremony': {
    id: 'movie-ceremony',
    name: 'Movie Ceremony',
    description: 'Cinematic opening with dramatic transitions',
    layoutType: 'movie-ceremony',
    colorScheme: colorSchemes.movie,
    typography: typographyOptions.movie,
    animations: animationPresets.movie,
    background: {
      type: 'video',
      src: '/uploads/video/movie-ceremony.mp4',
      opacity: 0.6,
      blendMode: 'multiply'
    },
    arrangement: {
      photoPosition: 'top',
      textAlignment: 'center',
      buttonPosition: 'side',
      sectionOrder: ['intro', 'title', 'couple', 'details', 'venue', 'schedule', 'gallery'],
      spacing: 'spacious'
    }
  },
  'class-gold': {
    id: 'class-gold',
    name: 'Class Gold',
    description: 'Luxury modern gold design with premium typography',
    layoutType: 'class-gold',
    colorScheme: colorSchemes.gold,
    typography: typographyOptions.traditional,
    animations: animationPresets.traditional,
    openButtonTextColor: '#4A3511',
    background: {
      type: 'video',
      src: '/uploads/video/1770281380424-second_screen.mp4',
      opacity: 0.3,
      blendMode: 'screen'
    },
    arrangement: {
      photoPosition: 'center',
      textAlignment: 'center',
      buttonPosition: 'bottom',
      sectionOrder: ['intro', 'logo', 'title', 'parents', 'couple', 'details', 'venue', 'schedule', 'gallery'],
      spacing: 'normal'
    }
  },
  'golden-grandeur': {
    id: 'golden-grandeur',
    name: 'Golden Grandeur',
    description: 'Grand cinematic gold design that works beautifully for weddings and birthdays',
    layoutType: 'golden-grandeur',
    colorScheme: colorSchemes.gold,
    typography: typographyOptions.traditional,
    animations: animationPresets.traditional,
    openButtonTextColor: '#4A3511',
    background: {
      type: 'video',
      src: '/uploads/video/1770281380424-second_screen.mp4',
      opacity: 0.35,
      blendMode: 'screen'
    },
    arrangement: {
      photoPosition: 'center',
      textAlignment: 'center',
      buttonPosition: 'bottom',
      sectionOrder: ['intro', 'logo', 'title', 'parents', 'couple', 'details', 'venue', 'schedule', 'gallery'],
      spacing: 'spacious'
    }
  },
  'blush-ornate': {
    id: 'blush-ornate',
    name: 'Blush Ornate',
    description: 'Dusty rose ornamental layout inspired by elegant mobile invitation cards',
    layoutType: 'blush-ornate',
    colorScheme: {
      primary: '#F47FB3',
      secondary: '#C57B97',
      accent: '#F6B4C9',
      background: '#8E6A71',
      text: '#FFE7F1',
      textSecondary: 'rgba(255,231,241,0.8)',
      border: 'rgba(244,127,179,0.35)',
      gradient: 'linear-gradient(135deg, #ff9ccc 0%, #f47fb3 45%, #ffd2e4 100%)'
    },
    typography: typographyOptions.romantic,
    animations: animationPresets.romantic,
    openButtonTextColor: '#5F3947',
    showIntroGuestName: true,
    showTransitionOverlay: true,
    showTransitionSaveTheDate: true,
    showTransitionEventTitle: true,
    showTransitionNames: true,
    showTransitionDate: true,
    showTransitionLocation: true,
    background: {
      type: 'pattern',
      opacity: 1
    },
    arrangement: {
      photoPosition: 'center',
      textAlignment: 'center',
      buttonPosition: 'bottom',
      sectionOrder: ['intro', 'title', 'message', 'couple', 'details', 'venue', 'gallery'],
      spacing: 'normal'
    }
  },
  'birthday-balloon': {
    id: 'birthday-balloon',
    name: 'Birthday Balloon',
    description: 'Royal blue birthday invitation with hero photo, gold accents, balloons, and a matching intro-to-transition flow',
    layoutType: 'birthday-balloon',
    colorScheme: {
      primary: '#F4C542',
      secondary: '#1D3E8A',
      accent: '#FFFFFF',
      background: '#10285F',
      text: '#F8FAFF',
      textSecondary: 'rgba(248,250,255,0.78)',
      border: 'rgba(244,197,66,0.42)',
      gradient: 'linear-gradient(135deg, #ffe39c 0%, #f4c542 40%, #c99017 100%)'
    },
    typography: {
      ...typographyOptions.romantic,
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Montserrat, sans-serif',
      khmerFont: 'Kantumruy Pro, sans-serif',
      englishHeadingFont: 'Playfair Display, serif',
      englishBodyFont: 'Montserrat, sans-serif',
      englishButtonFont: 'Montserrat, sans-serif',
      englishH1Font: 'Playfair Display, serif',
      englishH2Font: 'Montserrat, sans-serif',
      englishH3Font: 'Montserrat, sans-serif',
      englishH1SizePx: 50,
      englishH2SizePx: 21,
      englishH3SizePx: 20,
      englishBodySizePx: 18,
      englishButtonSizePx: 19,
      englishH1Style: 'normal',
      englishH2Style: 'bold',
      englishH3Style: 'normal',
      englishBodyStyle: 'normal',
      englishButtonStyle: 'bold',
      khmerHeadingFont: 'Kantumruy Pro, sans-serif',
      khmerBodyFont: 'Kantumruy Pro, sans-serif',
      khmerButtonFont: 'Kantumruy Pro, sans-serif',
      khmerH1Font: 'Kantumruy Pro, sans-serif',
      khmerH2Font: 'Kantumruy Pro, sans-serif',
      khmerH3Font: 'Kantumruy Pro, sans-serif',
      khmerH1SizePx: 46,
      khmerH2SizePx: 24,
      khmerH3SizePx: 21,
      khmerBodySizePx: 18,
      khmerButtonSizePx: 19,
      khmerH1Style: 'bold',
      khmerH2Style: 'bold',
      khmerH3Style: 'normal',
      khmerBodyStyle: 'normal',
      khmerButtonStyle: 'bold',
      headingSize: 'text-4xl md:text-6xl',
      bodySize: 'text-base md:text-lg',
      khmerSize: 'text-xl md:text-2xl',
      letterSpacing: 'normal',
      textShadow: '0 4px 16px rgba(0,0,0,0.35)'
    },
    animations: animationPresets.movie,
    openButtonTextColor: '#10285F',
    showIntroGuestName: true,
    showTransitionOverlay: true,
    showTransitionSaveTheDate: true,
    showTransitionEventTitle: true,
    showTransitionNames: true,
    showTransitionDate: true,
    showTransitionLocation: true,
    background: {
      type: 'pattern',
      opacity: 1
    },
    arrangement: {
      photoPosition: 'top',
      textAlignment: 'center',
      buttonPosition: 'bottom',
      sectionOrder: ['intro', 'hero-photo', 'title', 'details', 'venue', 'gallery'],
      spacing: 'compact'
    }
  },
  'botanical-arch': {
    id: 'botanical-arch',
    name: 'Botanical Arch',
    description: 'Soft lilac floral arch with elegant editorial typography and animated botanicals',
    layoutType: 'botanical-arch',
    colorScheme: {
      primary: '#A889C3',
      secondary: '#C9B1E8',
      accent: '#FFF7FF',
      background: '#F5EFFB',
      text: '#FFF9FF',
      textSecondary: 'rgba(255,249,255,0.82)',
      border: 'rgba(255,255,255,0.4)',
      gradient: 'linear-gradient(135deg, #e0cff5 0%, #b39ad0 45%, #8b739f 100%)'
    },
    typography: {
      ...typographyOptions.romantic,
      headingFont: 'Cormorant Garamond, serif',
      bodyFont: 'Montserrat, sans-serif',
      khmerFont: 'Kantumruy Pro, sans-serif',
      englishHeadingFont: 'Cormorant Garamond, serif',
      englishBodyFont: 'Montserrat, sans-serif',
      englishButtonFont: 'Montserrat, sans-serif',
      englishH1Font: 'Cormorant Garamond, serif',
      englishH2Font: 'Playfair Display, serif',
      englishH3Font: 'Montserrat, sans-serif',
      khmerHeadingFont: 'Moul, serif',
      khmerBodyFont: 'Kantumruy Pro, sans-serif',
      khmerButtonFont: 'Kantumruy Pro, sans-serif',
      khmerH1Font: 'Moul, serif',
      khmerH2Font: 'Koulen, serif',
      khmerH3Font: 'Kantumruy Pro, sans-serif',
      englishH1SizePx: 58,
      englishH2SizePx: 28,
      englishH3SizePx: 21,
      englishBodySizePx: 17,
      englishButtonSizePx: 17,
      khmerH1SizePx: 50,
      khmerH2SizePx: 24,
      khmerH3SizePx: 20,
      khmerBodySizePx: 18,
      khmerButtonSizePx: 18,
      englishH1Style: 'normal',
      englishH2Style: 'normal',
      englishH3Style: 'normal',
      englishBodyStyle: 'normal',
      englishButtonStyle: 'bold',
      khmerH1Style: 'bold',
      khmerH2Style: 'bold',
      khmerH3Style: 'normal',
      khmerBodyStyle: 'normal',
      khmerButtonStyle: 'bold',
      textShadow: '0 8px 24px rgba(126, 95, 153, 0.22)'
    },
    animations: animationPresets.romantic,
    openButtonTextColor: '#5E476F',
    background: {
      type: 'gradient',
      gradient: 'radial-gradient(circle at top, rgba(255,255,255,0.82) 0%, rgba(238,230,248,0.92) 30%, rgba(245,239,251,1) 100%)',
      opacity: 1
    },
    arrangement: {
      photoPosition: 'center',
      textAlignment: 'center',
      buttonPosition: 'bottom',
      sectionOrder: ['intro', 'title', 'parents', 'couple', 'details', 'venue', 'message', 'gallery'],
      spacing: 'spacious'
    }
  },
  'blue-arch': {
    id: 'blue-arch',
    name: 'Blue Arch',
    description: 'Reference-style vertical invitation card positioning with gold arch lines and event icons over a video background',
    layoutType: 'blue-arch',
    colorScheme: {
      primary: '#D3A56F',
      secondary: '#9CBBC9',
      accent: '#EEF7F8',
      background: '#EAF1F1',
      text: '#5F6870',
      textSecondary: 'rgba(95,104,112,0.72)',
      border: 'rgba(211,165,111,0.72)',
      gradient: 'linear-gradient(135deg, #f6d5a6 0%, #d3a56f 100%)'
    },
    typography: {
      ...typographyOptions.romantic,
      headingFont: 'Cormorant Garamond, serif',
      bodyFont: 'Montserrat, sans-serif',
      khmerFont: 'Kantumruy Pro, sans-serif',
      englishHeadingFont: 'Cormorant Garamond, serif',
      englishBodyFont: 'Montserrat, sans-serif',
      englishButtonFont: 'Montserrat, sans-serif',
      englishH1Font: 'Cormorant Garamond, serif',
      englishH2Font: 'Cormorant Garamond, serif',
      englishH3Font: 'Montserrat, sans-serif',
      khmerHeadingFont: 'Moul, serif',
      khmerBodyFont: 'Kantumruy Pro, sans-serif',
      khmerButtonFont: 'Kantumruy Pro, sans-serif',
      khmerH1Font: 'Moul, serif',
      khmerH2Font: 'Moul, serif',
      khmerH3Font: 'Kantumruy Pro, sans-serif',
      englishH1SizePx: 58,
      englishH2SizePx: 28,
      englishH3SizePx: 15,
      englishBodySizePx: 14,
      englishButtonSizePx: 13,
      khmerH1SizePx: 42,
      khmerH2SizePx: 24,
      khmerH3SizePx: 16,
      khmerBodySizePx: 15,
      khmerButtonSizePx: 15,
      englishH1Style: 'normal',
      englishH2Style: 'normal',
      englishH3Style: 'bold',
      englishBodyStyle: 'normal',
      englishButtonStyle: 'bold',
      khmerH1Style: 'bold',
      khmerH2Style: 'bold',
      khmerH3Style: 'normal',
      khmerBodyStyle: 'normal',
      khmerButtonStyle: 'bold',
      textShadow: '0 2px 10px rgba(255,255,255,0.42)'
    },
    animations: animationPresets.romantic,
    openButtonTextColor: '#FFFFFF',
    background: {
      type: 'video',
      opacity: 1,
      blendMode: 'normal'
    },
    arrangement: {
      photoPosition: 'background',
      textAlignment: 'center',
      buttonPosition: 'bottom',
      sectionOrder: ['intro', 'couple', 'details', 'venue', 'message', 'gallery'],
      spacing: 'compact'
    }
  }
};
