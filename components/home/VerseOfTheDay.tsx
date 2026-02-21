"use client";

import { cn } from "@/lib/utils/cn";
import { BookOpen, Share2, Quote, Sparkles } from "lucide-react";
import { useState, useMemo } from "react";

const VERSES = [
    {
        arabic: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        translation: "Maka sesungguhnya bersama kesulitan ada kemudahan.",
        reference: "Ash-Sharh: 5"
    },
    {
        arabic: "وَتَزَوَّدُوا فَإِنَّ خَيْرَ الزَّادِ التَّقْوَىٰ",
        translation: "Berbekallah, sesungguhnya sebaik-baik bekal adalah takwa.",
        reference: "Al-Baqarah: 197"
    },
    {
        arabic: "لَقَدْ كَانَ لَكُمْ فِي رَسُولِ اللَّهِ أُسْوَةٌ حَسَنَةٌ",
        translation: "Sungguh, telah ada pada (diri) Rasulullah itu suri teladan yang baik bagimu.",
        reference: "Al-Ahzab: 21"
    },
    {
        arabic: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
        translation: "Barangsiapa bertakwa kepada Allah niscaya Dia akan membukakan jalan keluar baginya.",
        reference: "At-Talaq: 2"
    },
    {
        arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
        translation: "Maka ingatlah kamu kepada-Ku, niscaya Aku ingat (pula) kepadamu.",
        reference: "Al-Baqarah: 152"
    }
];

export const VerseOfTheDay = ({ className }: { className?: string }) => {
    // Deterministic selection based on current date
    const dailyVerse = useMemo(() => {
        const today = new Date();
        const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
        // Simple hash function for date string
        let hash = 0;
        for (let i = 0; i < dateString.length; i++) {
            hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % VERSES.length;
        return VERSES[index];
    }, []);

    const [isCopied, setIsCopied] = useState(false);

    const handleShare = () => {
        const text = `"${dailyVerse.translation}" (${dailyVerse.reference})\n\nRead more on SatuJuz.`;
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className={cn("glass-card p-6 flex flex-col gap-6 relative group border-l-4 border-l-neon", className)}>
            <div className="absolute top-4 right-4 text-text-muted group-hover:text-neon/10 transition-colors">
                <Quote size={40} />
            </div>

            <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-neon/10 flex items-center justify-center text-neon">
                    <BookOpen size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-text-dim">Ayat Hari Ini</span>
            </div>

            <div className="flex flex-col gap-4 text-center py-2">
                <h4 className="text-3xl font-bold text-text-primary font-arabic leading-relaxed">
                    {dailyVerse.arabic}
                </h4>
                <div className="flex flex-col gap-1 items-center">
                    <p className="text-xs font-medium text-text-dim leading-relaxed italic max-w-[280px]">
                        "{dailyVerse.translation}"
                    </p>
                    <span className="text-[9px] font-black text-neon uppercase tracking-widest mt-2 bg-neon/10 px-2 py-0.5 rounded">
                        {dailyVerse.reference}
                    </span>
                </div>
            </div>

            <div className="flex justify-center border-t border-stealth-border/20 pt-4">
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-neon transition-all"
                >
                    <Share2 size={12} />
                    {isCopied ? "Copied!" : "Copy Verse"}
                </button>
            </div>

            <div className="hidden group-hover:block absolute -bottom-1 -right-1">
                <Sparkles size={20} className="text-neon animate-pulse opacity-20" />
            </div>
        </div>
    );
};
