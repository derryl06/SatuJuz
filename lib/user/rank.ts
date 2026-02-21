export type UserRank = {
    title: string;
    description: string;
    neonColor: string;
    minStreak: number;
    nextTierIdx: number | null;
};

export const RANKS: UserRank[] = [
    { title: "Novice Reader", description: "Beginning the Journey", neonColor: "text-white/60", minStreak: 0, nextTierIdx: 1 },
    { title: "Consistent Seeker", description: "Building the Habit", neonColor: "text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]", minStreak: 7, nextTierIdx: 2 },
    { title: "Dedicated Reciter", description: "Steadfast Devotion", neonColor: "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]", minStreak: 15, nextTierIdx: 3 },
    { title: "Stealth Khatib", description: "Master of the Shadows", neonColor: "text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]", minStreak: 30, nextTierIdx: 4 },
    { title: "Neon Grandmaster", description: "Luminous Consistency", neonColor: "text-[#FFD60A] drop-shadow-[0_0_12px_rgba(255,214,10,0.8)]", minStreak: 60, nextTierIdx: null }
];

export function getUserRank(streak: number): { current: UserRank, next: UserRank | null, progress: number } {
    let currentIdx = 0;

    for (let i = RANKS.length - 1; i >= 0; i--) {
        if (streak >= RANKS[i].minStreak) {
            currentIdx = i;
            break;
        }
    }

    const current = RANKS[currentIdx];
    const next = current.nextTierIdx !== null ? RANKS[current.nextTierIdx] : null;

    let progress = 100;
    if (next) {
        const totalReq = next.minStreak - current.minStreak;
        const currentProg = streak - current.minStreak;
        progress = Math.min(100, Math.max(0, (currentProg / totalReq) * 100));
    }

    return { current, next, progress };
}
