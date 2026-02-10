'use client';

import { useEffect, useRef, useState } from 'react';

interface LivelyBackgroundProps {
    imageUrl?: string;
    videoUrl?: string;
    videoOpacity?: number;
    overlayColor?: string;
}

export default function LivelyBackground({
    imageUrl = '/assets/backgrounds/pastel-glitter.jpg',
    videoUrl = 'https://ik.imagekit.io/ketteyos/dust.mp4',
    videoOpacity = 0.4,
    overlayColor = 'bg-black/40'
}: LivelyBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

    useEffect(() => {
        // Delay video loading slightly to prioritize page content
        const timer = setTimeout(() => {
            setShouldLoadVideo(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.8; // Slow down dust slightly for dreamy effect

            // Handle video loaded event
            const handleCanPlay = () => {
                setVideoLoaded(true);
            };

            videoRef.current.addEventListener('canplay', handleCanPlay);

            return () => {
                videoRef.current?.removeEventListener('canplay', handleCanPlay);
            };
        }
    }, [shouldLoadVideo]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden">
            {/* Base Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear transform hover:scale-105"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                }}
            ></div>

            {/* Video Overlay (Dust/Particles) - Lazy Loaded */}
            {videoUrl && shouldLoadVideo && (
                <div
                    className={`absolute inset-0 z-10 mix-blend-screen pointer-events-none transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <video
                        ref={videoRef}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        poster={imageUrl}
                        className="w-full h-full object-cover"
                        style={{ opacity: videoOpacity }}
                    >
                        <source src={videoUrl} type="video/mp4" />
                    </video>
                </div>
            )}

            {/* Dark/Color Overlay for Text Readability */}
            <div className={`absolute inset-0 z-20 ${overlayColor} backdrop-blur-[1px]`}></div>
        </div>
    );
}
