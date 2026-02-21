"use client";

import { Minus, Plus } from "lucide-react";

interface FontSizeControlProps {
    fontSize: number;
    onChange: (size: number) => void;
}

export const FontSizeControl = ({ fontSize, onChange }: FontSizeControlProps) => {
    return (
        <div className="flex items-center gap-4 bg-[var(--surface-app)] border border-[var(--border-glass)] rounded-[22px] px-4 py-2 shadow-2xl backdrop-blur-xl">
            <button
                onClick={() => onChange(Math.max(fontSize - 4, 16))}
                className="h-9 w-9 rounded-xl bg-stealth-surface hover:bg-stealth-surface/80 flex items-center justify-center text-text-muted hover:text-text-primary transition-all active:scale-90"
                title="Decrease font size"
            >
                <Minus size={14} />
            </button>

            <div className="flex flex-col items-center min-w-[36px]">
                <span className="text-[7px] font-black text-text-muted uppercase tracking-[2px] mb-0">Scale</span>
                <span className="text-sm font-black text-neon tracking-tighter leading-none">{fontSize}</span>
            </div>

            <button
                onClick={() => onChange(Math.min(fontSize + 4, 64))}
                className="h-9 w-9 rounded-xl bg-stealth-surface hover:bg-stealth-surface/80 flex items-center justify-center text-text-muted hover:text-text-primary transition-all active:scale-90"
                title="Increase font size"
            >
                <Plus size={14} />
            </button>
        </div>
    );
};
