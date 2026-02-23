"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    // Initialize lazily to prevent SSR build crashes
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            } catch (e) {
                console.error("Error fetching user:", e);
            } finally {
                setLoading(false);
            }
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event: any, session: any) => {
                setUser(session?.user ?? null);
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase]);

    return { user, loading, supabase };
}
