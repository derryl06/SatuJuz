"use client";

import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useNotifications } from "@/hooks/useNotifications";
import { GlassCard } from "../ui/GlassCard";
import { Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export const PrayerWidget = () => {
    const { settings, timings, nextPrayer, loading } = usePrayerTimes();
    const [countdown, setCountdown] = useState("");
    const { sendNotification } = useNotifications();
    const [hasNotified, setHasNotified] = useState(false);

    useEffect(() => {
        if (!nextPrayer) return;

        setHasNotified(false); // Reset notification lock on new prayer

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = nextPrayer.date.getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                setCountdown("Sholat Sekarang");

                if (!hasNotified) {
                    sendNotification(`Waktunya Sholat ${nextPrayer.name}!`, {
                        body: `Sudah masuk waktu sholat untuk daerahmu.`,
                        requireInteraction: true
                    });
                    setHasNotified(true);
                }
                return;
            }

            const h = Math.floor(distance / (1000 * 60 * 60));
            const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((distance % (1000 * 60)) / 1000);

            setCountdown(`${h > 0 ? h + "h " : ""}${m}m ${s}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [nextPrayer, hasNotified, sendNotification]);

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
            <div className="bg-stealth-surface border border-[var(--border-glass)] p-4 rounded-3xl flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.3)] group hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-neon/10 border border-neon/20 flex items-center justify-center text-neon shadow-[0_0_15px_rgba(255,214,10,0.15)] group-hover:shadow-[0_0_20px_rgba(255,214,10,0.3)] transition-shadow">
                        <Clock size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[2px] text-text-muted">Next Prayer</span>
                        <h2 className="text-xl font-black tracking-tighter text-white uppercase mt-0.5 leading-none">
                            {nextPrayer?.name}
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-dim px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
                        {nextPrayer?.time}
                    </span>
                    <div className="flex items-center gap-1.5 px-1 mt-0.5">
                        <span className="text-[9px] font-black uppercase tracking-[1px] text-text-muted">in</span>
                        <span className="text-[11px] font-black text-neon tracking-tighter drop-shadow-[0_0_8px_rgba(255,214,10,0.3)]">{countdown}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
