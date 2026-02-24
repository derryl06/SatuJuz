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

    const addCompletion = async (juz_number: number, dateId?: string) => {
        if (isProcessing.current) return;

        const date_id = dateId ?? getTodayDateId();

        // Idempotency check: if already completed on that date, skip
        if (completions.some(c => c.date_id === date_id && c.juz_number === juz_number)) {
            return;
        }

        isProcessing.current = true;
        setProcessing(true);

        try {
            const doneThatDayCount = completions.filter(c => c.date_id === date_id).length;
            const item_type = doneThatDayCount < settings.dailyTarget ? "target" : "extra";

            const completed_at = new Date().toISOString();

            const newCompletion: JuzCompletion = {
                id: crypto.randomUUID(),
                date_id,
                juz_number,
                item_type,
                completed_at,
                user_id: user?.id,
            };

            if (user && supabase) {
                // Ensure daily marker exists
                await supabase.from("daily_completions").upsert(
                    { user_id: user.id, date_id },
                    { onConflict: "user_id,date_id" }
                );

                // Upsert item (no duplicate for same user+date+juz)
                const { error } = await supabase.from("completion_items").upsert(
                    {
                        user_id: user.id,
                        date_id,
                        juz_number,
                        item_type,
                        completed_at,
                    },
                    { onConflict: "user_id,date_id,juz_number" }
                );

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

    const removeCompletion = async (juz_number: number, dateId?: string) => {
        if (isProcessing.current) return;

        const date_id = dateId ?? getTodayDateId();
        const target = completions.find(c => c.date_id === date_id && c.juz_number === juz_number);
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
