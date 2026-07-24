'use client';

import { motion } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';

interface OpenInvitationHintProps {
    label: string;
    color: string;
    textColor: string;
    borderColor?: string;
    background?: string;
    className?: string;
    labelClassName?: string;
    iconOnly?: boolean;
}

export default function OpenInvitationHint({
    label,
    color,
    textColor,
    borderColor,
    background,
    className = '',
    labelClassName = '',
    iconOnly = false,
}: OpenInvitationHintProps) {
    const isKhmerLabel = /[\u1780-\u17FF]/.test(label);

    if (iconOnly) {
        return (
            <motion.div
                className={`pointer-events-none relative inline-flex h-16 w-16 items-center justify-center ${className}`}
                initial={{ opacity: 0, x: 8, scale: 0.96 }}
                animate={{ opacity: 1, x: [0, -10, 0], scale: [1, 1.04, 1] }}
                transition={{
                    opacity: { delay: 1.1, duration: 0.28 },
                    x: { delay: 1.1, duration: 1.55, repeat: Infinity, ease: 'easeInOut' },
                    scale: { delay: 1.1, duration: 1.55, repeat: Infinity, ease: 'easeInOut' },
                }}
                aria-hidden="true"
            >
                <motion.div
                    className="absolute h-10 w-10 rounded-full border-[3px]"
                    style={{ borderColor: borderColor || color }}
                    animate={{ scale: [1, 2, 2.45], opacity: [0.78, 0.28, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.div
                    className="absolute h-10 w-10 rounded-full border-[3px]"
                    style={{ borderColor: borderColor || color }}
                    animate={{ scale: [1, 2, 2.45], opacity: [0.78, 0.28, 0] }}
                    transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.div
                    className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border shadow-lg backdrop-blur-md"
                    style={{
                        borderColor: borderColor || `${color}66`,
                        background: background || 'rgba(255,255,255,0.18)',
                        color: textColor,
                        filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.28))',
                    }}
                    animate={{ x: [0, -5, 0], rotate: [-10, -5, -10] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <MousePointerClick size={24} style={{ color }} />
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`pointer-events-none inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-bold shadow-lg backdrop-blur-md ${isKhmerLabel ? '' : 'uppercase tracking-[0.22em]'} ${labelClassName} ${className}`}
            style={{
                borderColor: borderColor || `${color}66`,
                background: background || 'rgba(255,255,255,0.18)',
                color: textColor,
            }}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: [0, -5, 0], scale: [1, 1.03, 1] }}
            transition={{
                opacity: { delay: 1.1, duration: 0.28 },
                y: { delay: 1.1, duration: 1.55, repeat: Infinity, ease: 'easeInOut' },
                scale: { delay: 1.1, duration: 1.55, repeat: Infinity, ease: 'easeInOut' },
            }}
        >
            <MousePointerClick size={16} style={{ color }} />
            <span>{label}</span>
        </motion.div>
    );
}
