export type JuzCompletion = {
    id: string;
    user_id?: string;
    date_id: string; // YYYY-MM-DD
    juz_number: number;
    item_type: "target" | "extra";
    completed_at: string;
};

export type Bookmark = {
    user_id?: string;
    juz_number: number;
    surah_number?: number;
    ayah_number?: number;
    scroll_y?: number;
    updated_at: string;
};

export type Profile = {
    id: string;
    display_name?: string;
    prayer_city?: string;
    prayer_country?: string;
    prayer_lat?: number;
    prayer_lon?: number;
    prayer_method?: string;
};

export type QuranJuz = {
    number: number;
    verses: QuranVerse[];
};

export type QuranVerse = {
    numberInSurah: number;
    text: string;
    transliteration?: string;
    translation?: string;
    surah: {
        number: number;
        name: string;
        englishName: string;
    };
};
export type AppSettings = {
    dailyTarget: number;
    updated_at: string;
};

export type Badge = {
    id: string;
    user_id?: string;
    badge_type: string;
    awarded_at: string;
};
