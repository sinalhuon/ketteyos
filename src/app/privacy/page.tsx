'use client';

import Link from 'next/link';
import { Lock, ChevronLeft } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 selection:bg-yellow-200 dark:selection:bg-yellow-900/40">
            {/* Header */}
            <header className="border-b border-gray-100 dark:border-white/5 sticky top-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md z-10">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                        <ChevronLeft size={16} />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm">
                        <Lock size={18} className="text-yellow-600 dark:text-yellow-500" />
                        Privacy Policy
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <article className="prose prose-gray dark:prose-invert prose-headings:font-bold prose-h1:text-4xl md:prose-h1:text-5xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-li:text-gray-600 dark:prose-li:text-gray-400 max-w-none">
                    <h1>Privacy Policy</h1>
                    <p className="lead text-lg mb-12">
                        Your privacy is important to us. This policy explains how Ketteyos collects, uses, and protects your information.
                    </p>

                    <section>
                        <h2>1. Information We Collect</h2>
                        <p>
                            We collect information you provide directly to us, such as your name, email address, and event details when you create an account or build an invitation. We also collect media files you upload (photos, logos).
                        </p>
                    </section>

                    <section>
                        <h2>2. How We Use Information</h2>
                        <ul>
                            <li>To provide, maintain, and improve our services.</li>
                            <li>To personalize your invitations and event pages.</li>
                            <li>To communicate with you about your account or updates.</li>
                            <li>To track website traffic via Google Analytics (if configured).</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Sharing of Information</h2>
                        <p>
                            We do not sell your personal data. We only share information as needed to deliver the service (e.g., displaying your invitation to your invited guests) or when required by law.
                        </p>
                    </section>

                    <section>
                        <h2>4. Data Security</h2>
                        <p>
                            We use industry-standard measures to protect your data. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2>5. Cookies & Tracking</h2>
                        <p>
                            We use cookies and similar technologies to enhance your experience and analyze usage. You can manage your cookie preferences through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2>6. Third-Party Services</h2>
                        <p>
                            Our platform may integrate with third-party services like Google Analytics or social media platforms. These services have their own privacy policies.
                        </p>
                    </section>

                    <section>
                        <h2>7. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us through our dedicated contact page.
                        </p>
                    </section>

                    <footer className="mt-24 pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:justify-between items-center gap-4 text-xs text-gray-400">
                        <p>© {new Date().getFullYear()} Ketteyos. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</Link>
                            <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact Us</Link>
                        </div>
                    </footer>
                </article>
            </main>
        </div>
    );
}
