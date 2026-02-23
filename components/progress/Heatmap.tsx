"use client";

import { useMemo, useState, useEffect } from "react";
import { JuzCompletion } from "@/types/domain";
import { formatDateId } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

interface HeatmapProps {
    completions: JuzCompletion[];
    dailyTarget: number;
}

export const Heatmap = ({ completions, dailyTarget }: HeatmapProps) => {
    const days = 90;
    const [selectedDate, setSelectedDate] = useState<{
        dateId: string;
        count: number;
        targetMet: boolean;
        date: Date;
    } | null>(null);

    const todayId = useMemo(() => formatDateId(new Date()), []);

    const heatmapData = useMemo(() => {
        const data: Record<string, number> = {};
        completions.forEach((c) => {
            data[c.date_id] = (data[c.date_id] || 0) + 1;
        });

        const items = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateId = formatDateId(d);
            const count = data[dateId] || 0;
            items.push({
                dateId,
                count,
                targetMet: count >= dailyTarget,
                date: d
            });
        }
        return items;
    }, [completions, dailyTarget]);

    // Close tooltip when clicking outside
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedDate(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="relative group/heatmap flex flex-col gap-4">
            {/* Legend or Tooltip Space */}
            <div className="h-14 flex items-center justify-center">
                {selectedDate ? (
                    <div className="animate-fade-in bg-stealth-surface border border-[var(--border-glass-vibrant)] rounded-2xl px-4 py-2 shadow-xl backdrop-blur-xl flex flex-col items-center">
                        <span className="text-[8px] font-black uppercase tracking-[2px] text-text-muted">
                            {selectedDate.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-sm font-black text-text-primary">{selectedDate.count} Juz</span>
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full animate-pulse",
                                selectedDate.targetMet ? "bg-neon shadow-neon-glow" : "bg-text-muted"
                            )} />
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-wider",
                                selectedDate.targetMet ? "text-neon" : "text-text-muted"
                            )}>
                                {selectedDate.targetMet ? "Target Met" : "Target Not Met"}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 opacity-50">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-[3px] bg-stealth-surface border border-[var(--border-glass)]" />
                            <span className="text-mono !text-[8px]">0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-[3px] bg-neon/20" />
                            <span className="text-mono !text-[8px]">1</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-[3px] bg-neon/50" />
                            <span className="text-mono !text-[8px]">2</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-[3px] bg-neon" />
                            <span className="text-mono !text-[8px]">3+</span>
                        </div>
                    </div>
                )}
            </div>

            <div
                className="grid grid-flow-col grid-rows-7 gap-1.5"
            >
                {heatmapData.map((item) => {
                    const isToday = item.dateId === todayId;
                    const isSelected = selectedDate?.dateId === item.dateId;
                    return (
                        <div
                            key={item.dateId}
                            tabIndex={0}
                            onMouseEnter={() => setSelectedDate(item)}
                            onClick={() => setSelectedDate(item)}
                            className={cn(
                                "h-[13px] w-[13px] rounded-[3px] transition-all duration-300 outline-none cursor-pointer",
                                item.count === 0 && "bg-stealth-surface border border-[var(--border-glass)]",
                                item.count === 1 && "bg-neon/20",
                                item.count === 2 && "bg-neon/50",
                                item.count >= 3 && "bg-neon shadow-[0_0_10px_rgba(255,214,10,0.3)]",
                                isToday && "ring-2 ring-neon/40 ring-offset-1 ring-offset-transparent",
                                isSelected ? "scale-125 z-10 brightness-125" : "hover:scale-110"
                            )}
                        />
                    );
                })}
            </div>
        </div>
    );
};
