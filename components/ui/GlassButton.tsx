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
        primary: "bg-[#FFD60A] text-black hover:opacity-90",
        secondary: "bg-white/10 text-white border border-white/10 hover:bg-white/20 backdrop-blur-md",
        ghost: "bg-transparent text-white hover:bg-white/5",
        accent: "bg-[#FFD60A] text-black hover:shadow-[0_0_20px_rgba(255,214,10,0.3)]",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3",
        lg: "px-8 py-4 text-lg font-black",
        pill: "px-8 py-3 rounded-full",
    };

    return (
        <button
            className={cn(
                "press-scale flex items-center justify-center font-bold tracking-tight rounded-3xl transition-all duration-300",
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
