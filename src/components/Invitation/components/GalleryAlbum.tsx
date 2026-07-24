'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Play, ExternalLink } from 'lucide-react';

type GalleryColorScheme = {
    primary: string;
    text: string;
    textSecondary: string;
    border: string;
};

type PhotoMedia = string | { imageUrl?: string | null };
type VideoMedia = string | { videoUrl?: string | null };
type MediaItem = { url: string; type: 'photo' | 'video' };
type VideoSource =
    | { type: 'youtube'; embedUrl: string; thumbnail: string }
    | { type: 'vimeo'; embedUrl: string; thumbnail: null }
    | { type: 'facebook'; embedUrl: string; thumbnail: null }
    | { type: 'direct'; embedUrl: string; thumbnail: null }
    | { type: 'external'; embedUrl: string; thumbnail: null };

const getCleanVideoUrl = (url: string) => {
    const trimmed = url.trim();
    const match = trimmed.match(/https?:\/\/[^\s"'<>]+/i);
    return (match?.[0] || trimmed).replace(/[),.;]+$/, '');
};

const getYouTubeId = (url: string) => {
    const trimmed = getCleanVideoUrl(url);
    if (!trimmed) return null;

    try {
        const parsed = new URL(trimmed);
        const host = parsed.hostname.replace(/^www\./, '');
        const pathParts = parsed.pathname.split('/').filter(Boolean);

        if (host === 'youtu.be') {
            return pathParts[0]?.match(/^[A-Za-z0-9_-]{11}$/) ? pathParts[0] : null;
        }

        if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
            const watchId = parsed.searchParams.get('v');
            if (watchId?.match(/^[A-Za-z0-9_-]{11}$/)) return watchId;
            if (['embed', 'shorts', 'v'].includes(pathParts[0]) && pathParts[1]?.match(/^[A-Za-z0-9_-]{11}$/)) {
                return pathParts[1];
            }
        }
    } catch {
        // Fall back to regex parsing below.
    }

    const match = trimmed.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|shorts\/|watch\?[^#\s]*?[?&]?v=))([A-Za-z0-9_-]{11})/i);
    return match?.[1] || null;
};

const getVimeoId = (url: string) => {
    const trimmed = getCleanVideoUrl(url);
    if (!trimmed) return null;

    try {
        const parsed = new URL(trimmed);
        const host = parsed.hostname.replace(/^www\./, '');
        if (!host.endsWith('vimeo.com')) return null;
        const pathParts = parsed.pathname.split('/').filter(Boolean);
        const videoIndex = pathParts.indexOf('video');
        const candidate = videoIndex >= 0 ? pathParts[videoIndex + 1] : pathParts.find((part) => /^\d+$/.test(part));
        return candidate && /^\d+$/.test(candidate) ? candidate : null;
    } catch {
        const match = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
        return match?.[1] || null;
    }
};

const isFacebookVideoUrl = (url: string) => {
    const cleanUrl = getCleanVideoUrl(url);
    try {
        const parsed = new URL(cleanUrl);
        const host = parsed.hostname.replace(/^www\./, '');
        return host === 'fb.watch' || host.endsWith('facebook.com') || host.endsWith('facebook.net');
    } catch {
        return /(?:facebook\.com|fb\.watch|facebook\.net)/i.test(cleanUrl);
    }
};

const isDirectVideoUrl = (url: string) => /\.(mp4|webm|ogg|mov|m4v)(?:$|[?#])/i.test(getCleanVideoUrl(url));

const getFacebookEmbedUrl = (url: string, autoplay: boolean) => (
    `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(getCleanVideoUrl(url))}&show_text=false&autoplay=${autoplay ? 'true' : 'false'}`
);

const getVideoSource = (url: string): VideoSource => {
    const youtubeId = getYouTubeId(url);
    if (youtubeId) {
        return {
            type: 'youtube',
            embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
            thumbnail: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        };
    }

    const vimeoId = getVimeoId(url);
    if (vimeoId) {
        return {
            type: 'vimeo',
            embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`,
            thumbnail: null,
        };
    }

    if (isFacebookVideoUrl(url)) {
        return {
            type: 'facebook',
            embedUrl: getFacebookEmbedUrl(url, true),
            thumbnail: null,
        };
    }

    if (isDirectVideoUrl(url)) {
        return { type: 'direct', embedUrl: getCleanVideoUrl(url), thumbnail: null };
    }

    return { type: 'external', embedUrl: getCleanVideoUrl(url), thumbnail: null };
};

const getVideoThumbnail = (videoUrl: string) => getVideoSource(videoUrl).thumbnail;

const getVideoKey = (videoUrl: string) => {
    const source = getVideoSource(videoUrl);
    return `${source.type}:${source.embedUrl}`.trim().toLowerCase();
};

const VideoPlayer = ({ url, cs }: { url: string; cs: GalleryColorScheme }) => {
    const source = getVideoSource(url);

    if (source.type === 'youtube' || source.type === 'vimeo' || source.type === 'facebook') {
        return (
            <iframe
                src={source.embedUrl}
                title={`${source.type} video player`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
            />
        );
    }

    if (source.type === 'direct') {
        return <video src={source.embedUrl} autoPlay controls playsInline className="h-full w-full object-contain" />;
    }

    return (
        <div className="flex h-full flex-col items-center justify-center space-y-4">
            <ExternalLink size={48} style={{ color: cs.primary }} />
            <p className="text-lg font-medium text-white">External Video Link</p>
            <a href={source.embedUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-6 py-2 font-bold text-black transition-colors hover:bg-gray-200">
                Open Video
            </a>
        </div>
    );
};

const PhotoItem = ({ url, i, cs, onClick, orientation = 'portrait' }: { url: string; i: number; cs: GalleryColorScheme; onClick: () => void; orientation?: 'portrait' | 'landscape' }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const isLandscape = orientation === 'landscape';

    return (
        <motion.div
            key={`photo-${i}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: (Math.min(i, 5) * 0.1) }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative cursor-pointer overflow-hidden rounded-lg border bg-black/10 flex items-center justify-center ${isLandscape ? 'col-span-2 aspect-[16/9]' : 'col-span-1 aspect-[4/5]'}`}
            style={{ borderColor: cs.border }}
            onClick={onClick}
        >
            <AnimatePresence>
                {!isLoaded && (
                    <motion.div 
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-0"
                    >
                        <div 
                            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" 
                            style={{ borderColor: `${cs.primary} transparent transparent transparent` }} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <img 
                src={url} 
                alt={`Gallery ${i}`} 
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
            />
        </motion.div>
    );
};

const VideoThumbItem = ({ url, thumb, i, cs, onClick }: { url: string; thumb: string | null; i: number; cs: GalleryColorScheme; onClick: () => void }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const source = getVideoSource(url);

    return (
        <motion.div
            key={`video-${i}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: (Math.min(i, 5) * 0.1) }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative col-span-2 md:col-span-3 aspect-video cursor-pointer overflow-hidden rounded-xl border bg-black/40 flex items-center justify-center group"
            style={{ borderColor: cs.border }}
            onClick={onClick}
        >
            {thumb ? (
                <>
                    <AnimatePresence>
                        {!isLoaded && (
                            <motion.div 
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-0"
                            >
                                <div 
                                    className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" 
                                    style={{ borderColor: `${cs.primary} transparent transparent transparent` }} 
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <img 
                        src={thumb} 
                        alt={`Video ${i}`} 
                        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 z-10 ${isLoaded ? 'opacity-60 group-hover:opacity-40' : 'opacity-0'}`}
                        onLoad={() => setIsLoaded(true)}
                    />
                </>
            ) : source.type === 'facebook' ? (
                <>
                    <div className="absolute inset-0 z-0 flex items-center justify-center bg-black">
                        <iframe
                            src={getFacebookEmbedUrl(url, false)}
                            title={`Facebook video preview ${i + 1}`}
                            className="h-full w-full scale-[1.04] border-0 opacity-70 transition-opacity duration-700 group-hover:opacity-55"
                            allow="encrypted-media; picture-in-picture; web-share"
                            allowFullScreen
                            scrolling="no"
                        />
                    </div>
                    <div className="absolute inset-0 z-10 bg-black/10" />
                </>
            ) : (
                <div className="z-10 text-center p-4">
                    <Play size={24} style={{ color: cs.primary }} className="mx-auto mb-2" />
                    <p className="text-[10px] uppercase tracking-widest opacity-60 text-white">Watch Video</p>
                </div>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                    <Play size={16} fill="white" className="ml-1 text-white" />
                </div>
                <div className="mt-3 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-sm" style={{ borderColor: cs.border, backgroundColor: 'rgba(0,0,0,0.38)' }}>
                    Tap To Play
                </div>
            </div>
        </motion.div>
    );
};

const GalleryMediaPreview = ({
    item,
    index,
    cs,
    onClick,
    className,
    imageClassName = 'object-cover',
}: {
    item: MediaItem;
    index: number;
    cs: GalleryColorScheme;
    onClick: () => void;
    className: string;
    imageClassName?: string;
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const thumb = item.type === 'video' ? getVideoThumbnail(item.url) : item.url;

    return (
        <motion.button
            type="button"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.55, delay: Math.min(index, 4) * 0.08 }}
            whileTap={{ scale: 0.985 }}
            onClick={onClick}
            className={`relative block overflow-hidden rounded-lg border bg-black/20 text-left shadow-[0_12px_28px_rgba(0,0,0,0.22)] ${className}`}
            style={{ borderColor: cs.border }}
        >
            {thumb ? (
                <img
                    src={thumb}
                    alt={`Gallery ${index + 1}`}
                    className={`absolute inset-0 h-full w-full ${imageClassName} transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setIsLoaded(true)}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <ExternalLink size={26} style={{ color: cs.primary }} />
                </div>
            )}
            {!isLoaded && thumb && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-t-transparent" style={{ borderColor: `${cs.primary} transparent transparent transparent` }} />
                </div>
            )}
            {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white backdrop-blur-sm">
                        <Play size={17} fill="white" className="ml-0.5" />
                    </div>
                </div>
            )}
        </motion.button>
    );
};

interface GalleryAlbumProps {
    photos?: PhotoMedia[] | string; // Supports string[] or {imageUrl: string}[]
    videos?: VideoMedia[] | string; // Supports string[] or {videoUrl: string}[]
    colorScheme?: Partial<GalleryColorScheme>;
    previewCount?: number;
    showSeeMore?: boolean;
    seeMoreLabel?: string;
    layout?: 'grid' | 'three-row-slider';
}

export default function GalleryAlbum({ photos = [], videos = [], colorScheme, previewCount, showSeeMore = false, seeMoreLabel = 'See More', layout = 'grid' }: GalleryAlbumProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [photoOrientations, setPhotoOrientations] = useState<Record<string, 'portrait' | 'landscape'>>({});
    const sliderRef = useRef<HTMLDivElement>(null);

    const cs: GalleryColorScheme = {
        primary: '#D4AF37',
        text: '#FFFFFF',
        textSecondary: 'rgba(255, 255, 255, 0.7)',
        border: 'rgba(212, 175, 55, 0.3)',
        ...colorScheme,
    };

    const normalizeMediaList = (value: PhotoMedia[] | VideoMedia[] | string): Array<PhotoMedia | VideoMedia> => {
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') {
            const trimmed = value.trim();
            if (!trimmed) return [];
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) return parsed;
            } catch {
                return trimmed
                    .split('\n')
                    .map((item) => item.trim())
                    .filter(Boolean);
            }
        }
        return [];
    };

    const normalizedPhotos = normalizeMediaList(photos);
    const normalizedVideos = normalizeMediaList(videos);
    const getPhotoUrl = (photo: PhotoMedia | VideoMedia) => typeof photo === 'string' ? photo : ('imageUrl' in photo ? photo.imageUrl || '' : '');
    const getVideoUrl = (video: PhotoMedia | VideoMedia) => typeof video === 'string' ? video : ('videoUrl' in video ? video.videoUrl || '' : '');
    const photoItems = normalizedPhotos
        .map((photo): MediaItem => ({ url: getPhotoUrl(photo), type: 'photo' }))
        .filter((item): item is MediaItem => Boolean(item.url));
    const seenVideoKeys = new Set<string>();
    const videoItems = normalizedVideos
        .map((video): MediaItem => ({ url: getVideoUrl(video), type: 'video' }))
        .filter((item): item is MediaItem => Boolean(item.url))
        .filter((item) => {
            const key = getVideoKey(item.url);
            if (seenVideoKeys.has(key)) return false;
            seenVideoKeys.add(key);
            return true;
        });
    const allMedia = [...photoItems, ...videoItems];
    const visiblePhotos = typeof previewCount === 'number' ? normalizedPhotos.slice(0, previewCount) : normalizedPhotos;
    const hiddenMediaCount = Math.max(0, allMedia.length - (previewCount || allMedia.length));
    const selectedMedia = selectedIndex === null ? null : allMedia[selectedIndex];

    const openMedia = (index: number) => setSelectedIndex(index);
    const showNext = () => setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % allMedia.length));
    const showPrevious = () => setSelectedIndex((prev) => (prev === null ? 0 : (prev - 1 + allMedia.length) % allMedia.length));

    useEffect(() => {
        normalizedPhotos.forEach((photo) => {
            const url = getPhotoUrl(photo);
            if (!url || photoOrientations[url]) return;

            const img = new window.Image();
            img.src = url;
            img.onload = () => {
                setPhotoOrientations((prev) => ({
                    ...prev,
                    [url]: img.width > img.height ? 'landscape' : 'portrait',
                }));
            };
        });
    }, [normalizedPhotos, photoOrientations]);

    useEffect(() => {
        if (layout !== 'three-row-slider') return;
        const slider = sliderRef.current;
        if (!slider || allMedia.length <= 3) return;

        const timer = window.setInterval(() => {
            const firstCard = slider.querySelector<HTMLElement>('[data-gallery-slide]');
            const step = firstCard ? firstCard.offsetWidth + 12 : Math.max(180, slider.clientWidth * 0.68);
            const remaining = slider.scrollWidth - slider.clientWidth - slider.scrollLeft;
            slider.scrollTo({
                left: remaining <= step * 0.75 ? 0 : slider.scrollLeft + step,
                behavior: 'smooth',
            });
        }, 2800);

        return () => window.clearInterval(timer);
    }, [allMedia.length, layout]);

    if (photoItems.length === 0 && videoItems.length === 0) return null;

    if (layout === 'three-row-slider') {
        const featuredMedia = allMedia.slice(0, 2);
        const sliderMedia = allMedia.slice(2);

        return (
            <div className="space-y-4 sm:space-y-5">
                <div className="space-y-2 text-center">
                    <h3 className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: cs.primary }}>Gallery & Moments</h3>
                    <div className="mx-auto h-px w-14" style={{ background: cs.primary }} />
                </div>

                <div className="space-y-2.5 sm:space-y-3">
                    {featuredMedia.map((item, index) => (
                        <GalleryMediaPreview
                            key={`${item.type}-${item.url}-${index}`}
                            item={item}
                            index={index}
                            cs={cs}
                            onClick={() => openMedia(index)}
                            className="aspect-[2/1] w-full sm:aspect-[16/9]"
                        />
                    ))}

                    {sliderMedia.length > 0 && (
                        <div
                            ref={sliderRef}
                            className="-mx-1 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:gap-3 sm:pb-2 [&::-webkit-scrollbar]:hidden"
                        >
                            {sliderMedia.map((item, index) => (
                                <div key={`${item.type}-${item.url}-${index + 2}`} data-gallery-slide className="min-w-[48%] snap-center sm:min-w-[42%]">
                                    <GalleryMediaPreview
                                        item={item}
                                        index={index + 2}
                                        cs={cs}
                                        onClick={() => openMedia(index + 2)}
                                        className="aspect-[1/1] w-full sm:aspect-[4/5]"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {selectedMedia && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10 backdrop-blur-md"
                            onClick={() => setSelectedIndex(null)}
                        >
                            <button
                                className="absolute right-6 top-6 z-20 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                                onClick={() => setSelectedIndex(null)}
                            >
                                <X size={24} />
                            </button>

                            {allMedia.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showPrevious();
                                        }}
                                        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20"
                                        aria-label="Previous media"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            showNext();
                                        }}
                                        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20"
                                        aria-label="Next media"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}

                            <motion.div
                                key={`${selectedMedia.type}-${selectedMedia.url}`}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="relative flex max-h-full w-full max-w-5xl items-center justify-center"
                                onClick={(e) => e.stopPropagation()}
                                drag={allMedia.length > 1 ? 'x' : false}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.18}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x < -70) showNext();
                                    if (info.offset.x > 70) showPrevious();
                                }}
                            >
                                {selectedMedia.type === 'photo' ? (
                                    <img src={selectedMedia.url} alt="Full view" className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl" />
                                ) : (
                                    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
                                        <VideoPlayer url={selectedMedia.url} cs={cs} />
                                    </div>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <h3 className="text-xs tracking-[0.4em] uppercase font-bold" style={{ color: cs.primary }}>Gallery & Moments</h3>
                <div className="h-px w-12 mx-auto" style={{ background: cs.primary }} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {/* Videos — shown above photos */}
                {videoItems.length > 0 && (
                    <div className="col-span-2 md:col-span-3 pt-1 text-center">
                        <div className="inline-flex flex-col items-center gap-2">
                            <div className="rounded-full border px-4 py-1 text-[10px] font-bold uppercase tracking-[0.34em]" style={{ color: cs.primary, borderColor: cs.border, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                Video Highlight
                            </div>
                            <p className="text-xs" style={{ color: cs.textSecondary }}>
                                Tap the video card to play
                            </p>
                        </div>
                    </div>
                )}
                {videoItems.map((video, i) => {
                    const url = video.url;
                    const thumb = getVideoThumbnail(url);
                    return (
                        <VideoThumbItem 
                            key={`video-${i}`}
                            url={url}
                            thumb={thumb} 
                            i={i} 
                            cs={cs} 
                            onClick={() => openMedia(photoItems.length + i)}
                        />
                    );
                })}

                {/* Photos — below videos */}
                {videoItems.length > 0 && normalizedPhotos.length > 0 && (
                    <div className="col-span-2 md:col-span-3 pt-2 text-center">
                        <div className="rounded-full border px-4 py-1 text-[10px] font-bold uppercase tracking-[0.34em] inline-block" style={{ color: cs.primary, borderColor: cs.border, backgroundColor: 'rgba(255,255,255,0.02)' }}>
                            Photo Gallery
                        </div>
                    </div>
                )}
                {visiblePhotos.map((photo, i) => {
                    const url = getPhotoUrl(photo);
                    if (!url) return null;
                    return (
                        <PhotoItem 
                            key={`photo-${i}`}
                            url={url} 
                            i={i} 
                            cs={cs} 
                            orientation={photoOrientations[url] || 'portrait'}
                            onClick={() => openMedia(i)}
                        />
                    );
                })}
            </div>


            {showSeeMore && hiddenMediaCount > 0 && (
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => openMedia(Math.min(previewCount || 0, allMedia.length - 1))}
                        className="rounded-full border px-6 py-2 text-xs font-bold uppercase tracking-[0.22em] shadow-sm backdrop-blur-md"
                        style={{ borderColor: cs.border, color: cs.text, backgroundColor: 'rgba(255,255,255,0.32)' }}
                    >
                        {seeMoreLabel}
                    </button>
                </div>
            )}

            {/* Lightbox */}
            <AnimatePresence>
                {selectedMedia && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-10 backdrop-blur-md"
                        onClick={() => setSelectedIndex(null)}
                    >
                        <button
                            className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                            onClick={() => setSelectedIndex(null)}
                        >
                            <X size={24} />
                        </button>

                        {allMedia.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showPrevious();
                                    }}
                                    className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20"
                                    aria-label="Previous media"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        showNext();
                                    }}
                                    className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md hover:bg-white/20"
                                    aria-label="Next media"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}

                        <motion.div
                            key={`${selectedMedia.type}-${selectedMedia.url}`}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl w-full max-h-full flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                            drag={allMedia.length > 1 ? 'x' : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.18}
                            onDragEnd={(_, info) => {
                                if (info.offset.x < -70) showNext();
                                if (info.offset.x > 70) showPrevious();
                            }}
                        >
                            {selectedMedia.type === 'photo' ? (
                                <img src={selectedMedia.url} alt="Full view" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
                            ) : (
                                <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-black">
                                    <VideoPlayer url={selectedMedia.url} cs={cs} />
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
