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
    onClick?: () => void;
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
            "rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 border backdrop-blur-sm",
            variant === "yellow"
                ? "bg-[#FFD60A] border-none text-black high-contrast-shadow"
                : "bg-white/5 border-white/10 text-white high-contrast-shadow hover:bg-white/10",
            size === "small" ? "h-28 p-4" : "h-40",
            className
        )}>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    {icon && <span className={cn(variant === "yellow" ? "text-black/60" : "text-[#FFD60A]")}>{icon}</span>}
                    <span className={cn(
                        "text-ios-caption",
                        variant === "yellow" ? "text-black/40" : "text-white/30"
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
                    "text-ios-mono text-[9px]",
                    variant === "yellow" ? "text-black/40" : "text-white/20"
                )}>{subValue}</span>
            )}
        </div>
    );
};
