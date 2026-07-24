'use client';

import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight, Star, Share2, ShieldCheck, CheckCircle, Smartphone, Music, MapPin,
  XCircle, Heart, Eye, ImageIcon, Sparkles, Zap, Globe, ChevronDown, Crown, Diamond
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

// ─── Section Reveal ───────────────────────────────────────────────────────────
function RevealSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Floating Particle ────────────────────────────────────────────────────────
function Particle({ style, delay, duration }: { style: React.CSSProperties; delay: number; duration: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [0, -28, 0], opacity: [0, 0.7, 0], scale: [0.8, 1.3, 0.8] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useEffect(() => {
    if (!isInView) return;
    let v = 0;
    const step = target / 60;
    const t = setInterval(() => {
      v += step;
      if (v >= target) { setCount(target); clearInterval(t); } else setCount(Math.floor(v));
    }, 16);
    return () => clearInterval(t);
  }, [isInView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Badge Label ──────────────────────────────────────────────────────────────
function SectionBadge({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/25 bg-yellow-500/8 text-yellow-400 text-xs font-semibold tracking-widest uppercase mb-6">
      <Icon className="w-3 h-3" />{label}
    </div>
  );
}

// ─── Package Card ─────────────────────────────────────────────────────────────
type AdminFeature = { id: string; text: string; textEn?: string; included: boolean };
type AdminPlan = {
  id: string; name: string; nameEn?: string; price: string; currency: string;
  period: string; duration: number; description: string; descriptionEn?: string;
  isPopular: boolean; features: AdminFeature[];
};

function PricingCard({
  emoji, tier, name, price, subtitle, features, validity, highlight, delay, popularBadge, ctaText, adminPlan, lang
}: {
  emoji: string; tier: string; name: string; price: string; subtitle: string;
  features: string[]; validity: string; highlight?: boolean; delay?: number;
  popularBadge: string; ctaText: string; adminPlan?: AdminPlan; lang?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const isEn = lang === 'en';

  // Build feature list – admin plan overrides hardcoded, pick EN if available
  const featureList = adminPlan
    ? adminPlan.features.filter(f => f.included).map(f =>
      (isEn && f.textEn) ? f.textEn : f.text)
    : features;

  // Build price display
  const priceDisplay = adminPlan ? `${adminPlan.currency}${adminPlan.price}` : price;

  // Build name display
  const nameDisplay = adminPlan
    ? (isEn && adminPlan.nameEn ? adminPlan.nameEn : adminPlan.name)
    : name;

  // Build subtitle/description
  const subtitleDisplay = adminPlan
    ? (isEn && adminPlan.descriptionEn ? adminPlan.descriptionEn : adminPlan.description)
    : subtitle;

  // Build validity label
  const validityDisplay = adminPlan
    ? (adminPlan.period === 'one-time'
      ? (isEn ? 'One-time payment' : 'ការបង់ជ័មតូកតាម័យ')
      : (isEn
        ? `Valid for ${adminPlan.duration ?? 1} ${adminPlan.period}${(adminPlan.duration ?? 1) > 1 ? 's' : ''}`
        : `តំណាភ្ជាប់តែច័សផ្ត ${adminPlan.duration ?? 1} ${adminPlan.period === 'month' ? 'ខែ' : adminPlan.period === 'year' ? 'ឆ្នាែ' : 'ការត័ង '}`))
    : validity;

  const isHighlighted = adminPlan ? adminPlan.isPopular : (highlight ?? false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: delay || 0, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative rounded-2xl p-6 lg:p-8 border flex flex-col overflow-hidden transition-all ${isHighlighted
        ? 'bg-gradient-to-br from-yellow-950/40 to-amber-950/20 border-yellow-500/50 shadow-[0_0_40px_rgba(202,138,4,0.15)]'
        : 'bg-white/[0.03] border-white/10 hover:border-yellow-500/30'}`}
    >
      {isHighlighted && (
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent" />
      )}
      {isHighlighted && (
        <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded-full">
          {popularBadge}
        </div>
      )}

      {/* Header */}
      <div className="mb-5">
        <div className="text-3xl mb-2">{emoji}</div>
        {tier && <div className="text-xs text-yellow-500/70 font-semibold tracking-widest uppercase mb-1">{tier}</div>}
        <h3 className={`text-2xl font-bold mb-1 ${isHighlighted ? 'text-yellow-400' : 'text-white'}`}>{nameDisplay}</h3>
        <div className={`text-3xl lg:text-4xl font-black mb-2 ${isHighlighted ? 'text-yellow-300' : 'text-white'}`}>{priceDisplay}</div>
        {subtitleDisplay && <p className="text-gray-400 text-sm leading-relaxed">{subtitleDisplay}</p>}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6 flex-1">
        {featureList.map((f, i) => (
          <li key={i} className="flex gap-2.5 items-start text-sm text-gray-300">
            <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${isHighlighted ? 'text-yellow-400' : 'text-green-400'}`} />
            <span className="leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>

      {/* Validity */}
      <div className={`text-xs rounded-lg px-3 py-2 mb-5 border ${isHighlighted ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300' : 'bg-white/5 border-white/10 text-gray-400'}`}>
        ⏱️ {validityDisplay}
      </div>

      {/* CTA - redirect to contact page */}
      <Link
        href="/contact"
        className={`w-full py-3 rounded-xl font-semibold text-sm text-center transition-all block ${isHighlighted
          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-[0_4px_20px_rgba(202,138,4,0.3)] hover:shadow-[0_6px_30px_rgba(202,138,4,0.5)]'
          : 'border border-white/15 text-white hover:bg-white/8 hover:border-yellow-500/30'}`}
      >
        {ctaText}
      </Link>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
// Reads localStorage and returns the correct dashboard path, or null if not logged in
function getLoggedInDashboard(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) return null;

    const user = JSON.parse(userStr);
    if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') return '/admin/dashboard';
    return '/dashboard';
  } catch { return null; }
}

export default function Home() {
  const router = useRouter();
  const [appLogo, setAppLogo] = useState<string | null>(null);
  const [appName, setAppName] = useState('Ketteyos');
  const [isLoading, setIsLoading] = useState(true);
  const [showcaseEvents, setShowcaseEvents] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [adminPlans, setAdminPlans] = useState<AdminPlan[]>([]);
  const [showPricing, setShowPricing] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const { t, language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const loggedInDash = user
    ? (user.isSuperAdmin || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? '/admin/dashboard' : '/dashboard')
    : null;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [emblaRefTrusted] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 3200, stopOnInteraction: true })]);
  const [emblaRefTemplates] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 3800, stopOnInteraction: true })]);
  const [emblaRefPricing, emblaApiPricing] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 4000, stopOnInteraction: true })]);
  const [emblaRefFeatures] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 3500, stopOnInteraction: true })]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';
        const res = await fetch(`${API_BASE}/settings.php`);
        const data = await res.json();
        if (data.success) { setAppLogo(data.settings.appLogo || null); setAppName(data.settings.appName || 'Ketteyos'); }
        const sr = await fetch(`${API_BASE}/showcase_events.php`);
        const sd = await sr.json();
        if (sd.success && sd.events) setShowcaseEvents(sd.events);
        const tr = await fetch(`${API_BASE}/public_templates.php`);
        const td = await tr.json();
        if (td.success && td.templates) setTemplates(td.templates);
        // Fetch admin-configured pricing plans
        try {
          const pr = await fetch(`${API_BASE}/public_pricing.php`);
          const pd = await pr.json();
          if (pd.success && Array.isArray(pd.plans) && pd.plans.length > 0) {
            setAdminPlans(pd.plans);
          }
          if (typeof pd.showPricing === 'boolean') setShowPricing(pd.showPricing);
        } catch { }
      } catch { } finally { setIsLoading(false); }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const particles = Array.from({ length: 16 }, (_, i) => ({
    style: {
      left: `${(i * 43 + 7) % 100}%`,
      top: `${(i * 61 + 13) % 100}%`,
      width: 4 + (i % 4) * 3,
      height: 4 + (i % 4) * 3,
      background: `radial-gradient(circle, rgba(202,138,4,0.6) 0%, transparent 70%)`
    },
    delay: (i * 0.35) % 4,
    duration: 3.5 + (i % 3) * 1.5,
  }));

  const features = [
    { icon: Star, title: t('landing.features.f1.title'), desc: t('landing.features.f1.desc'), color: "from-yellow-500 to-amber-600" },
    { icon: Share2, title: t('landing.features.f2.title'), desc: t('landing.features.f2.desc'), color: "from-yellow-600 to-orange-500" },
    { icon: ShieldCheck, title: t('landing.features.f3.title'), desc: t('landing.features.f3.desc'), color: "from-amber-500 to-yellow-600" },
    { icon: ImageIcon, title: t('landing.features.f4.title'), desc: t('landing.features.f4.desc'), color: "from-yellow-500 to-amber-500" },
    { icon: Music, title: t('landing.features.f5.title'), desc: t('landing.features.f5.desc'), color: "from-orange-500 to-yellow-500" },
    { icon: MapPin, title: t('landing.features.f6.title'), desc: t('landing.features.f6.desc'), color: "from-amber-600 to-yellow-500" },
  ];

  const ctaText = language === 'en' ? "Get Started →" : "ចាប់ផ្តើមឥឡូវ →";
  const popularBadge = t('landing.pricing.popular');

  // Use admin-configured plans when available, else fall back to hardcoded
  const packages = adminPlans.length > 0
    ? adminPlans.map((plan, i) => ({
      emoji: '',  // name already includes emoji (e.g. '🌟 កញ្ចប់ វិចិត្រ')
      tier: '',
      name: plan.name,
      price: `${plan.currency}${plan.price}`,
      subtitle: plan.description,
      features: plan.features.filter(f => f.included).map(f => f.text),
      validity: plan.period === 'one-time'
        ? 'One-time payment'
        : `Valid for ${plan.duration ?? 1} ${plan.period}${(plan.duration ?? 1) > 1 ? 's' : ''}`,
      highlight: plan.isPopular,
      delay: i * 0.1,
      popularBadge,
      ctaText,
      adminPlan: plan,
      lang: language,
    }))
    : [
      {
        emoji: "🌟", tier: t('landing.pricing.p1.tier'), name: t('landing.pricing.p1.name'), price: "$50",
        subtitle: t('landing.pricing.p1.subtitle'),
        features: [
          t('landing.pricing.p1.f1'), t('landing.pricing.p1.f2'), t('landing.pricing.p1.f3'),
          t('landing.pricing.p1.f4'), t('landing.pricing.p1.f5'), t('landing.pricing.p1.f6'), t('landing.pricing.p1.f7')
        ],
        validity: t('landing.pricing.validityMonth') + (language === 'en' ? "3 Months" : "៣ ខែ"),
        delay: 0,
        popularBadge, ctaText
      },
      {
        emoji: "👑", tier: t('landing.pricing.p2.tier'), name: t('landing.pricing.p2.name'), price: "$150",
        subtitle: t('landing.pricing.p2.subtitle'),
        features: [
          t('landing.pricing.p2.f1'), t('landing.pricing.p2.f2'), t('landing.pricing.p2.f3'),
          t('landing.pricing.p2.f4'), t('landing.pricing.p2.f5'), t('landing.pricing.p2.f6'), t('landing.pricing.p2.f7')
        ],
        validity: t('landing.pricing.validityMonth') + (language === 'en' ? "6 Months" : "៦ ខែ"),
        highlight: true,
        delay: 0.1,
        popularBadge, ctaText
      },
      {
        emoji: "💎", tier: t('landing.pricing.p3.tier'), name: t('landing.pricing.p3.name'), price: "$250",
        subtitle: t('landing.pricing.p3.subtitle'),
        features: [
          t('landing.pricing.p3.f1'), t('landing.pricing.p3.f2'), t('landing.pricing.p3.f3'),
          t('landing.pricing.p3.f4'), t('landing.pricing.p3.f5')
        ],
        validity: t('landing.pricing.validityMonth') + (language === 'en' ? "18 Months" : "១៨ ខែ"),
        delay: 0.2,
        popularBadge, ctaText
      },
      {
        emoji: "🚀", tier: t('landing.pricing.p4.tier'), name: t('landing.pricing.p4.name'), price: (language === 'en' ? "From $350+" : "ចាប់ពី $350+"),
        subtitle: t('landing.pricing.p4.subtitle'),
        features: [
          t('landing.pricing.p4.f1'), t('landing.pricing.p4.f2'), t('landing.pricing.p4.f3'),
          t('landing.pricing.p4.f4'), t('landing.pricing.p4.f5')
        ],
        validity: t('landing.pricing.validityForever'),
        delay: 0.3,
        popularBadge, ctaText
      },
    ];

  return (
    <div
      className="min-h-screen bg-[#050505] text-white selection:bg-yellow-500/30 overflow-x-hidden"
      style={{ fontFamily: "'Kantumruy Pro', 'Hanuman', 'Khmer OS', Arial, sans-serif" }}
    >

      {/* ── Sticky Navbar ── */}
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/85 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {!isLoading && (
              <motion.div whileHover={{ scale: 1.06 }} transition={{ type: "spring", stiffness: 400 }}
                className="relative w-10 h-10 sm:w-12 sm:h-12 overflow-hidden rounded-xl border border-yellow-500/20 shadow-lg shadow-yellow-500/10 shrink-0">
                <Image src={appLogo || "/icon.png"} alt="Logo" fill className="object-contain" />
              </motion.div>
            )}
            <span className="font-bold text-base sm:text-lg bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-600 truncate">
              {appName}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <LanguageSwitcher />
            {/* Contact Us link when NOT logged in */}
            {!loggedInDash && (
              <button
                onClick={() => router.push('/contact')}
                className="hidden sm:block text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/5"
              >
                {t('landing.nav.contact')}
              </button>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <button
                onClick={() => {
                  const dash = getLoggedInDashboard();
                  router.push(dash ?? '/login');
                }}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold text-sm shadow-[0_0_20px_rgba(202,138,4,0.35)] hover:shadow-[0_0_28px_rgba(202,138,4,0.55)] transition-all"
              >
                {loggedInDash ? (language === 'en' ? 'Go to Dashboard →' : 'ទៅផ្ទាំងគ្រប់គ្រង →') : t('landing.nav.login')}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(120,80,0,0.3) 0%, transparent 70%)' }} />
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-yellow-600/8 rounded-full blur-[80px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-amber-600/8 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        {particles.map((p, i) => <Particle key={i} {...p} />)}

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-5 sm:px-6 max-w-5xl mx-auto w-full">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 text-xs sm:text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('landing.hero.pill')}</span>
            <Sparkles className="w-3.5 h-3.5" />
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, type: "spring", stiffness: 90 }}
            className="flex justify-center mb-8 sm:mb-10"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="relative">
              <div className="absolute inset-0 bg-yellow-500/15 rounded-3xl blur-2xl scale-150" />
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-3xl overflow-hidden border border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
                <Image src={appLogo || "/icon.png"} alt="App Logo" fill className="object-contain" priority />
              </div>
            </motion.div>
          </motion.div>

          {/* Headline — Khmer-safe: no tight line-height, good padding */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6"
            style={{ lineHeight: '1.65', paddingTop: '0.15em' }}
          >
            {t('landing.hero.title1')}{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600">
                {t('landing.hero.titleHighlight')}
              </span>
              <motion.span
                className="absolute bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
            </span>{' '}
            {t('landing.hero.title2')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10"
            style={{ lineHeight: '2' }}
          >
            {t('landing.hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 sm:mb-14"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <button
                onClick={() => router.push(loggedInDash ?? '/contact')}
                className="group relative mx-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 text-black font-bold text-base sm:text-lg shadow-[0_8px_30px_rgba(202,138,4,0.4)] hover:shadow-[0_12px_40px_rgba(202,138,4,0.6)] transition-all flex items-center justify-center gap-2.5 overflow-hidden"
              >
                <Zap className="w-5 h-5" />
                <span>{loggedInDash ? (language === 'en' ? 'Go to Dashboard' : 'ចាប់ផ្តើម') : (language === 'en' ? 'Contact Us' : 'ទំនាក់ទំនងពួកយើង')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
            {showPricing && (
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <a href="#pricing"
                  className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl border border-white/15 hover:border-yellow-500/40 bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  {language === 'en' ? 'View Pricing' : 'មើលតម្លៃ'}
                </a>
              </motion.div>
            )}
          </motion.div>

          {/* Trust badges */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
            {[
              t('landing.hero.badgeFree'),
              t('landing.hero.badgeInstant'),
              t('landing.hero.badgeMobile')
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 shrink-0" />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-600">
          <span className="text-xs tracking-widest uppercase">SCROLL</span>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative py-10 sm:py-12 border-y border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-950/10 via-transparent to-yellow-950/10" />
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 divide-x divide-white/10">
          {[
            { value: 500, suffix: '+', label: t('landing.stats.created') },
            { value: 50, suffix: '+', label: t('landing.stats.templates') },
            { value: 99, suffix: '%', label: t('landing.stats.satisfaction') },
          ].map((s, i) => (
            <RevealSection key={i} delay={i * 0.1} className="text-center py-4 px-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                <AnimatedCounter target={s.value} suffix={s.suffix} />
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1" style={{ lineHeight: '1.8' }}>{s.label}</div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* ── Showcase ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <RevealSection className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <SectionBadge icon={Heart} label={language === 'en' ? 'Real Events' : 'ព្រឹត្តិការណ៍ពិត'} />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style={{ lineHeight: '1.6' }}>{t('landing.trusted.title')}</h2>
            <p className="text-gray-400 max-w-xl mx-auto" style={{ lineHeight: '2' }}>{t('landing.trusted.subtitle')}</p>
          </div>
          <div className="overflow-hidden" ref={emblaRefTrusted}>
            <div className="flex gap-4 sm:gap-6 items-stretch">
              {showcaseEvents.length > 0 ? showcaseEvents.map((event) => (
                <div key={event.id} className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3">
                  <motion.a href={`/invite/${event.slug || event.id}`} target="_blank"
                    whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}
                    className="group relative h-56 sm:h-64 rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-500/50 transition-all flex shadow-xl shadow-black/30">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${event.shareImageUrl})` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-yellow-500/20 backdrop-blur-sm border border-yellow-500/40 rounded-full px-4 py-2 text-yellow-300 text-sm font-medium flex items-center gap-2">
                        <Eye className="w-4 h-4" />{language === 'en' ? 'View' : 'មើលធៀប'}
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="text-white font-bold text-base truncate">{event.title}</div>
                      <div className="text-yellow-400 text-sm flex items-center gap-1 mt-1"><Heart className="w-3 h-3" />{language === 'en' ? 'Invitation' : 'ធៀបអញ្ជើញ'}</div>
                    </div>
                  </motion.a>
                </div>
              )) : (
                <div className="text-gray-500 italic py-8 w-full text-center">
                  {language === 'en' ? 'Events will appear here...' : 'ព្រឹត្តិការណ៍នឹងបង្ហាញនៅទីនេះ...'}
                </div>
              )}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── Why Digital ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(100,60,0,0.1) 0%, transparent 70%)' }} />
        <RevealSection className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <SectionBadge icon={Zap} label={language === 'en' ? 'Why Go Digital?' : 'ហេតុអ្វីជ្រើសឌីជីថល'} />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style={{ lineHeight: '1.6' }}>{t('landing.experience.title')}</h2>
            <p className="text-gray-400 max-w-xl mx-auto" style={{ lineHeight: '2' }}>{t('landing.experience.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 lg:gap-8">
            {/* Traditional */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="p-6 sm:p-8 rounded-2xl bg-red-950/15 border border-red-900/25 relative overflow-hidden">
              <h3 className="text-lg sm:text-xl font-bold text-gray-300 mb-5 flex items-center gap-3" style={{ lineHeight: '1.6' }}>
                <span className="w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <XCircle className="w-4 h-4 text-red-500" />
                </span>
                {t('landing.experience.traditional.title')}
              </h3>
              <ul className="space-y-3 text-gray-400">
                {[1, 2, 3, 4].map(n => (
                  <li key={n} className="flex gap-2.5 items-start" style={{ lineHeight: '1.9' }}>
                    <span className="w-5 h-5 bg-red-500/10 rounded-full flex items-center justify-center shrink-0 mt-1 text-red-500 text-xs font-bold">✕</span>
                    <span>{t(`landing.experience.traditional.point${n}` as any)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            {/* Digital */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-yellow-950/20 to-amber-950/10 border border-yellow-600/20 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(202,138,4,0.8) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              <h3 className="text-lg sm:text-xl font-bold text-yellow-500 mb-5 flex items-center gap-3 relative z-10" style={{ lineHeight: '1.6' }}>
                <span className="w-8 h-8 bg-yellow-500/15 border border-yellow-500/30 rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4 text-yellow-500" />
                </span>
                {t('landing.experience.digital.title')}
              </h3>
              <ul className="space-y-3 text-gray-300 relative z-10">
                {[1, 2, 3, 4].map(n => (
                  <li key={n} className="flex gap-2.5 items-start" style={{ lineHeight: '1.9' }}>
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-1" />
                    <span>{t(`landing.experience.digital.point${n}` as any)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </RevealSection>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <RevealSection className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <SectionBadge icon={Globe} label={language === 'en' ? 'How It Works' : 'របៀបប្រើប្រាស់'} />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style={{ lineHeight: '1.6' }}>{t('landing.steps.title')}</h2>
            <p className="text-gray-400 max-w-xl mx-auto" style={{ lineHeight: '2' }}>{t('landing.steps.subtitle')}</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            {/* Desktop Horizontal Line */}
            <div className="hidden sm:block absolute top-10 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-yellow-600/30 to-transparent" />

            {/* Mobile Vertical Line */}
            <div className="sm:hidden absolute top-8 bottom-8 left-7 w-[2px] bg-gradient-to-b from-yellow-600/50 via-yellow-600/20 to-transparent" />

            <div className="grid sm:grid-cols-3 gap-10 sm:gap-8 relative">
              {[
                { num: "1", title: t('landing.steps.step1.title'), desc: t('landing.steps.step1.desc') },
                { num: "2", title: t('landing.steps.step2.title'), desc: t('landing.steps.step2.desc') },
                { num: "3", title: t('landing.steps.step3.title'), desc: t('landing.steps.step3.desc') },
              ].map((step, idx) => (
                <motion.div key={idx}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: idx * 0.15, duration: 0.7 }}
                  className="relative flex items-start sm:block sm:text-center group">

                  {/* Number Icon */}
                  <div className="shrink-0 relative z-10">
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex flex-col items-center justify-center text-black shadow-[0_4px_20px_rgba(202,138,4,0.3)] group-hover:shadow-[0_4px_25px_rgba(202,138,4,0.5)] transition-all sm:mx-auto mb-0 sm:mb-6 border border-yellow-300/50">
                      <span className="text-xl sm:text-2xl font-black leading-none">{step.num}</span>
                    </motion.div>
                  </div>

                  {/* Text Content */}
                  <div className="ml-6 sm:ml-0 pt-2 sm:pt-0 pb-6 sm:pb-0">
                    <h3 className="text-lg font-bold text-white mb-2" style={{ lineHeight: '1.6' }}>{step.title}</h3>
                    <p className="text-gray-400 text-sm" style={{ lineHeight: '1.8' }}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── Features ── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <RevealSection className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-14">
            <SectionBadge icon={Sparkles} label={language === 'en' ? 'Features' : 'មុខងារ'} />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style={{ lineHeight: '1.6' }}>{t('landing.features.title')}</h2>
            <p className="text-gray-400 max-w-xl mx-auto" style={{ lineHeight: '2' }}>{t('landing.features.subtitle')}</p>
          </div>

          {/* Mobile: swipeable carousel */}
          <div className="sm:hidden overflow-hidden" ref={emblaRefFeatures}>
            <div className="flex gap-4">
              {features.map((f, idx) => (
                <div key={idx} className="min-w-0 shrink-0 grow-0 basis-full">
                  <div className="group relative p-6 rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <f.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-white mb-2" style={{ lineHeight: '1.6' }}>{f.title}</h3>
                    <p className="text-gray-400 text-sm" style={{ lineHeight: '2' }}>{f.desc}</p>
                    {/* Progress dots */}
                    <div className="flex gap-1.5 mt-4">
                      {features.map((_, di) => (
                        <div key={di} className={`h-1 rounded-full transition-all ${di === idx ? 'w-6 bg-yellow-500' : 'w-1.5 bg-white/15'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: 3-column grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((f, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: idx * 0.07, duration: 0.6 }}
                whileHover={{ y: -7, scale: 1.02 }}
                className="group relative p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-yellow-500/30 hover:bg-white/[0.05] transition-all overflow-hidden cursor-default">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(202,138,4,0.07) 0%, transparent 70%)' }} />
                <div className={`relative z-10 w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="relative z-10 font-bold text-white mb-2" style={{ lineHeight: '1.6' }}>{f.title}</h3>
                <p className="relative z-10 text-gray-400 text-sm" style={{ lineHeight: '2' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </RevealSection>
      </section>

      {/* ── Template Gallery ── */}
      <section id="templates-demo" className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(80,50,0,0.12) 0%, transparent 70%)' }} />
        <RevealSection className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <SectionBadge icon={ImageIcon} label={language === 'en' ? 'Templates' : 'គំរូ Template'} />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3" style={{ lineHeight: '1.6' }}>{t('landing.demo.title')}</h2>
            <p className="text-gray-400 max-w-xl mx-auto" style={{ lineHeight: '2' }}>{t('landing.demo.subtitle')}</p>
          </div>
          <div className="overflow-hidden" ref={emblaRefTemplates}>
            <div className="flex gap-4 sm:gap-6">
              {templates.length > 0 ? templates.map((template, i) => (
                <div key={template.id} className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 lg:basis-1/3">
                  <motion.div whileHover={{ y: -6 }}
                    className="group bg-white/[0.03] rounded-2xl overflow-hidden border border-white/8 hover:border-yellow-500/30 flex flex-col h-[380px] sm:h-[400px] transition-all hover:shadow-2xl hover:shadow-yellow-500/5">
                    <div className="relative h-56 sm:h-60 bg-gray-900 flex items-center justify-center overflow-hidden shrink-0">
                      {template.previewUrl ? (
                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${template.previewUrl})` }} />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-950/30 to-gray-900 flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="relative z-10 text-center px-4">
                        <h3 className="text-lg font-bold text-yellow-400 uppercase tracking-widest drop-shadow-lg">{template.name}</h3>
                        {template.category && <p className="text-gray-300 text-xs uppercase tracking-wider mt-1">{template.category}</p>}
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 flex-1 flex items-end">
                      <a href={`/demo/default/?t=${template.codeKey}`} target="_blank"
                        className="w-full py-2.5 rounded-xl bg-yellow-500/10 hover:bg-yellow-500 text-yellow-400 hover:text-black border border-yellow-500/30 hover:border-yellow-500 flex items-center justify-center gap-2 transition-all font-medium text-sm">
                        <Eye className="w-4 h-4" />{t('landing.demo.testBtn')}
                      </a>
                    </div>
                  </motion.div>
                </div>
              )) : (
                <div className="w-full text-center text-gray-500 italic py-12">កំពុងទាញ Templates...</div>
              )}
            </div>
          </div>
        </RevealSection>
      </section>

      {/* ── PRICING ── */}
      {showPricing && (
        <section id="pricing" className="py-16 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(120,80,0,0.15) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, rgba(202,138,4,0.8) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          <RevealSection className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12 sm:mb-16">
              <SectionBadge icon={Crown} label={t('landing.pricing.badge')} />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4" style={{ lineHeight: '1.6' }}>
                {t('landing.pricing.title')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">{t('landing.pricing.titleHighlight')}</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto" style={{ lineHeight: '2' }}>
                {t('landing.pricing.subtitle')}
              </p>
            </div>

            <div className="overflow-hidden" ref={emblaRefPricing}>
              <div className="flex gap-4 sm:gap-5">
                {packages.map((pkg, i) => (
                  <div key={i} className="min-w-0 shrink-0 grow-0 basis-full sm:basis-1/2 xl:basis-1/4">
                    <PricingCard {...pkg} />
                  </div>
                ))}
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {packages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApiPricing?.scrollTo(i)}
                  className="w-2 h-2 rounded-full bg-yellow-500/30 hover:bg-yellow-500 transition-all"
                />
              ))}
            </div>

            {/* Contact CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 sm:mt-14 text-center"
            >
              <div className="inline-block p-6 sm:p-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 max-w-xl w-full">
                <div className="text-2xl mb-3">🤝</div>
                <h3 className="font-bold text-white text-lg mb-2" style={{ lineHeight: '1.7' }}>{t('landing.pricing.contactTitle')}</h3>
                <p className="text-gray-400 text-sm mb-5" style={{ lineHeight: '2' }}>{t('landing.pricing.contactSubtitle')}</p>
                <a
                  href="https://t.me/ketteyos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold shadow-[0_4px_20px_rgba(202,138,4,0.3)] hover:shadow-[0_6px_28px_rgba(202,138,4,0.5)] transition-all"
                >
                  <Zap className="w-4 h-4" />
                  {t('landing.pricing.contactBtn')}
                </a>
              </div>
            </motion.div>
          </RevealSection>
        </section>
      )}

      {/* ── Final CTA ── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(120,80,0,0.18) 0%, transparent 70%)' }} />
        {particles.slice(0, 8).map((p, i) => <Particle key={i} {...p} />)}
        <RevealSection className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div whileHover={{ scale: 1.06 }} className="inline-block mb-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl overflow-hidden border border-yellow-500/30 shadow-2xl shadow-yellow-500/20">
              <Image src={appLogo || "/icon.png"} alt="Logo" fill className="object-contain" />
            </div>
          </motion.div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 leading-tight" style={{ lineHeight: '1.65' }}>
            {t('landing.finalCta.title1')}<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">{t('landing.finalCta.titleHighlight')}</span>
            {t('landing.finalCta.title2') && t('landing.finalCta.title2')}
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-10 max-w-xl mx-auto whitespace-pre-line" style={{ lineHeight: '2' }}>
            {t('landing.finalCta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <button
                onClick={() => router.push(loggedInDash ?? '/contact')}
                className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-base sm:text-lg shadow-[0_8px_30px_rgba(202,138,4,0.4)] hover:shadow-[0_12px_40px_rgba(202,138,4,0.6)] transition-all inline-flex items-center gap-2.5"
              >
                <Sparkles className="w-5 h-5" />
                {loggedInDash ? (language === 'en' ? 'Go to Dashboard' : 'ចូលទៅផ្ទាំងគ្រប់គ្រងកម្មវិធី') : t('landing.finalCta.contactBtn')}
              </button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <button
                onClick={() => router.push(loggedInDash ?? '/login')}
                className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl border border-white/15 bg-white/5 text-white font-semibold text-base sm:text-lg hover:bg-white/10 transition-all inline-flex items-center gap-2"
              >
                {loggedInDash ? (language === 'en' ? 'Dashboard →' : 'ផ្ទាំងគ្រប់គ្រង') : t('landing.finalCta.loginBtn')}
                {!loggedInDash && <ArrowRight className="w-4 h-4" />}
              </button>
            </motion.div>
          </div>
        </RevealSection>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 py-10 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 relative rounded-xl overflow-hidden">
              <Image src="/icon.png" alt="Logo" fill className="object-cover" />
            </div>
            <span className="text-gray-500 text-sm">© {new Date().getFullYear()} {appName}. {t('footer.copyright')}</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link href="/privacy" className="hover:text-yellow-500 transition-colors">{t('footer.privacy')}</Link>
            <Link href="/terms" className="hover:text-yellow-500 transition-colors">{t('footer.terms')}</Link>
            <Link href="/contact" className="hover:text-yellow-500 transition-colors">{t('footer.contact')}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
