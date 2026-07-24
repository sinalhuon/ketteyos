'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronsUp } from 'lucide-react';

interface ScrollUpGuideProps {
    show: boolean;
    label: string;
    color: string;
    textColor: string;
    borderColor?: string;
    className?: string;
    lineClassName?: string;
    labelClassName?: string;
    iconSize?: number;
}

export default function ScrollUpGuide({
    show,
    label,
    color,
    textColor,
    borderColor,
    className = 'fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-6',
    lineClassName = 'h-16 w-px',
    labelClassName,
    iconSize = 14,
}: ScrollUpGuideProps) {
    const isKhmerLabel = /[\u1780-\u17FF]/.test(label);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.28 }}
                    className={className}
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex flex-col items-center gap-2"
                    >
                        <div
                            className={lineClassName}
                            style={{
                                background: `linear-gradient(180deg, transparent 0%, ${color} 18%, ${color} 100%)`,
                                boxShadow: `0 0 10px ${color}33`
                            }}
                        />
                        <div
                            className={`flex items-center gap-1 text-[11px] ${isKhmerLabel ? '' : 'uppercase tracking-[0.28em]'} ${labelClassName || ''}`}
                            style={{ color: textColor }}
                        >
                            <ChevronsUp size={iconSize} style={{ color }} />
                            <span>{label}</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
