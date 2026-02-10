'use client';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface Book3DProps {
    isOpen: boolean;
    onToggle: () => void;
    frontCover: ReactNode;
    insidePage: ReactNode;
    leftPageContent?: ReactNode;
}

const Book3D = ({ isOpen, onToggle, frontCover, insidePage, leftPageContent }: Book3DProps) => {
    return (
        <div
            className="relative z-20 w-[90%] max-w-[400px] h-[600px] md:max-w-[500px] md:h-[700px] cursor-pointer"
            style={{ perspective: '1500px' }}
            onClick={onToggle}
        >
            {/* The Book Flipper */}
            <div
                className={clsx(
                    "w-full h-full relative transition-transform duration-[1500ms] ease-in-out",
                )}
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isOpen ? (typeof window !== 'undefined' && window.innerWidth >= 768 ? 'translateX(50%) rotateY(-180deg)' : 'rotateY(-180deg)') : 'rotateY(0deg)'
                }}
            >
                {/* Front Cover (Front Face) */}
                <div
                    className="absolute inset-0 z-20 origin-left border-2 border-[#D4AF37] rounded-r-md shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col justify-center items-center text-[#D4AF37]"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="absolute inset-2 border border-[#D4AF37]/30 pointer-events-none"></div>
                    {frontCover}
                </div>

                {/* Back of Front Cover (Left page when open) */}
                <div
                    className="absolute inset-0 bg-gray-900 rounded-l-md z-20 flex flex-col justify-center items-center"
                    style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden'
                    }}
                >
                    {/* Optional decorative back cover content */}
                    {leftPageContent}
                </div>

            </div>

            {/* Inside Page (Right page when open) - Static background */}
            <div className="absolute inset-0 bg-[#FDFBF7] z-10 flex flex-col items-center justify-center p-8 text-center shadow-inner rounded-r-md">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#D4AF37 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
                    {insidePage}
                </div>
            </div>
        </div>
    );
};

export default Book3D;
