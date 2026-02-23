import { JuzCompletion, Badge } from "@/types/domain";
import { formatDateId } from "../utils/date";

export type BadgeType = "starter" | "consistent" | "dedicated" | "khatam" | "warrior";

export const getBadgeDetails = (type: BadgeType) => {
    switch (type) {
        case "starter": return { title: "Starter", description: "Completed your first juz", icon: "🌱" };
        case "consistent": return { title: "Consistent", description: "3-day streak achieved", icon: "🔥" };
        case "dedicated": return { title: "Dedicated", description: "7-day streak achieved", icon: "🎖️" };
        case "khatam": return { title: "Khatam Club", description: "Completed 30 juz", icon: "👑" };
        case "warrior": return { title: "Warrior", description: "3 juz in one day", icon: "⚔️" };
    }
};

export function checkNewBadges(completions: JuzCompletion[], streak: number, existingBadges: Badge[]): BadgeType[] {
    const earnedTypes = new Set(existingBadges.map(b => b.badge_type as BadgeType));
    const newBadges: BadgeType[] = [];

    // 1. Starter
    if (!earnedTypes.has("starter") && completions.length >= 1) {
        newBadges.push("starter");
    }

    // 2. Consistent (3 days)
    if (!earnedTypes.has("consistent") && streak >= 3) {
        newBadges.push("consistent");
    }

    // 3. Dedicated (7 days)
    if (!earnedTypes.has("dedicated") && streak >= 7) {
        newBadges.push("dedicated");
    }

    // 4. Khatam (30 juz total)
    if (!earnedTypes.has("khatam") && completions.length >= 30) {
        newBadges.push("khatam");
    }

    // 5. Warrior (3 in one day)
    if (!earnedTypes.has("warrior")) {
        const counts: Record<string, number> = {};
        completions.forEach(c => {
            counts[c.date_id] = (counts[c.date_id] || 0) + 1;
        });
        const hasWarrior = Object.values(counts).some(count => count >= 3);
        if (hasWarrior) {
            newBadges.push("warrior");
        }
    }

    return newBadges;
}
