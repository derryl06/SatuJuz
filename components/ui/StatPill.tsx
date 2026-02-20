import { cn } from "@/lib/utils/cn";

interface StatPillProps {
    label: string;
    value: string | number;
    icon?: string;
    className?: string;
}

export const StatPill = ({ label, value, icon, className }: StatPillProps) => {
    return (
        <div className={cn("flex flex-col gap-1 rounded-3xl bg-white/5 p-4 border border-white/10 high-contrast-shadow", className)}>
            <span className="text-ios-caption text-white/30">{label}</span>
            <div className="flex items-center gap-2">
                {icon && <span className="text-xl drop-shadow-glow">{icon}</span>}
                <span className="text-xl font-black text-white tracking-tight">{value}</span>
            </div>
        </div>
    );
};
