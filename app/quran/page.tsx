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
import { ChevronLeft, ChevronRight, Check, Bookmark, Menu } from "lucide-react";

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
    const { addCompletion } = useCompletions();

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

    const handleComplete = async () => {
        await addCompletion(juzNumber);
        router.push("/");
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0B0F10]">
            {/* Top Bar */}
            <header className="sticky top-0 z-40 bg-[#0B0F10]/80 backdrop-blur-xl border-b border-white/10 px-4 h-20 flex items-center justify-between high-contrast-shadow">
                <button
                    onClick={() => router.push("/")}
                    className="h-10 w-10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>

                <button
                    onClick={() => setShowJuzPicker(!showJuzPicker)}
                    className="flex items-center gap-2 group"
                >
                    <h1 className="text-xl font-black tracking-tight text-white group-hover:text-[#FFD60A] transition-colors uppercase">
                        Juz {juzNumber}
                    </h1>
                    <Menu size={16} className="text-white/20 group-hover:text-[#FFD60A]" />
                </button>

                <div className="flex items-center gap-2">
                    <FontSizeControl fontSize={fontSize} onChange={setFontSize} />
                    <button className="h-10 w-10 flex items-center justify-center text-white/40 hover:text-[#FFD60A] transition-colors">
                        <Bookmark size={20} />
                    </button>
                </div>
            </header>

            {/* Juz Picker Overlay */}
            {showJuzPicker && (
                <div className="fixed inset-0 z-50 bg-[#0B0F10]/95 animate-in fade-in duration-300 pt-24 px-6 overflow-y-auto pb-32">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <h2 className="text-2xl font-black text-white px-2 uppercase tracking-tighter">Jump to Juz</h2>
                        <button onClick={() => setShowJuzPicker(false)} className="text-white/40 font-black text-sm uppercase px-4 py-2 bg-white/5 rounded-xl border border-white/10">Close</button>
                    </div>
                    <JuzPicker variant="grid" currentJuz={juzNumber} onSelect={handleJuzChange} />
                </div>
            )}

            <main className="flex-1 px-4 mb-32">
                {loading ? (
                    <div className="flex flex-col gap-6 py-12 animate-pulse">
                        <div className="h-8 w-1/3 bg-white/5 rounded-xl mx-auto" />
                        <div className="space-y-4">
                            <div className="h-4 w-full bg-white/5 rounded-lg" />
                            <div className="h-4 w-full bg-white/5 rounded-lg" />
                            <div className="h-4 w-5/6 bg-white/5 rounded-lg ml-auto" />
                        </div>
                    </div>
                ) : juzData ? (
                    <Reader juz={juzData} fontSize={fontSize} />
                ) : (
                    <div className="p-12 text-center text-red-400 font-bold uppercase tracking-widest bg-red-400/10 rounded-3xl border border-red-400/20 mt-10">Failed to load text</div>
                )}
            </main>

            {/* Sticky Bottom Actions */}
            <footer className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F10]/80 backdrop-blur-xl border-t border-white/10 p-4 pb-8 flex flex-col gap-4">
                <div className="max-w-md mx-auto w-full flex gap-3">
                    <div className="grid grid-cols-2 gap-3 flex-1">
                        <button
                            disabled={juzNumber <= 1}
                            onClick={() => handleJuzChange(juzNumber - 1)}
                            className="h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-black hover:bg-white/10 transition-all disabled:opacity-20 flex-1"
                        >
                            <ChevronLeft size={20} className="mr-1" /> PREV
                        </button>
                        <button
                            disabled={juzNumber >= 30}
                            onClick={() => handleJuzChange(juzNumber + 1)}
                            className="h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white font-black hover:bg-white/10 transition-all disabled:opacity-20 flex-1"
                        >
                            NEXT <ChevronRight size={20} className="ml-1" />
                        </button>
                    </div>
                    <button
                        onClick={handleComplete}
                        className="h-14 px-8 bg-[#FFD60A] text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(255,214,10,0.3)] press-scale"
                    >
                        <Check size={20} />
                        COMPLETE
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
