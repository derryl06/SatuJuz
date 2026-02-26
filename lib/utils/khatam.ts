import { JuzCompletion } from "@/types/domain";

export function calculateKhatamProgress(completions: JuzCompletion[]) {
    const totalJuz = completions.length;
    let totalCompleted = totalJuz % 30;

    // If it's exactly a multiple of 30, it means 30/30 (khatam achieved)
    // Only reset to 0 when they start reading the next cycle.
    // Wait, if totalJuz is 30, totalCompleted is 0. But it's better to show 30/30.
    // To do this, if totalJuz > 0 and totalCompleted === 0, then we can say it's 30.
    // But if they proceed to read the 31st, totalCompleted becomes 1. This naturally handles cycles!
    if (totalJuz > 0 && totalCompleted === 0) {
        totalCompleted = 30;
    }

    const remaining = 30 - totalCompleted;
    const percentage = Math.min(100, Math.round((totalCompleted / 30) * 100));

    return {
        totalCompleted,
        remaining,
        percentage
    };
}
