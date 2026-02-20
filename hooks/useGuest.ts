"use client";

import { useEffect, useState } from "react";
import { guestStore } from "@/lib/storage/guestStore";

export function useGuest() {
    const [guestId, setGuestId] = useState<string | null>(null);

    useEffect(() => {
        setGuestId(guestStore.getGuestId());
    }, []);

    return { guestId };
}
