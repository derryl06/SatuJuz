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
            <body className={cn(inter.className, "bg-[#0B0F10] text-white antialiased")}>
                <main className="relative z-10 min-h-screen max-w-md mx-auto px-4 pb-32 flex flex-col gap-4">
                    {children}
                </main>
                <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
                    <div className="max-w-md mx-auto px-4 pb-8">
                        <GlassTabBar />
                    </div>
                </div>
            </body>
        </html>
    );
}
