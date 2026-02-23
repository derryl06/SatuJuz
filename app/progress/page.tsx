"use client";

import { useCompletions } from "@/hooks/useCompletions";
import { useSettings } from "@/hooks/useSettings";
import { calculateStreak } from "@/lib/streak/streak";
import { cn } from "@/lib/utils/cn";
import { Heatmap } from "@/components/progress/Heatmap";
import { GlassCard } from "@/components/ui/GlassCard";
import { Bell, Activity, Target, Zap } from "lucide-react";
import { getTodayDateId } from "@/lib/utils/date";

export default function ProgressPage() {
    const { completions, loading } = useCompletions();
    const { settings } = useSettings();

    const streak = calculateStreak(completions, settings.dailyTarget);
    const totalJuz = completions.length;

    // Total days active: days where at least 1 juz was completed
    const daysActive = new Set(completions.map((c: any) => c.date_id)).size;

    // Today progress
    const todayId = getTodayDateId();
    const todayCompletions = completions.filter(c => c.date_id === todayId).length;
    const isTodayTargetMet = todayCompletions >= settings.dailyTarget;

    // Milestone logic: X / 30 for khatam
    const currentMilestone = Math.floor(totalJuz / 30) * 30 + 30;

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
        <div className="max-w-xl mx-auto flex flex-col gap-12 animate-fade-up pb-10">
            <header className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-caption">Your Stats</span>
                    <h1 className="text-large-title text-text-primary mt-1">Progress</h1>
                </div>
                <div className="h-12 px-4 rounded-2xl bg-stealth-surface border border-stealth-border flex items-center gap-2">
                    <div className={cn(
                        "w-2 h-2 rounded-full",
                        isTodayTargetMet ? "bg-neon shadow-neon-glow" : "bg-text-muted"
                    )} />
                    <span className="text-mono !text-[10px] text-text-primary">
                        Today: {todayCompletions}/{settings.dailyTarget}
                    </span>
                </div>
            </header>

            <div className="card-stealth p-6 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-mono !text-neon !text-[9px]">Activity Flow</span>
                        <h3 className="text-2xl font-black tracking-tighter text-text-primary">Last 90 Days</h3>
                    </div>
                    {todayCompletions > 0 && (
                        <div className="bg-neon/10 border border-neon/20 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                            <Activity size={10} className="text-neon" />
                            <span className="text-mono !text-neon !text-[8px] tracking-[1px]">Active Today</span>
                        </div>
                    )}
                </div>

                <div className="pt-2 pb-2 overflow-x-auto overflow-y-visible">
                    <div className="min-w-[300px]">
                        <Heatmap completions={completions} dailyTarget={settings.dailyTarget} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="card-stealth p-6 flex flex-col justify-between h-40">
                    <div className="flex flex-col gap-1">
                        <span className="text-caption">Current Streak</span>
                        <h2 className="text-4xl font-black text-text-primary tracking-tighter mt-1">
                            {streak.current}d
                        </h2>
                    </div>
                    <div className={cn(
                        "flex items-center gap-1.5 transition-all",
                        streak.current > 0 ? "text-neon" : "text-text-muted"
                    )}>
                        <Zap size={10} strokeWidth={3} className={streak.isSaved ? "animate-pulse" : ""} />
                        <span className="text-mono !text-[8px] uppercase tracking-widest text-inherit">
                            {streak.isSaved ? "Streak Saved" : streak.current > 0 ? "Daily Momentum" : "Start Reading"}
                        </span>
                    </div>
                </div>
                <div className="card-neon p-6 flex flex-col justify-between h-40 relative overflow-hidden group">
                    <div className="absolute top-[-20px] right-[-20px] opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Target size={120} className="text-black" />
                    </div>
                    <div className="flex flex-col gap-1 relative z-10">
                        <span className="text-caption !text-black/40">Total Juz</span>
                        <h2 className="text-4xl font-black text-black tracking-tighter mt-1">{totalJuz}</h2>
                    </div>
                    <div className="flex flex-col gap-1 relative z-10">
                        <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-black transition-all duration-1000"
                                style={{ width: `${(totalJuz % 30) / 30 * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between items-center opacity-40">
                            <span className="text-mono !text-black !text-[8px]">Khatam Goal</span>
                            <span className="text-mono !text-black !text-[8px]">{totalJuz}/{currentMilestone}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-stealth p-6 flex items-center justify-between group active:scale-[0.98] cursor-pointer">
                <div className="flex flex-col">
                    <span className="text-caption">Total Days Active</span>
                    <h2 className="text-2xl font-black text-text-primary tracking-tight mt-1">{daysActive} Days</h2>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-neon/10 flex items-center justify-center text-neon group-hover:bg-neon/20 transition-all shadow-neon-glow">
                    <Activity size={24} />
                </div>
            </div>
        </div>
    );
}
