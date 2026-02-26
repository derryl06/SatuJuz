"use client";

import { useState } from "react";
import { calculateKhatamProgress } from "@/lib/utils/khatam";
import { JuzCompletion } from "@/types/domain";
import { cn } from "@/lib/utils/cn";
import { Zap } from "lucide-react";

interface Props {
    completions: JuzCompletion[];
    onShare?: () => void;
}

export const KhatamSummaryCard = ({ completions, onShare }: Props) => {
    const [expanded, setExpanded] = useState(false);
    const progress = calculateKhatamProgress(completions);

    return (
        <div
            onClick={() => setExpanded(!expanded)}
            className={cn(
                "card-stealth flex flex-col justify-center cursor-pointer active:scale-[0.98] transition-all duration-500 overflow-hidden",
                expanded ? "col-span-1 sm:col-span-2 min-h-48 p-6" : "h-full p-4"
            )}
        >
            {!expanded ? (
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col gap-1 w-full relative z-10">
                        <span className="text-caption !text-text-muted">Khatam</span>
                        <h2 className="text-2xl font-black text-text-primary tracking-tighter mt-1">{progress.totalCompleted} / 30</h2>

                        <div className="mt-2 flex flex-col gap-1.5">
                            <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{progress.remaining} lagi</p>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-neon transition-all duration-1000" style={{ width: `${progress.percentage}%` }} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col w-full text-center gap-4 py-4 animate-fade-in relative z-10 pointer-events-auto">
                    <span className="text-caption !text-text-muted">Progress Khatam</span>
                    <h2 className="text-5xl font-black text-text-primary tracking-tighter mt-1">
                        {progress.totalCompleted} <span className="text-2xl text-text-muted">/ 30</span>
                    </h2>

                    <div className="flex flex-col gap-2 mt-2 w-full max-w-xs mx-auto">
                        <p className="text-xs font-medium text-text-muted">Sisa {progress.remaining} juz lagi menuju khatam</p>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-neon transition-all duration-1000" style={{ width: `${progress.percentage}%` }} />
                        </div>
                    </div>

                    {onShare && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onShare();
                            }}
                            className="mt-4 mx-auto inline-flex items-center gap-2 text-mono text-black font-black uppercase text-[10px] tracking-widest bg-neon hover:bg-neon/80 transition-all py-3 px-6 rounded-xl shadow-neon-glow"
                        >
                            <Zap size={14} className="text-black" />
                            <span>Bagikan Progress</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
