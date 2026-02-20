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
        <div className="p-10 bg-white/5 border border-dashed border-white/10 rounded-3xl text-center">
            <span className="text-ios-caption text-white/30 lowercase font-medium">No activity today</span>
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            {todayCompletions.map((c) => (
                <div
                    key={c.id}
                    className="flex items-center p-4 bg-white/5 rounded-3xl border border-white/10 group hover:bg-white/10 transition-all duration-500 high-contrast-shadow"
                >
                    {/* Left: Icon */}
                    <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl transition-all shadow-lg shrink-0",
                        c.item_type === "target" ? "bg-[#FFD60A] text-black" : "bg-white/10 text-white/40"
                    )}>
                        <Book size={20} />
                    </div>

                    {/* Middle: Title & Sub */}
                    <div className="flex flex-col gap-0.5 ml-4 flex-1">
                        <span className="text-ios-headline text-white/90">Completed Juz {c.juz_number}</span>
                        <span className="text-ios-mono text-white/20 text-[9px]">
                            {new Date(c.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    {/* Right: Pill */}
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        c.item_type === "target" ? "bg-[#FFD60A]/10 text-[#FFD60A]" : "bg-white/10 text-white/30"
                    )}>
                        {c.item_type === "target" ? "Target" : "Extra"}
                    </div>
                </div>
            ))}
        </div>
    );
};
