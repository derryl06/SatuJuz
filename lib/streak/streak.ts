import { JuzCompletion } from "@/types/domain";
import { formatDateId, parseDateId } from "../utils/date";

export function calculateStreak(completions: JuzCompletion[]) {
    if (completions.length === 0) return { current: 0, best: 0 };

    // Unique dates with completions
    const sortedDates = Array.from(new Set(completions.map((c) => c.date_id)))
        .sort((a, b) => b.localeCompare(a)); // Newest first

    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;

    const today = formatDateId(new Date());
    const yesterday = formatDateId(new Date(Date.now() - 86400000));

    // Check if current streak is active
    if (sortedDates[0] === today || sortedDates[0] === yesterday) {
        let checkDate = parseDateId(sortedDates[0]);
        for (let i = 0; i < sortedDates.length; i++) {
            const d = sortedDates[i];
            const expectedDate = formatDateId(checkDate);
            if (d === expectedDate) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
    }

    // Calculate best streak
    const ascendingDates = [...sortedDates].reverse();
    if (ascendingDates.length > 0) {
        let lastDate = parseDateId(ascendingDates[0]);
        tempStreak = 1;
        bestStreak = 1;

        for (let i = 1; i < ascendingDates.length; i++) {
            const current = parseDateId(ascendingDates[i]);
            const diff = (current.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);

            if (Math.round(diff) === 1) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
            bestStreak = Math.max(bestStreak, tempStreak);
            lastDate = current;
        }
    }

    return { current: currentStreak, best: bestStreak };
}
