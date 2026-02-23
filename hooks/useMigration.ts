"use client";

import { useState } from "react";
import { useAuth } from "./useAuth";
import { guestStore } from "@/lib/storage/guestStore";
import { JuzCompletion, AppSettings } from "@/types/domain";

export function useMigration() {
    const { user, supabase } = useAuth();
    const [isMigrating, setIsMigrating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const migrate = async () => {
        if (!user || isMigrating) return;
        setIsMigrating(true);
        setError(null);

        try {
            const guestData = await guestStore.exportAll();

            // 1. Migrate Settings
            if (guestData.appSettings) {
                const { data: existingSettings } = await supabase
                    .from("settings")
                    .select("*")
                    .eq("user_id", user.id)
                    .single();

                if (!existingSettings) {
                    await supabase.from("settings").upsert({
                        user_id: user.id,
                        daily_target: guestData.appSettings.dailyTarget,
                        updated_at: guestData.appSettings.updated_at
                    });
                }
            }

            // 2. Migrate Completions with deterministic merge
            if (guestData.completions.length > 0) {
                // Fetch existing
                const { data: existing } = await supabase
                    .from("completion_items")
                    .select("date_id, juz_number, item_type, completed_at")
                    .eq("user_id", user.id);

                const existingCompletions = existing || [];
                const existingKeys = new Set(existingCompletions.map(e => `${e.date_id}|${e.juz_number}`));

                // Merge: only take guest completions that don't exist in Supabase
                const newCompletionsFromGuest = guestData.completions.filter(
                    c => !existingKeys.has(`${c.date_id}|${c.juz_number}`)
                );

                if (newCompletionsFromGuest.length > 0 || existingCompletions.length > 0) {
                    const allCompletions = [...existingCompletions, ...newCompletionsFromGuest];

                    // Group by date to recalculate item_type
                    const byDate: Record<string, any[]> = {};
                    allCompletions.forEach(c => {
                        if (!byDate[c.date_id]) byDate[c.date_id] = [];
                        byDate[c.date_id].push(c);
                    });

                    // Fetch current target (re-fetch to be sure)
                    const { data: currentSettings } = await supabase
                        .from("settings")
                        .select("daily_target")
                        .eq("user_id", user.id)
                        .single();

                    const target = currentSettings?.daily_target || 1;

                    const finalToInsert: any[] = [];
                    const dailyMarkers: string[] = [];

                    Object.keys(byDate).forEach(dateId => {
                        // Sort by completed_at
                        const sorted = byDate[dateId].sort((a, b) =>
                            new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
                        );

                        sorted.forEach((c, index) => {
                            const newItemType = (index < target) ? "target" : "extra";

                            // Only add to insert list if it's from guest (doesn't have user_id yet or is in newCompletionsFromGuest)
                            // OR if we need to update item_type for existing ones (optional, but good for consistency)
                            const isFromGuest = newCompletionsFromGuest.some(nc => nc.date_id === c.date_id && nc.juz_number === c.juz_number);

                            if (isFromGuest) {
                                finalToInsert.push({
                                    user_id: user.id,
                                    date_id: c.date_id,
                                    juz_number: c.juz_number,
                                    item_type: newItemType,
                                    completed_at: c.completed_at
                                });
                            } else if (c.item_type !== newItemType) {
                                // Update existing item type if it changed due to new target rules
                                finalToInsert.push({
                                    user_id: user.id,
                                    date_id: c.date_id,
                                    juz_number: c.juz_number,
                                    item_type: newItemType,
                                    completed_at: c.completed_at
                                });
                            }
                        });
                        dailyMarkers.push(dateId);
                    });

                    if (finalToInsert.length > 0) {
                        // Chunk inserts/upserts
                        for (let i = 0; i < finalToInsert.length; i += 100) {
                            const chunk = finalToInsert.slice(i, i + 100);
                            await supabase.from("completion_items").upsert(chunk, { onConflict: "user_id,date_id,juz_number" });
                        }
                    }

                    if (dailyMarkers.length > 0) {
                        await supabase.from("daily_completions").upsert(
                            dailyMarkers.map(d => ({ user_id: user.id, date_id: d })),
                            { onConflict: "user_id,date_id" }
                        );
                    }
                }
            }

            // 3. Migrate Bookmark
            if (guestData.bookmark) {
                await supabase.from("bookmarks").upsert({
                    ...guestData.bookmark,
                    user_id: user.id,
                    updated_at: new Date().toISOString()
                });
            }

            // 4. Migrate Badges
            if (guestData.badges && guestData.badges.length > 0) {
                await supabase.from("badges").upsert(
                    guestData.badges.map(b => ({
                        user_id: user.id,
                        badge_type: b.badge_type,
                        awarded_at: b.awarded_at
                    })),
                    { onConflict: "user_id,badge_type" }
                );
            }

            // 5. Finalize
            await guestStore.markMigratedAndClear();
            return { success: true, count: guestData.completions.length };

        } catch (err: any) {
            console.error("Migration failed:", err);
            setError(err.message || "Unknown error during migration");
            return { success: false, error: err.message };
        } finally {
            setIsMigrating(false);
        }
    };

    return { migrate, isMigrating, error };
}
