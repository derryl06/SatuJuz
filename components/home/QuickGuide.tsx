"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { cn } from "@/lib/utils/cn";
import { Sparkles, History, Flame, CheckCircle2, ChevronRight, ChevronLeft, Lightbulb, Target, Zap } from "lucide-react";

interface QuickGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

const slides = [
    {
        title: "Dua Mode Utama",
        description: "Pilih mode yang sesuai dengan target bacaanmu saat ini.",
        icon: <Sparkles className="text-neon" size={32} />,
        content: (
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-stealth-translucent p-4 rounded-2xl border border-stealth-border">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles size={16} className="text-neon" />
                        <span className="font-black text-xs uppercase tracking-widest text-text-primary">Ramadan Mode</span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed font-medium">Fokus ke target Juz 1-30. Cocok buat kamu yang mengejar khatam satu juz sehari.</p>
                </div>
                <div className="bg-stealth-translucent p-4 rounded-2xl border border-stealth-border opacity-80">
                    <div className="flex items-center gap-3 mb-2">
                        <History size={16} className="text-neon" />
                        <span className="font-black text-xs uppercase tracking-widest text-text-primary">Daily History</span>
                    </div>
                    <p className="text-[11px] text-text-muted leading-relaxed font-medium">Fokus ke kebiasaan harian. Lihat riwayat bacaanmu 14 hari terakhir.</p>
                </div>
            </div>
        )
    },
    {
        title: "Daily Target",
        description: "Sesuaikan target bacaan harianmu sendiri.",
        icon: <Target className="text-neon" size={32} />,
        content: (
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-stealth-translucent p-4 rounded-2xl border border-stealth-border">
                    <h4 className="font-black text-text-primary text-[11px] uppercase tracking-widest mb-1">Custom Goal</h4>
                    <p className="text-[11px] text-text-muted leading-relaxed font-medium">Klik tombol <span className="text-neon font-bold">Goal</span> di bagian Overview untuk mengatur berapa banyak Juz yang ingin kamu baca setiap harinya.</p>
                </div>
                <div className="bg-stealth-translucent p-4 rounded-2xl border border-stealth-border">
                    <h4 className="font-black text-text-primary text-[11px] uppercase tracking-widest mb-1">Progress Tracker</h4>
                    <p className="text-[11px] text-text-muted leading-relaxed font-medium">Indikator <span className="text-text-primary font-bold">Today</span> akan otomatis menyesuaikan dengan target barumu. Selesaikan misi untuk dapat centang hijau!</p>
                </div>
            </div>
        )
    },
    {
        title: "Streak Resilience",
        description: "Jangan takut putus streak kalau kamu sedang sibuk.",
        icon: <Flame className="text-neon" size={32} />,
        content: (
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-neon/10 p-6 rounded-[28px] border border-neon/20 flex flex-col items-center text-center">
                    <Flame size={40} className="text-neon animate-pulse mb-3" />
                    <h4 className="font-black text-text-primary text-base">Grace Period (1 Hari)</h4>
                    <p className="text-[11px] text-text-muted mt-2 leading-relaxed">Bolong baca 1 hari tidak akan memutus streak-mu. Status akan berubah jadi <span className="text-neon font-bold">Saved</span> untuk mengingatkanmu lanjut hari ini.</p>
                </div>
            </div>
        )
    },
    {
        title: "Manajemen Manual",
        description: "Tandai juz selesai langsung dari halaman utama.",
        icon: <CheckCircle2 className="text-neon" size={32} />,
        content: (
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-stealth-translucent p-4 rounded-2xl border border-stealth-border">
                    <h4 className="font-black text-text-primary text-[11px] uppercase tracking-widest mb-1">Interactive List</h4>
                    <p className="text-[11px] text-text-muted leading-relaxed">Klik angka Juz di bagian bawah untuk menandai progres secara cepat. Ingin membatalkan? Klik item di Recent Activity.</p>
                </div>
                <div className="bg-stealth-translucent p-4 rounded-2xl border border-stealth-border">
                    <h4 className="font-black text-text-primary text-[11px] uppercase tracking-widest mb-1">Bookmark Sync</h4>
                    <p className="text-[11px] text-text-muted leading-relaxed">Progresmu akan otomatis tersimpan sebagai bookmark supaya kamu bisa lanjut baca kapan saja.</p>
                </div>
            </div>
        )
    },
    {
        title: "Cloud Sync",
        description: "Amankan datamu dengan login via Email.",
        icon: <Zap className="text-neon" size={32} />,
        content: (
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-neon/10 p-6 rounded-[28px] border border-neon/20 flex flex-col items-center text-center">
                    <Zap size={40} className="text-neon mb-3 shadow-neon-glow" />
                    <h4 className="font-black text-text-primary text-base">Multi-Device Access</h4>
                    <p className="text-[11px] text-text-muted mt-2 leading-relaxed">Login di halaman Profile untuk sinkronisasi data antar perangkat. Tanpa password, cukup Magic Link ke email kamu.</p>
                </div>
            </div>
        )
    }
];

export const QuickGuide = ({ isOpen, onClose }: QuickGuideProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            onClose();
            setTimeout(() => setCurrentSlide(0), 300);
        }
    };

    const handleBack = () => {
        if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Quick Guide">
            <div className="flex flex-col gap-5 min-h-[360px] max-h-[75vh] overflow-y-auto custom-scrollbar">
                <div className="flex flex-col items-center text-center px-2">
                    <div className="h-16 w-16 rounded-[20px] bg-neon/10 border border-neon/10 flex items-center justify-center mb-4">
                        {slides[currentSlide].icon}
                    </div>
                    <h3 className="text-2xl font-black text-text-primary tracking-tighter uppercase">{slides[currentSlide].title}</h3>
                    <p className="text-[11px] font-medium text-text-dim mt-1 max-w-[200px]">{slides[currentSlide].description}</p>
                </div>

                <div className="flex-1">
                    {slides[currentSlide].content}
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-center gap-1.5">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    currentSlide === i ? "w-8 bg-neon" : "w-1.5 bg-stealth-translucent"
                                )}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleBack}
                            disabled={currentSlide === 0}
                            className="h-14 rounded-[20px] bg-stealth-translucent border border-stealth-border text-text-muted font-black uppercase tracking-widest text-[9px] flex items-center justify-center disabled:opacity-0 transition-all"
                        >
                            <ChevronLeft size={16} className="mr-1" />
                            Prev
                        </button>
                        <button
                            onClick={handleNext}
                            className="h-14 rounded-[20px] bg-neon text-black font-black uppercase tracking-widest text-[9px] flex items-center justify-center transition-all active:scale-95 shadow-xl"
                        >
                            {currentSlide === slides.length - 1 ? "Got It!" : "Next"}
                            {currentSlide !== slides.length - 1 && <ChevronRight size={16} className="ml-1" />}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
