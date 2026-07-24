'use client';

import React from 'react';

interface FancyFrameProps {
    children: React.ReactNode;
    className?: string;
    padding?: string;
    color?: string;
}

const FancyFrame: React.FC<FancyFrameProps> = ({ children, className = '', padding = 'p-8', color = '#EEC573' }) => {
    return (
        <div className={`relative inline-block ${className}`}>
            {/* Outer Gold Border - Thin */}
            <div className={`absolute inset-0 border border-[${color}]/40 rounded-lg pointer-events-none`} />

            {/* Inner Gold Border - Slightly inset */}
            <div className={`absolute inset-1 border border-[${color}]/20 rounded-lg pointer-events-none`} />

            {/* Corner Flourishes */}
            {/* Top Left */}
            <div className="absolute -top-1 -left-1 w-12 h-12 pointer-events-none">
                <svg viewBox="0 0 40 40" fill="none" className={`w-full h-full text-[${color}]`}>
                    <path d="M1 40V12C1 5.92487 5.92487 1 12 1H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M6 40V14C6 9.58172 9.58172 6 14 6H40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
                    <circle cx="1" cy="1" r="2" fill="currentColor" />
                </svg>
            </div>

            {/* Top Right */}
            <div className="absolute -top-1 -right-1 w-12 h-12 pointer-events-none transform rotate-90">
                <svg viewBox="0 0 40 40" fill="none" className={`w-full h-full text-[${color}]`}>
                    <path d="M1 40V12C1 5.92487 5.92487 1 12 1H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M6 40V14C6 9.58172 9.58172 6 14 6H40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
                    <circle cx="1" cy="1" r="2" fill="currentColor" />
                </svg>
            </div>

            {/* Bottom Right */}
            <div className="absolute -bottom-1 -right-1 w-12 h-12 pointer-events-none transform rotate-180">
                <svg viewBox="0 0 40 40" fill="none" className={`w-full h-full text-[${color}]`}>
                    <path d="M1 40V12C1 5.92487 5.92487 1 12 1H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M6 40V14C6 9.58172 9.58172 6 14 6H40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
                    <circle cx="1" cy="1" r="2" fill="currentColor" />
                </svg>
            </div>

            {/* Bottom Left */}
            <div className="absolute -bottom-1 -left-1 w-12 h-12 pointer-events-none transform -rotate-90">
                <svg viewBox="0 0 40 40" fill="none" className={`w-full h-full text-[${color}]`}>
                    <path d="M1 40V12C1 5.92487 5.92487 1 12 1H40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M6 40V14C6 9.58172 9.58172 6 14 6H40" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
                    <circle cx="1" cy="1" r="2" fill="currentColor" />
                </svg>
            </div>

            {/* Crown/Ornament Top Center */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 pointer-events-none">
                <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0L14 4L18 5L15 8L16 12L12 10L8 12L9 8L6 5L10 4L12 0Z" fill={color} />
                </svg>
            </div>

            {/* Content Container */}
            <div className={`relative z-10 ${padding}`}>
                {children}
            </div>
        </div>
    );
};

export default FancyFrame;
