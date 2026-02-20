"use client";

import { useState } from "react";
import { Modal } from "../ui/Modal";
import { GlassButton } from "../ui/GlassButton";
import { cn } from "@/lib/utils/cn";

interface AddCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (juz: number) => void;
    existingJuz: number[];
}

export const AddCompletionModal = ({ isOpen, onClose, onAdd, existingJuz }: AddCompletionModalProps) => {
    const [selected, setSelected] = useState<number | null>(null);

    const handleAdd = () => {
        if (selected !== null) {
            onAdd(selected);
            onClose();
            setSelected(null);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Complete Juz">
            <div className="grid grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => {
                    const isDone = existingJuz.includes(juz);
                    return (
                        <button
                            key={juz}
                            onClick={() => setSelected(juz)}
                            className={cn(
                                "flex h-12 w-full items-center justify-center rounded-2xl font-bold transition-all duration-300",
                                selected === juz
                                    ? "bg-[#FFD60A] text-black shadow-[0_0_15px_rgba(255,214,10,0.4)] scale-90"
                                    : isDone
                                        ? "bg-[#FFD60A]/20 text-[#FFD60A] border border-[#FFD60A]/30"
                                        : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {juz}
                        </button>
                    );
                })}
            </div>

            <div className="mt-8 flex gap-3">
                <GlassButton variant="secondary" className="flex-1" onClick={onClose}>
                    Cancel
                </GlassButton>
                <GlassButton
                    variant="primary"
                    className="flex-1"
                    disabled={selected === null}
                    onClick={handleAdd}
                >
                    Add Juz
                </GlassButton>
            </div>
        </Modal>
    );
};
