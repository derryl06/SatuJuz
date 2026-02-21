import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const createClient = () => {
    // Check if URL is present. If missing (like during Vercel Build Step), return a mocked client that doesn't crash SSR.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("Supabase env missing. Mocking client for build step.");
        return {
            auth: {
                getUser: async () => ({ data: { user: null }, error: null }),
                onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
                signInWithOtp: async () => ({ data: null, error: new Error("Supabase env missing") }),
                signOut: async () => ({ error: null }),
                updateUser: async () => ({ data: { user: null }, error: new Error("Supabase env missing") }),
            },
            from: (table: string) => ({
                select: () => ({
                    order: async () => ({ data: [], error: null })
                }),
                insert: async () => ({ error: null }),
                upsert: async () => ({ error: null }),
                delete: () => ({ eq: async () => ({ error: null }) })
            })
        } as any;
    }

    return createClientComponentClient();
};
