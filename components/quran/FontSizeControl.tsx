"use client";

import { Minus, Plus } from "lucide-react";

interface FontSizeControlProps {
    fontSize: number;
    onChange: (size: number) => void;
}

export const FontSizeControl = ({ fontSize, onChange }: FontSizeControlProps) => {
    return (
        <div className="flex items-center gap-2 sm:gap-3 bg-[var(--surface-app)] border border-[var(--border-glass)] rounded-[20px] px-2 sm:px-3 py-1.5 shadow-2xl backdrop-blur-xl">
            <button
                onClick={() => onChange(Math.max(fontSize - 4, 16))}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-stealth-surface hover:bg-stealth-surface/80 flex items-center justify-center text-text-muted hover:text-text-primary transition-all active:scale-90"
                title="Decrease font size"
            >
                <Minus size={12} strokeWidth={3} />
            </button>

            <div className="flex flex-col items-center min-w-[28px] sm:min-w-[32px]">
                <span className="text-[6px] sm:text-[7px] font-black text-text-muted uppercase tracking-[1px] sm:tracking-[2px] mb-0 sm:mb-0.5">Scale</span>
                <span className="text-xs sm:text-sm font-black text-neon tracking-tighter leading-none">{fontSize}</span>
            </div>

            <button
                onClick={() => onChange(Math.min(fontSize + 4, 64))}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-stealth-surface hover:bg-stealth-surface/80 flex items-center justify-center text-text-muted hover:text-text-primary transition-all active:scale-90"
                title="Increase font size"
            >
                <Plus size={12} strokeWidth={3} />
            </button>
        </div>
    );
};
