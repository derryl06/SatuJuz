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
            if (user && supabase) {
                const { data } = await supabase
                    .from("bookmarks")
                    .select("*")
                    .eq("user_id", user.id)
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
        if (user && supabase) {
            await supabase.from("bookmarks").upsert({
                user_id: user.id,
                juz_number: updated.juz_number,
                surah_number: updated.surah_number,
                ayah_number: updated.ayah_number,
                scroll_y: updated.scroll_y,
                updated_at: updated.updated_at
            }, { onConflict: "user_id" });
        } else {
            await guestStore.setBookmark(updated);
        }
    };

    return { bookmark, updateBookmark };
}
