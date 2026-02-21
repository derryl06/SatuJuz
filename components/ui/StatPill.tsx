import { cn } from "@/lib/utils/cn";

interface StatPillProps {
    label: string;
    value: string | number;
    icon?: string;
    className?: string;
    onClick?: () => void;
}

export const StatPill = ({ label, value, icon, className, onClick }: StatPillProps) => {
    return (
        <div
            onClick={onClick}
            className={cn("flex flex-col gap-1 rounded-2xl bg-stealth-surface p-4 border border-[var(--border-glass)]", className)}
        >
            <span className="text-caption">{label}</span>
            <div className="flex items-center gap-2">
                {icon && <span className="text-lg">{icon}</span>}
                <span className="text-xl font-black text-text-primary tracking-tighter">{value}</span>
            </div>
        </div>
    );
};
