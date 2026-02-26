"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { JuzCompletion } from "@/types/domain";
import { formatDateId, parseDateId } from "@/lib/utils/date";
import { Flame, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface WeeklyRecapProps {
    completions: JuzCompletion[];
}

export const WeeklyRecap = ({ completions }: WeeklyRecapProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [stats, setStats] = useState({ count: 0, daysCount: 0, bestDay: "" });

    useEffect(() => {
        // Trigger on Sundays (day 0) if user was active this week
        const today = new Date();
        const isSunday = today.getDay() === 0;

        // Check if seen this week already in localStorage
        const weekKey = `recap_seen_${today.getFullYear()}_W${getWeekNumber(today)}`;
        const seen = localStorage.getItem(weekKey);

        if (isSunday && !seen) {
            // Calculate last 7 days stats
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            const sevenDaysAgoId = formatDateId(sevenDaysAgo);

            const weekCompletions = completions.filter(c => c.date_id >= sevenDaysAgoId);

            if (weekCompletions.length > 0) {
                const dayCounts: Record<string, number> = {};
                weekCompletions.forEach(c => {
                    dayCounts[c.date_id] = (dayCounts[c.date_id] || 0) + 1;
                });

                const daysCount = Object.keys(dayCounts).length;
                let bestDay = "";
                let max = 0;
                Object.entries(dayCounts).forEach(([day, count]) => {
                    if (count > max) {
                        max = count;
                        bestDay = day;
                    }
                });

                setStats({ count: weekCompletions.length, daysCount, bestDay });
                setIsOpen(true);
                localStorage.setItem(weekKey, "true");
            }
        }
    }, [completions]);

    function getWeekNumber(d: Date) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        var weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
        return weekNo;
    }

    return (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Rekap Mingguan">
            <div className="flex flex-col gap-6 text-center py-4">
                <div className="h-20 w-20 bg-neon rounded-[24px] flex items-center justify-center mx-auto shadow-neon-glow rotate-3">
                    <TrendingUp size={40} className="text-black" />
                </div>

                <div>
                    <h2 className="text-2xl font-black text-text-primary tracking-tighter uppercase">Minggu yang Hebat!</h2>
                    <p className="text-sm text-text-dim font-medium px-8 mt-1">Kamu berhasil menjaga konsistensi membaca Juz minggu ini.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-stealth-translucent border border-stealth-border rounded-3xl p-6 flex flex-col items-center">
                        <span className="text-caption !text-text-muted">Dibaca</span>
                        <span className="text-3xl font-black text-text-primary">{stats.count} Juz</span>
                    </div>
                    <div className="bg-stealth-translucent border border-stealth-border rounded-3xl p-6 flex flex-col items-center">
                        <span className="text-caption !text-text-muted">Aktif</span>
                        <span className="text-3xl font-black text-neon">{stats.daysCount} Hari</span>
                    </div>
                </div>

                {stats.bestDay && (
                    <div className="bg-gradient-to-br from-neon/10 to-transparent border border-neon/20 rounded-3xl p-6 flex items-center justify-between">
                        <div className="flex flex-col items-start">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neon">Performa Terbaik</span>
                            <span className="text-lg font-black text-text-primary mt-1">
                                {new Date(stats.bestDay).toLocaleDateString('id-ID', { weekday: 'long' })}
                            </span>
                        </div>
                        <Star className="text-neon" size={24} fill="currentColor" />
                    </div>
                )}

                <button
                    onClick={() => setIsOpen(false)}
                    className="w-full h-16 bg-stealth-translucent border border-stealth-border rounded-[24px] text-text-primary font-black uppercase tracking-widest text-xs active:scale-95 transition-all mt-4"
                >
                    Lanjutkan
                </button>
            </div>
        </Modal>
    );
};
