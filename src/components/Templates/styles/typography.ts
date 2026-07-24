import { Typography } from '../types';

export const typographyOptions: Record<string, Typography> = {
  // Current typography (default)
  default: {
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Lato, sans-serif',
    khmerFont: 'Koulen, sans-serif',
    headingSize: 'text-2xl md:text-4xl',
    bodySize: 'text-base md:text-lg',
    khmerSize: 'text-xl md:text-2xl',
    letterSpacing: 'normal',
    textShadow: '0 2px 2px rgba(0,0,0,0.3)'
  },

  // Modern typography
  modern: {
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    khmerFont: 'Kantumruy Pro, sans-serif',
    headingSize: 'text-3xl md:text-5xl',
    bodySize: 'text-sm md:text-base',
    khmerSize: 'text-lg md:text-xl',
    letterSpacing: 'wide',
    textShadow: 'none'
  },

  // Traditional typography
  traditional: {
    headingFont: 'Playfair Display, serif',
    bodyFont: 'Lato, sans-serif',
    khmerFont: 'Moul, serif',
    headingSize: 'text-2xl md:text-4xl',
    bodySize: 'text-base md:text-lg',
    khmerSize: 'text-xl md:text-2xl',
    letterSpacing: 'normal',
    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
  },

  // Romantic typography
  romantic: {
    headingFont: 'Great Vibes, cursive',
    bodyFont: 'Lato, sans-serif',
    khmerFont: 'Koulen, sans-serif',
    headingSize: 'text-4xl md:text-6xl',
    bodySize: 'text-base md:text-lg',
    khmerSize: 'text-xl md:text-2xl',
    letterSpacing: 'wide',
    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
  },

  // Movie ceremony typography
  movie: {
    headingFont: 'Bebas Neue, cursive',
    bodyFont: 'Roboto, sans-serif',
    khmerFont: 'Koulen, sans-serif',
    headingSize: 'text-4xl md:text-6xl',
    bodySize: 'text-base md:text-lg',
    khmerSize: 'text-xl md:text-2xl',
    letterSpacing: 'widest',
    textShadow: '0 4px 8px rgba(0,0,0,0.5)'
  },

  // Minimal typography
  minimal: {
    headingFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    khmerFont: 'Kantumruy Pro, sans-serif',
    headingSize: 'text-2xl md:text-3xl',
    bodySize: 'text-sm md:text-base',
    khmerSize: 'text-lg md:text-xl',
    letterSpacing: 'tight',
    textShadow: 'none'
  }
};
