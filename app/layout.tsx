import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils/cn";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: "One Day One Juz | OD1J",
    description: "Modern Quran habit tracker for Gen Z - Developed by Derryl Youri",
    manifest: "/manifest.json",
    authors: [{ name: "Derryl Youri" }],
};

export const viewport: Viewport = {
    themeColor: "#090909",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

import { GlassTabBar } from "@/components/ui/GlassTabBar";
import { ThemeProvider } from "@/lib/theme/ThemeContext";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={cn(
                inter.variable,
                outfit.variable,
                "font-sans bg-[var(--bg-app)] text-[var(--text-primary)] antialiased min-h-screen transition-colors duration-300"
            )}>
                <ThemeProvider>
                    <div className="max-w-md mx-auto min-h-screen flex flex-col relative pb-32 px-5 pt-8 sm:px-6">
                        {children}
                    </div>
                    <GlassTabBar />
                </ThemeProvider>
            </body>
        </html>
    );
}
