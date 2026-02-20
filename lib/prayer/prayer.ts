export type PrayerSettings = {
    city?: string;
    country?: string;
    lat?: number;
    lon?: number;
    method: string;
};

export async function fetchPrayerTimes(settings: PrayerSettings) {
    let url = "";
    if (settings.lat && settings.lon) {
        url = `https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${settings.lat}&longitude=${settings.lon}&method=${settings.method}`;
    } else if (settings.city && settings.country) {
        url = `https://api.aladhan.com/v1/timingsByCity/${Math.floor(Date.now() / 1000)}?city=${settings.city}&country=${settings.country}&method=${settings.method}`;
    } else {
        return null;
    }

    try {
        const res = await fetch(url);
        const data = await res.json();
        return data.data.timings;
    } catch (e) {
        console.error("Failed to fetch prayer times", e);
        return null;
    }
}

export function getNextPrayer(timings: any) {
    if (!timings) return null;
    const now = new Date();
    const prayerOrder = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

    for (const name of prayerOrder) {
        const [hours, minutes] = timings[name].split(":").map(Number);
        const prayerTime = new Date();
        prayerTime.setHours(hours, minutes, 0, 0);

        if (prayerTime > now) {
            return { name, time: timings[name], date: prayerTime };
        }
    }

    // If all prayers passed, next is Fajr tomorrow
    const [hours, minutes] = timings["Fajr"].split(":").map(Number);
    const prayerTime = new Date();
    prayerTime.setDate(prayerTime.getDate() + 1);
    prayerTime.setHours(hours, minutes, 0, 0);
    return { name: "Fajr", time: timings["Fajr"], date: prayerTime, isTomorrow: true };
}
