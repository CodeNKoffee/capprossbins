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
  title: "CapprossBins - Intelligent Credit Scoring & Binning",
  description: "Your binning engine for transparent, intelligent credit scoring. Built for clarity. Powered by binning. Trusted in credit scoring.",
  keywords: "credit scoring, risk analytics, binning, financial technology, credit assessment",
  authors: [{ name: "Yasser Soliman" }],
  creator: "Yasser Soliman",
  publisher: "Yasser Soliman",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://capprossbins.cappross.com"),
  alternates: {
    canonical: "https://capprossbins.cappross.com",
    types: {
      "text/html": [
        { url: "https://capprossbins.cappross.com", title: "CapprossBins - Netlify" },
        { url: "https://capprossbins.cappross.com", title: "CapprossBins - Custom Domain" }
      ]
    }
  },
  openGraph: {
    title: "CapprossBins - Intelligent Credit Scoring & Binning",
    description:
      "Your binning engine for transparent, intelligent credit scoring. Built for clarity. Powered by binning. Trusted in credit scoring.",
    url: "https://capprossbins.cappross.com",
    siteName: "CapprossBins",
    images: [
      {
        url: "/assets/images/bin-stats.jpeg",
        width: 512,
        alt: "CapprossBins - Intelligent Credit Scoring & Binning",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CapprossBins - Intelligent Credit Scoring & Binning",
    description:
      "Your binning engine for transparent, intelligent credit scoring. Built for clarity. Powered by binning. Trusted in credit scoring.",
    images: ["/assets/images/bin-stats.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "Financial Technology",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}> 
        {children}
      </body>
    </html>
  );
}
