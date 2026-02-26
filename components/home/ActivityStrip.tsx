"use client";

import { cn } from "@/lib/utils/cn";
import { useEffect, useRef } from "react";
import { formatDateId, getTodayDateId, parseDateId } from "@/lib/utils/date";

interface ActivityStripProps {
    type: "history" | "target";
    currentValue: string | number; // dateId or juzNumber
    onSelect: (value: any) => void;
    completions?: any[];
}

export const ActivityStrip = ({ type, currentValue, onSelect, completions = [] }: ActivityStripProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to selected item
    useEffect(() => {
        if (scrollRef.current) {
            const activeItem = scrollRef.current.querySelector('[data-active="true"]');
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [currentValue]);

    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    if (type === "history") {
        // Generate last 14 days
        const last14Days = Array.from({ length: 14 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (13 - i));
            return d;
        });

        return (
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-6 pt-2 scrollbar-hide px-6 -mx-6"
            >
                {last14Days.map((date) => {
                    const id = formatDateId(date);
                    const isActive = currentValue === id;
                    const completionCount = completions.filter(c => c.date_id === id).length;

                    return (
                        <button
                            key={id}
                            data-active={isActive}
                            onClick={() => onSelect(id)}
                            className={cn(
                                "flex flex-col items-center justify-between min-w-[64px] h-[84px] shrink-0 rounded-[24px] transition-all duration-500 border py-3",
                                isActive
                                    ? "bg-neon border-none scale-105 shadow-neon-glow z-10"
                                    : "bg-stealth-surface border-[var(--border-glass)] text-text-muted hover:bg-stealth-surface/80"
                            )}
                        >
                            <span className={cn(
                                "text-mono !text-[8px] uppercase tracking-widest font-black",
                                isActive ? "!text-black/40" : "text-text-muted"
                            )}>
                                {days[date.getDay()]}
                            </span>

                            {completionCount > 0 ? (
                                <div className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black",
                                    isActive ? "bg-black text-neon" : "bg-neon text-black"
                                )}>
                                    {completionCount}
                                </div>
                            ) : (
                                <span className={cn(
                                    "text-xl font-black tracking-tighter",
                                    isActive ? "!text-black" : "text-text-primary"
                                )}>
                                    {date.getDate()}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }

    // Target mode (original JuzPicker logic)
    return (
        <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-8 pt-2 scrollbar-hide px-6 -mx-6"
        >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                <button
                    key={juz}
                    data-active={Number(currentValue) === juz}
                    onClick={() => onSelect(juz)}
                    className={cn(
                        "flex flex-col items-center justify-center min-w-[72px] h-[92px] shrink-0 rounded-[28px] transition-all duration-500 border",
                        Number(currentValue) === juz
                            ? "bg-neon border-none scale-110 shadow-neon-glow z-10"
                            : "bg-stealth-surface border-[var(--border-glass)] text-text-dim hover:bg-stealth-surface/50 active:scale-95"
                    )}
                >
                    <span className={cn(
                        "text-mono !text-[8px] uppercase tracking-[2px] mb-1.5 font-black",
                        Number(currentValue) === juz ? "!text-black/40" : "text-text-muted"
                    )}>
                        JUZ
                    </span>
                    <span className={cn(
                        "text-3xl font-black tracking-tighter leading-none",
                        Number(currentValue) === juz ? "!text-black" : "text-text-primary"
                    )}>
                        {juz}
                    </span>
                </button>
            ))}
        </div>
    );
};
