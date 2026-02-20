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

    if (loading) return <div className="h-28 animate-pulse rounded-[32px] bg-white/5" />;

    if (!settings) {
        return (
            <Link href="/profile">
                <GlassCard className="flex items-center justify-between border-dashed border-white/10 bg-transparent">
                    <div className="flex items-center gap-3 text-white/40">
                        <MapPin size={20} />
                        <span className="text-ios-body">Atur Lokasi Sholat</span>
                    </div>
                    <div className="rounded-full bg-white/10 px-4 py-1.5 text-ios-mono">Setup</div>
                </GlassCard>
            </Link>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            <GlassCard className="col-span-2 py-5 px-6 group bg-[#FFD60A] border-none high-contrast-shadow">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-ios-caption text-black/40">Next Prayer</span>
                        <span className="text-4xl font-black tracking-tighter text-black uppercase">
                            {nextPrayer?.name}
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-1 px-3 py-1.5 rounded-2xl bg-black/5 border border-black/5">
                        <span className="text-ios-mono text-black/60 text-[10px]">{nextPrayer?.time}</span>
                        <div className="flex items-center gap-1.5">
                            <Clock size={12} className="text-black/60" />
                            <span className="text-ios-mono text-black font-black text-[10px]">{countdown}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center px-0.5">
                        <span className="text-ios-caption text-black/30 font-bold">Progress to {nextPrayer?.name}</span>
                        <span className="text-ios-mono text-black/40 text-[9px]">65%</span>
                    </div>
                    <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-black rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                            style={{ width: '65%' }}
                        />
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
