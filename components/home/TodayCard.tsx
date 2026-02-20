"use client";

import { cn } from "@/lib/utils/cn";
import React from "react";

interface StatTileProps {
    label: string;
    value: string | number;
    subValue?: string;
    icon?: React.ReactNode;
    variant?: "yellow" | "gray";
    size?: "large" | "small";
    className?: string;
}

export const StatTile = ({
    label,
    value,
    subValue,
    icon,
    variant = "gray",
    size = "large",
    className
}: StatTileProps) => {
    return (
        <div className={cn(
            "rounded-[32px] p-6 flex flex-col justify-between transition-all duration-300 border",
            variant === "yellow"
                ? "bg-[#E2FF31] border-none text-black shadow-[0_20px_40px_rgba(226,255,49,0.1)]"
                : "bg-[#161616] border-white/5 text-white shadow-xl",
            size === "small" ? "h-32 p-5" : "h-44",
            className
        )}>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    {icon && <span className={cn(variant === "yellow" ? "text-black/60" : "text-[#E2FF31]")}>{icon}</span>}
                    <span className={cn(
                        "text-ios-caption",
                        variant === "yellow" ? "text-black/40" : "text-white/20"
                    )}>{label}</span>
                </div>
                <h2 className={cn(
                    "font-black tracking-tighter leading-none",
                    size === "large" ? "text-4xl" : "text-xl mt-1"
                )}>
                    {value}
                </h2>
            </div>
            {subValue && (
                <span className={cn(
                    "text-ios-mono",
                    variant === "yellow" ? "text-black/40" : "text-white/20"
                )}>{subValue}</span>
            )}
        </div>
    );
};

interface TodayCardProps {
    targetJuz: number;
    streak: number;
}

/**
 * Legacy TodayCard repurposed as a grid factory
 */
export const TodayCard = ({ targetJuz, streak }: TodayCardProps) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <StatTile
                label="Target"
                value={`Juz ${targetJuz}`}
                subValue="Next Challenge"
                variant="yellow"
            />
            <StatTile
                label="Streak"
                value={`${streak} Hari`}
                subValue="Current Progress"
            />
        </div>
    );
};
