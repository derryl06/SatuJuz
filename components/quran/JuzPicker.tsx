"use client";

import { cn } from "@/lib/utils/cn";
import { useEffect, useRef } from "react";

interface JuzPickerProps {
    currentJuz: number;
    onSelect: (juz: number) => void;
}

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
            <div className="grid grid-cols-5 gap-3 p-2">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                    <button
                        key={juz}
                        onClick={() => onSelect(juz)}
                        className={cn(
                            "flex h-12 w-full items-center justify-center rounded-2xl font-black transition-all duration-300 border",
                            currentJuz === juz
                                ? "bg-[#FFD60A] border-none text-black shadow-[0_0_15px_rgba(255,214,10,0.3)] scale-90"
                                : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
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
            className="flex gap-3 overflow-x-auto pb-6 pt-2 scrollbar-hide px-6 -mx-6 mask-fade-edges"
        >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                <button
                    key={juz}
                    data-active={currentJuz === juz}
                    onClick={() => onSelect(juz)}
                    className={cn(
                        "flex flex-col items-center justify-center min-w-[64px] h-[86px] shrink-0 rounded-3xl transition-all duration-300 border backdrop-blur-sm",
                        currentJuz === juz
                            ? "bg-[#FFD60A] border-none scale-105 shadow-[0_10px_25px_rgba(255,214,10,0.3)]"
                            : "bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:bg-white/10"
                    )}
                >
                    <span className={cn(
                        "text-ios-mono text-[9px] mb-1",
                        currentJuz === juz ? "text-black/40" : "text-white/20"
                    )}>
                        {days[(juz - 1) % 7]}
                    </span>
                    <span className={cn(
                        "text-2xl font-black tracking-tighter",
                        currentJuz === juz ? "text-black" : "text-white/90"
                    )}>
                        {juz}
                    </span>
                </button>
            ))}
        </div>
    );
};
