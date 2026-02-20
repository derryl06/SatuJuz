import { cn } from "@/lib/utils/cn";

interface StatPillProps {
    label: string;
    value: string | number;
    icon?: string;
    className?: string;
}

export const StatPill = ({ label, value, icon, className }: StatPillProps) => {
    return (
        <div className={cn("flex flex-col gap-1.5 rounded-[28px] bg-[#161616] p-5 border border-white/5 shadow-xl", className)}>
            <span className="text-ios-caption text-white/20">{label}</span>
            <div className="flex items-center gap-2.5">
                {icon && <span className="text-2xl drop-shadow-glow">{icon}</span>}
                <span className="text-2xl font-black text-white tracking-tight">{value}</span>
            </div>
        </div>
    );
};
