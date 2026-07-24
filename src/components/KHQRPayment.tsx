'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle, Clock, RefreshCw, AlertCircle, X } from 'lucide-react';
import { BASE_URL } from '@/lib/api';
import Image from 'next/image';

interface KHQRPaymentProps {
    /** Transaction ID returned by khqr.php?action=generate (POST) */
    txId: string;
    planName: string;
    planPrice: string;
    planCurrency: string;
    onPaymentSuccess: (token: string, user: object) => void;
    onCancel: () => void;
}

type PaymentStatus = 'loading' | 'ready' | 'polling' | 'paid' | 'error';

export default function KHQRPayment({
    txId,
    planName,
    planPrice,
    planCurrency,
    onPaymentSuccess,
    onCancel,
}: KHQRPaymentProps) {
    const [status, setStatus] = useState<PaymentStatus>('loading');
    const [qrPayload, setQrPayload] = useState('');
    const [bankName, setBankName] = useState('');
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState(planCurrency);
    const [errorMsg, setErrorMsg] = useState('');
    const [countdown, setCountdown] = useState(300);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const clearTimers = () => {
        if (pollRef.current) clearInterval(pollRef.current);
        if (countdownRef.current) clearInterval(countdownRef.current);
    };

    // Load QR data from the already-created transaction
    const loadQR = useCallback(async () => {
        setStatus('loading');
        setErrorMsg('');
        try {
            // Re-generate using GET with txId to retrieve stored payload
            const res = await fetch(`${BASE_URL}/khqr.php?action=getqr&txId=${encodeURIComponent(txId)}`);
            const data = await res.json();
            if (!data.success) {
                setErrorMsg(data.error || 'Failed to load QR');
                setStatus('error');
                return;
            }
            setQrPayload(data.qrPayload);
            setBankName(data.bankName || '');
            setAmount(data.amount?.toString() || planPrice);
            setCurrency(data.currency || planCurrency);
            setCountdown(300);
            setStatus('ready');
        } catch {
            setErrorMsg('Network error. Please try again.');
            setStatus('error');
        }
    }, [txId, planPrice, planCurrency]);

    useEffect(() => {
        loadQR();
        return () => clearTimers();
    }, [loadQR]);

    // Start polling when ready
    useEffect(() => {
        if (status !== 'ready' && status !== 'polling') return;

        countdownRef.current = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) {
                    clearTimers();
                    setStatus('error');
                    setErrorMsg('QR code expired. Please go back and try again.');
                    return 0;
                }
                return c - 1;
            });
        }, 1000);

        pollRef.current = setInterval(async () => {
            setStatus('polling');
            try {
                const res = await fetch(`${BASE_URL}/khqr.php?action=check&txId=${encodeURIComponent(txId)}`);
                const data = await res.json();
                if (data.paid) {
                    clearTimers();
                    setStatus('paid');
                    // Confirm: create user + get JWT
                    const confirmRes = await fetch(`${BASE_URL}/khqr.php?action=confirm`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ txId }),
                    });
                    const confirmData = await confirmRes.json();
                    if (confirmData.success && confirmData.token) {
                        setTimeout(() => onPaymentSuccess(confirmData.token, confirmData.user), 1200);
                    } else {
                        setErrorMsg(confirmData.error || 'Payment confirmed but account setup failed. Please contact support.');
                        setStatus('error');
                    }
                }
            } catch {
                // Network hiccup — keep polling silently
            }
        }, 10000);

        return () => clearTimers();
    }, [status === 'ready', txId]); // eslint-disable-line react-hooks/exhaustive-deps

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const amountDisplay = currency === 'KHR'
        ? `${parseInt(amount || planPrice).toLocaleString()} ៛`
        : `$${parseFloat(amount || planPrice).toFixed(2)}`;

    return (
        <div className="w-full flex flex-col items-center gap-5">

            {/* ── KHQR Official Card ── */}
            <div className="w-full max-w-[320px] rounded-[20px] overflow-hidden shadow-xl bg-white">

                {/* Red header with real KHQR logo */}
                <div className="bg-[#E02020] flex items-center justify-center py-4 px-6">
                    <Image
                        src="/assets/khqr-logo.png"
                        alt="KHQR"
                        width={160}
                        height={50}
                        className="object-contain h-[50px] w-auto"
                        priority
                    />
                </div>

                {/* White body */}
                <div className="bg-white px-6 pt-6 pb-5 text-center">
                    {/* Merchant name */}
                    <p className="text-[15px] font-extrabold text-gray-900 uppercase tracking-wide mb-1">
                        {bankName || 'MERCHANT'}
                    </p>

                    {/* Amount */}
                    <p className="text-[32px] font-black text-black mb-6 leading-tight">
                        {amountDisplay}
                    </p>

                    {/* Dashed divider (full bleed) */}
                    <div className="border-t-2 border-dashed border-gray-300 mx-[-24px] mb-5" />

                    {/* QR area */}
                    <div className="flex items-center justify-center min-h-[240px]">
                        {status === 'loading' && (
                            <div className="flex flex-col items-center gap-3 text-gray-400">
                                <div className="w-10 h-10 border-4 border-[#E02020] border-t-transparent rounded-full animate-spin" />
                                <p className="text-sm">Loading QR...</p>
                            </div>
                        )}

                        {(status === 'ready' || status === 'polling') && qrPayload && (
                            <div className="relative inline-block">
                                <QRCodeSVG
                                    value={qrPayload}
                                    size={230}
                                    level="M"
                                    includeMargin={false}
                                />
                                {/* Polling pulse indicator */}
                                {status === 'polling' && (
                                    <span className="absolute top-1 right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E02020] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E02020]" />
                                    </span>
                                )}
                            </div>
                        )}

                        {status === 'paid' && (
                            <div className="flex flex-col items-center gap-3 text-green-500 py-4">
                                <CheckCircle size={64} className="animate-bounce" />
                                <p className="text-lg font-bold text-gray-900">Payment Confirmed!</p>
                                <p className="text-sm text-gray-500 text-center">Setting up your account...</p>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="flex flex-col items-center gap-3 text-red-500 py-4">
                                <AlertCircle size={44} />
                                <p className="text-sm text-center text-red-600 font-medium px-2">{errorMsg}</p>
                                <button
                                    onClick={loadQR}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#E02020] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                                >
                                    <RefreshCw size={14} /> Retry
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Countdown */}
                    {(status === 'ready' || status === 'polling') && (
                        <div className={`mt-4 flex items-center justify-center gap-1.5 text-sm font-mono font-semibold ${countdown < 60 ? 'text-red-500' : 'text-gray-400'}`}>
                            <Clock size={14} />
                            {formatTime(countdown)}
                        </div>
                    )}
                </div>
            </div>

            {/* Plan label */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Plan: <span className="font-semibold text-gray-700 dark:text-gray-200">{planName}</span>
            </p>

            {/* Step instructions */}
            {(status === 'ready' || status === 'polling') && (
                <ol className="w-full max-w-[320px] space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {[
                        'Open Bakong / ABA / Wing app',
                        'Tap Scan QR and point at the code',
                        'Confirm the amount and complete payment',
                        'This page will redirect automatically',
                    ].map((step, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <span className="flex-shrink-0 w-5 h-5 bg-red-100 text-[#E02020] rounded-full text-xs flex items-center justify-center font-bold">{i + 1}</span>
                            {step}
                        </li>
                    ))}
                </ol>
            )}

            {/* Cancel */}
            {status !== 'paid' && (
                <button
                    onClick={onCancel}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mt-1"
                >
                    <X size={14} /> Cancel and go back
                </button>
            )}
        </div>
    );
}
