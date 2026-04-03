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

// export const metadata: Metadata = {
//   title: "Integrated System Design Lab",
//   description: "Official website of the Integrated System Design Lab",
// };
export const metadata: Metadata = {
  title: "Integrated System Design Lab | NIT Rourkela| ISDL NIT Rourkela",
  description:
    "Official website of Integrated System Design Lab (ISDL) at NIT Rourkela — Focused on research in integrated circuit design, embedded systems, MEMS sensors, and low-power instrumentation.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  keywords: [
    "Integrated System Design Lab NIT Rourkela",
     "Integrated System Design Lab nit rkl",
      "Integrated System Design Lab nit rourkela",
    "nit rkl lab",
    "nit rourkela lab",
    "isdl nit rkl",
    "isdl nit rourkela",
    "isdl icsense",
    "Sougata Kar Lab",
    "ISDL",
    "NIT Rourkela",
    "IC Design Laboratory",
    "MEMS Sensors Laboratory",
    "Embedded Systems Laboratory",
    "Instrumentation Laboratory",
    "Analog and Mixed-Signal Laboratory",
    "Low-Power Circuits Laboratory",
    "Neuromorphic Circuits Laboratory",
  ],

  authors: [{ name: "Integrated System Design Lab (ISDL), NIT Rourkela" }],
  creator: "Integrated System Design Lab (ISDL), NIT Rourkela",
  publisher: "National Institute of Technology Rourkela",

  openGraph: {
    title: "ISDL | Integrated System Design Lab – NIT Rourkela",
    description:
      "The Integrated System Design Lab (ISDL) at NIT Rourkela specializes in IC design, MEMS sensors, embedded instrumentation, and complete system integration from research to testing.",
    url: "https://isdl.icsense.in",
    siteName: "ISDL NIT Rourkela",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://isdl.icsense.in/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Integrated System Design Lab (ISDL) – NIT Rourkela",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ISDL | Integrated System Design Lab – NIT Rourkela",
    description:
      "Explore research and development at ISDL, NIT Rourkela in integrated circuit design, MEMS sensors, and embedded systems.",
    images: ["https://isdl.icsense.in/favicon.ico"],
  },

  metadataBase: new URL("https://isdl.icsense.in"),

  alternates: {
    canonical: "https://isdl.icsense.in",
  },

  verification: {
    google: "f8gkuE0P3FODD2IjB9mMbojHXkoJTcjr5Bu6IryC4PA",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
