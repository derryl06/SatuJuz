"use client";

import { cn } from "@/lib/utils/cn";
import { useEffect, useRef } from "react";

interface JuzPickerProps {
    currentJuz: number;
    onSelect: (juz: number) => void;
    variant?: "strip" | "grid";
}

export const JuzPicker = ({ currentJuz, onSelect, variant = "strip" }: JuzPickerProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to selected juz (only for strip variant)
    useEffect(() => {
        if (variant === "strip" && scrollRef.current) {
            const activeItem = scrollRef.current.querySelector('[data-active="true"]');
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [currentJuz, variant]);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    if (variant === "grid") {
        return (
            <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                    <button
                        key={juz}
                        onClick={() => onSelect(juz)}
                        className={cn(
                            "flex h-14 w-full items-center justify-center rounded-[20px] font-black transition-all duration-300 border",
                            currentJuz === juz
                                ? "bg-neon border-none text-black shadow-neon-glow scale-105 z-10"
                                : "bg-stealth-surface border-[var(--border-glass)] text-text-muted hover:bg-stealth-surface/80 hover:text-text-primary"
                        )}
                    >
                        {juz}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-8 pt-2 scrollbar-hide px-6 -mx-6"
        >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                <button
                    key={juz}
                    data-active={currentJuz === juz}
                    onClick={() => onSelect(juz)}
                    className={cn(
                        "flex flex-col items-center justify-center min-w-[72px] h-[92px] shrink-0 rounded-[28px] transition-all duration-500 border",
                        currentJuz === juz
                            ? "bg-neon border-none scale-110 shadow-neon-glow z-10"
                            : "bg-stealth-surface border-[var(--border-glass)] text-text-dim hover:bg-stealth-surface/50 active:scale-95"
                    )}
                >
                    <span className={cn(
                        "text-mono !text-[8px] uppercase tracking-[2px] mb-1.5 font-black",
                        currentJuz === juz ? "!text-black/40" : "text-text-muted"
                    )}>
                        {days[(juz - 1) % 7]}
                    </span>
                    <span className={cn(
                        "text-3xl font-black tracking-tighter leading-none",
                        currentJuz === juz ? "!text-black" : "text-text-primary"
                    )}>
                        {juz}
                    </span>
                </button>
            ))}
        </div>
    );
};
