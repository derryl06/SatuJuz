import { get, set } from "idb-keyval";
import { QuranJuz } from "@/types/domain";

const CACHE_VERSION = "v2";
const getCacheKey = (juz: number) => `quran:juz:${juz}:${CACHE_VERSION}`;

export async function fetchJuz(juz: number): Promise<QuranJuz | null> {
    const cacheKey = getCacheKey(juz);

    // 1. Try Cache (IndexedDB) - Safe for SSR
    if (typeof window !== "undefined") {
        const cached = await get(cacheKey);
        if (cached) return cached;
    }

    // 2. Fetch from API (AlQuran.cloud)
    try {
        // Fetch Arabic and Transliteration separately as combined Juz endpoint may fail
        const [arabicRes, translitRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/juz/${juz}/quran-uthmani`),
            fetch(`https://api.alquran.cloud/v1/juz/${juz}/en.transliteration`)
        ]);

        const arabicData = await arabicRes.json();
        const translitData = await translitRes.json();

        if (arabicData.code === 200 && translitData.code === 200) {
            const uthmaniAyahs = arabicData.data.ayahs;
            const translitAyahs = translitData.data.ayahs;

            const juzData: QuranJuz = {
                number: juz,
                verses: uthmaniAyahs.map((a: any, i: number) => ({
                    numberInSurah: a.numberInSurah,
                    text: a.text,
                    transliteration: translitAyahs[i]?.text,
                    surah: {
                        number: a.surah.number,
                        name: a.surah.name,
                        englishName: a.surah.englishName,
                    }
                }))
            };

            // 3. Store in Cache
            if (typeof window !== "undefined") {
                await set(cacheKey, juzData);
            }
            return juzData;
        }
    } catch (e) {
        console.error(`Failed to fetch juz ${juz}`, e);
    }

    return null;
}
