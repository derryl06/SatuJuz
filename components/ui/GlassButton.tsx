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
        primary: "bg-white text-black hover:bg-white/90",
        secondary: "bg-[#252525] text-white hover:bg-[#333]",
        ghost: "bg-transparent text-white hover:bg-white/5",
        accent: "bg-[#E2FF31] text-black hover:bg-[#d4f02b]",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3",
        lg: "px-10 py-5 text-lg font-black",
        pill: "px-8 py-3 rounded-full",
    };

    return (
        <button
            className={cn(
                "press-scale flex items-center justify-center font-bold tracking-tight rounded-[24px] transition-all duration-300",
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
