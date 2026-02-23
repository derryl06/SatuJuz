import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:hello@example.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
);

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
    try {
        // Ambil 1 subcription terbaru
        const { data, error } = await supabaseAdmin
            .from("push_subscriptions")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (error || !data) {
            throw new Error("Tidak ada subscription ditemukan.");
        }

        const pushSubscription = {
            endpoint: data.endpoint,
            keys: {
                p256dh: data.p256dh,
                auth: data.auth,
            }
        };

        const payload = JSON.stringify({
            title: "Test Notifikasi 🚀",
            body: "Web Push berhasil! Tab sudah bisa ditutup.",
            url: "/settings"
        });

        await webpush.sendNotification(pushSubscription, payload);

        return NextResponse.json({ success: true, message: "Pesan terkirim!" });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
