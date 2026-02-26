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

    // Grouping for month labels with overlap prevention
    const monthLabels = useMemo(() => {
        const labels: { month: string; index: number }[] = [];
        let lastLabelIndex = -10;
        heatmapData.forEach((item, index) => {
            const currentMonth = item.date.getMonth();
            const colIndex = Math.floor(index / 7);

            if (index % 7 === 0) {
                const prevItem = heatmapData[index - 7];
                const monthChanged = prevItem ? prevItem.date.getMonth() !== currentMonth : true;

                if (monthChanged && (colIndex - lastLabelIndex >= 4)) {
                    labels.push({
                        month: item.date.toLocaleDateString('id-ID', { month: 'short' }),
                        index: colIndex
                    });
                    lastLabelIndex = colIndex;
                }
            }
        });
        return labels;
    }, [heatmapData]);

    // Close tooltip when clicking outside
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelectedDate(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="relative group/heatmap flex flex-col gap-8">
            {/* Legend or Tooltip Space */}
            <div className="h-16 flex items-center justify-center">
                {selectedDate ? (
                    <div className="animate-fade-in bg-stealth-surface border border-[var(--border-glass-vibrant)] rounded-[20px] px-5 py-2.5 shadow-2xl backdrop-blur-2xl flex flex-col items-center min-w-[180px]">
                        <span className="text-[9px] font-black uppercase tracking-[2.5px] text-text-muted">
                            {selectedDate.date.toLocaleDateString('id-ID', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </span>
                        <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-sm font-black text-text-primary">{selectedDate.count} Juz</span>
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                selectedDate.targetMet ? "bg-[#FFD60A] shadow-[0_0_12px_rgba(255,214,10,0.5)] animate-pulse" : "bg-text-muted"
                            )} />
                            <span className={cn(
                                "text-[10px] font-black uppercase tracking-wider",
                                selectedDate.targetMet ? "text-[#EAB308] dark:text-[#FFD60A]" : "text-text-muted"
                            )}>
                                {selectedDate.targetMet ? "Target Tercapai" : "Belum Target"}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4 opacity-70 bg-stealth-surface/40 px-4 py-2 rounded-full border border-[var(--border-glass)]">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-[3px] bg-stealth-surface border border-[var(--border-glass)]" />
                            <span className="text-mono !text-[9px] text-text-muted">0</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-[3px] bg-[#FFD60A]/20" />
                            <span className="text-mono !text-[9px] text-text-muted">1</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-[3px] bg-[#FFD60A]/50" />
                            <span className="text-mono !text-[9px] text-text-muted">2</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-[3px] bg-[#FFD60A] shadow-[0_0_8px_rgba(255,214,10,0.3)]" />
                            <span className="text-mono !text-[9px] text-text-muted">3+</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3 scale-95 origin-left sm:scale-100">
                {/* Month Labels */}
                <div className="relative h-4 ml-8">
                    {monthLabels.map((label, i) => (
                        <span
                            key={i}
                            className="absolute text-[8px] font-black uppercase tracking-widest text-text-muted transition-opacity opacity-60"
                            style={{ left: `${label.index * 19.5}px` }}
                        >
                            {label.month}
                        </span>
                    ))}
                </div>

                <div className="flex gap-3">
                    {/* Day Labels */}
                    <div className="grid grid-rows-7 gap-1.5 h-full pt-1">
                        <span className="h-[13px] flex items-center text-[7px] font-black text-text-muted/40 uppercase"></span>
                        <span className="h-[13px] flex items-center text-[7px] font-black text-text-muted/80 uppercase">Sen</span>
                        <span className="h-[13px] flex items-center text-[7px] font-black text-text-muted/40 uppercase"></span>
                        <span className="h-[13px] flex items-center text-[7px] font-black text-text-muted/80 uppercase">Rab</span>
                        <span className="h-[13px] flex items-center text-[7px] font-black text-text-muted/40 uppercase"></span>
                        <span className="h-[13px] flex items-center text-[7px] font-black text-text-muted/80 uppercase">Jum</span>
                        <span className="h-[13px] flex items-center text-[7px] font-black text-text-muted/40 uppercase"></span>
                    </div>

                    <div className="grid grid-flow-col grid-rows-7 gap-1.5 flex-1 p-2 bg-white/5 dark:bg-black/5 rounded-lg border border-transparent">
                        {heatmapData.map((item) => {
                            const isToday = item.dateId === todayId;
                            const isSelected = selectedDate?.dateId === item.dateId;

                            let tileColor = "bg-stealth-surface border border-[var(--border-glass)]";
                            if (item.count === 1) tileColor = "bg-[#FFD60A]/20 dark:bg-[#FFD60A]/10 border border-[#FFD60A]/10";
                            if (item.count === 2) tileColor = "bg-[#FFD60A]/50 dark:bg-[#FFD60A]/30 border border-[#FFD60A]/20";
                            if (item.count >= 3) tileColor = "bg-[#FFD60A] shadow-[0_0_15px_rgba(255,214,10,0.4)] border border-[#FFD60A]";

                            return (
                                <div
                                    key={item.dateId}
                                    tabIndex={0}
                                    onMouseEnter={() => setSelectedDate(item)}
                                    onClick={() => setSelectedDate(item)}
                                    className={cn(
                                        "h-[13px] w-[13px] rounded-[3px] transition-all duration-500 outline-none cursor-pointer",
                                        tileColor,
                                        isToday && "ring-2 ring-[#FFD60A]/40 ring-offset-2 ring-offset-background",
                                        isSelected ? "scale-[1.6] z-30 brightness-110 shadow-2xl" : "hover:scale-[1.3] z-20 hover:brightness-105"
                                    )}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
