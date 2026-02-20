import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils/cn";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "One Day One Juz | OD1J",
    description: "Modern Quran habit tracker for Gen Z",
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    themeColor: "#090909",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

import { GlassTabBar } from "@/components/ui/GlassTabBar";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={cn(inter.className, "bg-[#090909] text-white")}>
                <main className="relative z-10 min-h-screen pb-32">
                    {children}
                </main>
                <GlassTabBar />
            </body>
        </html>
    );
}
