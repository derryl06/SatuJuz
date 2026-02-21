"use client";

import { useState, useEffect } from "react";
import { guestStore } from "@/lib/storage/guestStore";

export interface AppSettings {
    dailyTarget: number;
}

export function useSettings() {
    const [settings, setSettings] = useState<AppSettings>({ dailyTarget: 1 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const saved = await guestStore.getAppSettings();
            setSettings(saved);
            setLoading(false);
        };
        load();
    }, []);

    const updateSettings = async (newSettings: Partial<AppSettings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        await guestStore.setAppSettings(updated);
    };

    return { settings, updateSettings, loading };
}
