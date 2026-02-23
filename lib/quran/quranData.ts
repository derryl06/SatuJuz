import { get, set } from "idb-keyval";
import { QuranJuz } from "@/types/domain";

const CACHE_VERSION = "v4";
const getCacheKey = (juz: number) => `quran:juz:${juz}:${CACHE_VERSION}`;

export async function fetchJuz(juz: number): Promise<QuranJuz | null> {
    const cacheKey = getCacheKey(juz);

    // 1. Try Cache (IndexedDB) - Safe for SSR
    if (typeof window !== "undefined") {
        const cached = await get(cacheKey);
        if (cached) return cached;
    }

    try {
        // 2a. Fetch boundary mapping from AlQuran.cloud (which surah and ayah are in this juz)
        const mapRes = await fetch(`https://api.alquran.cloud/v1/juz/${juz}/quran-uthmani`);
        const mapData = await mapRes.json();

        if (mapData.code !== 200) throw new Error("Failed to map Juz");

        const ayahsInfo = mapData.data.ayahs;

        // Find unique surah numbers present in this juz
        const surahNumbers = Array.from(new Set(ayahsInfo.map((a: any) => a.surah.number))) as number[];

        // 2b. Fetch these surahs from EQuran.id (Kemenag standard: Arabic, Latin, Indonesia)
        const surahPromises = surahNumbers.map(sId =>
            fetch(`https://equran.id/api/v2/surat/${sId}`).then(res => res.json())
        );
        const equranResponses = await Promise.all(surahPromises);

        // Organize the EQuran data for easy lookup
        const eQuranMap: Record<number, any> = {};
        for (const res of equranResponses) {
            if (res.code === 200 && res.data) {
                eQuranMap[res.data.nomor] = res.data;
            }
        }

        // 2c. Build the final array of Ayahs matching the Juz boundary
        const juzData: QuranJuz = {
            number: juz,
            verses: ayahsInfo.map((a: any) => {
                const surahId = a.surah.number;
                const ayahNum = a.numberInSurah;

                // Lookup specifically in EQuran data
                const equranSurah = eQuranMap[surahId];
                const equranAyah = equranSurah?.ayat?.find((ay: any) => ay.nomorAyat === ayahNum);

                return {
                    numberInSurah: ayahNum,
                    // Use EQuran Kemenag format if available, fallback to Uthmani otherwise
                    text: equranAyah?.teksArab || a.text,
                    transliteration: equranAyah?.teksLatin || undefined,
                    translation: equranAyah?.teksIndonesia || undefined,
                    surah: {
                        number: surahId,
                        name: equranSurah?.nama || a.surah.name,
                        englishName: equranSurah?.namaLatin || a.surah.englishName,
                    }
                };
            })
        };

        // 3. Store in Cache
        if (typeof window !== "undefined") {
            await set(cacheKey, juzData);
        }
        return juzData;
    } catch (e) {
        console.error(`Failed to fetch juz ${juz}`, e);
    }

    return null;
}
