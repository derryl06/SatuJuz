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
        <div className="flex flex-col gap-10 p-6 pt-16 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <header className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-ios-caption text-white/20">Hello, Salaam!</span>
                        <h1 className="text-ios-title text-white">Ready For The Juz?</h1>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="h-12 w-12 rounded-full bg-[#161616] border border-white/5 flex items-center justify-center text-white/60 relative"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <Bell size={20} />
                            <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#E2FF31] rounded-full shadow-[0_0_10px_#E2FF31]" />
                        </button>
                    </div>
                </div>

                <JuzPicker
                    currentJuz={targetJuz}
                    onSelect={(juz) => router.push(`/quran?juz=${juz}`)}
                />
            </header>

            <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between px-2">
                    <span className="text-ios-headline text-white">Overview</span>
                    <button className="text-ios-mono text-white/20 hover:text-[#E2FF31] transition-colors">See Details &gt;</button>
                </div>

                {/* 2xLarge Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <StatTile
                        label="Next Target"
                        value={`Juz ${targetJuz}`}
                        subValue="Distance"
                        variant="yellow"
                        icon={<Target size={14} />}
                        className="cursor-pointer"
                        // @ts-ignore
                        onClick={() => router.push(`/quran?juz=${targetJuz}`)}
                    />
                    <StatTile
                        label="Streak"
                        value={`${streak.current} d`}
                        subValue="Progress"
                        icon={<Flame size={14} />}
                    />
                </div>

                {/* 3xSmall Grid */}
                <div className="grid grid-cols-3 gap-4">
                    <StatTile
                        label="Total"
                        value={totalJuz}
                        size="small"
                        subValue="Juz"
                        icon={<BookOpen size={12} />}
                    />
                    <StatTile
                        label="Time"
                        value="1h 12m"
                        size="small"
                        subValue="Duration"
                        icon={<Clock size={12} />}
                    />
                    <StatTile
                        label="Khatam"
                        value={khatamCount}
                        size="small"
                        subValue="Finish"
                        icon={<Zap size={12} />}
                    />
                </div>
            </section>

            <section className="flex flex-col gap-6 mb-24">
                <div className="flex items-center justify-between px-2">
                    <span className="text-ios-headline text-white">Recent Activity</span>
                    <button className="text-ios-mono text-white/20 hover:text-[#E2FF31] transition-colors">See Details &gt;</button>
                </div>
                <CompletionList completions={completions} />
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
