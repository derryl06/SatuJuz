import { JuzCompletion } from "@/types/domain";
import { parseDateId, formatDateId } from "./date";

export function calculateStreak(
    completions: JuzCompletion[],
    dailyTarget: number
): number {
    if (!completions || completions.length === 0) return 0;

    // Group by date and count completions
    const dateCounts: Record<string, number> = {};
    completions.forEach(c => {
        dateCounts[c.date_id] = (dateCounts[c.date_id] || 0) + 1;
    });

    // Only count dates that meet the daily target
    const metDates = Object.keys(dateCounts)
        .filter(dateId => dateCounts[dateId] >= dailyTarget)
        .sort((a, b) => b.localeCompare(a)); // Newest first

    if (metDates.length === 0) return 0;

    const today = formatDateId(new Date());
    const newestMetDateObj = parseDateId(metDates[0]);
    const todayObj = parseDateId(today);

    const diffNewest = Math.round((todayObj.getTime() - newestMetDateObj.getTime()) / (1000 * 3600 * 24));

    // A streak is broken if the newest met date is more than 2 days ago
    if (diffNewest > 2) return 0;

    let currentStreak = 0;
    let checkDate = newestMetDateObj;

    for (let i = 0; i < metDates.length; i++) {
        const d = metDates[i];
        const currentObj = parseDateId(d);

        if (i === 0) {
            currentStreak = 1;
            continue;
        }

        const diff = Math.round((checkDate.getTime() - currentObj.getTime()) / (1000 * 3600 * 24));

        if (diff === 1 || diff === 2) {
            currentStreak++;
            checkDate = currentObj;
        } else {
            break;
        }
    }

    return currentStreak;
}
