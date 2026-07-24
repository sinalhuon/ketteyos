'use client';

import Link from 'next/link';
import { ShieldCheck, ChevronLeft } from 'lucide-react';

export default function TermsPage() {
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
                        <ShieldCheck size={18} className="text-yellow-600 dark:text-yellow-500" />
                        Terms of Service
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
                <article className="prose prose-gray dark:prose-invert prose-headings:font-bold prose-h1:text-4xl md:prose-h1:text-5xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-li:text-gray-600 dark:prose-li:text-gray-400 max-w-none">
                    <h1>Terms of Service</h1>
                    <p className="lead text-lg mb-12">
                        Welcome to Ketteyos. By using our digital invitation platform, you agree to the following terms. Please read them carefully.
                    </p>

                    <section>
                        <h2>1. Use of Service</h2>
                        <p>
                            Ketteyos provides a platform for creating, managing, and sharing digital invitations and event frames. You are responsible for the content you upload and share.
                        </p>
                    </section>

                    <section>
                        <h2>2. User Accounts</h2>
                        <p>
                            To access certain features, you must create an account. You represent that the information you provide is accurate and that you will maintain the security of your account credentials.
                        </p>
                    </section>

                    <section>
                        <h2>3. Content & Copyright</h2>
                        <p>
                            You retain ownership of any media (photos, logos, music) you upload. However, by uploading content, you grant Ketteyos a license to host and display that content as part of your invitations. You must not upload content that violates third-party copyrights or local laws.
                        </p>
                    </section>

                    <section>
                        <h2>4. Prohibited Conduct</h2>
                        <ul>
                            <li>Do not use the service for illegal or unauthorized purposes.</li>
                            <li>Do not attempt to scrape or disrupt the integrity of the platform.</li>
                            <li>Do not upload harmful, offensive, or malicious content.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Payments & Refunds</h2>
                        <p>
                            Fees for premium services or templates are processed securely. All sales are final unless otherwise stated in specific promotional offers.
                        </p>
                    </section>

                    <section>
                        <h2>6. Limitation of Liability</h2>
                        <p>
                            Ketteyos is provided "as is". We are not liable for any service interruptions, data loss, or indirect damages resulting from the use of our platform.
                        </p>
                    </section>

                    <section>
                        <h2>7. Changes to Terms</h2>
                        <p>
                            We may update these terms from time to time. Your continued use of the platform after changes are posted constitutes acceptance of the new terms.
                        </p>
                    </section>

                    <footer className="mt-24 pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:justify-between items-center gap-4 text-xs text-gray-400">
                        <p>© {new Date().getFullYear()} Ketteyos. All rights reserved.</p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact Us</Link>
                        </div>
                    </footer>
                </article>
            </main>
        </div>
    );
}
