"use client";

import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils/cn";
import { Home, BookOpen, BarChart2, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
    { name: "Home", href: "/", icon: Home },
    { name: "Quran", href: "/quran", icon: BookOpen },
    { name: "Progress", href: "/progress", icon: BarChart2 },
    { name: "Profile", href: "/profile", icon: User },
];

export const GlassTabBar = () => {
    const pathname = usePathname();
    const scrollDirection = useScrollDirection();
    const isDown = scrollDirection === "down";

    return (
        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-8 pointer-events-none">
            <nav
                className={cn(
                    "bg-[#161616] border border-white/5 pointer-events-auto flex items-center justify-around gap-2 rounded-[32px] px-6 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) high-contrast-shadow",
                    isDown ? "h-16 w-64 translate-y-2 opacity-90 scale-95" : "h-20 w-full max-w-lg translate-y-0 opacity-100 scale-100"
                )}
            >
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;
                    const Icon = tab.icon;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={cn(
                                "press-scale relative flex flex-col items-center justify-center gap-1.5 transition-all duration-500",
                                isActive ? "text-[#E2FF31]" : "text-white/20 hover:text-white/40",
                                isDown ? "p-2" : "flex-1 px-4"
                            )}
                        >
                            <div className={cn(
                                "relative p-2 rounded-2xl transition-all duration-500",
                                isActive && "bg-[#E2FF31]/10 shadow-[0_0_20px_rgba(226,255,49,0.1)]"
                            )}>
                                <Icon
                                    size={isDown ? 22 : 24}
                                    className={cn("transition-all duration-500", isActive && "drop-shadow-[0_0_8px_rgba(226,255,49,0.5)]")}
                                />
                            </div>

                            {!isDown && (
                                <span className={cn(
                                    "text-ios-mono transition-all duration-500",
                                    isActive ? "opacity-100 translate-y-0 text-[#E2FF31]" : "opacity-40 translate-y-1"
                                )}>
                                    {tab.name}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
