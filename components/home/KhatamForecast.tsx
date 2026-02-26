"use client";

import { useSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils/cn";
import { Calendar, Timer, Sparkles } from "lucide-react";

interface KhatamForecastProps {
    totalCompletions: number;
    className?: string;
}

export const KhatamForecast = ({ totalCompletions, className }: KhatamForecastProps) => {
    const { settings } = useSettings();
    const dailyTarget = settings.dailyTarget || 1;

    // Calculate progress within the current 30-juz cycle
    const currentCycleProgress = totalCompletions % 30;
    const remainingInCycle = 30 - currentCycleProgress;

    // Safety check: if exactly at 30, it means starting a new one
    const juzToFinish = remainingInCycle === 0 ? 30 : remainingInCycle;

    const daysUntilKhatam = Math.ceil(juzToFinish / dailyTarget);

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + daysUntilKhatam);

    const formattedDate = targetDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    const progressPercentage = (currentCycleProgress / 30) * 100;

    return (
        <div className={cn("glass-card p-5 relative overflow-hidden group", className)}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                <Sparkles size={48} className="text-[#FFD60A]" />
            </div>

            <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-neon/10 flex items-center justify-center text-neon">
                        <Timer size={18} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">Estimasi Khatam</span>
                </div>

                <div className="flex flex-col">
                    <h3 className="text-2xl font-black text-text-primary tracking-tighter">
                        {daysUntilKhatam} <span className="text-sm text-text-dim font-bold uppercase ml-1">Hari Lagi</span>
                    </h3>
                    <p className="text-[11px] font-medium text-text-dim mt-1">
                        Estimasi Selesai: <span className="text-neon font-bold">{formattedDate}</span>
                    </p>
                </div>

                <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                        <span className="text-text-muted">Siklus Progress</span>
                        <span className="text-neon">{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-stealth-border/20 rounded-full overflow-hidden border border-stealth-border">
                        <div
                            className="h-full bg-neon shadow-neon transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <Calendar size={12} className="text-text-muted" />
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">
                        Berdasarkan target {dailyTarget} Juz / hari
                    </span>
                </div>
            </div>
        </div>
    );
};
