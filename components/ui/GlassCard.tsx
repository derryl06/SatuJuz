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
                "stealth-surface p-4 transition-all duration-300 high-contrast-shadow",
                hoverEffect && "hover:border-white/20 hover:neon-glow",
                className
            )}
        >
            {children}
        </div>
    );
};
