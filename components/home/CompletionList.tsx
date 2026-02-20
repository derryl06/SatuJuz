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
        <div className="p-10 border border-dashed border-white/5 rounded-[32px] text-center">
            <span className="text-ios-caption text-white/10 italic lowercase">No activity today</span>
        </div>
    );

    return (
        <div className="flex flex-col gap-4">
            {todayCompletions.map((c) => (
                <div
                    key={c.id}
                    className="flex items-center p-5 bg-[#161616]/40 rounded-[28px] border border-white/5 group hover:bg-[#161616] transition-all duration-500"
                >
                    {/* Left: Icon */}
                    <div className={cn(
                        "flex h-12 w-12 items-center justify-center rounded-2xl transition-all shadow-lg shrink-0",
                        c.item_type === "target" ? "bg-[#E2FF31] text-black" : "bg-white/5 text-white/40"
                    )}>
                        <Book size={20} />
                    </div>

                    {/* Middle: Title & Sub */}
                    <div className="flex flex-col gap-0.5 ml-4 flex-1">
                        <span className="text-ios-headline text-white">Juz {c.juz_number}</span>
                        <span className="text-ios-mono text-white/20">
                            {new Date(c.completed_at).toLocaleTimeString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    {/* Right: Two stats columns like the image */}
                    <div className="flex items-center gap-6 ml-4">
                        <div className="flex flex-col items-end min-w-[50px]">
                            <span className="text-[10px] font-black uppercase text-white/20 tracking-tighter">Pages</span>
                            <span className="text-sm font-bold text-white">20 p</span>
                        </div>
                        <div className="flex flex-col items-end min-w-[70px]">
                            <span className="text-[10px] font-black uppercase text-white/20 tracking-tighter">Duration</span>
                            <span className="text-sm font-bold text-white">45 m</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
