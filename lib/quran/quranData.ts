import { get, set } from "idb-keyval";
import { QuranJuz } from "@/types/domain";

const CACHE_VERSION = "v1";
const getCacheKey = (juz: number) => `quran:juz:${juz}:${CACHE_VERSION}`;

export async function fetchJuz(juz: number): Promise<QuranJuz | null> {
    const cacheKey = getCacheKey(juz);

    // 1. Try Cache (IndexedDB)
    const cached = await get(cacheKey);
    if (cached) return cached;

    // 2. Fetch from API (EQuran.id)
    // Note: EQuran.id uses slightly different structure, but we'll map it.
    // Alternative: AlQuran.cloud juz API
    try {
        const res = await fetch(`https://api.alquran.cloud/v1/juz/${juz}/quran-uthmani`);
        const data = await res.json();

        if (data.code === 200) {
            const juzData: QuranJuz = {
                number: juz,
                verses: data.data.ayahs.map((a: any) => ({
                    numberInSurah: a.numberInSurah,
                    text: a.text,
                    surah: {
                        number: a.surah.number,
                        name: a.surah.name,
                        englishName: a.surah.englishName,
                    }
                }))
            };

            // 3. Store in Cache
            await set(cacheKey, juzData);
            return juzData;
        }
    } catch (e) {
        console.error(`Failed to fetch juz ${juz}`, e);
    }

    return null;
}
