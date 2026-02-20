"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "./useAuth";
import { guestStore } from "@/lib/storage/guestStore";
import { JuzCompletion } from "@/types/domain";
import { getTodayDateId } from "@/lib/utils/date";

export function useCompletions() {
    const { user, supabase } = useAuth();
    const [completions, setCompletions] = useState<JuzCompletion[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCompletions = useCallback(async () => {
        setLoading(true);
        if (user) {
            const { data, error } = await supabase
                .from("completion_items")
                .select("*")
                .order("completed_at", { ascending: false });
            if (!error && data) {
                setCompletions(data as JuzCompletion[]);
            }
        } else {
            const guestData = await guestStore.getCompletions();
            setCompletions(guestData);
        }
        setLoading(false);
    }, [user, supabase]);

    useEffect(() => {
        fetchCompletions();
    }, [fetchCompletions]);

    const addCompletion = async (juz_number: number) => {
        const date_id = getTodayDateId();
        const isFirstToday = !completions.some((c: any) => c.date_id === date_id);
        const item_type = isFirstToday ? "target" : "extra";

        const newCompletion: JuzCompletion = {
            id: crypto.randomUUID(),
            date_id,
            juz_number,
            item_type,
            completed_at: new Date().toISOString(),
            user_id: user?.id,
        };

        if (user) {
            // First ensure daily_completions row exists (upsert)
            await supabase.from("daily_completions").upsert({
                user_id: user.id,
                date_id,
            }, { onConflict: "user_id,date_id" });

            // Then insert completion item
            const { error } = await supabase.from("completion_items").insert({
                user_id: user.id,
                date_id,
                juz_number,
                item_type,
                completed_at: newCompletion.completed_at,
            });
            if (error) console.error("Error adding completion:", error);
        } else {
            await guestStore.addCompletion(newCompletion);
        }
        fetchCompletions();
    };

    return { completions, loading, addCompletion, refresh: fetchCompletions };
}
