"use client";

import { useCompletions } from "@/hooks/useCompletions";
import { calculateStreak } from "@/lib/streak/streak";
import { Heatmap } from "@/components/progress/Heatmap";
import { StatsPanel } from "@/components/progress/StatsPanel";
import { GlassCard } from "@/components/ui/GlassCard";

export default function ProgressPage() {
    const { completions, loading } = useCompletions();

    const streak = calculateStreak(completions);
    const totalJuz = completions.length;
    const daysActive = new Set(completions.map((c: any) => c.date_id)).size;

    if (loading) return <div className="p-6 text-center text-white/20">Loading...</div>;

    return (
        <div className="flex flex-col gap-10 p-6 pt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <header className="flex flex-col gap-1">
                <h1 className="text-ios-large-title text-white">Progress</h1>
                <p className="text-ios-headline text-white/40">Visualizing your spiritual journey.</p>
            </header>

            <GlassCard className="p-8 flex flex-col gap-8 border-white/10 shadow-2xl">
                <div className="flex flex-col gap-1">
                    <span className="text-ios-caption decoration-blue-500/50 underline underline-offset-8">Activity Flow</span>
                    <h3 className="text-3xl font-black tracking-tight text-white mt-2">Last 90 Days</h3>
                </div>
                <Heatmap completions={completions} />
                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] text-white/20 uppercase tracking-widest font-black">Less</span>
                    <div className="flex gap-1">
                        <div className="h-2.5 w-2.5 rounded-sm bg-white/5" />
                        <div className="h-2.5 w-2.5 rounded-sm bg-[#E2FF31]/20" />
                        <div className="h-2.5 w-2.5 rounded-sm bg-[#E2FF31]/50" />
                        <div className="h-2.5 w-2.5 rounded-sm bg-[#E2FF31]" />
                    </div>
                    <span className="text-[10px] text-white/20 uppercase tracking-widest font-black">More</span>
                </div>
            </GlassCard>

            <StatsPanel totalJuz={totalJuz} streak={streak} daysActive={daysActive} />
        </div>
    );
}
