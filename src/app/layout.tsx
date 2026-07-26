import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/providers/themeProvider";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
export const revalidate = 300;
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL!
  ),

  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME!,
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  },

  description:
    "Watch trending videos, latest uploads, popular entertainment and streaming content.",

  applicationName: process.env.NEXT_PUBLIC_APP_NAME,

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.className}  h-full antialiased`}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <NextTopLoader color="#FF4D8D" height={3} showSpinner={false} />
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
