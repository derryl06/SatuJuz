import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const createClient = () => {
    // Check if env vars exist before creating client to prevent crashes
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
        if (typeof window !== "undefined") {
            console.warn("Supabase credentials missing. App will run in Guest Mode only.");
        }
        return null;
    }

    try {
        return createClientComponentClient();
    } catch (e) {
        console.error("Failed to initialize Supabase client:", e);
        return null;
    }
};
