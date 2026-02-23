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
        <div className="grid grid-flow-col grid-rows-7 gap-1.5">
            {heatmapData.map((item, i) => (
                <div
                    key={item.dateId}
                    title={`${item.dateId}: ${item.count} juz`}
                    className={cn(
                        "h-[13px] w-[13px] rounded-[3px] transition-all duration-700",
                        item.count === 0 && "bg-stealth-translucent border border-stealth-border",
                        item.count === 1 && "bg-neon/20",
                        item.count === 2 && "bg-neon/50",
                        item.count >= 3 && "bg-neon shadow-neon-glow"
                    )}
                />
            ))}
        </div>
    );
};
