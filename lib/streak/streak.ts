import { JuzCompletion } from "@/types/domain";
import { formatDateId, parseDateId } from "../utils/date";

export function calculateStreak(completions: JuzCompletion[], dailyTarget: number = 1) {
    if (completions.length === 0) return { current: 0, best: 0, isSaved: false };

    // Group by date and count completions
    const dateCounts: Record<string, number> = {};
    completions.forEach(c => {
        dateCounts[c.date_id] = (dateCounts[c.date_id] || 0) + 1;
    });

    // Only count dates that meet the daily target
    const metDates = Object.keys(dateCounts)
        .filter(dateId => dateCounts[dateId] >= dailyTarget)
        .sort((a, b) => b.localeCompare(a)); // Newest first

    if (metDates.length === 0) return { current: 0, best: 0, isSaved: false };

    let currentStreak = 0;
    let bestStreak = 0;
    let isSaved = false;

    const today = formatDateId(new Date());
    const yesterday = formatDateId(new Date(Date.now() - 86400000));

    const newestMetDate = metDates[0];
    const todayObj = parseDateId(today);
    const newestMetDateObj = newestMetDate ? parseDateId(newestMetDate) : null;

    const diffNewest = (newestMetDateObj && todayObj)
        ? Math.round((todayObj.getTime() - newestMetDateObj.getTime()) / (1000 * 3600 * 24))
        : 999;

    // A streak is active if the newest met date is today, yesterday, or 2 days ago (saved)
    if (diffNewest <= 2) {
        let checkDate = newestMetDateObj!;
        currentStreak = 0;

        for (let i = 0; i < metDates.length; i++) {
            const d = metDates[i];
            const currentObj = parseDateId(d);

            if (i === 0) {
                currentStreak = 1;
                checkDate = currentObj;
                continue;
            }

            const diff = (checkDate.getTime() - currentObj.getTime()) / (1000 * 3600 * 24);
            const rDiff = Math.round(diff);

            if (rDiff === 1) {
                currentStreak++;
                checkDate = currentObj;
            } else if (rDiff === 2) {
                // Grace Period (1-day gap allowed)
                currentStreak++;
                checkDate = currentObj;
                isSaved = true;
            } else {
                break;
            }
        }
    }

    if (diffNewest === 2) {
        isSaved = true;
    }

    // Best streak calculation
    const ascendingMetDates = [...metDates].reverse();
    if (ascendingMetDates.length > 0) {
        let lastDate = parseDateId(ascendingMetDates[0]);
        let tempStreak = 1;
        bestStreak = 1;

        for (let i = 1; i < ascendingMetDates.length; i++) {
            const current = parseDateId(ascendingMetDates[i]);
            const diff = (current.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
            const rDiff = Math.round(diff);

            if (rDiff === 1 || rDiff === 2) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
            bestStreak = Math.max(bestStreak, tempStreak);
            lastDate = current;
        }
    }

    return { current: currentStreak, best: bestStreak, isSaved };
}
