"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { cn } from "@/lib/utils/cn";
import { Sparkles, History, Flame, CheckCircle2, ChevronRight, ChevronLeft, Lightbulb, Target } from "lucide-react";

interface QuickGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

const slides = [
    {
        title: "Dua Mode Utama",
        description: "Pilih mode yang sesuai dengan target bacaanmu saat ini.",
        icon: <Sparkles className="text-[#FFD60A]" size={32} />,
        content: (
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles size={16} className="text-[#FFD60A]" />
                        <span className="font-black text-xs uppercase tracking-widest">Ramadan Mode</span>
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium">Fokus ke target Juz 1-30. Cocok buat kamu yang mengejar khatam satu juz sehari.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 opacity-80">
                    <div className="flex items-center gap-3 mb-2">
                        <History size={16} className="text-[#FFD60A]" />
                        <span className="font-black text-xs uppercase tracking-widest">Daily History</span>
                    </div>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium">Fokus ke kebiasaan harian. Lihat riwayat bacaanmu 14 hari terakhir.</p>
                </div>
            </div>
        )
    },
    {
        title: "Daily Target",
        description: "Sesuaikan target bacaan harianmu sendiri.",
        icon: <Target className="text-[#FFD60A]" size={32} />,
        content: (
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <h4 className="font-black text-white text-[11px] uppercase tracking-widest mb-1">Custom Goal</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium">Klik tombol <span className="text-[#FFD60A] font-bold">Goal</span> di bagian Overview untuk mengatur berapa banyak Juz yang ingin kamu baca setiap harinya.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <h4 className="font-black text-white text-[11px] uppercase tracking-widest mb-1">Progress Tracker</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed font-medium">Indikator <span className="text-white font-bold">Today</span> akan otomatis menyesuaikan dengan target barumu. Selesaikan misi untuk dapat centang hijau!</p>
                </div>
            </div>
        )
    },
    {
        title: "Streak Resilience",
        description: "Jangan takut putus streak kalau kamu sedang sibuk.",
        icon: <Flame className="text-[#FFD60A]" size={32} />,
        content: (
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-[#FFD60A]/10 p-6 rounded-[28px] border border-[#FFD60A]/20 flex flex-col items-center text-center">
                    <Flame size={40} className="text-[#FFD60A] animate-pulse mb-3" />
                    <h4 className="font-black text-white text-base">Grace Period (1 Hari)</h4>
                    <p className="text-[11px] text-white/40 mt-2 leading-relaxed">Bolong baca 1 hari tidak akan memutus streak-mu. Status akan berubah jadi <span className="text-[#FFD60A] font-bold">Saved</span> untuk mengingatkanmu lanjut hari ini.</p>
                </div>
            </div>
        )
    },
    {
        title: "Manajemen Manual",
        description: "Tandai juz selesai langsung dari halaman utama.",
        icon: <CheckCircle2 className="text-[#FFD60A]" size={32} />,
        content: (
            <div className="flex flex-col gap-4 mt-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <h4 className="font-black text-white text-[11px] uppercase tracking-widest mb-1">Double-Tap to Unmark</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">Salah pencet? Klik lagi juz yang sudah selesai di hari ini untuk memunculkan tombol <span className="text-red-400 font-bold">Unmark Juz</span>.</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <h4 className="font-black text-white text-[11px] uppercase tracking-widest mb-1">Activity Strip</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">Klik bubble tanggal atau angka Juz di bagian bawah untuk menandai progres secara cepat.</p>
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
                    <div className="h-16 w-16 rounded-[20px] bg-[#FFD60A]/10 border border-[#FFD60A]/10 flex items-center justify-center mb-4">
                        {slides[currentSlide].icon}
                    </div>
                    <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{slides[currentSlide].title}</h3>
                    <p className="text-[11px] font-medium text-white/30 mt-1 max-w-[200px]">{slides[currentSlide].description}</p>
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
                                    currentSlide === i ? "w-8 bg-[#FFD60A]" : "w-1.5 bg-white/10"
                                )}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleBack}
                            disabled={currentSlide === 0}
                            className="h-14 rounded-[20px] bg-white/5 border border-white/5 text-white/20 font-black uppercase tracking-widest text-[9px] flex items-center justify-center disabled:opacity-0 transition-all"
                        >
                            <ChevronLeft size={16} className="mr-1" />
                            Prev
                        </button>
                        <button
                            onClick={handleNext}
                            className="h-14 rounded-[20px] bg-[#FFD60A] text-black font-black uppercase tracking-widest text-[9px] flex items-center justify-center transition-all active:scale-95 shadow-xl"
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
