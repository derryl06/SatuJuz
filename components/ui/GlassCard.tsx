import { cn } from "@/lib/utils/cn";
import React from "react";

export interface GlassCardProps {
    children?: React.ReactNode;
    className?: string;
    hoverEffect?: boolean;
}

/**
 * Redesigned as StealthCard (solid high-contrast cards)
 * Maintaining name GlassCard for backward compatibility unless refactoring all imports.
 */
export const GlassCard = ({ children, className, hoverEffect = true }: GlassCardProps) => {
    return (
        <div
            className={cn(
                "bg-stealth-translucent border border-stealth-border rounded-[28px] p-6 shadow-sm transition-all duration-300",
                hoverEffect && "hover:bg-stealth-surface/80 active:scale-[0.98]",
                className
            )}
        >
            {children}
        </div>
    );
};
