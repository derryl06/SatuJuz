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
    const [isZenMode, setIsZenMode] = useState(false);
    const { addCompletion, processing } = useCompletions();
    const { bookmark, updateBookmark } = useBookmark();
    const scrollDirection = useScrollDirection();
    const [isAtTop, setIsAtTop] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsAtTop(window.scrollY < 20);
        };
        // Set initial state
        handleScroll();
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // UI visibility logic: 
    // Header should never hide entirely.
    const isHeaderHidden = false;
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

    // Handle Body Classes for Zen Mode
    useEffect(() => {
        if (isZenMode) {
            document.body.classList.add('zen-mode');
        } else {
            document.body.classList.remove('zen-mode');
        }

        return () => document.body.classList.remove('zen-mode');
    }, [isZenMode]);

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

    return (
        <div className="flex flex-col min-h-screen bg-[var(--bg-app)] overflow-x-hidden">
            {/* A) Reader Header - Now FIXED to viewport top */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl border-b border-[var(--border-glass)] flex items-center justify-between px-3 sm:px-6 transition-all duration-500 ease-[cubic-bezier(0.16, 1, 0.3, 1)]",
                    isZenMode
                        ? "h-12 bg-[var(--bg-app)]/60 opacity-60 hover:opacity-100"
                        : "h-16 bg-[var(--bg-app)]/95 opacity-100"
                )}
            >
                <div className="flex items-center gap-2 sm:gap-4">
                    <button
                        onClick={() => router.push("/")}
                        className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center text-text-dim hover:text-text-primary transition-all active:scale-90 bg-stealth-surface border border-[var(--border-glass)] rounded-xl"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    {/* ... other items if needed ... */}
                </div>

                <button
                    onClick={() => setShowJuzPicker(!showJuzPicker)}
                    className="flex flex-col items-center group active:scale-95 transition-all"
                >
                    <span className="text-[7px] font-black uppercase tracking-[3px] text-neon/40 group-hover:text-neon/60 transition-colors mb-0.5">Selection</span>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="px-2 sm:px-2.5 py-1 bg-neon/10 rounded-lg border border-neon/20">
                            <h1 className="text-xs sm:text-sm font-black tracking-widest text-neon group-hover:scale-105 transition-transform uppercase">
                                Juz {juzNumber}
                            </h1>
                        </div>
                        <Menu size={12} className="text-text-muted group-hover:text-neon" />
                    </div>
                </button>

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsZenMode(!isZenMode);
                        }}
                        className={cn(
                            "h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center transition-all active:scale-90 rounded-xl border border-[var(--border-glass)]",
                            isZenMode ? "bg-neon/20 text-neon border-neon/30 shadow-neon-glow" : "bg-stealth-surface text-text-muted hover:text-neon"
                        )}
                        title="Focus Mode"
                    >
                        <Sparkles size={14} className="sm:hidden" />
                        <Sparkles size={16} className="hidden sm:block" />
                    </button>
                    <div>
                        <FontSizeControl fontSize={fontSize} onChange={setFontSize} />
                    </div>
                    <button
                        onClick={() => updateBookmark({ juz_number: juzNumber })}
                        className={cn(
                            "h-8 w-8 sm:h-9 sm:w-9 flex items-center justify-center transition-all active:scale-90 bg-stealth-surface rounded-xl border border-[var(--border-glass)]",
                            bookmark?.juz_number === juzNumber ? "text-neon border-neon/30 shadow-neon-glow" : "text-text-muted hover:text-neon"
                        )}
                    >
                        <Bookmark size={14} fill={bookmark?.juz_number === juzNumber ? "currentColor" : "none"} className="sm:hidden" />
                        <Bookmark size={16} fill={bookmark?.juz_number === juzNumber ? "currentColor" : "none"} className="hidden sm:block" />
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
                    "flex-1 px-6 sm:px-12 md:px-24 transition-all duration-500 pt-24 pb-10"
                )}
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

            {/* Bottom Actions - Now statically positioned at the end of the text */}
            <footer className="w-full px-5 py-12 flex justify-center z-10 pb-32">
                <div className="max-w-[340px] w-full flex items-center gap-2 bg-[var(--surface-app)] border border-[var(--border-glass)] p-1.5 rounded-[22px]">
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
