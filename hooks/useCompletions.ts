"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { guestStore } from "@/lib/storage/guestStore";
import { JuzCompletion } from "@/types/domain";
import { getTodayDateId } from "@/lib/utils/date";
import { useSettings } from "./useSettings";

export function useCompletions() {
    const { user, supabase } = useAuth();
    const { settings } = useSettings();
    const [completions, setCompletions] = useState<JuzCompletion[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Use a ref to track processing to avoid race conditions in rapid clicks
    const isProcessing = useRef(false);

    const fetchCompletions = useCallback(async () => {
        setLoading(true);
        try {
            if (user && supabase) {
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
        } finally {
            setLoading(false);
        }
    }, [user, supabase]);

    useEffect(() => {
        fetchCompletions();
    }, [fetchCompletions]);

    const addCompletion = async (juz_number: number) => {
        if (isProcessing.current) return;

        const date_id = getTodayDateId();

        // Idempotency check: if already completed today, skip
        if (completions.some(c => c.date_id === date_id && c.juz_number === juz_number)) {
            return;
        }

        isProcessing.current = true;
        setProcessing(true);

        try {
            const doneTodayCount = completions.filter(c => c.date_id === date_id).length;
            const item_type = doneTodayCount < settings.dailyTarget ? "target" : "extra";

            const newCompletion: JuzCompletion = {
                id: crypto.randomUUID(),
                date_id,
                juz_number,
                item_type,
                completed_at: new Date().toISOString(),
                user_id: user?.id,
            };

            if (user && supabase) {
                // 1. Ensure daily marker exists
                await supabase.from("daily_completions").upsert({
                    user_id: user.id,
                    date_id,
                }, { onConflict: "user_id,date_id" });

                // 2. Insert item with UPSERT to be absolutely sure no duplicates are created
                // Even though we have a frontend check, network issues might cause retries.
                const { error } = await supabase.from("completion_items").upsert({
                    user_id: user.id,
                    date_id,
                    juz_number,
                    item_type,
                    completed_at: newCompletion.completed_at,
                }, { onConflict: "user_id,date_id,juz_number" });

                if (error) console.error("Error adding completion:", error);
            } else {
                await guestStore.addCompletion(newCompletion);
            }
            await fetchCompletions();
        } finally {
            isProcessing.current = false;
            setProcessing(false);
        }
    };

    const removeCompletion = async (juz_number: number) => {
        if (isProcessing.current) return;

        const date_id = getTodayDateId();
        const target = completions.find((c) => c.date_id === date_id && c.juz_number === juz_number);

        if (!target) return;

        isProcessing.current = true;
        setProcessing(true);

        try {
            if (user && supabase) {
                const { error } = await supabase
                    .from("completion_items")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("date_id", date_id)
                    .eq("juz_number", juz_number);

                if (error) console.error("Error removing completion:", error);

                // If no more items today, we could delete daily_completions,
                // but usually keeping it is fine as a record that they were active.
            } else {
                await guestStore.removeCompletionByJuz(date_id, juz_number);
            }
            await fetchCompletions();
        } finally {
            isProcessing.current = false;
            setProcessing(false);
        }
    };

    return {
        completions,
        loading,
        processing,
        addCompletion,
        removeCompletion,
        refresh: fetchCompletions
    };
}
