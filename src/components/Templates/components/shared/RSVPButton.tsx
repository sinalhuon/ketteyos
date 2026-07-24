'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TemplateConfig } from '../../types';

interface RSVPButtonProps {
  config: TemplateConfig;
  onRsvp?: (status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
  className?: string;
}

export default function RSVPButton({ config, onRsvp, className = '' }: RSVPButtonProps) {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className={`relative z-30 ${className}`}>
      {!showOptions ? (
        <motion.button
          onClick={() => setShowOptions(true)}
          className={`px-8 py-3 bg-gradient-to-r from-${config.colorScheme.primary} to-${config.colorScheme.secondary} text-white rounded-full text-sm tracking-wider hover:shadow-lg transition-all duration-300`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            backgroundColor: config.colorScheme.primary,
            fontFamily: config.typography.bodyFont
          }}
        >
          RSVP
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-4"
        >
          <motion.button
            onClick={() => onRsvp?.('ACCEPTED')}
            className="px-6 py-2 bg-green-600 text-white rounded-full text-xs hover:bg-green-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Join
          </motion.button>
          <motion.button
            onClick={() => onRsvp?.('DECLINED')}
            className="px-6 py-2 bg-red-600 text-white rounded-full text-xs hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sorry
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
