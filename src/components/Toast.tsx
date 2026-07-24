'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    toast: {
        success: (message: string) => void;
        error: (message: string) => void;
        warning: (message: string) => void;
        info: (message: string) => void;
    };
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        // Return a fallback that uses alert() if context is not available
        return {
            toast: {
                success: (msg: string) => { /* silent */ },
                error: (msg: string) => { /* silent */ },
                warning: (msg: string) => { /* silent */ },
                info: (msg: string) => { /* silent */ },
            }
        };
    }
    return context;
}

const icons: Record<ToastType, typeof CheckCircle2> = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};

const styles: Record<ToastType, string> = {
    success: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
    error: 'bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
    info: 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
};

const iconColors: Record<ToastType, string> = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    warning: 'text-amber-500',
    info: 'text-blue-500',
};

const progressColors: Record<ToastType, string> = {
    success: 'bg-emerald-400',
    error: 'bg-red-400',
    warning: 'bg-amber-400',
    info: 'bg-blue-400',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
    const Icon = icons[toast.type];
    const duration = toast.duration || 3500;
    const [exiting, setExiting] = useState(false);
    const [progress, setProgress] = useState(100);
    const startTime = useRef(Date.now());

    useEffect(() => {
        const raf = () => {
            const elapsed = Date.now() - startTime.current;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgress(remaining);
            if (remaining > 0) requestAnimationFrame(raf);
        };
        const frameId = requestAnimationFrame(raf);

        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => onDismiss(toast.id), 300);
        }, duration);

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(frameId);
        };
    }, [duration, toast.id, onDismiss]);

    const handleDismiss = () => {
        setExiting(true);
        setTimeout(() => onDismiss(toast.id), 300);
    };

    return (
        <div
            className={`
                flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm
                transition-all duration-300 ease-out min-w-[280px] max-w-[420px] relative overflow-hidden
                ${styles[toast.type]}
                ${exiting
                    ? 'opacity-0 translate-x-[120%] scale-95'
                    : 'opacity-100 translate-x-0 scale-100 animate-[slideIn_0.3s_ease-out]'
                }
            `}
        >
            <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColors[toast.type]}`} />
            <p className="flex-1 text-sm font-medium leading-snug pr-2">{toast.message}</p>
            <button
                onClick={handleDismiss}
                className="shrink-0 p-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors mt-0.5"
            >
                <X className="w-3.5 h-3.5 opacity-50" />
            </button>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/5 dark:bg-white/5">
                <div
                    className={`h-full ${progressColors[toast.type]} transition-none`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).slice(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const toast = {
        success: (msg: string) => addToast(msg, 'success'),
        error: (msg: string) => addToast(msg, 'error'),
        warning: (msg: string) => addToast(msg, 'warning'),
        info: (msg: string) => addToast(msg, 'info'),
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto">
                        <ToastItem toast={t} onDismiss={removeToast} />
                    </div>
                ))}
            </div>

            {/* Keyframe Animation */}
            <style jsx global>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(120%) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
}
