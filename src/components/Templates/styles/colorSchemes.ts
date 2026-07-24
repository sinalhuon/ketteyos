import { ColorScheme } from '../types';

export const colorSchemes: Record<string, ColorScheme> = {
  // Current gold theme (default)
  gold: {
    primary: '#EEC573',
    secondary: '#BF953F',
    accent: '#FCF6BA',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    border: 'rgba(238, 197, 115, 0.4)',
    gradient: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728)'
  },

  // Modern theme
  modern: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    background: '#0F172A',
    text: '#F8FAFC',
    textSecondary: 'rgba(248, 250, 252, 0.8)',
    border: 'rgba(99, 102, 241, 0.3)',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },

  // Traditional theme
  traditional: {
    primary: '#D4AF37',
    secondary: '#B8860B',
    accent: '#F0E68C',
    background: '#1A1A1A',
    text: '#FFF8DC',
    textSecondary: 'rgba(255, 248, 220, 0.85)',
    border: 'rgba(212, 175, 55, 0.4)',
    gradient: 'linear-gradient(to right, #D4AF37, #F0E68C, #B8860B)'
  },

  // Romantic theme
  romantic: {
    primary: '#FF69B4',
    secondary: '#FFB6C1',
    accent: '#FFC0CB',
    background: '#2D1B3D',
    text: '#FFF0F5',
    textSecondary: 'rgba(255, 240, 245, 0.9)',
    border: 'rgba(255, 105, 180, 0.3)',
    gradient: 'linear-gradient(135deg, #FF69B4 0%, #FFB6C1 50%, #FFC0CB 100%)'
  },

  // Movie ceremony theme (Warm Copper Gold & Crimson Red)
  movie: {
    primary: 'rgb(196, 130, 73)',
    secondary: '#8B1E1E',
    accent: '#FFD700',
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    border: 'rgba(196, 130, 73, 0.4)',
    gradient: 'linear-gradient(45deg, rgb(196, 130, 73), #8B1E1E, #FFD700)'
  },

  // Minimal theme
  minimal: {
    primary: '#FFFFFF',
    secondary: '#F3F4F6',
    accent: '#9CA3AF',
    background: '#111827',
    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    border: 'rgba(255, 255, 255, 0.2)',
    gradient: 'linear-gradient(to right, #FFFFFF, #F3F4F6)'
  },

  // Birthday Balloon original royal blue + gold
  birthdayBalloonClassic: {
    primary: '#F4C542',
    secondary: '#1D3E8A',
    accent: '#FFFFFF',
    background: '#10285F',
    text: '#F8FAFF',
    textSecondary: 'rgba(248, 250, 255, 0.78)',
    border: 'rgba(244, 197, 66, 0.42)',
    gradient: 'linear-gradient(135deg, #ffe39c 0%, #f4c542 40%, #c99017 100%)'
  },

  // Premium black and gold birthday mood
  birthdayBalloonNoir: {
    primary: '#F0C76A',
    secondary: '#4A3420',
    accent: '#FFF5D6',
    background: '#120D0A',
    text: '#FFF9EE',
    textSecondary: 'rgba(255, 249, 238, 0.78)',
    border: 'rgba(240, 199, 106, 0.35)',
    gradient: 'linear-gradient(135deg, #fff1b8 0%, #e6bb57 42%, #8a5b12 100%)'
  },

  // Soft champagne celebration
  birthdayBalloonChampagne: {
    primary: '#E7C77B',
    secondary: '#8A6A4A',
    accent: '#FFF8E8',
    background: '#2D241F',
    text: '#FFF8F0',
    textSecondary: 'rgba(255, 248, 240, 0.78)',
    border: 'rgba(231, 199, 123, 0.34)',
    gradient: 'linear-gradient(135deg, #fff3d7 0%, #e7c77b 44%, #b1894d 100%)'
  },

  // Playful pink birthday option
  birthdayBalloonConfetti: {
    primary: '#FFD166',
    secondary: '#D149A0',
    accent: '#FFF7F2',
    background: '#3B174A',
    text: '#FFF6FC',
    textSecondary: 'rgba(255, 246, 252, 0.8)',
    border: 'rgba(255, 209, 102, 0.35)',
    gradient: 'linear-gradient(135deg, #ffe29a 0%, #ff7bc3 45%, #8d4dff 100%)'
  },

  // Deep navy luxury birthday option
  birthdayBalloonMidnight: {
    primary: '#F3C969',
    secondary: '#243B6B',
    accent: '#F7F1DE',
    background: '#0A1635',
    text: '#F9FBFF',
    textSecondary: 'rgba(249, 251, 255, 0.76)',
    border: 'rgba(243, 201, 105, 0.34)',
    gradient: 'linear-gradient(135deg, #fce6a2 0%, #f3c969 36%, #5679c9 100%)'
  }
};
