"use client";

import { useBookmark } from "@/hooks/useBookmark";
import { QuranJuz } from "@/types/domain";
import { useEffect, useRef } from "react";

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
            window.scrollTo(0, bookmark.scroll_y);
        } else {
            window.scrollTo(0, 0);
        }
    }, [juz.number, bookmark]);

    // Save scroll position on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY % 20 === 0) {
                updateBookmark({
                    juz_number: juz.number,
                    scroll_y: window.scrollY,
                });
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [juz.number, updateBookmark]);

    return (
        <div
            ref={containerRef}
            className="flex flex-col gap-12 py-8 leading-[2.2] text-right animate-in fade-in duration-1000"
            dir="rtl"
            style={{ fontSize: `${fontSize}px` }}
        >
            {juz.verses.map((verse, idx) => (
                <div key={`${juz.number}-${idx}`} className="flex flex-col gap-6">
                    {verse.numberInSurah === 1 && (
                        <div className="flex flex-col items-center gap-4 py-12">
                            <div className="h-px w-full bg-white/10" />
                            <div className="text-center font-black text-xl tracking-tighter text-[#FFD60A] font-sans uppercase">
                                Surah {verse.surah.englishName}
                            </div>
                            <div className="h-px w-full bg-white/10" />
                        </div>
                    )}
                    <div className="font-arabic text-white/90 selection:bg-[#FFD60A]/20">
                        {verse.text}
                        <span className="mr-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-[12px] font-sans font-black text-[#FFD60A] align-middle high-contrast-shadow">
                            {verse.numberInSurah}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
