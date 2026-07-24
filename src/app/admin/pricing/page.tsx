'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Plus, Trash2, Save, Tag, Star, Check, GripVertical, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface PricingFeature {
    id: string;
    text: string;        // Khmer / primary
    textEn?: string;     // English translation
    included: boolean;
}

interface PlanLimits {
    maxEvents: number;
    maxPhotos: number;
    maxLanguages: number;
    smartRsvp: boolean;
    digitalWishes: boolean;
    customMusic: boolean;
    embedVideo: boolean;
    premiumAnimations: boolean;
    addToCalendar: boolean;
    customDesign: boolean;
    customDomain: boolean;
    qrCheckin: boolean;
    vipSupport: boolean;
}

const languageToggleLabel = (maxLanguages: number) =>
    maxLanguages >= 2 ? `Multiple Languages On (${maxLanguages})` : 'Multiple Languages Off';

const featureToggleLabels: Record<Exclude<keyof PlanLimits, 'maxEvents' | 'maxPhotos' | 'maxLanguages'>, string> = {
    smartRsvp: 'Smart RSVP',
    digitalWishes: 'Digital Wishes / Comments',
    customMusic: 'Custom Music',
    embedVideo: 'Embed Video',
    premiumAnimations: 'Premium Animations',
    addToCalendar: 'Add To Calendar',
    customDesign: 'Custom Design',
    customDomain: 'Custom Domain',
    qrCheckin: 'QR Checkin',
    vipSupport: 'VIP Support',
};

const defaultLimits = (): PlanLimits => ({
    maxEvents: 3,
    maxPhotos: 8,
    maxLanguages: 1,
    smartRsvp: false,
    digitalWishes: false,
    customMusic: false,
    embedVideo: false,
    premiumAnimations: false,
    addToCalendar: false,
    customDesign: false,
    customDomain: false,
    qrCheckin: false,
    vipSupport: false,
});

interface PricingPlan {
    id: string;
    name: string;           // Khmer / primary
    nameEn?: string;        // English translation
    price: string;
    currency: string;
    period: string;
    duration: number;
    description: string;       // Khmer
    descriptionEn?: string;    // English
    isPopular: boolean;
    isActive: boolean;
    features: PricingFeature[];
    limits?: PlanLimits;
}

const newId = () => Math.random().toString(36).slice(2, 10);

const defaultPlan = (): PricingPlan => ({
    id: newId(),
    name: '',
    price: '',
    currency: '$',
    period: 'month',
    duration: 1,
    description: '',
    isPopular: false,
    isActive: true,
    features: [{ id: newId(), text: '', included: true }],
    limits: defaultLimits(),
});

export default function PricingPage() {
    const { toast } = useToast();
    const [plans, setPlans] = useState<PricingPlan[]>([]);
    const [showPricing, setShowPricing] = useState(true);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
    const [showEn, setShowEn] = useState<Record<string, boolean>>({});  // per-plan EN section toggle

    useEffect(() => {
        const load = async () => {
            try {
                const res = await apiFetch('admin.php?action=pricing');
                if (res?.success) {
                    if (Array.isArray(res.plans)) {
                        setPlans(res.plans.map((p: PricingPlan) => ({
                            ...p,
                            limits: { ...defaultLimits(), ...(p.limits || {}) },
                        })));
                    }
                    if (typeof res.showPricing === 'boolean') setShowPricing(res.showPricing);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await apiFetch('admin.php?action=pricing', {
                method: 'POST',
                body: JSON.stringify({ plans, showPricing }),
            });
            if (res?.success) {
                toast.success('Pricing saved successfully!');
            } else {
                toast.error('Failed to save pricing.');
            }
        } catch (e) {
            toast.error('Error saving pricing.');
        } finally {
            setSaving(false);
        }
    };

    const addPlan = () => {
        const plan = defaultPlan();
        setPlans((prev) => [...prev, plan]);
    };

    const removePlan = (id: string) => {
        setPlans((prev) => prev.filter((p) => p.id !== id));
    };

    const updatePlan = (id: string, field: keyof PricingPlan, value: any) => {
        setPlans((prev) =>
            prev.map((p) => {
                if (field === 'isPopular') {
                    return { ...p, isPopular: p.id === id ? Boolean(value) : false };
                }
                if (p.id !== id) return p;
                return { ...p, [field]: value };
            })
        );
    };

    const updatePlanLimit = (planId: string, key: keyof PlanLimits, value: number | boolean) => {
        setPlans((prev) =>
            prev.map((p) => {
                if (p.id !== planId) return p;
                const limits = { ...defaultLimits(), ...p.limits };
                let nextLimits = { ...limits, [key]: value };

                if (key === 'maxLanguages') {
                    const nextMaxLanguages = Number(value) || 1;
                    nextLimits = {
                        ...nextLimits,
                        maxLanguages: Math.max(1, Math.min(5, nextMaxLanguages)),
                    };
                }

                return { ...p, limits: nextLimits };
            })
        );
    };

    const toggleMultipleLanguages = (planId: string) => {
        setPlans((prev) =>
            prev.map((p) => {
                if (p.id !== planId) return p;
                const limits = { ...defaultLimits(), ...p.limits };
                const enabled = (limits.maxLanguages ?? 1) >= 2;
                return {
                    ...p,
                    limits: {
                        ...limits,
                        maxLanguages: enabled ? 1 : 2,
                    },
                };
            })
        );
    };

    const addFeature = (planId: string) => {
        setPlans((prev) =>
            prev.map((p) =>
                p.id === planId
                    ? { ...p, features: [...p.features, { id: newId(), text: '', included: true }] }
                    : p
            )
        );
    };

    const updateFeature = (planId: string, featureId: string, field: keyof PricingFeature, value: any) => {
        setPlans((prev) =>
            prev.map((p) =>
                p.id === planId
                    ? {
                        ...p,
                        features: p.features.map((f) =>
                            f.id === featureId ? { ...f, [field]: value } : f
                        ),
                    }
                    : p
            )
        );
    };

    const removeFeature = (planId: string, featureId: string) => {
        setPlans((prev) =>
            prev.map((p) =>
                p.id === planId
                    ? { ...p, features: p.features.filter((f) => f.id !== featureId) }
                    : p
            )
        );
    };

    const toggleCollapse = (planId: string) => {
        setCollapsed((prev) => ({ ...prev, [planId]: !prev[planId] }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[1600px] p-8 lg:p-10 space-y-8">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <Tag className="text-yellow-500" size={28} />
                        Pricing Plans
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Manage your pricing tiers and features displayed to customers.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Show/Hide Pricing Toggle */}
                    <button
                        onClick={() => setShowPricing((v) => !v)}
                        title={showPricing ? 'Pricing section is visible on landing page' : 'Pricing section is hidden on landing page'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-medium text-sm transition ${showPricing
                            ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400'
                            : 'bg-gray-100 dark:bg-[#1a1a1a] border-gray-200 dark:border-[#333] text-gray-500 dark:text-gray-400'
                            }`}
                    >
                        {showPricing ? <Eye size={15} /> : <EyeOff size={15} />}
                        {showPricing ? 'Visible on Page' : 'Hidden from Page'}
                    </button>
                    <button
                        onClick={addPlan}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-[#333] text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition font-medium text-sm shadow-sm"
                    >
                        <Plus size={16} /> Add Plan
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-sm text-sm"
                    >
                        <Save size={16} />
                        {saving ? 'Saving…' : 'Save All'}
                    </button>
                </div>
            </header>

            {/* Visibility banner */}
            {!showPricing && (
                <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
                    <EyeOff size={16} className="shrink-0" />
                    <span>The pricing section is currently <strong>hidden</strong> from the landing page. Toggle &quot;Visible on Page&quot; and save to show it.</span>
                </div>
            )}

            {/* Empty State */}
            {plans.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 dark:border-[#333] rounded-2xl text-center">
                    <Tag size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-400 dark:text-gray-500 mb-2">No pricing plans yet</h3>
                    <p className="text-sm text-gray-400 dark:text-gray-600 mb-6">Add your first pricing plan to get started.</p>
                    <button
                        onClick={addPlan}
                        className="flex items-center gap-2 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-bold transition shadow-sm text-sm"
                    >
                        <Plus size={16} /> Add First Plan
                    </button>
                </div>
            )}

            {/* Plans Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {plans.map((plan, planIndex) => (
                    <div
                        key={plan.id}
                        className={`bg-white dark:bg-[#111] rounded-2xl border shadow-sm dark:shadow-none transition-all ${plan.isPopular
                            ? 'border-yellow-400 dark:border-yellow-500/60 ring-2 ring-yellow-400/20 dark:ring-yellow-500/20'
                            : 'border-gray-200 dark:border-[#222]'
                            }`}
                    >
                        {/* Card Header */}
                        <div className="p-5 border-b border-gray-100 dark:border-[#222] flex items-center gap-3">
                            <GripVertical size={18} className="text-gray-300 dark:text-gray-600 cursor-grab shrink-0" />
                            <div className="flex-1 min-w-0">
                                <input
                                    type="text"
                                    value={plan.name}
                                    onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                                    placeholder="Plan name (e.g. Basic)"
                                    className="w-full bg-transparent text-lg font-bold text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                {/* Popular Badge Toggle */}
                                <button
                                    onClick={() => updatePlan(plan.id, 'isPopular', !plan.isPopular)}
                                    title={plan.isPopular ? 'Most Popular (click to unset)' : 'Set as Most Popular'}
                                    className={`relative p-1.5 rounded-lg transition-all ${plan.isPopular
                                        ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 ring-2 ring-yellow-400/40 dark:ring-yellow-500/40'
                                        : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-500/10'
                                        }`}
                                >
                                    <Star size={16} fill={plan.isPopular ? 'currentColor' : 'none'} />
                                    {plan.isPopular && (
                                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500" />
                                        </span>
                                    )}
                                </button>
                                {/* Active Toggle — iOS style */}
                                <button
                                    onClick={() => updatePlan(plan.id, 'isActive', !plan.isActive)}
                                    title={plan.isActive ? 'Active — click to deactivate' : 'Inactive — click to activate'}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${plan.isActive
                                        ? 'bg-green-500'
                                        : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                >
                                    <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${plan.isActive ? 'translate-x-4' : 'translate-x-0'
                                            }`}
                                    />
                                </button>
                                {/* Collapse */}
                                <button
                                    onClick={() => toggleCollapse(plan.id)}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                                >
                                    {collapsed[plan.id] ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                </button>
                                {/* Delete */}
                                <button
                                    onClick={() => removePlan(plan.id)}
                                    className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        {!collapsed[plan.id] && (
                            <div className="p-5 space-y-5">
                                {/* Price Row */}
                                <div className={`grid gap-3 ${plan.period === 'one-time' ? 'grid-cols-3' : 'grid-cols-4'}`}>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">Currency</label>
                                        <select
                                            value={plan.currency}
                                            onChange={(e) => updatePlan(plan.id, 'currency', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 transition"
                                        >
                                            <option value="$">$ USD</option>
                                            <option value="€">€ EUR</option>
                                            <option value="£">£ GBP</option>
                                            <option value="៛">៛ KHR</option>
                                            <option value="฿">฿ THB</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">Price</label>
                                        <input
                                            type="text"
                                            value={plan.price}
                                            onChange={(e) => updatePlan(plan.id, 'price', e.target.value)}
                                            placeholder="0"
                                            className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 transition"
                                        />
                                    </div>
                                    {plan.period !== 'one-time' && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">Duration</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={120}
                                                value={plan.duration ?? 1}
                                                onChange={(e) => updatePlan(plan.id, 'duration', Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 transition"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">Period</label>
                                        <select
                                            value={plan.period}
                                            onChange={(e) => updatePlan(plan.id, 'period', e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 transition"
                                        >
                                            <option value="month">month(s)</option>
                                            <option value="year">year(s)</option>
                                            <option value="one-time">one-time</option>
                                            <option value="event">event(s)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Duration preview label */}
                                {plan.period !== 'one-time' && (
                                    <p className="-mt-2 text-xs text-gray-400 dark:text-gray-500">
                                        Displayed as: <span className="font-semibold text-yellow-600 dark:text-yellow-400">{plan.currency}{plan.price || '0'} / {plan.duration ?? 1} {plan.period}{(plan.duration ?? 1) > 1 ? 's' : ''}</span>
                                    </p>
                                )}

                                {/* Description (KH) */}
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">Description <span className="text-yellow-500">(ខ្មែរ)</span></label>
                                    <input
                                        type="text"
                                        value={plan.description}
                                        onChange={(e) => updatePlan(plan.id, 'description', e.target.value)}
                                        placeholder="ការពិពណ៌នាខ្លីអំពីកញ្ចប់នេះ…"
                                        className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 transition"
                                    />
                                </div>

                                {/* English Translation Toggle */}
                                <button
                                    onClick={() => setShowEn(prev => ({ ...prev, [plan.id]: !prev[plan.id] }))}
                                    className="flex items-center gap-2 text-xs font-medium text-blue-500 dark:text-blue-400 hover:text-blue-600 transition"
                                >
                                    <span>🌐</span>
                                    {showEn[plan.id] ? 'Hide English Translation ▲' : 'Add / Edit English Translation ▼'}
                                </button>

                                {/* English Section */}
                                {showEn[plan.id] && (
                                    <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-xl">
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">🇬🇧 English Translation</p>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">Plan Name (EN)</label>
                                            <input
                                                type="text"
                                                value={plan.nameEn ?? ''}
                                                onChange={(e) => updatePlan(plan.id, 'nameEn' as any, e.target.value)}
                                                placeholder="e.g. Standard Package"
                                                className="w-full bg-white dark:bg-[#0a0a0a] border border-blue-200 dark:border-blue-500/30 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">Description (EN)</label>
                                            <input
                                                type="text"
                                                value={plan.descriptionEn ?? ''}
                                                onChange={(e) => updatePlan(plan.id, 'descriptionEn' as any, e.target.value)}
                                                placeholder="e.g. Simple, elegant, and exceeds expectations"
                                                className="w-full bg-white dark:bg-[#0a0a0a] border border-blue-200 dark:border-blue-500/30 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">Features (EN)</label>
                                            <div className="space-y-2">
                                                {plan.features.map((feature, fi) => (
                                                    <div key={feature.id} className="flex items-center gap-2">
                                                        <span className="shrink-0 w-5 text-center text-xs text-gray-400">{fi + 1}.</span>
                                                        <input
                                                            type="text"
                                                            value={feature.textEn ?? ''}
                                                            onChange={(e) => updateFeature(plan.id, feature.id, 'textEn' as any, e.target.value)}
                                                            placeholder={`Feature ${fi + 1} in English…`}
                                                            className="flex-1 bg-white dark:bg-[#0a0a0a] border border-blue-200 dark:border-blue-500/30 rounded-lg px-3 py-1.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 transition"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Features */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-xs font-medium text-gray-400 dark:text-gray-500">Features</label>
                                        <button
                                            onClick={() => addFeature(plan.id)}
                                            className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 font-medium transition"
                                        >
                                            <Plus size={12} /> Add Feature
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {plan.features.map((feature) => (
                                            <div key={feature.id} className="flex items-center gap-2">
                                                {/* Include toggle */}
                                                <button
                                                    onClick={() => updateFeature(plan.id, feature.id, 'included', !feature.included)}
                                                    className={`shrink-0 w-5 h-5 rounded flex items-center justify-center border transition ${feature.included
                                                        ? 'bg-green-500 border-green-500 text-white'
                                                        : 'border-gray-300 dark:border-[#444] text-transparent'
                                                        }`}
                                                >
                                                    <Check size={11} strokeWidth={3} />
                                                </button>
                                                <input
                                                    type="text"
                                                    value={feature.text}
                                                    onChange={(e) => updateFeature(plan.id, feature.id, 'text', e.target.value)}
                                                    placeholder="Feature description…"
                                                    className={`flex-1 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/30 transition ${feature.included
                                                        ? 'text-gray-900 dark:text-white'
                                                        : 'text-gray-400 dark:text-gray-600 line-through'
                                                        }`}
                                                />
                                                <button
                                                    onClick={() => removeFeature(plan.id, feature.id)}
                                                    className="shrink-0 p-1 text-gray-300 dark:text-gray-600 hover:text-red-500 transition"
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Plan Limits (Feature Enforcement) */}
                                <div className="border-t border-gray-200 dark:border-[#333] pt-5 mt-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Plan Limits (API Enforcement)</label>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[10px] text-gray-400 mb-0.5">Max Events</label>
                                            <div className="flex items-center gap-1.5">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={9999}
                                                    disabled={(plan.limits ?? defaultLimits()).maxEvents === -1}
                                                    value={(plan.limits ?? defaultLimits()).maxEvents === -1 ? '' : (plan.limits ?? defaultLimits()).maxEvents}
                                                    placeholder={(plan.limits ?? defaultLimits()).maxEvents === -1 ? '∞' : ''}
                                                    onChange={(e) => updatePlanLimit(plan.id, 'maxEvents', Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-2 py-1.5 text-sm disabled:opacity-40"
                                                />
                                                <button
                                                    type="button"
                                                    title="Toggle unlimited"
                                                    onClick={() => updatePlanLimit(plan.id, 'maxEvents', (plan.limits ?? defaultLimits()).maxEvents === -1 ? 1 : -1)}
                                                    className={`shrink-0 px-1.5 py-1 rounded border text-[10px] font-bold transition ${
                                                        (plan.limits ?? defaultLimits()).maxEvents === -1
                                                            ? 'bg-purple-100 dark:bg-purple-500/20 border-purple-400 text-purple-700 dark:text-purple-300'
                                                            : 'bg-gray-100 dark:bg-[#222] border-gray-300 dark:border-[#444] text-gray-400 hover:border-purple-400 hover:text-purple-500'
                                                    }`}
                                                >
                                                    ∞
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-400 mb-0.5">Max Photos</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={999}
                                                value={(plan.limits ?? defaultLimits()).maxPhotos}
                                                onChange={(e) => updatePlanLimit(plan.id, 'maxPhotos', Math.max(1, parseInt(e.target.value) || 1))}
                                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-2 py-1.5 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-400 mb-0.5">Max Languages</label>
                                            <input
                                                type="number"
                                                min={1}
                                                max={5}
                                                value={(plan.limits ?? defaultLimits()).maxLanguages}
                                                onChange={(e) => updatePlanLimit(plan.id, 'maxLanguages', Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                                                className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#333] rounded-lg px-2 py-1.5 text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                                        Use this to allow Khmer + English event content. `1` means single language only. `2` or more enables multi-language events.
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <button
                                            onClick={() => toggleMultipleLanguages(plan.id)}
                                            className={`text-[10px] px-2 py-1 rounded border transition ${
                                                ((plan.limits ?? defaultLimits()).maxLanguages ?? 1) >= 2
                                                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-700 dark:text-blue-300'
                                                    : 'bg-gray-100 dark:bg-[#222] border-gray-200 dark:border-[#333] text-gray-500'
                                            }`}
                                        >
                                            {languageToggleLabel((plan.limits ?? defaultLimits()).maxLanguages ?? 1)}
                                        </button>
                                        {(['smartRsvp', 'digitalWishes', 'customMusic', 'embedVideo', 'premiumAnimations', 'addToCalendar', 'customDesign', 'customDomain', 'qrCheckin', 'vipSupport'] as const).map((k) => (
                                            <button
                                                key={k}
                                                onClick={() => updatePlanLimit(plan.id, k, !(plan.limits ?? defaultLimits())[k])}
                                                className={`text-[10px] px-2 py-1 rounded border transition ${(plan.limits ?? defaultLimits())[k]
                                                    ? 'bg-green-500/20 border-green-500/40 text-green-700 dark:text-green-400'
                                                    : 'bg-gray-100 dark:bg-[#222] border-gray-200 dark:border-[#333] text-gray-500'}`}
                                            >
                                                {featureToggleLabels[k]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Preview Badge */}
                                {plan.isPopular && (
                                    <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg px-3 py-2">
                                        <Star size={12} fill="currentColor" />
                                        This plan will be highlighted as <strong>Most Popular</strong>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom Save */}
            {plans.length > 0 && (
                <div className="flex justify-end pt-2">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-sm"
                    >
                        <Save size={18} />
                        {saving ? 'Saving…' : 'Save All Plans'}
                    </button>
                </div>
            )}
        </div>
    );
}
