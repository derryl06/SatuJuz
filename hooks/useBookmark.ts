"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { guestStore } from "@/lib/storage/guestStore";
import { Bookmark } from "@/types/domain";

export function useBookmark() {
    const { user, supabase } = useAuth();
    const [bookmark, setBookmark] = useState<Bookmark | null>(null);

    useEffect(() => {
        const fetchBookmark = async () => {
            if (user) {
                const { data } = await supabase
                    .from("bookmarks")
                    .select("*")
                    .single();
                if (data) setBookmark(data as Bookmark);
            } else {
                setBookmark(await guestStore.getBookmark());
            }
        };
        fetchBookmark();
    }, [user, supabase]);

    const updateBookmark = async (newBookmark: Partial<Bookmark>) => {
        const updated = {
            ...bookmark,
            ...newBookmark,
            updated_at: new Date().toISOString(),
            user_id: user?.id,
        } as Bookmark;

        setBookmark(updated);
        if (user) {
            await supabase.from("bookmarks").upsert(updated);
        } else {
            await guestStore.setBookmark(updated);
        }
    };

    return { bookmark, updateBookmark };
}
