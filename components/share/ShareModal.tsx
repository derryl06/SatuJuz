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
        <Modal isOpen={isOpen} onClose={onClose} title="Share Progress">
            <div className="flex flex-col gap-8">
                {/* Preview aspect ratio card */}
                <div className="glass-surface relative aspect-[9/16] w-full max-w-[240px] mx-auto rounded-3xl overflow-hidden animate-in zoom-in-95 duration-500">
                    {dataUrl ? (
                        <img src={dataUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full bg-white/5 animate-pulse" />
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <span className="text-xs font-medium uppercase tracking-widest text-white/40 px-2">Select Template</span>
                    <div className="grid grid-cols-3 gap-2">
                        {(["minimal", "bold", "elegant"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTemplate(t)}
                                className={cn(
                                    "flex h-12 items-center justify-center rounded-xl text-xs font-bold capitalize transition-all",
                                    template === t ? "bg-white text-black" : "bg-white/5 text-white hover:bg-white/10"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <GlassButton variant="secondary" className="flex-1" onClick={onClose}>
                        Close
                    </GlassButton>
                    <GlassButton variant="primary" className="flex-1" onClick={handleDownload} disabled={!dataUrl}>
                        <Download size={18} className="mr-2" />
                        Save PNG
                    </GlassButton>
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
