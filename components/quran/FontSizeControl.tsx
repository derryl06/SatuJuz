"use client";

import { Minus, Plus } from "lucide-react";

interface FontSizeControlProps {
    fontSize: number;
    onChange: (size: number) => void;
}

export const FontSizeControl = ({ fontSize, onChange }: FontSizeControlProps) => {
    return (
        <div className="flex items-center gap-5 bg-[#161616] border border-white/5 rounded-[24px] px-6 py-3 shadow-xl">
            <button
                onClick={() => onChange(Math.max(fontSize - 4, 16))}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                title="Decrease font size"
            >
                <Minus size={20} className="text-white" />
            </button>

            <div className="flex flex-col items-center min-w-[48px]">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-0.5">Size</span>
                <span className="text-base font-black text-[#E2FF31] tracking-tighter">{fontSize}</span>
            </div>

            <button
                onClick={() => onChange(Math.min(fontSize + 4, 64))}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                title="Increase font size"
            >
                <Plus size={20} className="text-white" />
            </button>
        </div>
    );
};
