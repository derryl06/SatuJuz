"use client";

import { useCompletions } from "@/hooks/useCompletions";
import { cn } from "@/lib/utils/cn";
import { useBookmark } from "@/hooks/useBookmark";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { calculateStreak } from "@/lib/utils/streak";
import { getTodayDateId } from "@/lib/utils/date";
import { calculateKhatamProgress } from "@/lib/utils/khatam";
import { PrayerWidget } from "@/components/home/PrayerWidget";
import { StatTile } from "@/components/home/TodayCard";
import { CompletionList } from "@/components/home/CompletionList";
import { ActivityStrip } from "@/components/home/ActivityStrip";
import { SunnahWidget } from "@/components/home/SunnahWidget";
import { AddCompletionModal } from "@/components/home/AddCompletionModal";
import { ShareModal } from "@/components/share/ShareModal";
import { StatPill } from "@/components/ui/StatPill";
import { KhatamSummaryCard } from "@/components/home/KhatamSummaryCard";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSettings } from "@/hooks/useSettings";
import { GoalSettingsModal } from "@/components/home/GoalSettingsModal";
import { KhatamForecast } from "@/components/home/KhatamForecast";
import { VerseOfTheDay } from "@/components/home/VerseOfTheDay";
import { useBadges } from "@/hooks/useBadges";
import { WeeklyRecap } from "@/components/home/WeeklyRecap";
import { useTheme } from "@/lib/theme/ThemeContext";
import {
    Sun, Moon, MapPin, Target, Flame, Zap, Bell, HelpCircle,
    BookOpen, Clock, Share2, Calendar, ChevronRight, History, Sparkles, Check
} from "lucide-react";

export default function HomePage() {
    const router = useRouter();
    const { completions, addCompletion, removeCompletion, loading, processing } = useCompletions();
    const { settings: appSettings, updateSettings } = useSettings();
    const { settings: prayerSettings } = usePrayerTimes();
    const { bookmark } = useBookmark();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"target" | "history">("target");
    const [selectedDate, setSelectedDate] = useState(getTodayDateId());

    const dailyTarget = appSettings.dailyTarget;
    const streak = calculateStreak(completions, dailyTarget);
    useBadges(completions, streak);
    const totalJuz = completions.length;
    const khatamCount = Math.floor(totalJuz / 30);
    const khatamProgress = calculateKhatamProgress(completions);

    // Logic to determine next target juz
    const todayId = getTodayDateId();
    const activeDateId = viewMode === "history" ? selectedDate : todayId;
    const doneActiveDay = completions.filter((c: any) => c.date_id === activeDateId);
    const doneActiveJuz = doneActiveDay.map((c: any) => c.juz_number);
    const doneToday = completions.filter((c: any) => c.date_id === todayId);
    const monthId = todayId.substring(0, 7); // YYYY-MM
    const doneThisMonth = completions.filter((c: any) => c.date_id.startsWith(monthId)).length;
    const doneTodayJuz = doneToday.map((c: any) => c.juz_number);

    const isTodayGoalMet = doneToday.length >= dailyTarget;

    const lastActiveJuz = bookmark?.juz_number || 1;
    const targetJuz = doneTodayJuz.length > 0 ? (Math.max(...doneTodayJuz) % 30) + 1 : lastActiveJuz;

    const { theme, toggleTheme } = useTheme();

    const handleShare = async () => {
        const text = `Saya sudah membaca ${khatamProgress.totalCompleted} dari 30 juz di SatuJuz.\n${khatamProgress.remaining} lagi menuju khatam.`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Progress SatuJuz',
                    text: text,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            navigator.clipboard.writeText(text);
            alert("Teks disalin ke clipboard!");
        }
    };

    if (loading) return (
        <div className="flex flex-col gap-8">
            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-24 bg-stealth-surface rounded-full animate-pulse" />
                    <div className="h-10 w-48 bg-stealth-surface rounded-xl animate-pulse" />
                </div>
            </header>
            <div className="h-40 bg-stealth-surface rounded-[28px] animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
                <div className="h-32 bg-stealth-surface rounded-[28px] animate-pulse" />
                <div className="h-32 bg-stealth-surface rounded-[28px] animate-pulse" />
            </div>
            <div className="h-40 bg-stealth-surface rounded-[28px] animate-pulse" />
        </div>
    );

    return (
        <>
            <div className="max-w-xl mx-auto flex flex-col gap-16 animate-fade-up pb-10">
                <header className="flex items-start justify-between">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <MapPin size={12} className="text-neon animate-pulse" />
                            <span className="text-mono text-neon text-[9px] font-black tracking-widest mt-0.5">
                                {prayerSettings?.city || (prayerSettings?.lat ? "LIVE GPS" : "DETECTING...")}
                            </span>
                        </div>
                        <h1 className="text-large-title text-text-primary">Siap membaca hari ini?</h1>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="h-12 w-12 rounded-2xl bg-stealth-surface border border-stealth-border flex items-center justify-center text-neon active:scale-95 transition-all"
                            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
                        >
                            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>
                </header>

                {/* Reminder section removed as requested */}

                {/* B) Calendar Strip Section */}
                <section className="flex flex-col gap-8">
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
                                Mode Target
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
                                Riwayat Harian
                            </button>
                        </div>
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

                {/* D) Next Target Hero Card */}
                <section>
                    <div className="card-neon p-6 sm:p-10 flex flex-col gap-6 relative overflow-hidden group transition-all">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-black/5 rounded-full blur-3xl group-hover:bg-black/10 transition-all duration-500" />
                        <div className="flex flex-col">
                            {!isTodayGoalMet ? (
                                <div className="mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-black/80 bg-black/10 px-2.5 py-1 rounded-md mb-1 inline-block">Hari ini belum selesai</span>
                                    <p className="text-xs text-black/60 font-bold">Target kamu {dailyTarget} juz hari ini</p>
                                </div>
                            ) : (
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 bg-black/5 w-fit px-2.5 py-1 rounded-md mb-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-black/80">Target hari ini selesai</span>
                                        <div className="bg-green-500 rounded-full p-0.5">
                                            <Check size={8} strokeWidth={4} className="text-white" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-black/60 font-bold">Bagus, lanjutkan besok</p>
                                </div>
                            )}

                            <span className="text-caption !text-black/50 font-black">Target Berikutnya</span>
                            <div className="flex items-center gap-3 mt-1">
                                <h3 className="text-5xl sm:text-7xl font-black text-black tracking-tighter">Juz {targetJuz}</h3>
                                {bookmark?.surah_number && bookmark?.ayah_number && bookmark?.juz_number === targetJuz && (
                                    <div className="hidden sm:flex flex-col bg-black/5 px-3 py-1.5 rounded-xl border border-black/10">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-black/40">Bookmark</span>
                                        <span className="text-xs font-bold text-black/80">S:{bookmark.surah_number} A:{bookmark.ayah_number}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-black/80 text-sm font-bold mt-1">
                                {bookmark?.surah_number && bookmark?.ayah_number && bookmark?.juz_number === targetJuz
                                    ? `Lanjut ke Surah ${bookmark.surah_number} Ayat ${bookmark.ayah_number}`
                                    : 'Lanjutkan dari terakhir kamu berhenti'}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 relative z-10">
                            <button
                                onClick={() => router.push(`/quran?juz=${targetJuz}`)}
                                className="bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex-1 active:scale-95 transition-transform shadow-xl"
                            >
                                {isTodayGoalMet ? "Baca Lagi" : "Lanjut Baca"}
                            </button>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-black/10 text-black px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex-1 border border-black/5 active:scale-95 transition-transform"
                            >
                                {viewMode === "history" ? `Tandai Selesai (${selectedDate})` : "Tandai Selesai"}
                            </button>
                        </div>
                    </div>
                </section>

                {/* C) Overview Section */}
                <section className="flex flex-col gap-4 mt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-headline text-text-primary/90">Ringkasan</h2>
                        <button
                            onClick={() => setIsGoalModalOpen(true)}
                            className="text-mono text-neon text-[9px] hover:opacity-80 transition-opacity flex items-center gap-1.5 bg-stealth-surface px-3 py-1.5 rounded-xl border border-[var(--border-glass)] active:scale-95"
                        >
                            <Target size={10} strokeWidth={3} />
                            Target: {dailyTarget} &gt;
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <StatTile
                            label="Konsistensi"
                            value={`${streak} d`}
                            subValue={streak > 0 ? "Konsistensi Harian" : "Mulai Membaca"}
                            variant="yellow"
                            icon={<Flame size={14} className={streak > 0 ? "animate-pulse" : ""} />}
                            className="bg-neon/10 border-neon/20 h-full"
                        />
                        <div className="flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-5 w-full">
                                <StatPill label="Total" value={totalJuz} icon="📖" />
                                <KhatamSummaryCard completions={completions} onShare={handleShare} />
                            </div>
                            <StatPill
                                label="Progress Hari Ini"
                                value={`${doneToday.length}/${dailyTarget}`}
                                icon={isTodayGoalMet ? "✅" : "⏰"}
                                className={cn(
                                    "cursor-pointer active:scale-95 transition-all h-full",
                                    isTodayGoalMet ? "border-neon/20 bg-neon/5" : "hover:bg-stealth-surface"
                                )}
                                onClick={() => setIsGoalModalOpen(true)}
                            />
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="flex flex-col gap-6">
                        <KhatamForecast totalCompletions={totalJuz} />
                        <SunnahWidget />
                    </div>
                    <div className="flex flex-col gap-6">
                        <VerseOfTheDay />
                        <PrayerWidget />
                    </div>
                </div>

                {/* E) Recent Activity */}
                <section className="flex flex-col gap-4 mt-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-headline text-text-primary/90">Aktivitas Terkini</h2>
                        <button
                            onClick={() => {
                                setViewMode("history");
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-mono text-neon text-[9px] hover:opacity-80 transition-opacity"
                        >
                            Lihat Detail &gt;
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <CompletionList completions={completions} />
                    </div>
                </section>

                {/* F) Share */}
                <section className="text-center pt-4">
                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-2 text-mono text-text-muted hover:text-neon transition-colors py-2 px-4 rounded-xl hover:bg-stealth-surface active:scale-95"
                    >
                        <Zap size={14} className="text-neon" />
                        <span>Bagikan Progress</span>
                    </button>
                </section>

                <div className="mt-16 mb-24 flex flex-col items-center opacity-10 hover:opacity-30 transition-opacity">
                    <span className="text-[7px] font-black uppercase tracking-[4px] text-text-primary">Dikembangkan Oleh</span>
                    <span className="text-[9px] font-bold text-neon mt-1">Derryl Youri</span>
                </div>
            </div>

            {/* Modals outside main container */}
            <AddCompletionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={(juz) => addCompletion(juz, activeDateId)}
                onRemove={(juz) => removeCompletion(juz, activeDateId)}
                existingJuz={doneActiveJuz}
                processing={processing}
                dateId={activeDateId}
                onDateChange={(newDate) => {
                    setViewMode("history");
                    setSelectedDate(newDate);
                }}
            />

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                streak={streak}
                todayCount={doneToday.length}
                totalJuz={totalJuz}
                monthCount={doneThisMonth}
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
