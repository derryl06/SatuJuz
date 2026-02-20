"use client";

import { GlassCard } from "../ui/GlassCard";
import { StatPill } from "../ui/StatPill";

interface StatsPanelProps {
    totalJuz: number;
    streak: { current: number; best: number };
    daysActive: number;
}

export const StatsPanel = ({ totalJuz, streak, daysActive }: StatsPanelProps) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <StatPill label="Current Streak" value={`${streak.current}d`} icon="🔥" className="border-[#E2FF31]/10" />
            <StatPill label="Best Streak" value={`${streak.best}d`} icon="🏆" />
            <StatPill label="Total Juz" value={totalJuz} icon="📖" />
            <StatPill label="Days Active" value={daysActive} icon="📅" />

            <GlassCard className="col-span-2 p-8 flex flex-col items-center gap-5 bg-[#161616] border-white/5 shadow-2xl">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-ios-caption text-white/20">Khatam Progress</span>
                    <h4 className="text-2xl font-black text-white tracking-tighter">{totalJuz % 30} <span className="text-white/20">/ 30 Juz</span></h4>
                </div>
                <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                    <div
                        className="h-full bg-[#E2FF31] rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(226,255,49,0.2)]"
                        style={{ width: `${(totalJuz % 30) / 30 * 100}%` }}
                    />
                </div>
                <span className="text-ios-mono text-white/10 uppercase tracking-[0.3em]">Goal: 30 Juz Finish</span>
            </GlassCard>
        </div>
    );
};
