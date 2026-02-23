"use client";

import { useBookmark } from "@/hooks/useBookmark";
import { QuranJuz } from "@/types/domain";
import { useEffect, useRef } from "react";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ReaderProps {
    juz: QuranJuz;
    fontSize: number;
}

export const Reader = ({ juz, fontSize }: ReaderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { bookmark, updateBookmark } = useBookmark();

    // Restore scroll position
    useEffect(() => {
        if (bookmark?.juz_number === juz.number && bookmark.scroll_y) {
            window.scrollTo({ top: bookmark.scroll_y, behavior: 'smooth' });
        } else {
            window.scrollTo(0, 0);
        }
    }, [juz.number, bookmark]);

    // Save scroll position on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY % 50 === 0) {
                updateBookmark({
                    juz_number: juz.number,
                    scroll_y: window.scrollY,
                });
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [juz.number, updateBookmark]);

    const handleAyahBookmark = (surahNumber: number, ayahNumber: number) => {
        updateBookmark({
            juz_number: juz.number,
            surah_number: surahNumber,
            ayah_number: ayahNumber,
            scroll_y: window.scrollY
        });
    };

    return (
        <div
            ref={containerRef}
            className="flex flex-col gap-12 py-8 leading-[2.2] text-right animate-in fade-in duration-1000"
            dir="rtl"
            style={{ fontSize: `${fontSize}px` }}
        >
            {juz.verses.map((verse, idx) => {
                const isBookmarked = bookmark?.juz_number === juz.number &&
                    bookmark?.surah_number === verse.surah.number &&
                    bookmark?.ayah_number === verse.numberInSurah;

                return (
                    <div key={`${juz.number}-${idx}`} className="flex flex-col gap-6 group relative">
                        {verse.numberInSurah === 1 && (
                            <div className="card-stealth w-full text-center my-10 border-neon/10 bg-neon/5 py-10 relative overflow-hidden group/surah">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon/20 to-transparent" />
                                <span className="text-[10px] font-black uppercase tracking-[4px] text-neon/60">Surah</span>
                                <h2 className="text-4xl font-black text-text-primary mt-2 tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis px-4">
                                    {verse.surah.englishName}
                                </h2>
                                <div className="text-mono !text-text-muted mt-3 !text-[10px] uppercase tracking-widest px-4">
                                    {verse.surah.name}
                                </div>
                            </div>
                        )}
                        <div className="font-arabic text-text-primary/90 selection:bg-neon/20 leading-[2.5] relative">
                            {verse.text}
                            <span className="mr-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-stealth-surface border border-[var(--border-glass)] text-[14px] font-sans font-black text-neon align-middle shadow-xl">
                                {verse.numberInSurah}
                            </span>
                        </div>
                        {verse.transliteration && (
                            <div className="flex flex-col gap-2 mt-4 text-left font-sans max-w-3xl" dir="ltr">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-neon/60 mb-1">
                                        Transliteration
                                    </h4>
                                    <button
                                        onClick={() => handleAyahBookmark(verse.surah.number, verse.numberInSurah)}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all active:scale-95",
                                            isBookmarked
                                                ? "bg-neon/10 border-neon/30 text-neon shadow-neon-glow"
                                                : "bg-stealth-surface border-[var(--border-glass)] text-text-muted hover:text-text-primary"
                                        )}
                                        title={isBookmarked ? "Currenly Bookmarked" : "Bookmark this Verse"}
                                    >
                                        <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
                                        <span className="text-[9px] font-black uppercase tracking-widest hidden sm:inline-block">
                                            {isBookmarked ? "Saved" : "Save"}
                                        </span>
                                    </button>
                                </div>
                                <p className="text-sm sm:text-base text-text-primary/90 leading-relaxed italic border-l-2 border-neon/30 pl-4 py-1">
                                    {verse.transliteration}
                                </p>
                            </div>
                        )}
                        {verse.translation && (
                            <div className="flex flex-col gap-2 text-left font-sans max-w-3xl" dir="ltr">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-text-dim/60 mb-1">
                                    Indonesia
                                </h4>
                                <p className="text-sm sm:text-base text-text-dim leading-relaxed border-l-2 border-[var(--border-glass)] pl-4 py-1">
                                    {verse.translation}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
