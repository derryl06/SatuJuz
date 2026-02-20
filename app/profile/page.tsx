"use client";

import { useAuth } from "@/hooks/useAuth";
import { useCompletions } from "@/hooks/useCompletions";
import { guestStore } from "@/lib/storage/guestStore";
import { JuzCompletion } from "@/types/domain";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { StatPill } from "@/components/ui/StatPill";
import { calculateStreak } from "@/lib/streak/streak";
import { useState, useEffect } from "react";
import { LogOut, Save, MapPin, Loader2, CheckCircle, Smartphone, CheckCircle2, Star } from "lucide-react";
import { getTodayDateId } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

export default function ProfilePage() {
    const { user, supabase, loading: authLoading } = useAuth();
    const { completions, refresh: refreshCompletions } = useCompletions();
    const [migrating, setMigrating] = useState(false);
    const [migrationSuccess, setMigrationSuccess] = useState(false);

    const streak = calculateStreak(completions);

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: window.location.origin + "/profile" },
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    const migrateData = async () => {
        if (!user || migrating) return;
        setMigrating(true);
        try {
            const guestData = await guestStore.exportAll();
            if (guestData.completions.length > 0) {
                // 1. Fetch existing to avoid duplicates
                const { data: existing } = await supabase
                    .from("completion_items")
                    .select("date_id, juz_number");

                const existingKeys = new Set(existing?.map((e: any) => `${e.date_id}|${e.juz_number}`) || []);
                const toInsert = guestData.completions.filter((c: any) => !existingKeys.has(`${c.date_id}|${c.juz_number}`));

                if (toInsert.length > 0) {
                    // Chunk inserts
                    for (let i = 0; i < toInsert.length; i += 100) {
                        const chunk = toInsert.slice(i, i + 100).map((c: any) => ({
                            user_id: user.id,
                            date_id: c.date_id,
                            juz_number: c.juz_number,
                            item_type: c.item_type,
                            completed_at: c.completed_at
                        }));

                        // Insert completions
                        await supabase.from("completion_items").insert(chunk);

                        // Upsert daily markers
                        const uniqueDates = Array.from(new Set(chunk.map((c: any) => c.date_id)));
                        await supabase.from("daily_completions").upsert(
                            uniqueDates.map((d: any) => ({ user_id: user.id, date_id: d })),
                            { onConflict: "user_id,date_id" }
                        );
                    }
                }
            }

            if (guestData.bookmark) {
                await supabase.from("bookmarks").upsert({
                    ...guestData.bookmark,
                    user_id: user.id,
                    updated_at: new Date().toISOString()
                });
            }

            await guestStore.markMigratedAndClear();
            setMigrationSuccess(true);
            refreshCompletions();
        } catch (e: any) {
            console.error("Migration failed", e);
        } finally {
            setMigrating(false);
        }
    };

    // Auto-migrate on mount if user is logged in
    useEffect(() => {
        const checkAndMigrate = async () => {
            const isAlreadyMigrated = await guestStore.isMigrated();
            if (user && !isAlreadyMigrated) {
                await migrateData();
            }
        };
        if (!authLoading && user) {
            checkAndMigrate();
        }
    }, [user, authLoading]);

    if (authLoading) return <div className="p-6 text-center text-white/20">Loading profile...</div>;

    return (
        <div className="flex flex-col gap-10 p-6 pt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <header className="flex flex-col gap-1">
                <h1 className="text-ios-large-title text-white">Profile</h1>
                <p className="text-ios-headline text-white/40">{user ? "Synced & Protected" : "Guest Mode"}</p>
            </header>

            {user ? (
                <GlassCard className="flex flex-col gap-6 border-white/5 bg-[#161616]">
                    <div className="flex items-center gap-5">
                        <div className="h-20 w-20 rounded-full bg-[#E2FF31] p-1 shadow-lg shadow-[#E2FF31]/20">
                            <div className="h-full w-full rounded-full bg-black flex items-center justify-center font-black text-2xl text-[#E2FF31]">
                                {user.email?.[0].toUpperCase()}
                            </div>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-xl font-black text-white tracking-tight">{user.user_metadata?.full_name || "Modern Reader"}</span>
                            <span className="text-ios-mono text-white/30">{user.email}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <StatPill label="Current Streak" value={streak.current} icon="🔥" />
                        <StatPill label="Total Saved" value={completions.length} icon="☁️" />
                    </div>

                    <GlassButton variant="secondary" className="w-full text-red-500 font-bold border border-red-500/10" onClick={handleLogout}>
                        <LogOut className="mr-2" size={18} />
                        Logout
                    </GlassButton>
                </GlassCard>
            ) : (
                <GlassCard className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold">Sign in to sync</h2>
                        <p className="text-sm text-white/40">Don't lose your {streak.current}-day streak. Connect your Google account to track across devices.</p>
                    </div>

                    <GlassButton variant="primary" className="w-full" onClick={handleLogin}>
                        Login with Google
                    </GlassButton>

                    <div className="flex items-center gap-2 text-xs text-white/20 italic">
                        <Smartphone size={14} />
                        <span>Progress currently saved only on this device</span>
                    </div>
                </GlassCard>
            )}

            {migrating && (
                <GlassCard className="flex items-center gap-4 border-blue-500/50 animate-pulse">
                    <Loader2 className="animate-spin text-blue-500" />
                    <span className="font-medium">Syncing your progress...</span>
                </GlassCard>
            )}

            {migrationSuccess && (
                <GlassCard className="flex items-center gap-4 border-green-500/50 bg-green-500/5">
                    <CheckCircle className="text-green-500" />
                    <span className="font-medium">All data synced successfully!</span>
                </GlassCard>
            )}

            <div className="flex flex-col gap-5">
                <h3 className="text-ios-caption px-4">Settings</h3>
                <GlassCard className="flex flex-col gap-6 p-7">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                            <label className="text-ios-body font-bold">Prayer Location</label>
                            <span className="text-ios-mono text-white/20">Used for countdowns</span>
                        </div>
                        <GlassButton size="sm" variant="secondary" className="h-12 w-12 rounded-2xl" onClick={() => {/* Location Picker */ }}>
                            <MapPin size={20} className="text-white/60" />
                        </GlassButton>
                    </div>
                    <div className="h-px bg-white/5 mx-2" />
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5">
                            <label className="text-ios-body font-bold">App Version</label>
                            <span className="text-ios-mono text-white/20 uppercase">Production Preview</span>
                        </div>
                        <span className="text-ios-mono text-white/40 bg-white/5 px-3 py-1 rounded-lg">v1.0.0</span>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
}
