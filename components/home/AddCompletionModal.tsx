"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { GlassButton } from "../ui/GlassButton";
import { cn } from "@/lib/utils/cn";
import { triggerConfetti } from "@/lib/utils/confetti";

interface AddCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (juz: number) => void;
    onRemove: (juz: number) => void;
    existingJuz: number[];
}

export const AddCompletionModal = ({ isOpen, onClose, onAdd, onRemove, existingJuz }: AddCompletionModalProps) => {
    const [selected, setSelected] = useState<number | null>(null);

    const isAlreadyDone = selected !== null && existingJuz.includes(selected);

    const handleAction = () => {
        if (selected !== null) {
            if (isAlreadyDone) {
                if (confirm(`Unmark Juz ${selected}? This will remove it from today's activity.`)) {
                    onRemove(selected);
                    onClose();
                    setSelected(null);
                }
            } else {
                onAdd(selected);
                triggerConfetti();
                onClose();
                setSelected(null);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Manual Completion">
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-1 px-2">
                    <span className="text-caption">Selection</span>
                    <h3 className="text-2xl font-black text-text-primary uppercase tracking-tighter">Choose Juz</h3>
                </div>

                <div className="grid grid-cols-5 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar p-1">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
                        const isDone = existingJuz.includes(juz);
                        return (
                            <button
                                key={juz}
                                onClick={() => setSelected(juz)}
                                className={cn(
                                    "flex h-14 w-full items-center justify-center rounded-[20px] font-black tracking-tighter transition-all duration-300 border relative",
                                    selected === juz
                                        ? "bg-neon border-none text-black shadow-neon-glow scale-105 z-10"
                                        : isDone
                                            ? "bg-neon/20 text-neon border-neon/30"
                                            : "bg-stealth-surface text-text-muted border-[var(--border-glass)] hover:bg-stealth-surface/80 hover:text-text-primary active:scale-95"
                                )}
                            >
                                {juz}
                                {isDone && !selected && (
                                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-neon rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={onClose}
                        className="h-16 rounded-[24px] bg-stealth-surface border border-[var(--border-glass)] text-text-muted font-black uppercase tracking-widest text-[10px] hover:bg-stealth-surface/80 active:scale-95 transition-all"
                    >
                        Discard
                    </button>
                    <button
                        disabled={selected === null}
                        onClick={handleAction}
                        className={cn(
                            "h-16 rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-neon-glow disabled:opacity-10 active:scale-95 transition-all w-full",
                            isAlreadyDone ? "bg-red-500/20 text-red-500 border border-red-500/20" : "bg-neon text-black"
                        )}
                    >
                        {isAlreadyDone ? "Unmark Juz" : "Confirm"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};
