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
import { Check } from "lucide-react";

export default function QuranPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const juzParam = searchParams.get("juz");
    const [juzNumber, setJuzNumber] = useState(juzParam ? parseInt(juzParam) : 1);
    const [juzData, setJuzData] = useState<QuranJuz | null>(null);
    const [fontSize, setFontSize] = useState(28);
    const [loading, setLoading] = useState(true);
    const { addCompletion } = useCompletions();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const data = await fetchJuz(juzNumber);
            setJuzData(data);
            setLoading(false);
        };
        loadData();
    }, [juzNumber]);

    const handleJuzChange = (n: number) => {
        setJuzNumber(n);
        router.push(`/quran?juz=${n}`);
    };

    const handleComplete = async () => {
        await addCompletion(juzNumber);
        // Optionally show a toast or animation
        router.push("/");
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#090909]">
            <header className="sticky top-0 z-40 bg-[#090909]/95 border-b border-white/5 p-6 flex flex-col gap-6 high-contrast-shadow">
                <div className="flex items-center justify-between">
                    <h1 className="text-ios-title text-white">Juz {juzNumber}</h1>
                    <FontSizeControl fontSize={fontSize} onChange={setFontSize} />
                </div>
                <JuzPicker currentJuz={juzNumber} onSelect={handleJuzChange} />
            </header>

            <main className="flex-1 px-6">
                {loading ? (
                    <div className="flex h-64 items-center justify-center text-white/20 italic">Loading text...</div>
                ) : juzData ? (
                    <Reader juz={juzData} fontSize={fontSize} />
                ) : (
                    <div className="p-12 text-center text-red-400">Failed to load Quran text. Check connection.</div>
                )}
            </main>

            <footer className="p-8 mb-24">
                <GlassButton variant="accent" className="w-full h-20 text-xl font-black rounded-[32px] neon-glow" onClick={handleComplete}>
                    <Check className="mr-3" size={24} />
                    Mark Juz {juzNumber} Complete
                </GlassButton>
            </footer>
        </div>
    );
}
