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
import { LogOut, Save, MapPin, Loader2, CheckCircle, Smartphone, CheckCircle2, Star, Edit2, X } from "lucide-react";
import { getTodayDateId } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

export default function ProfilePage() {
    const { user, supabase, loading: authLoading } = useAuth();
    const { completions, refresh: refreshCompletions } = useCompletions();
    const [migrating, setMigrating] = useState(false);
    const [migrationSuccess, setMigrationSuccess] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState("");
    const [isUpdatingName, setIsUpdatingName] = useState(false);

    useEffect(() => {
        if (user) {
            setNewName(user.user_metadata?.full_name || "MODERN READER");
        }
    }, [user]);

    const handleUpdateName = async () => {
        if (!newName.trim() || !user) {
            setIsEditingName(false);
            return;
        }

        setIsUpdatingName(true);
        const { error } = await supabase.auth.updateUser({
            data: { full_name: newName.trim() }
        });

        setIsUpdatingName(false);
        if (!error) {
            setIsEditingName(false);
            window.location.reload();
        } else {
            console.error(error);
            alert("Failed to update name");
        }
    };

    const streak = calculateStreak(completions);

    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email) return;

        setIsLoggingIn(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin + "/profile",
            },
        });

        if (error) {
            console.error(error);
            alert("Error sending magic link. Please try again.");
        } else {
            setOtpSent(true);
        }
        setIsLoggingIn(false);
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

    if (authLoading) return (
        <div className="flex flex-col gap-8">
            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-24 bg-white/5 rounded-full animate-pulse" />
                    <div className="h-10 w-48 bg-white/5 rounded-xl animate-pulse" />
                </div>
            </header>
            <div className="h-48 bg-white/5 rounded-[32px] animate-pulse" />
            <div className="h-32 bg-white/5 rounded-[32px] animate-pulse" />
        </div>
    );

    return (
        <div className="flex flex-col gap-8 animate-fade-up">
            <header className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-caption">{user ? "Authenticated" : "Guest Mode"}</span>
                    <h1 className="text-large-title text-white mt-1">Profile</h1>
                </div>
                <button className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 active:scale-95 transition-all">
                    <Star size={20} />
                </button>
            </header>

            {user ? (
                <div className="flex flex-col gap-8">
                    <div className="card-stealth p-8 relative overflow-hidden flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-[32px] bg-gradient-to-br from-[#FFD60A] to-[#FFD60A]/50 p-1 mb-6 shadow-[0_20px_40px_rgba(255,214,10,0.2)]">
                            <div className="h-full w-full rounded-[28px] bg-black flex items-center justify-center font-black text-3xl text-[#FFD60A]">
                                {(user.user_metadata?.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {isEditingName ? (
                                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1 mt-1">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="bg-transparent text-white font-black text-2xl tracking-tighter uppercase focus:outline-none w-48 text-center"
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleUpdateName();
                                            if (e.key === 'Escape') {
                                                setIsEditingName(false);
                                                setNewName(user.user_metadata?.full_name || "MODERN READER");
                                            }
                                        }}
                                    />
                                    <button onClick={handleUpdateName} className="text-neon hover:opacity-80 disabled:opacity-50" disabled={isUpdatingName}>
                                        {isUpdatingName ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={18} />}
                                    </button>
                                    <button onClick={() => {
                                        setIsEditingName(false);
                                        setNewName(user.user_metadata?.full_name || "MODERN READER");
                                    }} className="text-red-400 hover:opacity-80">
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{user.user_metadata?.full_name || "Modern Reader"}</h2>
                                    <button onClick={() => setIsEditingName(true)} className="text-white/20 hover:text-neon transition-colors mt-2" title="Edit Name">
                                        <Edit2 size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                        <span className="text-mono !text-white/20 !text-[10px] mt-1 tracking-widest">{user.email}</span>

                        <div className="grid grid-cols-2 gap-3 w-full mt-8">
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-1 items-start text-left">
                                <span className="text-caption !text-white/20">Streak</span>
                                <span className="text-2xl font-black text-white tracking-tighter">{streak.current} Days</span>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col gap-1 items-start text-left">
                                <span className="text-caption !text-white/20">Lifetime</span>
                                <span className="text-2xl font-black text-white tracking-tighter">{completions.length} Juz</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full h-16 bg-white/5 border border-white/5 rounded-[24px] flex items-center justify-center text-red-400 font-black text-xs uppercase tracking-widest mt-6 hover:bg-white/[0.08] active:scale-95 transition-all"
                        >
                            <LogOut className="mr-2" size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card-neon p-8 flex flex-col gap-6 text-black">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-black tracking-tighter uppercase">Login</h2>
                        <p className="text-sm font-medium opacity-60 leading-relaxed">Don't lose your <span className="font-black underline underline-offset-4">{streak.current}-day progress</span>. Login safely using a Magic Link.</p>
                    </div>

                    {otpSent ? (
                        <div className="flex flex-col gap-4 text-center mt-4 bg-black/5 p-6 rounded-[24px]">
                            <div className="h-16 w-16 bg-black rounded-full flex items-center justify-center mx-auto mb-2 relative">
                                <span className="absolute w-full h-full rounded-full border-4 border-[#FFD60A] border-t-transparent animate-spin" />
                                <span className="text-2xl">📬</span>
                            </div>
                            <h3 className="font-black text-xl tracking-tighter">Check Your Email</h3>
                            <p className="text-xs font-medium opacity-60 px-4">We've sent a magic link to <strong className="opacity-100">{email}</strong>. Click it to magically sign in!</p>
                            <button
                                onClick={() => setOtpSent(false)}
                                className="text-[10px] uppercase tracking-widest font-black text-black/40 mt-2 hover:text-black transition-colors"
                            >
                                Wrong email? Try again
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} className="flex flex-col gap-3 mt-4">
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 px-6 rounded-2xl bg-black/5 border border-black/10 text-black font-medium placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black/50 transition-all text-sm"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isLoggingIn || !email}
                                className="w-full h-16 bg-black text-white rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl disabled:opacity-50 mt-2"
                            >
                                {isLoggingIn ? <Loader2 className="animate-spin" size={16} /> : "Send Magic Link"}
                            </button>
                        </form>
                    )}

                    <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40">
                        <Smartphone size={14} strokeWidth={3} />
                        <span>Progess saved locally</span>
                    </div>
                </div>
            )}

            {(migrating || migrationSuccess) && (
                <div className="px-2">
                    {migrating && (
                        <div className="flex items-center gap-4 bg-white/5 border border-[#FFD60A]/30 p-5 rounded-[24px] animate-fade-in">
                            <Loader2 className="animate-spin text-[#FFD60A]" size={20} />
                            <span className="font-black text-[10px] text-[#FFD60A] uppercase tracking-widest">Syncing with cloud...</span>
                        </div>
                    )}

                    {migrationSuccess && (
                        <div className="flex items-center gap-4 bg-[#FFD60A]/10 border border-[#FFD60A]/30 p-5 rounded-[24px] animate-scale-in">
                            <CheckCircle2 className="text-[#FFD60A]" size={20} />
                            <span className="font-black text-[10px] text-[#FFD60A] uppercase tracking-widest">Everything is synced</span>
                        </div>
                    )}
                </div>
            )}

            <section className="flex flex-col gap-6">
                <div className="px-2">
                    <span className="text-caption">Preferences</span>
                    <h3 className="text-large-title text-white mt-1">Settings</h3>
                </div>

                <div className="card-stealth p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between p-2">
                        <div className="flex flex-col">
                            <label className="text-base font-black text-white">Location Data</label>
                            <span className="text-mono !text-white/20 !text-[9px] uppercase mt-0.5">Used for prayer accurate times</span>
                        </div>
                        <button
                            onClick={async () => {
                                const city = window.prompt("Enter your city (e.g. Jakarta)");
                                if (city) {
                                    const { guestStore } = await import("@/lib/storage/guestStore");
                                    await guestStore.setPrayerSettings({ city, method: "Kemenag" });
                                    window.location.reload();
                                }
                            }}
                            className="h-10 px-5 bg-white/5 rounded-xl text-white/40 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 active:scale-90 transition-all"
                        >
                            Change
                        </button>
                    </div>
                    <div className="h-px bg-white/5 opacity-50" />
                    <div className="flex items-center justify-between p-2">
                        <div className="flex flex-col">
                            <label className="text-base font-black text-white">Application</label>
                            <span className="text-mono !text-white/20 !text-[9px] uppercase mt-0.5">Stable Preview Release</span>
                        </div>
                        <span className="text-[10px] font-black text-[#FFD60A] bg-[#FFD60A]/10 px-3 py-1.5 rounded-lg border border-[#FFD60A]/10">v2.1.0</span>
                    </div>
                    <div className="h-px bg-white/5 opacity-50" />
                    <div className="flex items-center justify-between p-2">
                        <div className="flex flex-col">
                            <label className="text-base font-black text-white">Lead Developer</label>
                            <span className="text-mono !text-[#FFD60A] !text-[9px] uppercase mt-0.5 font-bold">Derryl Youri</span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#FFD60A] to-[#FFD60A]/20 flex items-center justify-center p-0.5">
                            <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-[8px] font-black text-[#FFD60A]">DY</div>
                        </div>
                    </div>
                    <div className="h-px bg-white/5 opacity-50" />
                    <div className="flex items-center justify-between p-2">
                        <div className="flex flex-col">
                            <label className="text-base font-black text-red-400">Danger Zone</label>
                            <span className="text-mono !text-red-400/50 !text-[9px] uppercase mt-0.5">Irreversible Action</span>
                        </div>
                        <button
                            onClick={async () => {
                                const confirmDelete = window.confirm("Are you sure you want to permanently delete all your reading progress? This action cannot be undone.");
                                if (!confirmDelete) return;

                                try {
                                    if (user) {
                                        await supabase.from("completion_items").delete().eq("user_id", user.id);
                                        await supabase.from("daily_completions").delete().eq("user_id", user.id);
                                    } else {
                                        const { guestStore } = await import("@/lib/storage/guestStore");
                                        await guestStore.markMigratedAndClear(); // This internally clears completions
                                    }

                                    alert("All reading progress has been successfully erased.");
                                    window.location.href = "/";
                                } catch (error) {
                                    console.error("Failed to reset progress", error);
                                    alert("An error occurred. Please try again.");
                                }
                            }}
                            className="h-10 px-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 active:scale-90 transition-all"
                        >
                            Reset Data
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
