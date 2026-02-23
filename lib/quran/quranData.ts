import { get, set } from "idb-keyval";
import { QuranJuz } from "@/types/domain";

const CACHE_VERSION = "v2";
const getCacheKey = (juz: number) => `quran:juz:${juz}:${CACHE_VERSION}`;

export async function fetchJuz(juz: number): Promise<QuranJuz | null> {
    const cacheKey = getCacheKey(juz);

    // 1. Try Cache (IndexedDB)
    const cached = await get(cacheKey);
    if (cached) return cached;

    // 2. Fetch from API (AlQuran.cloud)
    // We fetch Uthmani text and Transliteration together
    try {
        const res = await fetch(`https://api.alquran.cloud/v1/juz/${juz}/editions/quran-uthmani,en.transliteration`);
        const data = await res.json();

        if (data.code === 200) {
            const uthmaniAyahs = data.data[0].ayahs;
            const translitAyahs = data.data[1].ayahs;

            const juzData: QuranJuz = {
                number: juz,
                verses: uthmaniAyahs.map((a: any, i: number) => ({
                    numberInSurah: a.numberInSurah,
                    text: a.text,
                    transliteration: translitAyahs[i].text,
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
