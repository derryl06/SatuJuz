"use client";

import { useEffect, useState } from "react";
import { Book, Heart, Star, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export const SunnahWidget = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const isFriday = currentTime.getDay() === 5;

    // Example logic for "Virtue of the day"
    const virtues = [
        "Smiling is charity.",
        "Kindness is a mark of faith.",
        "Cleanliness is half of faith.",
        "The best among you are those who have the best manners.",
        "Truthfulness leads to righteousness.",
        "Modesty is a branch of faith.",
        "A good word is charity."
    ];
    const dailyVirtue = virtues[currentTime.getDate() % virtues.length];

    if (isFriday) {
        return (
            <div className="card-neon p-5 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-neon shadow-lg">
                        <Book size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest !text-black/40">Friday Sunnah</span>
                        <h3 className="text-xl font-black !text-black leading-tight">Read Al-Kahf</h3>
                    </div>
                </div>
                <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center group-hover:bg-black/10 transition-colors">
                    <ChevronRight size={20} className="!text-black" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-stealth-surface border border-stealth-border rounded-[32px] p-5 flex items-start gap-4 transition-colors">
            <div className="w-10 h-10 bg-neon/10 rounded-xl flex items-center justify-center text-neon shrink-0">
                <Sparkles size={20} />
            </div>
            <div className="flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Daily Reminder</span>
                <p className="text-text-primary/80 font-medium leading-relaxed mt-1 text-sm">
                    "{dailyVirtue}"
                </p>
            </div>
        </div>
    );
};
