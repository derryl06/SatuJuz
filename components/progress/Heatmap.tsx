"use client";

import { useMemo } from "react";
import { JuzCompletion } from "@/types/domain";
import { formatDateId } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

interface HeatmapProps {
    completions: JuzCompletion[];
}

export const Heatmap = ({ completions }: HeatmapProps) => {
    const days = 90;

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
            items.push({
                dateId,
                count: data[dateId] || 0,
            });
        }
        return items;
    }, [completions]);

    return (
        <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
            {heatmapData.map((item, i) => (
                <div
                    key={item.dateId}
                    title={`${item.dateId}: ${item.count} juz`}
                    className={cn(
                        "h-3 w-3 rounded-lg transition-all duration-500 border",
                        item.count === 0 && "bg-white/5 border-white/5",
                        item.count === 1 && "bg-[#FFD60A]/20 border-[#FFD60A]/10 shadow-[0_0_8px_rgba(255,214,10,0.05)]",
                        item.count === 2 && "bg-[#FFD60A]/50 border-[#FFD60A]/20 shadow-[0_0_8px_rgba(255,214,10,0.1)]",
                        item.count >= 3 && "bg-[#FFD60A] border-none shadow-[0_0_12px_rgba(255,214,10,0.3)]"
                    )}
                />
            ))}
        </div>
    );
};
