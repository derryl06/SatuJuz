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
        <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <nav
                className={cn(
                    "bg-[var(--surface-app)] border border-[var(--border-glass)] backdrop-blur-2xl pointer-events-auto flex items-center justify-around rounded-[32px] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) shadow-[0_12px_40px_rgba(0,0,0,0.2)]",
                    isDown ? "h-[64px] w-[240px] opacity-90 scale-95" : "h-[80px] w-full max-w-[360px] opacity-100 scale-100"
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
                                "relative flex flex-col items-center justify-center transition-all duration-500",
                                isActive ? "text-neon" : "text-[var(--text-muted)] hover:text-[var(--text-dim)]",
                                isDown ? "flex-shrink-0" : "flex-1"
                            )}
                        >
                            <div className={cn(
                                "p-2.5 rounded-2xl transition-all duration-500",
                                isActive && !isDown && "bg-neon/10"
                            )}>
                                <Icon
                                    size={isDown ? 20 : 24}
                                    strokeWidth={isActive ? 2.5 : 2}
                                    className={cn("transition-all duration-500", isActive && "drop-shadow-[0_0_10px_rgba(255,214,10,0.3)]")}
                                />
                            </div>

                            {!isDown && (
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-[1.5px] transition-all duration-500",
                                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-90 h-0 w-0"
                                )}>
                                    {isActive ? tab.name : ""}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
};
