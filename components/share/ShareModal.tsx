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
}

export const ShareModal = ({ isOpen, onClose, streak, todayCount }: ShareModalProps) => {
    const [template, setTemplate] = useState<"minimal" | "bold" | "elegant">("minimal");
    const [dataUrl, setDataUrl] = useState("");

    const handleDownload = () => {
        const link = document.createElement("a");
        link.download = `od1j-share-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Share Journey">
            <div className="flex flex-col gap-6">
                {/* Preview aspect ratio card */}
                <div className="glass-surface relative aspect-[9/16] w-full max-w-[220px] mx-auto rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
                    {dataUrl ? (
                        <img src={dataUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full bg-white/5 animate-pulse flex items-center justify-center">
                            <Share2 className="text-white/10 animate-bounce" size={40} />
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/20 px-2">Style Template</span>
                    <div className="grid grid-cols-3 gap-3">
                        {(["minimal", "bold", "elegant"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTemplate(t)}
                                className={cn(
                                    "flex h-12 items-center justify-center rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 border",
                                    template === t
                                        ? "bg-[#FFD60A] border-none text-black shadow-[0_0_15px_rgba(255,214,10,0.3)]"
                                        : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    <button
                        onClick={handleDownload}
                        disabled={!dataUrl}
                        className="w-full h-14 bg-[#FFD60A] text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(255,214,10,0.3)] disabled:opacity-20 press-scale"
                    >
                        <Download size={20} />
                        SAVE IMAGE
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/60 font-black text-sm hover:bg-white/10 transition-all press-scale"
                    >
                        CLOSE
                    </button>
                </div>

                <ShareCanvas
                    template={template}
                    streak={streak}
                    todayCount={todayCount}
                    onReady={setDataUrl}
                />
            </div>
        </Modal>
    );
};
