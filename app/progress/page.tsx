"use client";

import { useCompletions } from "@/hooks/useCompletions";
import { calculateStreak } from "@/lib/streak/streak";
import { cn } from "@/lib/utils/cn";
import { Heatmap } from "@/components/progress/Heatmap";
import { GlassCard } from "@/components/ui/GlassCard";
import { Bell, Activity, Target, Zap } from "lucide-react";

export default function ProgressPage() {
    const { completions, loading } = useCompletions();

    const streak = calculateStreak(completions);
    const totalJuz = completions.length;
    const daysActive = new Set(completions.map((c: any) => c.date_id)).size;

    if (loading) return (
        <div className="flex flex-col gap-8">
            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-24 bg-stealth-surface rounded-full animate-pulse" />
                    <div className="h-10 w-48 bg-stealth-surface rounded-xl animate-pulse" />
                </div>
            </header>
            <div className="h-64 bg-stealth-surface rounded-[28px] animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
                <div className="h-36 bg-stealth-surface rounded-[28px] animate-pulse" />
                <div className="h-36 bg-stealth-surface rounded-[28px] animate-pulse" />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-up">
            <header className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-caption">Your Stats</span>
                    <h1 className="text-large-title text-text-primary mt-1">Progress</h1>
                </div>
                <button className="h-12 w-12 rounded-2xl bg-stealth-surface border border-stealth-border flex items-center justify-center text-text-dim active:scale-95 transition-all">
                    <Activity size={20} />
                </button>
            </header>

            <div className="card-stealth p-6 flex flex-col gap-6">
                <div className="flex flex-col gap-0.5">
                    <span className="text-mono !text-neon !text-[9px]">Activity Flow</span>
                    <h3 className="text-2xl font-black tracking-tighter text-text-primary">Last 90 Days</h3>
                </div>

                <div className="py-2 overflow-hidden">
                    <Heatmap completions={completions} />
                </div>

                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[2px]">Less</span>
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-lg bg-stealth-translucent border border-stealth-border" />
                        <div className="h-3 w-3 rounded-lg bg-neon/20" />
                        <div className="h-3 w-3 rounded-lg bg-neon/50" />
                        <div className="h-3 w-3 rounded-lg bg-neon" />
                    </div>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[2px]">More</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="card-stealth p-6 flex flex-col justify-between h-40">
                    <div className="flex flex-col gap-1">
                        <span className="text-caption">Current Streak</span>
                        <h2 className="text-4xl font-black text-text-primary tracking-tighter mt-1">
                            {streak.current}d
                        </h2>
                    </div>
                    <div className={cn(
                        "flex items-center gap-1.5 transition-all text-neon",
                        streak.isSaved ? "animate-pulse" : "opacity-40"
                    )}>
                        <Zap size={10} strokeWidth={3} />
                        <span className="text-mono !text-[8px] uppercase tracking-widest text-inherit">
                            {streak.isSaved ? "Streak Saved" : "Daily Momentum"}
                        </span>
                    </div>
                </div>
                <div className="card-neon p-6 flex flex-col justify-between h-40">
                    <div className="flex flex-col gap-1">
                        <span className="text-caption !text-black/40">Total Juz</span>
                        <h2 className="text-4xl font-black text-black tracking-tighter mt-1">{totalJuz}</h2>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-40">
                        <Target size={10} strokeWidth={3} className="text-black" />
                        <span className="text-mono !text-black !text-[8px]">Lifetime Goal</span>
                    </div>
                </div>
            </div>

            <div className="card-stealth p-6 flex items-center justify-between group active:scale-[0.98] cursor-pointer">
                <div className="flex flex-col">
                    <span className="text-caption">Total Days Active</span>
                    <h2 className="text-2xl font-black text-text-primary tracking-tight mt-1">{daysActive} Days</h2>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-neon/10 flex items-center justify-center text-neon group-hover:bg-neon/20 transition-all shadow-neon-glow">
                    <Target size={24} />
                </div>
            </div>
        </div>
    );
}
