"use client";

import { JuzCompletion } from "@/types/domain";
import { Book } from "lucide-react";
import { getTodayDateId } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

interface CompletionListProps {
    completions: JuzCompletion[];
}

export const CompletionList = ({ completions }: CompletionListProps) => {
    const today = getTodayDateId();
    const todayCompletions = completions.filter((c) => c.date_id === today);

    if (todayCompletions.length === 0) return (
        <div className="p-12 bg-stealth-surface border border-dashed border-[var(--border-glass)] rounded-[28px] text-center">
            <span className="text-caption lowercase font-medium">No activity today</span>
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            {todayCompletions.map((c) => (
                <div
                    key={c.id}
                    className="flex items-center card-stealth !p-4 hover:bg-stealth-surface/80 transition-all cursor-pointer group"
                >
                    {/* Left: Icon */}
                    <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl transition-all shadow-xl shrink-0",
                        c.item_type === "target" ? "bg-neon text-black" : "bg-stealth-surface text-text-muted"
                    )}>
                        <Book size={20} />
                    </div>

                    {/* Middle: Title & Sub */}
                    <div className="flex flex-col gap-0.5 ml-4 flex-1">
                        <span className="text-base font-black text-text-primary/90">Completed Juz {c.juz_number}</span>
                        <span className="text-mono !text-text-muted !text-[9px]">
                            {new Date(c.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    {/* Right: Pill */}
                    <div className={cn(
                        "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest",
                        c.item_type === "target" ? "bg-neon/10 text-neon" : "bg-stealth-surface text-text-dim"
                    )}>
                        {c.item_type === "target" ? "Target" : "Extra"}
                    </div>
                </div>
            ))}
        </div>
    );
};
