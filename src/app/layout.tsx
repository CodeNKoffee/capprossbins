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
  title: "CapprossBins - Advanced Credit Scoring & Risk Analytics",
  description: "Intelligent binning and credit risk assessment platform for financial institutions. Advanced analytics, secure data processing, and real-time insights.",
  keywords: "credit scoring, risk analytics, binning, financial technology, credit assessment"
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
