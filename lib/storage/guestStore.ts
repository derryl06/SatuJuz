import { get, set, del } from "idb-keyval";
import { JuzCompletion, Bookmark, AppSettings, Badge } from "@/types/domain";

const KEYS = {
    GUEST_ID: "od1j_guest_id",
    COMPLETIONS: "od1j_completions",
    BOOKMARK: "od1j_bookmark",
    PRAYER_SETTINGS: "od1j_prayer_settings",
    APP_SETTINGS: "od1j_app_settings",
    MIGRATED: "od1j_migrated",
    BADGES: "od1j_badges",
};

export const guestStore = {
    getGuestId: () => {
        if (typeof window === "undefined") return null;
        let id = localStorage.getItem(KEYS.GUEST_ID);
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem(KEYS.GUEST_ID, id);
        }
        return id;
    },

    getCompletions: async (): Promise<JuzCompletion[]> => {
        return (await get(KEYS.COMPLETIONS)) || [];
    },

    addCompletion: async (completion: JuzCompletion) => {
        const list = await guestStore.getCompletions();
        // Idempotency check
        if (list.some(c => c.date_id === completion.date_id && c.juz_number === completion.juz_number)) {
            return;
        }
        list.push(completion);
        await set(KEYS.COMPLETIONS, list);
    },

    removeCompletion: async (id: string) => {
        const list = await guestStore.getCompletions();
        const filtered = list.filter((c) => c.id !== id);
        await set(KEYS.COMPLETIONS, filtered);
    },

    removeCompletionByJuz: async (date_id: string, juz_number: number) => {
        const list = await guestStore.getCompletions();
        const filtered = list.filter((c) => !(c.date_id === date_id && c.juz_number === juz_number));
        await set(KEYS.COMPLETIONS, filtered);
    },

    getBookmark: async (): Promise<Bookmark | null> => {
        return (await get(KEYS.BOOKMARK)) || null;
    },

    setBookmark: async (bookmark: Bookmark) => {
        await set(KEYS.BOOKMARK, bookmark);
    },

    getPrayerSettings: async () => {
        return (await get(KEYS.PRAYER_SETTINGS)) || null;
    },

    setPrayerSettings: async (settings: any) => {
        await set(KEYS.PRAYER_SETTINGS, settings);
    },

    getAppSettings: async (): Promise<AppSettings> => {
        return (await get(KEYS.APP_SETTINGS)) || { dailyTarget: 1, updated_at: new Date().toISOString() };
    },

    setAppSettings: async (settings: AppSettings) => {
        await set(KEYS.APP_SETTINGS, settings);
    },

    getBadges: async (): Promise<Badge[]> => {
        return (await get(KEYS.BADGES)) || [];
    },

    addBadge: async (badge: Badge) => {
        const list = await guestStore.getBadges();
        if (list.some(b => b.badge_type === badge.badge_type)) return;
        list.push(badge);
        await set(KEYS.BADGES, list);
    },

    exportAll: async () => {
        return {
            completions: await guestStore.getCompletions(),
            bookmark: await guestStore.getBookmark(),
            prayerSettings: await guestStore.getPrayerSettings(),
            appSettings: await guestStore.getAppSettings(),
            badges: await guestStore.getBadges(),
        };
    },

    markMigratedAndClear: async () => {
        await set(KEYS.MIGRATED, true);
        await del(KEYS.COMPLETIONS);
        await del(KEYS.BOOKMARK);
        await del(KEYS.BADGES);
        // Keep guest_id for history but data is cleared
    },

    isMigrated: async () => {
        return (await get(KEYS.MIGRATED)) || false;
    },
};
