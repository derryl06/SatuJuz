"use client";

import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { GlassCard } from "../ui/GlassCard";
import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const PrayerWidget = () => {
    const { settings, timings, nextPrayer, loading } = usePrayerTimes();
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        if (!nextPrayer) return;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = nextPrayer.date.getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setCountdown("Sholat Sekarang");
                return;
            }

            const h = Math.floor(distance / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            setCountdown(`${h > 0 ? h + "h " : ""}${m}m ${s}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [nextPrayer]);

    if (loading) return <div className="h-28 animate-pulse rounded-[32px] bg-stealth-surface/50" />;

    if (!settings) {
        return (
            <Link href="/profile">
                <div className="flex items-center justify-between border-2 border-dashed border-stealth-border bg-transparent rounded-[28px] p-6 group hover:border-stealth-border/50 transition-all">
                    <div className="flex items-center gap-3 text-text-muted group-hover:text-text-dim transition-colors">
                        <MapPin size={20} />
                        <span className="text-sm font-black uppercase tracking-widest">Atur Lokasi Sholat</span>
                    </div>
                    <div className="rounded-xl bg-stealth-surface px-4 py-2 text-xs font-black uppercase tracking-tighter text-text-muted">Setup</div>
                </div>
            </Link>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="card-neon p-6 relative overflow-hidden group">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col">
                        <span className="text-caption !text-black/40">Next Prayer</span>
                        <h2 className="text-5xl font-black tracking-tighter text-black uppercase mt-1">
                            {nextPrayer?.name}
                        </h2>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 px-4 py-2.5 rounded-2xl bg-black/5 border border-black/5">
                        <span className="text-mono !text-black/40 !text-[10px]">{nextPrayer?.time}</span>
                        <div className="flex items-center gap-2">
                            <Clock size={12} className="text-black/60" />
                            <span className="text-mono !text-black font-black !text-[10px]">{countdown}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-caption !text-black/40">Prayer Progress</span>
                        <span className="text-mono !text-black/60 !text-[9px]">65%</span>
                    </div>
                    <div className="h-2.5 w-full bg-black/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-black rounded-full transition-all duration-1000"
                            style={{ width: '65%' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
