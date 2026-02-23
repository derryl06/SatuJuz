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
import { ChevronLeft, ChevronRight, Check, Bookmark, Menu, Sparkles } from "lucide-react";
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
    const [isFocused, setIsFocused] = useState(false);
    const { addCompletion, processing } = useCompletions();
    const { bookmark, updateBookmark } = useBookmark();
    const scrollDirection = useScrollDirection();

    // Auto-hide UI on scroll down
    const shouldHideUI = isFocused || scrollDirection === "down";

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
        setTimeout(() => setIsCompleted(false), 3000);
    };

    // Toggle Focus Mode on single tap if UI is current hidden or shown
    const toggleUI = () => setIsFocused(!isFocused);

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg-app)] animate-fade-up overflow-x-hidden">
            {/* A) Reader Header */}
            <header
                className={cn(
                    "sticky top-0 z-40 bg-[var(--bg-app)]/95 backdrop-blur-2xl border-b border-[var(--border-glass)] h-16 flex items-center justify-between px-4 sm:px-6 transition-transform duration-500 ease-in-out",
                    shouldHideUI ? "-translate-y-full" : "translate-y-0"
                )}
            >
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
                    <button
                        onClick={() => setIsFocused(!isFocused)}
                        className={cn(
                            "h-9 w-9 flex items-center justify-center transition-all active:scale-90 rounded-xl border border-[var(--border-glass)]",
                            isFocused ? "bg-neon/20 text-neon border-neon/30" : "bg-stealth-surface text-text-muted hover:text-neon"
                        )}
                        title="Focus Mode"
                    >
                        <Sparkles size={16} />
                    </button>
                    <div className="hidden sm:block">
                        <FontSizeControl fontSize={fontSize} onChange={setFontSize} />
                    </div>
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

            <main
                className={cn(
                    "flex-1 px-6 sm:px-12 md:px-24 transition-all duration-500",
                    shouldHideUI ? "pt-10 pb-20" : "pt-10 pb-40"
                )}
                onClick={() => {
                    // Tap to show/hide UI
                    if (scrollDirection === "down" || isFocused) {
                        setIsFocused(false);
                    }
                }}
            >
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
                    <div className="max-w-4xl mx-auto landscape:px-20 transition-all duration-700">
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
                shouldHideUI ? "translate-y-[150%]" : "translate-y-0 bottom-10"
            )}>
                <div className="max-w-[340px] mx-auto w-full flex items-center gap-2 bg-[var(--surface-app)] shadow-[0_12px_40px_rgba(0,0,0,0.3)] backdrop-blur-3xl border border-[var(--border-glass-vibrant)] p-1.5 rounded-[22px] pointer-events-auto">
                    <div className="flex items-center bg-stealth-surface/50 rounded-[18px] p-1 flex-1">
                        <button
                            disabled={juzNumber <= 1}
                            onClick={(e) => { e.stopPropagation(); handleJuzChange(juzNumber - 1); }}
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
                            onClick={(e) => { e.stopPropagation(); handleJuzChange(juzNumber + 1); }}
                            className="h-9 w-9 rounded-lg flex items-center justify-center text-text-dim hover:text-text-primary transition-all disabled:opacity-5 active:scale-90"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleComplete(); }}
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

            {/* Float Floating Toggle for Immersive Exit (when everything is hidden) */}
            {shouldHideUI && (
                <button
                    onClick={() => setIsFocused(false)}
                    className="fixed bottom-6 right-6 h-10 w-10 bg-neon/10 border border-neon/20 rounded-full flex items-center justify-center text-neon animate-pulse z-50 transition-all active:scale-90 sm:hidden"
                >
                    <Menu size={18} />
                </button>
            )}
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
