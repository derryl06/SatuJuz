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

    if (authLoading) return <div className="p-10 pt-24 animate-pulse text-white/5 font-black text-center tracking-[1em]">STEALTH</div>;

    return (
        <div className="flex flex-col gap-8 pb-10 pt-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <header className="flex items-center justify-between px-2">
                <div className="flex flex-col">
                    <span className="text-ios-caption text-white/40 font-bold">{user ? "Synced & Protected" : "Local Journey"}</span>
                    <h1 className="text-4xl font-black tracking-tighter text-white">Profile</h1>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 relative">
                    <Star size={20} />
                    {user && <div className="absolute top-3.5 right-3.5 w-2 h-2 bg-[#FFD60A] rounded-full shadow-[0_0_10px_#FFD60A]" />}
                </div>
            </header>

            {user ? (
                <div className="flex flex-col gap-6">
                    <GlassCard className="flex flex-col gap-6 bg-white/5 border-white/10 p-6 rounded-[32px] high-contrast-shadow">
                        <div className="flex items-center gap-5">
                            <div className="h-20 w-20 rounded-[28px] bg-[#FFD60A] p-1 shadow-lg shadow-[#FFD60A]/20">
                                <div className="h-full w-full rounded-[24px] bg-black flex items-center justify-center font-black text-2xl text-[#FFD60A]">
                                    {user.email?.[0].toUpperCase()}
                                </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-2xl font-black text-white tracking-tighter">{user.user_metadata?.full_name || "Modern Reader"}</span>
                                <span className="text-ios-mono text-white/30 text-[10px]">{user.email}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-0.5">
                                <span className="text-[10px] font-black text-white/20 uppercase">Streak</span>
                                <span className="text-xl font-black text-white">{streak.current} Days</span>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-0.5">
                                <span className="text-[10px] font-black text-white/20 uppercase">Lifetime</span>
                                <span className="text-xl font-black text-white">{completions.length} Juz</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-red-500 font-black text-sm hover:bg-white/10 transition-all press-scale"
                        >
                            <LogOut className="mr-2" size={18} />
                            LOGOUT ACCOUNT
                        </button>
                    </GlassCard>
                </div>
            ) : (
                <GlassCard className="flex flex-col gap-6 bg-white/5 border-white/10 p-7 rounded-[32px] high-contrast-shadow">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-black tracking-tighter text-white">Sign in to sync</h2>
                        <p className="text-sm text-white/40 leading-relaxed">Don't lose your <span className="text-[#FFD60A] font-bold">{streak.current}-day streak</span>. Connect your Google account to track across devices.</p>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full h-14 bg-[#FFD60A] text-black rounded-2xl font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_0_20px_rgba(255,214,10,0.3)] press-scale"
                    >
                        Login with Google
                    </button>

                    <div className="flex items-center justify-center gap-2 text-xs text-white/20 font-bold uppercase tracking-widest">
                        <Smartphone size={14} />
                        <span>Progess saved locally</span>
                    </div>
                </GlassCard>
            )}

            {(migrating || migrationSuccess) && (
                <div className="px-2">
                    {migrating && (
                        <div className="flex items-center gap-4 bg-white/5 border border-[#FFD60A]/30 p-4 rounded-2xl animate-pulse">
                            <Loader2 className="animate-spin text-[#FFD60A]" size={20} />
                            <span className="font-bold text-sm text-[#FFD60A] uppercase tracking-wider">Syncing progress...</span>
                        </div>
                    )}

                    {migrationSuccess && (
                        <div className="flex items-center gap-4 bg-[#FFD60A]/10 border border-[#FFD60A]/30 p-4 rounded-2xl">
                            <CheckCircle2 className="text-[#FFD60A]" size={20} />
                            <span className="font-bold text-sm text-[#FFD60A] uppercase tracking-wider">Cloud sync complete</span>
                        </div>
                    )}
                </div>
            )}

            <section className="flex flex-col gap-4">
                <h3 className="text-ios-headline text-white/90 px-2 uppercase tracking-tighter">Settings</h3>
                <GlassCard className="flex flex-col gap-6 p-6 bg-white/5 border-white/10 rounded-[32px] high-contrast-shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <label className="text-lg font-black text-white px-2">Location</label>
                            <span className="text-ios-mono text-white/20 text-[10px] px-2">Used for prayer countdowns</span>
                        </div>
                        <button className="h-10 px-4 bg-white/10 rounded-xl text-white/60 font-black text-xs hover:bg-white/20 transition-all">
                            CHANGE
                        </button>
                    </div>
                    <div className="h-px bg-white/5 mx-2" />
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <label className="text-lg font-black text-white px-2">App Version</label>
                            <span className="text-ios-mono text-white/20 text-[10px] px-2 uppercase">Stable Preview</span>
                        </div>
                        <span className="text-[10px] font-black text-white/40 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">v2.1.0</span>
                    </div>
                </GlassCard>
            </section>
        </div>
    );
}
