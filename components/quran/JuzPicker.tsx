"use client";

import { cn } from "@/lib/utils/cn";
import { useEffect, useRef } from "react";

interface JuzPickerProps {
    currentJuz: number;
    onSelect: (juz: number) => void;
}

export const JuzPicker = ({ currentJuz, onSelect }: JuzPickerProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to selected juz
    useEffect(() => {
        if (scrollRef.current) {
            const activeItem = scrollRef.current.querySelector('[data-active="true"]');
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [currentJuz]);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <span className="text-ios-headline text-white">Juz Calendar</span>
                <span className="text-ios-mono text-white/20">Ramadan 1447</span>
            </div>

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
                            "flex flex-col items-center justify-center min-w-[64px] h-[86px] shrink-0 rounded-[24px] transition-all duration-300 border",
                            currentJuz === juz
                                ? "bg-[#E2FF31] border-[#E2FF31] scale-105 shadow-[0_10px_20px_rgba(226,255,49,0.2)]"
                                : "bg-[#161616] border-white/5 text-white/40 hover:border-white/20"
                        )}
                    >
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest mb-1",
                            currentJuz === juz ? "text-black/40" : "text-white/20"
                        )}>
                            {days[(juz - 1) % 7]}
                        </span>
                        <span className={cn(
                            "text-2xl font-black tracking-tighter",
                            currentJuz === juz ? "text-black" : "text-white"
                        )}>
                            {juz}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
