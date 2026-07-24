'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TemplateConfig } from '../../types';

interface CountdownTimerProps {
  config: TemplateConfig;
  eventDate: Date;
  className?: string;
}

export default function CountdownTimer({ config, eventDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = eventDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft();

    return () => clearInterval(timer);
  }, [eventDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-center space-y-4 ${className}`}
      style={{
        fontFamily: config.typography.headingFont
      }}
    >
      <h3 
        className="text-lg md:text-xl font-bold mb-4"
        style={{ color: config.colorScheme.primary }}
      >
        Countdown to the Big Day
      </h3>
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Minutes' },
          { value: timeLeft.seconds, label: 'Seconds' }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="text-center"
          >
            <div 
              className="text-2xl md:text-4xl font-bold"
              style={{
                color: config.colorScheme.text,
                textShadow: config.typography.textShadow
              }}
            >
              {item.value}
            </div>
            <div 
              className="text-xs md:text-sm uppercase tracking-wider"
              style={{ color: config.colorScheme.textSecondary }}
            >
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
