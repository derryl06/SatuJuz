"use client";

import { useState, useEffect } from "react";
import { guestStore } from "@/lib/storage/guestStore";
import { fetchPrayerTimes, getNextPrayer, PrayerSettings } from "@/lib/prayer/prayer";

export function usePrayerTimes() {
    const [settings, setSettings] = useState<PrayerSettings | null>(null);
    const [timings, setTimings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSettings = async () => {
            const s = await guestStore.getPrayerSettings();
            if (s) {
                setSettings(s);
                const t = await fetchPrayerTimes(s);
                setTimings(t);
            }
            setLoading(false);
        };
        loadSettings();
    }, []);

    const nextPrayer = timings ? getNextPrayer(timings) : null;

    return { settings, timings, nextPrayer, loading };
}
