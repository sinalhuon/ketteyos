import { AnimationConfig } from '../types';

export const animationPresets: Record<string, AnimationConfig> = {
  // Default animations (current)
  default: {
    entranceDuration: 0.8,
    transitionStyle: 'ease-out',
    hoverEffect: 'scale-105',
    backgroundAnimation: 'pulse',
    particleEffect: true
  },

  // Modern animations
  modern: {
    entranceDuration: 0.5,
    transitionStyle: 'ease-in-out',
    hoverEffect: 'translate-y-[-4px]',
    backgroundAnimation: 'gradient-shift',
    particleEffect: false
  },

  // Traditional animations
  traditional: {
    entranceDuration: 1.2,
    transitionStyle: 'ease-out',
    hoverEffect: 'scale-105',
    backgroundAnimation: 'shimmer',
    particleEffect: true
  },

  // Romantic animations
  romantic: {
    entranceDuration: 1.5,
    transitionStyle: 'ease-out',
    hoverEffect: 'scale-110',
    backgroundAnimation: 'float',
    particleEffect: true
  },

  // Movie ceremony animations
  movie: {
    entranceDuration: 0.3,
    transitionStyle: 'cubic-bezier(0.4, 0, 0.2, 1)',
    hoverEffect: 'scale-95',
    backgroundAnimation: 'spotlight',
    particleEffect: false
  },

  // Minimal animations
  minimal: {
    entranceDuration: 0.3,
    transitionStyle: 'linear',
    hoverEffect: 'opacity-80',
    backgroundAnimation: 'none',
    particleEffect: false
  }
};
