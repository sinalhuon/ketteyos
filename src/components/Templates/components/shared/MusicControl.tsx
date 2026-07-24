'use client';

import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { TemplateConfig } from '../../types';

interface MusicControlProps {
  config: TemplateConfig;
  isPlaying: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}

export default function MusicControl({ config, isPlaying, onToggle, className = '' }: MusicControlProps) {
  return (
    <motion.button
      onClick={onToggle}
      className={`fixed bottom-6 right-6 z-50 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        color: config.colorScheme.primary
      }}
    >
      {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
    </motion.button>
  );
}
