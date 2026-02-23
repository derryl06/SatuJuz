"use client";

import { useCompletions } from "@/hooks/useCompletions";
import { cn } from "@/lib/utils/cn";
import { useBookmark } from "@/hooks/useBookmark";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { calculateStreak } from "@/lib/streak/streak";
import { getTodayDateId } from "@/lib/utils/date";
import { PrayerWidget } from "@/components/home/PrayerWidget";
import { StatTile } from "@/components/home/TodayCard";
import { CompletionList } from "@/components/home/CompletionList";
import { ActivityStrip } from "@/components/home/ActivityStrip";
import { SunnahWidget } from "@/components/home/SunnahWidget";
import { AddCompletionModal } from "@/components/home/AddCompletionModal";
import { ShareModal } from "@/components/share/ShareModal";
import { StatPill } from "@/components/ui/StatPill";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { QuickGuide } from "@/components/home/QuickGuide";
import { useSettings } from "@/hooks/useSettings";
import { GoalSettingsModal } from "@/components/home/GoalSettingsModal";
import { KhatamForecast } from "@/components/home/KhatamForecast";
import { VerseOfTheDay } from "@/components/home/VerseOfTheDay";
import { useBadges } from "@/hooks/useBadges";
import { WeeklyRecap } from "@/components/home/WeeklyRecap";
import { useTheme } from "@/lib/theme/ThemeContext";
import {
    Sun, Moon, MapPin, Target, Flame, Zap, Bell, HelpCircle,
    BookOpen, Clock, Share2, Calendar, ChevronRight, History, Sparkles
} from "lucide-react";

export default function HomePage() {
    const router = useRouter();
    const { completions, addCompletion, removeCompletion, loading } = useCompletions();
    const { settings: appSettings, updateSettings } = useSettings();
    const { settings: prayerSettings } = usePrayerTimes();
    const { bookmark } = useBookmark();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"target" | "history">("target");
    const [selectedDate, setSelectedDate] = useState(getTodayDateId());

    const dailyTarget = appSettings.dailyTarget;
    const streak = calculateStreak(completions, dailyTarget);
    useBadges(completions, streak.current);
    const totalJuz = completions.length;
    const khatamCount = Math.floor(totalJuz / 30);

    // Logic to determine next target juz
    const todayId = getTodayDateId();
    const doneToday = completions.filter((c: any) => c.date_id === todayId);
    const monthId = todayId.substring(0, 7); // YYYY-MM
    const doneThisMonth = completions.filter((c: any) => c.date_id.startsWith(monthId)).length;
    const doneTodayJuz = doneToday.map((c: any) => c.juz_number);

    const isTodayGoalMet = doneToday.length >= dailyTarget;

    const lastActiveJuz = bookmark?.juz_number || 1;
    const targetJuz = doneTodayJuz.length > 0 ? (Math.max(...doneTodayJuz) % 30) + 1 : lastActiveJuz;

    const { theme, toggleTheme } = useTheme();

    if (loading) return <div className="p-10 pt-24 animate-pulse text-text-muted font-black text-center tracking-[1em]">STEALTH</div>;

    return (
        <>
            <div className="flex flex-col gap-8 animate-fade-up">
                {/* A) Header */}
                <header className="flex items-start justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin size={12} className="text-neon animate-pulse" />
                            <span className="text-mono text-neon text-[9px] font-black tracking-widest mt-0.5">
                                {prayerSettings?.city || (prayerSettings?.lat ? "LIVE GPS" : "DETECTING...")}
                            </span>
                        </div>
                        <h1 className="text-large-title text-text-primary">Ready For The Juz?</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="h-12 w-12 rounded-2xl bg-stealth-surface border border-stealth-border flex items-center justify-center text-neon active:scale-95 transition-all"
                            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                        >
                            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <button
                            onClick={() => setIsGuideOpen(true)}
                            className="h-12 w-12 rounded-2xl bg-stealth-surface border border-stealth-border flex items-center justify-center text-neon active:scale-95 transition-all"
                            title="Panduan Penggunaan"
                        >
                            <HelpCircle size={20} />
                        </button>
                    </div>
                </header>

                {/* B) Calendar Strip Section */}
                <section className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                        <div className="bg-stealth-surface p-1.5 rounded-[22px] flex items-center gap-1 border border-[var(--border-glass)]">
                            <button
                                onClick={() => setViewMode("target")}
                                className={cn(
                                    "px-5 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2",
                                    viewMode === "target"
                                        ? "bg-neon text-black shadow-neon-glow"
                                        : "text-text-muted hover:text-text-dim"
                                )}
                            >
                                <Sparkles size={12} className={viewMode === "target" ? "animate-pulse" : ""} />
                                Ramadan Mode
                            </button>
                            <button
                                onClick={() => setViewMode("history")}
                                className={cn(
                                    "px-5 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all duration-500 flex items-center gap-2",
                                    viewMode === "history"
                                        ? "bg-neon text-black shadow-neon-glow"
                                        : "text-text-muted hover:text-text-dim"
                                )}
                            >
                                <History size={12} />
                                Daily History
                            </button>
                        </div>
                        {/* 1447H Badge Removed for cleaner look */}
                    </div>

                    <ActivityStrip
                        type={viewMode}
                        currentValue={viewMode === "target" ? targetJuz : selectedDate}
                        onSelect={(val) => {
                            if (viewMode === "target") {
                                router.push(`/quran?juz=${val}`);
                            } else {
                                setSelectedDate(val);
                            }
                        }}
                        completions={completions}
                    />
                </section>

                {/* D) Next Target Hero Card - Priorities Above Overview */}
                <section>
                    <div className="card-neon p-6 flex flex-col gap-6 relative overflow-hidden group transition-all">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-black/5 rounded-full blur-3xl group-hover:bg-black/10 transition-all duration-500" />
                        <div className="flex flex-col">
                            <span className="text-caption !text-black/50 font-black">Next Target</span>
                            <h3 className="text-5xl font-black text-black tracking-tighter mt-1">Juz {targetJuz}</h3>
                            <p className="text-black/80 text-sm font-bold mt-1">Pick up where you left off</p>
                        </div>
                        <div className="flex gap-3 relative z-10">
                            <button
                                onClick={() => router.push(`/quran?juz=${targetJuz}`)}
                                className="bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex-1 active:scale-95 transition-transform shadow-xl"
                            >
                                Continue
                            </button>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-black/10 text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex-1 border border-black/5 active:scale-95 transition-transform"
                            >
                                Add Done
                            </button>
                        </div>
                    </div>
                </section>

                {/* C) Overview Section */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-headline text-text-primary/90">Overview</h2>
                        <button
                            onClick={() => setIsGoalModalOpen(true)}
                            className="text-mono text-neon text-[9px] hover:opacity-80 transition-opacity flex items-center gap-1.5 bg-stealth-surface px-3 py-1.5 rounded-xl border border-[var(--border-glass)] active:scale-95"
                        >
                            <Target size={10} strokeWidth={3} />
                            Goal: {dailyTarget} &gt;
                        </button>
                    </div>

                    <div className="grid grid-cols-1">
                        <StatTile
                            label="Current Streak"
                            value={`${streak.current} d`}
                            subValue={streak.isSaved ? "Saved (Grace Period)" : "Daily Consistency"}
                            variant="yellow"
                            icon={<Flame size={14} className={streak.isSaved ? "animate-pulse" : ""} />}
                            className="bg-neon/10 border-neon/20"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <StatPill label="Total" value={totalJuz} icon="📖" />
                        <StatPill label="Khatam" value={khatamCount} icon="⚡" />
                        <StatPill
                            label="Today"
                            value={`${doneToday.length}/${dailyTarget}`}
                            icon={isTodayGoalMet ? "✅" : "⏰"}
                            className={cn(
                                "cursor-pointer active:scale-95 transition-all",
                                isTodayGoalMet ? "border-neon/20 bg-neon/5" : "hover:bg-stealth-surface"
                            )}
                            onClick={() => setIsGoalModalOpen(true)}
                        />
                    </div>
                </section>

                <KhatamForecast totalCompletions={totalJuz} />
                <VerseOfTheDay />


                <SunnahWidget />
                <PrayerWidget />

                {/* E) Recent Activity */}
                <section className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-headline text-text-primary/90">Recent Activity</h2>
                        <button
                            onClick={() => {
                                setViewMode("history");
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-mono text-neon text-[9px] hover:opacity-80 transition-opacity"
                        >
                            See Details &gt;
                        </button>
                    </div>
                    <CompletionList completions={completions} />
                </section>

                {/* F) Share */}
                <section className="text-center pt-4">
                    <button
                        onClick={() => setIsShareModalOpen(true)}
                        className="inline-flex items-center gap-2 text-mono text-text-muted hover:text-neon transition-colors py-2 px-4 rounded-xl hover:bg-stealth-surface active:scale-95"
                    >
                        <Zap size={14} className="text-neon" />
                        <span>Share Progress Card</span>
                    </button>
                </section>

                <div className="mt-16 mb-24 flex flex-col items-center opacity-10 hover:opacity-30 transition-opacity">
                    <span className="text-[7px] font-black uppercase tracking-[4px] text-text-primary">Developed By</span>
                    <span className="text-[9px] font-bold text-neon mt-1">Derryl Youri</span>
                </div>
            </div>

            {/* Modals placed outside animated container to ensure viewport-fixed positioning */}
            <AddCompletionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={addCompletion}
                onRemove={removeCompletion}
                existingJuz={doneTodayJuz}
            />

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                streak={streak.current}
                todayCount={doneToday.length}
                totalJuz={totalJuz}
                monthCount={doneThisMonth}
            />

            <QuickGuide
                isOpen={isGuideOpen}
                onClose={() => setIsGuideOpen(false)}
            />

            <GoalSettingsModal
                isOpen={isGoalModalOpen}
                onClose={() => setIsGoalModalOpen(false)}
                currentGoal={dailyTarget}
                onUpdate={(newGoal) => updateSettings({ dailyTarget: newGoal })}
            />

            <WeeklyRecap completions={completions} />
        </>
    );
}
