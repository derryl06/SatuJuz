"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchJuz } from "@/lib/quran/quranData";
import { QuranJuz } from "@/types/domain";
import { JuzPicker } from "@/components/quran/JuzPicker";
import { Reader } from "@/components/quran/Reader";
import { FontSizeControl } from "@/components/quran/FontSizeControl";
import { GlassButton } from "@/components/ui/GlassButton";
import { useCompletions } from "@/hooks/useCompletions";
import { useBookmark } from "@/hooks/useBookmark";
import { ChevronLeft, ChevronRight, Check, Bookmark, Menu } from "lucide-react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { cn } from "@/lib/utils/cn";

import { Suspense } from "react";

function QuranPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const juzParam = searchParams.get("juz");
    const [juzNumber, setJuzNumber] = useState(juzParam ? parseInt(juzParam) : 1);
    const [juzData, setJuzData] = useState<QuranJuz | null>(null);
    const [fontSize, setFontSize] = useState(28);
    const [loading, setLoading] = useState(true);
    const [showJuzPicker, setShowJuzPicker] = useState(false);
    const { addCompletion, processing } = useCompletions();
    const { bookmark, updateBookmark } = useBookmark();
    const scrollDirection = useScrollDirection();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchJuz(juzNumber);
            setJuzData(data);
            setLoading(false);
            window.scrollTo(0, 0);
        };
        loadData();
    }, [juzNumber]);

    const handleJuzChange = (n: number) => {
        setJuzNumber(n);
        setShowJuzPicker(false);
        router.push(`/quran?juz=${n}`);
    };

    const [isCompleted, setIsCompleted] = useState(false);

    const handleComplete = async () => {
        await addCompletion(juzNumber);
        setIsCompleted(true);
        // Reset success state after 3 seconds
        setTimeout(() => setIsCompleted(false), 3000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg-app)] animate-fade-up">
            {/* A) Reader Header */}
            <header className="sticky top-0 z-40 bg-[var(--bg-app)] / 95 backdrop-blur-2xl border-b border-[var(--border-glass)] h-16 flex items-center justify-between px-4 sm:px-6">
                <button
                    onClick={() => router.push("/")}
                    className="h-10 w-10 flex items-center justify-center text-text-dim hover:text-text-primary transition-all active:scale-90 bg-stealth-surface border border-[var(--border-glass)] rounded-xl"
                >
                    <ChevronLeft size={20} />
                </button>

                <button
                    onClick={() => setShowJuzPicker(!showJuzPicker)}
                    className="flex flex-col items-center group active:scale-95 transition-all"
                >
                    <span className="text-[7px] font-black uppercase tracking-[3px] text-neon/40 group-hover:text-neon/60 transition-colors mb-0.5">Selection</span>
                    <div className="flex items-center gap-2">
                        <div className="px-2.5 py-1 bg-neon/10 rounded-lg border border-neon/20">
                            <h1 className="text-sm font-black tracking-widest text-neon group-hover:scale-105 transition-transform uppercase">
                                Juz {juzNumber}
                            </h1>
                        </div>
                        <Menu size={12} className="text-text-muted group-hover:text-neon" />
                    </div>
                </button>

                <div className="flex items-center gap-2">
                    <FontSizeControl fontSize={fontSize} onChange={setFontSize} />
                    <button
                        onClick={() => updateBookmark({ juz_number: juzNumber })}
                        className={cn(
                            "h-9 w-9 flex items-center justify-center transition-all active:scale-90 bg-stealth-surface rounded-xl border border-[var(--border-glass)]",
                            bookmark?.juz_number === juzNumber ? "text-neon border-neon/30 shadow-neon-glow" : "text-text-muted hover:text-neon"
                        )}
                    >
                        <Bookmark size={16} fill={bookmark?.juz_number === juzNumber ? "currentColor" : "none"} />
                    </button>
                </div>
            </header>

            {/* Juz Picker Overlay */}
            {showJuzPicker && (
                <div className="fixed inset-0 z-50 bg-[var(--bg-app)] animate-fade-in pt-24 px-6 overflow-y-auto pb-40">
                    <div className="flex items-center justify-between mb-10 px-4">
                        <div className="flex flex-col">
                            <span className="text-caption !text-text-dim">Quick Jump</span>
                            <h2 className="text-3xl font-black text-text-primary uppercase tracking-tighter mt-1">Select Juz</h2>
                        </div>
                        <button
                            onClick={() => setShowJuzPicker(false)}
                            className="h-12 px-6 bg-stealth-surface rounded-2xl text-[11px] font-black uppercase tracking-widest text-text-dim hover:bg-[var(--surface-app)] active:scale-95 transition-all border border-[var(--border-glass)]"
                        >
                            Close
                        </button>
                    </div>
                    <div className="max-w-md mx-auto">
                        <JuzPicker variant="grid" currentJuz={juzNumber} onSelect={handleJuzChange} />
                    </div>
                </div>
            )}

            <main className="flex-1 px-6 pb-40 pt-10">
                {loading ? (
                    <div className="flex flex-col gap-10 py-12">
                        <div className="h-12 w-48 bg-stealth-surface rounded-2xl mx-auto animate-pulse" />
                        <div className="space-y-6">
                            <div className="h-4 w-full bg-stealth-surface rounded-full animate-pulse" />
                            <div className="h-4 w-full bg-stealth-surface rounded-full animate-pulse" />
                            <div className="h-4 w-3/4 bg-stealth-surface rounded-full mx-auto animate-pulse" />
                            <div className="h-4 w-full bg-stealth-surface rounded-full animate-pulse" />
                            <div className="h-4 w-5/6 bg-stealth-surface rounded-full animate-pulse" />
                        </div>
                    </div>
                ) : juzData ? (
                    <div>
                        <Reader juz={juzData} fontSize={fontSize} />
                    </div>
                ) : (
                    <div className="p-16 text-center text-red-500 bg-red-500/5 rounded-[32px] border border-red-500/10 mt-10">
                        <span className="text-xs font-black uppercase tracking-widest block mb-2">Error</span>
                        <p className="text-sm font-medium opacity-60">Failed to load holy text</p>
                    </div>
                )}
            </main>

            {/* Sticky Bottom Actions */}
            <footer className={cn(
                "fixed left-0 right-0 z-40 px-5 pointer-events-none transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1)",
                scrollDirection === "down" ? "bottom-[104px]" : "bottom-32"
            )}>
                <div className="max-w-[340px] mx-auto w-full flex items-center gap-2 bg-[var(--surface-app)] / 80 backdrop-blur-2xl border border-[var(--border-glass-vibrant)] p-1.5 rounded-[22px] shadow-[0_12px_40px_rgba(0,0,0,0.15)] pointer-events-auto">
                    <div className="flex items-center bg-stealth-surface/50 rounded-[18px] p-1 flex-1">
                        <button
                            disabled={juzNumber <= 1}
                            onClick={() => handleJuzChange(juzNumber - 1)}
                            className="h-9 w-9 rounded-lg flex items-center justify-center text-text-dim hover:text-text-primary transition-all disabled:opacity-5 active:scale-90"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex-1 text-center">
                            <span className="text-[7px] font-black uppercase tracking-[2px] text-text-muted block">Juz</span>
                            <span className="text-[11px] font-black text-text-primary block -mt-1">{juzNumber}</span>
                        </div>
                        <button
                            disabled={juzNumber >= 30}
                            onClick={() => handleJuzChange(juzNumber + 1)}
                            className="h-9 w-9 rounded-lg flex items-center justify-center text-text-dim hover:text-text-primary transition-all disabled:opacity-5 active:scale-90"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <button
                        onClick={handleComplete}
                        disabled={isCompleted || processing}
                        className={cn(
                            "h-11 px-6 rounded-[20px] font-black flex items-center justify-center gap-2 transition-all",
                            isCompleted
                                ? "bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                                : "bg-neon text-black shadow-neon hover:shadow-neon/40 active:scale-95"
                        )}
                    >
                        {processing ? (
                            <span className="uppercase tracking-tighter text-sm">Saving...</span>
                        ) : isCompleted ? (
                            <>
                                <Check size={16} strokeWidth={3} />
                                <span className="uppercase tracking-tighter text-sm">Saved!</span>
                            </>
                        ) : (
                            <>
                                <Check size={16} strokeWidth={3} />
                                <span className="uppercase tracking-tighter text-sm">Finish</span>
                            </>
                        )}
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default function QuranPage() {
    return (
        <Suspense fallback={<div className="p-10 pt-24 animate-pulse text-white/5 font-black text-center tracking-[1em]">STEALTH</div>}>
            <QuranPageContent />
        </Suspense>
    );
}
