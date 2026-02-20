"use client";

import { useCompletions } from "@/hooks/useCompletions";
import { calculateStreak } from "@/lib/streak/streak";
import { Heatmap } from "@/components/progress/Heatmap";
import { GlassCard } from "@/components/ui/GlassCard";
import { Bell, Activity, Target, Zap } from "lucide-react";

export default function ProgressPage() {
    const { completions, loading } = useCompletions();

    const streak = calculateStreak(completions);
    const totalJuz = completions.length;
    const daysActive = new Set(completions.map((c: any) => c.date_id)).size;

    if (loading) return <div className="p-10 pt-24 animate-pulse text-white/5 font-black text-center tracking-[1em]">STEALTH</div>;

    return (
        <div className="flex flex-col gap-8 pb-10 pt-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <header className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                    <span className="text-ios-caption text-white/40 font-bold">Your Stats</span>
                    <h1 className="text-4xl font-black tracking-tighter text-white">Progress</h1>
                </div>
                <button className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 relative">
                    <Activity size={20} />
                    <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#FFD60A] rounded-full shadow-[0_0_10px_#FFD60A]" />
                </button>
            </header>

            <GlassCard className="p-6 flex flex-col gap-6 bg-white/5 border-white/10 high-contrast-shadow rounded-[32px]">
                <div className="flex flex-col gap-0.5">
                    <span className="text-ios-mono text-[#FFD60A] text-[9px] uppercase tracking-widest font-black">Activity Flow</span>
                    <h3 className="text-2xl font-black tracking-tighter text-white">Last 90 Days</h3>
                </div>

                <div className="py-2">
                    <Heatmap completions={completions} />
                </div>

                <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] text-white/20 uppercase tracking-widest font-black">Less</span>
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-lg bg-white/5 border border-white/5" />
                        <div className="h-3 w-3 rounded-lg bg-[#FFD60A]/20" />
                        <div className="h-3 w-3 rounded-lg bg-[#FFD60A]/50" />
                        <div className="h-3 w-3 rounded-lg bg-[#FFD60A]" />
                    </div>
                    <span className="text-[10px] text-white/20 uppercase tracking-widest font-black">More</span>
                </div>
            </GlassCard>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5 flex flex-col justify-between h-36 high-contrast-shadow">
                    <div className="flex flex-col gap-1">
                        <span className="text-ios-caption text-white/30">Current Streak</span>
                        <h2 className="text-3xl font-black text-white tracking-tighter">{streak.current} d</h2>
                    </div>
                    <span className="text-ios-mono text-[9px] text-white/20">Daily streak tracking</span>
                </div>
                <div className="bg-[#FFD60A] rounded-3xl p-5 flex flex-col justify-between h-36 high-contrast-shadow">
                    <div className="flex flex-col gap-1">
                        <span className="text-ios-caption text-black/40">Total Juz</span>
                        <h2 className="text-3xl font-black text-black tracking-tighter">{totalJuz}</h2>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Zap size={10} className="text-black/60" />
                        <span className="text-ios-mono text-[9px] text-black/40">Lifetime goal</span>
                    </div>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center justify-between high-contrast-shadow">
                <div className="flex flex-col">
                    <span className="text-ios-caption text-white/30">Total Days Active</span>
                    <h2 className="text-2xl font-black text-white tracking-tight">{daysActive} Days</h2>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-[#FFD60A]/10 flex items-center justify-center text-[#FFD60A]">
                    <Target size={24} />
                </div>
            </div>
        </div>
    );
}
