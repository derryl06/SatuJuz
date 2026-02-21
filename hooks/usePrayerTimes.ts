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
            if (s && (s.city || (s.lat && s.lon))) {
                setSettings(s);
                const t = await fetchPrayerTimes(s);
                setTimings(t);
                setLoading(false);
            } else {
                // Try grabbing real-time GPS
                if (typeof navigator !== "undefined" && "geolocation" in navigator) {
                    navigator.geolocation.getCurrentPosition(
                        async (pos) => {
                            const newSettings = { lat: pos.coords.latitude, lon: pos.coords.longitude, method: "Kemenag" };
                            await guestStore.setPrayerSettings(newSettings);
                            setSettings(newSettings);
                            const t = await fetchPrayerTimes(newSettings);
                            setTimings(t);
                            setLoading(false);
                        },
                        (err) => {
                            console.error("GPS Error:", err);
                            setLoading(false);
                        }
                    );
                } else {
                    setLoading(false);
                }
            }
        };
        loadSettings();
    }, []);

    const nextPrayer = timings ? getNextPrayer(timings) : null;

    return { settings, timings, nextPrayer, loading };
}
