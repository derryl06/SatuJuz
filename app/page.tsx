"use client";

import { useCompletions } from "@/hooks/useCompletions";
import { useBookmark } from "@/hooks/useBookmark";
import { calculateStreak } from "@/lib/streak/streak";
import { getTodayDateId } from "@/lib/utils/date";
import { PrayerWidget } from "@/components/home/PrayerWidget";
import { StatTile } from "@/components/home/TodayCard";
import { CompletionList } from "@/components/home/CompletionList";
import { JuzPicker } from "@/components/quran/JuzPicker";
import { AddCompletionModal } from "@/components/home/AddCompletionModal";
import { ShareModal } from "@/components/share/ShareModal";
import { Bell, Flame, BookOpen, Clock, Zap, Target } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
    const { completions, addCompletion, loading } = useCompletions();
    const { bookmark } = useBookmark();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const streak = calculateStreak(completions);
    const totalJuz = completions.length;
    const khatamCount = Math.floor(totalJuz / 30);

    // Logic to determine next target juz
    const todayId = getTodayDateId();
    const doneToday = completions.filter((c: any) => c.date_id === todayId);
    const doneTodayJuz = doneToday.map((c: any) => c.juz_number);

    const lastActiveJuz = bookmark?.juz_number || 1;
    const targetJuz = doneTodayJuz.length > 0 ? (Math.max(...doneTodayJuz) % 30) + 1 : lastActiveJuz;

    if (loading) return <div className="p-10 pt-24 animate-pulse text-white/5 font-black text-center tracking-[1em]">STEALTH</div>;

    return (
        <div className="flex flex-col gap-8 pb-10 pt-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {/* A) Header */}
            <header className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                    <span className="text-ios-caption text-white/40 font-bold">Hello, Salaam!</span>
                    <h1 className="text-4xl font-black tracking-tighter text-white">Ready For The Juz?</h1>
                </div>
                <button
                    className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 relative hover:bg-white/10 transition-all"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Bell size={20} />
                    <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#FFD60A] rounded-full shadow-[0_0_10px_#FFD60A]" />
                </button>
            </header>

            {/* B) Calendar Strip Card */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-ios-headline text-white/90">Juz Calendar</h2>
                    <span className="text-ios-mono text-white/20 text-[9px]">Ramadan 1447</span>
                </div>
                <JuzPicker
                    currentJuz={targetJuz}
                    onSelect={(juz) => router.push(`/quran?juz=${juz}`)}
                />
            </section>

            {/* C) Overview Section */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-ios-headline text-white/90">Overview</h2>
                    <button className="text-ios-mono text-[#FFD60A] text-[9px] hover:opacity-80 transition-opacity">See Details &gt;</button>
                </div>

                {/* 2-column grid of BIG stat cards */}
                <div className="grid grid-cols-2 gap-3">
                    <StatTile
                        label="Next Target"
                        value={`Juz ${targetJuz}`}
                        subValue="Primary Goal"
                        variant="yellow"
                        icon={<Target size={14} />}
                        className="cursor-pointer"
                        onClick={() => router.push(`/quran?juz=${targetJuz}`)}
                    />
                    <StatTile
                        label="Streak"
                        value={`${streak.current} d`}
                        subValue="Daily Progress"
                        icon={<Flame size={14} />}
                    />
                </div>

                {/* Row of 3 small pills */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 high-contrast-shadow">
                        <BookOpen size={14} className="text-[#FFD60A]" />
                        <span className="text-[10px] font-black text-white/30 uppercase">Total</span>
                        <span className="text-lg font-black text-white leading-none">{totalJuz}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 high-contrast-shadow">
                        <Zap size={14} className="text-[#FFD60A]" />
                        <span className="text-[10px] font-black text-white/30 uppercase">Khatam</span>
                        <span className="text-lg font-black text-white leading-none">{khatamCount}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 high-contrast-shadow">
                        <Clock size={14} className="text-[#FFD60A]" />
                        <span className="text-[10px] font-black text-white/30 uppercase">Today</span>
                        <span className="text-lg font-black text-white leading-none">{doneToday.length}</span>
                    </div>
                </div>
            </section>

            {/* D) Next Target Hero Card */}
            <section className="px-2">
                <div className="bg-[#FFD60A] rounded-[32px] p-6 flex flex-col gap-4 high-contrast-shadow relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-black/5 rounded-full blur-3xl group-hover:bg-black/10 transition-all duration-500" />
                    <div className="flex flex-col">
                        <span className="text-ios-caption text-black/40 font-bold uppercase tracking-widest">Next Target</span>
                        <h3 className="text-5xl font-black text-black tracking-tighter">Juz {targetJuz}</h3>
                        <p className="text-black/60 text-sm font-bold mt-1">Pick up where you left off</p>
                    </div>
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => router.push(`/quran?juz=${targetJuz}`)}
                            className="bg-black text-white px-6 py-3 rounded-2xl font-black text-sm flex-1 press-scale"
                        >
                            Continue
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-black/10 text-black px-6 py-3 rounded-2xl font-black text-sm flex-1 border border-black/5 press-scale"
                        >
                            Add Done
                        </button>
                    </div>
                </div>
            </section>

            <PrayerWidget />

            {/* E) Recent Activity */}
            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-ios-headline text-white/90">Recent Activity</h2>
                    <button className="text-ios-mono text-[#FFD60A] text-[9px] hover:opacity-80 transition-opacity">See Details &gt;</button>
                </div>
                <CompletionList completions={completions} />
            </section>

            {/* F) Share */}
            <section className="px-2 mb-20 text-center">
                <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="inline-flex items-center gap-2 text-ios-mono text-white/40 hover:text-[#FFD60A] transition-colors"
                >
                    <Zap size={14} />
                    <span>Share Progress Card</span>
                </button>
            </section>

            <AddCompletionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={addCompletion}
                existingJuz={doneTodayJuz}
            />

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                streak={streak.current}
                todayCount={doneToday.length}
            />
        </div>
    );
}
