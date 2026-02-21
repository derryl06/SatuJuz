import { get, set, del, keys } from "idb-keyval";
import { JuzCompletion, Bookmark } from "@/types/domain";

const KEYS = {
    GUEST_ID: "od1j_guest_id",
    COMPLETIONS: "od1j_completions",
    BOOKMARK: "od1j_bookmark",
    PRAYER_SETTINGS: "od1j_prayer_settings",
    APP_SETTINGS: "od1j_app_settings",
    MIGRATED: "od1j_migrated",
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
        list.push(completion);
        await set(KEYS.COMPLETIONS, list);
    },

    removeCompletion: async (id: string) => {
        const list = await guestStore.getCompletions();
        const filtered = list.filter((c) => c.id !== id);
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

    getAppSettings: async () => {
        return (await get(KEYS.APP_SETTINGS)) || { dailyTarget: 1 };
    },

    setAppSettings: async (settings: any) => {
        await set(KEYS.APP_SETTINGS, settings);
    },

    exportAll: async () => {
        return {
            completions: await guestStore.getCompletions(),
            bookmark: await guestStore.getBookmark(),
            prayerSettings: await guestStore.getPrayerSettings(),
        };
    },

    markMigratedAndClear: async () => {
        await set(KEYS.MIGRATED, true);
        await del(KEYS.COMPLETIONS);
        await del(KEYS.BOOKMARK);
        // Keep guest_id for history but data is cleared
    },

    isMigrated: async () => {
        return (await get(KEYS.MIGRATED)) || false;
    },
};
