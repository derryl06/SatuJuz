import { cn } from "@/lib/utils/cn";
import { Undo2, ArrowRight } from "lucide-react";

interface CompletionToastProps {
    show: boolean;
    juzNumber: number;
    onUndo: () => void;
    onNext: () => void;
}

export const CompletionToast = ({ show, juzNumber, onUndo, onNext }: CompletionToastProps) => {
    return (
        <div className={cn(
            "fixed bottom-24 sm:bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-stealth-surface border border-stealth-border p-4 rounded-2xl shadow-2xl transition-all duration-500 z-50 flex flex-col gap-3",
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}>
            <div className="flex items-center justify-between">
                <span className="text-text-primary font-black">Juz {juzNumber} selesai 🎉</span>
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onUndo}
                    className="flex-1 bg-stealth-border hover:bg-white/10 active:scale-95 transition-all text-text-primary text-[11px] font-black uppercase tracking-widest py-2 rounded-xl flex items-center justify-center gap-2 border border-[var(--border-glass)]"
                >
                    <Undo2 size={14} /> Undo
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 bg-neon text-black active:scale-95 transition-all text-[11px] font-black uppercase tracking-widest py-2 rounded-xl flex items-center justify-center gap-2 shadow-neon-glow"
                >
                    Lanjut Juz {(juzNumber % 30) + 1} <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
};
