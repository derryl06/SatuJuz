"use client";

import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils/cn";
import { Target, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { useState } from "react";

interface GoalSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentGoal: number;
    onUpdate: (newGoal: number) => void;
}

export const GoalSettingsModal = ({
    isOpen,
    onClose,
    currentGoal,
    onUpdate,
}: GoalSettingsModalProps) => {
    const [tempGoal, setTempGoal] = useState(currentGoal);

    const handleConfirm = () => {
        onUpdate(tempGoal);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Daily Target">
            <div className="flex flex-col gap-8 pb-2">
                <div className="flex flex-col items-center text-center gap-2">
                    <div className="h-16 w-16 rounded-3xl bg-neon/10 border border-neon/20 flex items-center justify-center text-neon mb-2 shadow-neon-glow">
                        <Target size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-text-primary tracking-tighter uppercase">Set Your Goal</h3>
                    <p className="text-[11px] font-medium text-text-dim max-w-[200px]">
                        How many Juz do you want to read every day?
                    </p>
                </div>

                <div className="flex items-center justify-center gap-8">
                    <button
                        onClick={() => setTempGoal(Math.max(1, tempGoal - 1))}
                        className="h-14 w-14 rounded-2xl bg-stealth-surface border border-[var(--border-glass)] flex items-center justify-center text-text-muted active:scale-95 transition-all hover:bg-stealth-surface/80 hover:text-text-primary"
                    >
                        <ChevronDown size={24} />
                    </button>

                    <div className="flex flex-col items-center min-w-[80px]">
                        <span className="text-6xl font-black text-neon tracking-tighter animate-in zoom-in-50 duration-300">
                            {tempGoal}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[3px] text-text-muted -mt-1">
                            Juz / Day
                        </span>
                    </div>

                    <button
                        onClick={() => setTempGoal(Math.min(30, tempGoal + 1))}
                        className="h-14 w-14 rounded-2xl bg-stealth-surface border border-[var(--border-glass)] flex items-center justify-center text-text-muted active:scale-95 transition-all hover:bg-stealth-surface/80 hover:text-text-primary"
                    >
                        <ChevronUp size={24} />
                    </button>
                </div>

                <div className="bg-neon/5 border border-neon/10 rounded-2xl p-4 flex items-start gap-3">
                    <Sparkles size={16} className="text-neon mt-0.5" />
                    <p className="text-[10px] font-medium text-neon/60 leading-relaxed">
                        Setting a consistent goal helps maintain your streak. You can always change this later.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={onClose}
                        className="h-16 rounded-[24px] bg-stealth-surface border border-[var(--border-glass)] text-text-muted font-black uppercase tracking-widest text-[10px] hover:bg-stealth-surface/80 active:scale-95 transition-all"
                    >
                        Discard
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="h-16 rounded-[24px] bg-neon text-black font-black uppercase tracking-widest text-[10px] shadow-neon-glow active:scale-95 transition-all"
                    >
                        Save Goal
                    </button>
                </div>
            </div>
        </Modal>
    );
};
