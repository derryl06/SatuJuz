import { cn } from "@/lib/utils/cn";
import React from "react";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost" | "accent";
    size?: "sm" | "md" | "lg" | "pill";
    className?: string;
}

export const GlassButton = ({
    children,
    className,
    variant = "primary",
    size = "md",
    ...props
}: GlassButtonProps) => {
    const variants = {
        primary: "bg-neon text-black hover:opacity-90 shadow-neon-glow",
        secondary: "bg-stealth-translucent text-text-primary border border-stealth-border hover:bg-stealth-surface",
        ghost: "bg-transparent text-text-dim hover:text-text-primary hover:bg-stealth-translucent",
        accent: "bg-neon text-black shadow-neon",
    };

    const sizes = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3.5 text-sm",
        lg: "px-8 py-4 text-base font-black",
        pill: "px-8 py-3 rounded-full text-sm",
    };

    return (
        <button
            className={cn(
                "active:scale-95 flex items-center justify-center font-black uppercase tracking-widest rounded-2xl transition-all duration-300",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
