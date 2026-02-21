import { JuzCompletion } from "@/types/domain";
import { formatDateId, parseDateId } from "../utils/date";

export function calculateStreak(completions: JuzCompletion[]) {
    if (completions.length === 0) return { current: 0, best: 0, isSaved: false };

    // Unique dates with completions
    const sortedDates = Array.from(new Set(completions.map((c) => c.date_id)))
        .sort((a, b) => b.localeCompare(a)); // Newest first

    let currentStreak = 0;
    let bestStreak = 0;
    let isSaved = false;

    const today = formatDateId(new Date());
    const yesterday = formatDateId(new Date(Date.now() - 86400000));

    // Check if current streak is active or "saved" (missed today but read yesterday)
    // If newest date is today, streak is active.
    // If newest date is yesterday, streak is active (meaning today isn't done yet).
    // If newest date is 2 days ago, streak is "saved" (meaning yesterday was missed, but today is still possible).

    const newestDate = sortedDates[0];
    const todayObj = parseDateId(today);
    const newestDateObj = newestDate ? parseDateId(newestDate) : null;

    const diffNewest = (newestDateObj && todayObj)
        ? Math.round((todayObj.getTime() - newestDateObj.getTime()) / (1000 * 3600 * 24))
        : 999;

    if (diffNewest <= 2) { // Read today, yesterday, or 2 days ago (Saved)
        let checkDate = newestDateObj!;
        currentStreak = 0;

        for (let i = 0; i < sortedDates.length; i++) {
            const d = sortedDates[i];
            const currentObj = parseDateId(d);

            if (i === 0) {
                currentStreak = 1;
                checkDate = currentObj;
                continue;
            }

            const diff = (checkDate.getTime() - currentObj.getTime()) / (1000 * 3600 * 24);
            const rDiff = Math.round(diff);

            if (rDiff === 1) {
                // Consecutive
                currentStreak++;
                checkDate = currentObj;
            } else if (rDiff === 2) {
                // 1-day gap: ALLOWED (Grace Period)
                currentStreak++; // We count the skip as part of the streak duration/resilience
                checkDate = currentObj;
                isSaved = true; // Mark as saved if we ever hit a 2-day gap in the current streak
            } else {
                break;
            }
        }
    }

    // Special case: if today is missed but yesterday was read, it's a normal active streak (not yet broken).
    // But if yesterday was missed and today is still ongoing? That's when we show "Saved".
    if (diffNewest === 1) {
        // Today is not done. This is normal.
    } else if (diffNewest === 2) {
        // Yesterday was missed. Current streak is technically on life support.
        isSaved = true;
    }

    // Calculate best streak (Simplified to match current logic with grace period)
    const ascendingDates = [...sortedDates].reverse();
    if (ascendingDates.length > 0) {
        let lastDate = parseDateId(ascendingDates[0]);
        let tempStreak = 1;
        bestStreak = 1;

        for (let i = 1; i < ascendingDates.length; i++) {
            const current = parseDateId(ascendingDates[i]);
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
