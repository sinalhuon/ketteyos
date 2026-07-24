import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ketteyos - លិខិតអញ្ជើញឌីជីថល និង ធៀបអេឡិចត្រូនិច | Digital Invitations",
  description: "Create and share premium digital invitations, birthday invitations, and event frames. លិខិតអញ្ជើញឌីជីថល ធៀបអេឡិចត្រូនិច និងស៊ុមរូបថតដ៏ស្រស់ស្អាតសម្រាប់កម្មវិធីរបស់អ្នក។",
  keywords: [
    "ធៀបអញ្ជើញ", "លិខិតអញ្ជើញឌីជីថល", "ធៀបអេឡិចត្រូនិច", "ធៀបអនឡាញ", "Ketteyos", "invitation program", "digital invitation", "birthday invitation", "event frame", "digital invitation cambodia", "wedding website cambodia", "online invitation"
  ],
  authors: [{ name: "Ketteyos" }],
  openGraph: {
    title: "Ketteyos - Digital Invitations & Event Frames",
    description: "Create and share your digital invitations with Ketteyos. លិខិតអញ្ជើញឌីជីថល ធៀបអេឡិចត្រូនិច និងស៊ុមរូបថតដ៏ស្រស់ស្អាត។",
    url: "https://ketteyos.com",
    siteName: "Ketteyos",
    locale: "km_KH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ketteyos - Digital Invitations",
    description: "Create and share your digital invitations with Ketteyos.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Providers } from "@/components/Providers";
import AnalyticsWrapper from "@/components/AnalyticsWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme) {
                    document.documentElement.classList.add(theme);
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <AnalyticsWrapper />
          {children}
        </Providers>
      </body>
    </html>
  );
}
