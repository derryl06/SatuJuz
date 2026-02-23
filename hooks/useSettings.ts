"use client";

import { useState, useEffect, useCallback } from "react";
import { guestStore } from "@/lib/storage/guestStore";
import { useAuth } from "./useAuth";
import { AppSettings } from "@/types/domain";

export function useSettings() {
    const { user, supabase } = useAuth();
    const [settings, setSettings] = useState<AppSettings>({ dailyTarget: 1, updated_at: new Date().toISOString() });
    const [loading, setLoading] = useState(true);

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        if (user && supabase) {
            const { data, error } = await supabase
                .from("settings")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (!error && data) {
                setSettings({
                    dailyTarget: data.daily_target,
                    updated_at: data.updated_at
                });
            } else if (error && error.code === 'PGRST116') {
                // Not found, use default or guest settings
                const guestSettings = await guestStore.getAppSettings();
                setSettings(guestSettings);
            }
        } else {
            const saved = await guestStore.getAppSettings();
            setSettings(saved);
        }
        setLoading(false);
    }, [user, supabase]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const updateSettings = async (newSettings: Partial<AppSettings>) => {
        const updated = { ...settings, ...newSettings, updated_at: new Date().toISOString() };
        setSettings(updated);

        if (user && supabase) {
            const { error } = await supabase.from("settings").upsert({
                user_id: user.id,
                daily_target: updated.dailyTarget,
                updated_at: updated.updated_at
            }, { onConflict: "user_id" });
            if (error) console.error("Error updating settings:", error);
        } else {
            await guestStore.setAppSettings(updated);
        }
    };

    return { settings, updateSettings, loading, refresh: fetchSettings };
}
