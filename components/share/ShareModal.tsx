"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { GlassButton } from "../ui/GlassButton";
import { ShareCanvas } from "./ShareCanvas";
import { Download, Share2, Palette } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    streak: number;
    todayCount: number;
    totalJuz: number;
    monthCount: number;
}

export const ShareModal = ({ isOpen, onClose, streak, todayCount, totalJuz, monthCount }: ShareModalProps) => {
    const [template, setTemplate] = useState<"minimal" | "bold" | "elegant">("minimal");
    const [dataUrl, setDataUrl] = useState("");

    const handleDownload = () => {
        const link = document.createElement("a");
        link.download = `od1j-share-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Share Success">
            <div className="flex flex-col gap-8">
                {/* Preview aspect ratio card */}
                <div className="relative aspect-[9/16] w-full max-w-[240px] mx-auto rounded-[40px] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.7)] border-4 border-[#161616] p-1 bg-[#161616]">
                    <div className="h-full w-full rounded-[36px] overflow-hidden bg-[#0B0F10] relative">
                        {dataUrl ? (
                            <img src={dataUrl} alt="Preview" className="h-full w-full object-cover animate-fade-in" />
                        ) : (
                            <div className="h-full w-full bg-white/5 animate-pulse flex items-center justify-center">
                                <Share2 className="text-white/10" size={40} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1 px-2">
                        <span className="text-caption">Visuals</span>
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-none">Template</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {(["minimal", "bold", "elegant"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTemplate(t)}
                                className={cn(
                                    "flex h-14 items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border",
                                    template === t
                                        ? "bg-[#FFD60A] border-none text-black shadow-[0_10px_20px_rgba(255,214,10,0.2)]"
                                        : "bg-white/5 border-white/5 text-white/30 hover:bg-white/[0.08]"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleDownload}
                        disabled={!dataUrl}
                        className="w-full h-16 bg-[#FFD60A] text-black rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,214,10,0.25)] disabled:opacity-20 active:scale-95 transition-all"
                    >
                        <Download size={18} strokeWidth={3} />
                        Save Image
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full h-14 text-white/30 font-black uppercase tracking-[0.2em] text-[10px] hover:text-white/50 active:scale-95 transition-all"
                    >
                        Back
                    </button>
                </div>

                <ShareCanvas
                    template={template}
                    streak={streak}
                    todayCount={todayCount}
                    totalJuz={totalJuz}
                    monthCount={monthCount}
                    onReady={setDataUrl}
                />
            </div>
        </Modal>
    );
};
