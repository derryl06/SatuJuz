"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import { guestStore } from "@/lib/storage/guestStore";
import { Badge, JuzCompletion } from "@/types/domain";
import { checkNewBadges, BadgeType } from "@/lib/badges/badgeSystem";

export function useBadges(completions: JuzCompletion[], streak: number) {
    const { user, supabase } = useAuth();
    const [badges, setBadges] = useState<Badge[]>([]);
    const [loading, setLoading] = useState(true);
    const lastAwardRef = useRef<string | null>(null);

    const fetchBadges = useCallback(async () => {
        setLoading(true);
        if (user) {
            const { data, error } = await supabase
                .from("badges")
                .select("*")
                .eq("user_id", user.id);
            if (!error && data) {
                setBadges(data as Badge[]);
            }
        } else {
            const guestBadges = await guestStore.getBadges();
            setBadges(guestBadges);
        }
        setLoading(false);
    }, [user, supabase]);

    useEffect(() => {
        fetchBadges();
    }, [fetchBadges]);

    useEffect(() => {
        if (loading || completions.length === 0) return;

        const awardNewBadges = async () => {
            const newBadgeTypes = checkNewBadges(completions, streak, badges);

            if (newBadgeTypes.length > 0) {
                // To avoid loops and double awards
                const awardKey = newBadgeTypes.join('|');
                if (lastAwardRef.current === awardKey) return;
                lastAwardRef.current = awardKey;

                for (const type of newBadgeTypes) {
                    const newBadge: Badge = {
                        id: crypto.randomUUID(),
                        badge_type: type,
                        awarded_at: new Date().toISOString(),
                        user_id: user?.id
                    };

                    if (user) {
                        await supabase.from("badges").upsert({
                            user_id: user.id,
                            badge_type: type,
                            awarded_at: newBadge.awarded_at
                        }, { onConflict: "user_id,badge_type" });
                    } else {
                        await guestStore.addBadge(newBadge);
                    }
                }
                fetchBadges();
            }
        };

        awardNewBadges();
    }, [completions, streak, badges, user, supabase, loading, fetchBadges]);

    return { badges, loading };
}
