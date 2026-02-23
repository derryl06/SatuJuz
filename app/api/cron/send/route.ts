import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

const VAPID_PUB = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIV = process.env.VAPID_PRIVATE_KEY || "";

if (VAPID_PUB && VAPID_PRIV) {
    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || "mailto:hello@example.com",
        VAPID_PUB,
        VAPID_PRIV
    );
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "key";

const supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

export async function GET(req: Request) {
    // Vercel menyertakan token autentikasi di header untuk cron
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { data: subscriptions, error } = await supabaseAdmin
            .from("push_subscriptions")
            .select("*");

        if (error || !subscriptions) throw error;

        const payload = JSON.stringify({
            title: "Waktunya Baca SatuJuz 📖",
            body: "Alarm cron otomatis. Yuk cicil bacaanmu!",
            url: "/"
        });

        const sendPromises = subscriptions.map((sub) => {
            const pushSub = { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } };
            return webpush.sendNotification(pushSub, payload).catch((err: any) => {
                if (err.statusCode === 404 || err.statusCode === 410) {
                    // Endpoint usang (user unsubscribe/clear data), segera hapus dari DB
                    return supabaseAdmin.from("push_subscriptions").delete().eq("id", sub.id);
                }
                console.error("Gagal push:", err);
            });
        });

        await Promise.all(sendPromises);

        return NextResponse.json({ success: true, sentCount: subscriptions.length });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
