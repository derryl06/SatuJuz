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
        <div className="grid grid-cols-2 gap-4">
            <GlassCard className="col-span-2 py-6 px-7 group bg-[#E2FF31] border-none shadow-[0_20px_40px_rgba(226,255,49,0.15)]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex flex-col gap-1">
                        <span className="text-ios-caption text-black/40">Sholat Berikutnya</span>
                        <span className="text-4xl font-black tracking-tighter text-black">
                            {nextPrayer?.name}
                        </span>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 px-4 py-2 rounded-2xl bg-black/5 border border-black/5">
                        <span className="text-ios-mono text-black/60">{nextPrayer?.time}</span>
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-black" />
                            <span className="text-ios-mono text-black font-black">{countdown}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-ios-caption text-black/30">Progress ke {nextPrayer?.name}</span>
                        <span className="text-ios-mono text-black/40">65%</span>
                    </div>
                    <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden p-[1px]">
                        <div
                            className="h-full bg-black rounded-full transition-all duration-1000"
                            style={{ width: '65%' }}
                        />
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};
