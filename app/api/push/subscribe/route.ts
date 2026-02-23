import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const subscription = await req.json();

        if (!subscription || !subscription.endpoint || !subscription.keys) {
            return NextResponse.json({ error: "Format salah" }, { status: 400 });
        }

        const { endpoint, keys: { p256dh, auth } } = subscription;

        // Optionally associate with user_id
        const userId = null;

        const { error } = await supabaseAdmin.from("push_subscriptions").upsert(
            {
                user_id: userId,
                endpoint,
                p256dh,
                auth,
            },
            { onConflict: "endpoint" }
        );

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
