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
                "bg-white/5 border border-white/10 rounded-[28px] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-sm transition-all duration-300",
                hoverEffect && "hover:bg-white/[0.08] hover:border-white/20",
                className
            )}
        >
            {children}
        </div>
    );
};
