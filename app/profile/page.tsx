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
import { LogOut, Save, MapPin, Loader2, CheckCircle, Smartphone, CheckCircle2, Star, Edit2, X, Shield, Download, Info } from "lucide-react";
import Link from "next/link";
import { getTodayDateId } from "@/lib/utils/date";
import { getUserRank } from "@/lib/user/rank";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useMigration } from "@/hooks/useMigration";
import { useSettings } from "@/hooks/useSettings";
import { useBadges } from "@/hooks/useBadges";
import { useReminder } from "@/hooks/useReminder";
import { Badge } from "@/types/domain";
import { cn } from "@/lib/utils/cn";

export default function ProfilePage() {
    const { user, supabase, loading: authLoading } = useAuth();
    const { completions, refresh: refreshCompletions } = useCompletions();
    const { settings: appSettings } = useSettings();
    const streak = calculateStreak(completions, appSettings.dailyTarget);
    const { badges } = useBadges(completions, streak.current);
    const { settings: prayerSettings } = usePrayerTimes();
    const { reminderTime, permission, setReminder, clearReminder } = useReminder();
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
        if (!newName.trim() || !user || !supabase) {
            setIsEditingName(false);
            return;
        }

        setIsUpdatingName(true);
        const { error, data } = await supabase.auth.updateUser({
            data: { full_name: newName.trim() }
        });

        setIsUpdatingName(false);
        if (!error && data?.user) {
            setIsEditingName(false);
            // Force refresh the session so onAuthStateChange picks up the new user_metadata
            await supabase.auth.refreshSession();
        } else if (error) {
            console.error(error);
            alert("Failed to update name");
        }
    };


    const [email, setEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const handleLogin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email || !supabase) return;

        setIsLoggingIn(true);
        // Vercel deployment URL logic for callback
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${siteUrl}/auth/callback`,
            },
        });

        if (error) {
            console.error(error);
            // Handle Supabase Rate Limit specifically
            if (error.message.includes("rate limit")) {
                alert("Anda meminta tautan terlalu cepat. Silakan periksa email Anda (termasuk folder Spam) atau tunggu sekitar 1-2 menit sebelum mencoba lagi.");
            } else {
                alert(`Gagal mengirim tautan: ${error.message}`);
            }
        } else {
            setOtpSent(true);
        }
        setIsLoggingIn(false);
    };

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        window.location.reload();
    };

    const { migrate } = useMigration();

    // Auto-migrate on mount if user is logged in
    useEffect(() => {
        const checkAndMigrate = async () => {
            const isAlreadyMigrated = await guestStore.isMigrated();
            if (user && !isAlreadyMigrated) {
                setMigrating(true);
                const result = await migrate();
                setMigrating(false);
                if (result?.success) {
                    setMigrationSuccess(true);
                    refreshCompletions();
                }
            }
        };
        if (!authLoading && user) {
            checkAndMigrate();
        }
    }, [user, authLoading, migrate, refreshCompletions]);

    if (authLoading) return (
        <div className="flex flex-col gap-8">
            <header className="flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <div className="h-4 w-24 bg-stealth-surface rounded-full animate-pulse" />
                    <div className="h-10 w-48 bg-stealth-surface rounded-xl animate-pulse" />
                </div>
            </header>
            <div className="h-48 bg-stealth-surface rounded-[32px] animate-pulse" />
            <div className="h-32 bg-stealth-surface rounded-[32px] animate-pulse" />
        </div>
    );

    return (
        <div className="max-w-xl mx-auto w-full flex flex-col gap-12 animate-fade-up pb-10">
            <header className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-caption">{user ? "Authenticated" : "Guest Mode"}</span>
                    <h1 className="text-large-title text-text-primary mt-1">Profile</h1>
                </div>
                <button className="h-12 w-12 rounded-2xl bg-stealth-surface border border-stealth-border flex items-center justify-center text-text-dim active:scale-95 transition-all">
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
                                <div className="flex items-center gap-2 bg-stealth-translucent border border-stealth-border rounded-xl px-3 py-1 mt-1">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="bg-transparent text-text-primary font-black text-2xl tracking-tighter uppercase focus:outline-none w-48 text-center"
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
                                    <h2 className="text-3xl font-black text-text-primary tracking-tighter uppercase">{user.user_metadata?.full_name || "Modern Reader"}</h2>
                                    <button onClick={() => setIsEditingName(true)} className="text-text-muted hover:text-neon transition-colors mt-2" title="Edit Name">
                                        <Edit2 size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                        <span className="text-mono !text-text-muted !text-[10px] mt-1 tracking-widest">{user.email}</span>

                        {(() => {
                            const rankData = getUserRank(streak.current);
                            return (
                                <div className="mt-4 flex flex-col items-center gap-2">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                        <Shield size={14} className={rankData.current.neonColor} />
                                        <span className={cn("text-[10px] font-black uppercase tracking-widest", rankData.current.neonColor)}>
                                            {rankData.current.title}
                                        </span>
                                    </div>
                                    {rankData.next && (
                                        <div className="flex flex-col items-center gap-1.5 mt-1 opacity-80 w-48">
                                            <div className="flex justify-between w-full text-[8px] font-black uppercase tracking-widest text-[#FFD60A]/60">
                                                <span>To {rankData.next.title}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full transition-all duration-1000", rankData.current.neonColor.split(' ')[0].replace('text-', 'bg-'))}
                                                    style={{ width: `${rankData.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        <div className="grid grid-cols-2 gap-3 w-full mt-8">
                            <div className="bg-stealth-translucent border border-stealth-border rounded-2xl p-5 flex flex-col gap-1 items-start text-left">
                                <span className="text-caption !text-text-muted">Streak</span>
                                <span className="text-2xl font-black text-text-primary tracking-tighter">{streak.current} Days</span>
                            </div>
                            <div className="bg-stealth-translucent border border-stealth-border rounded-2xl p-5 flex flex-col gap-1 items-start text-left">
                                <span className="text-caption !text-text-muted">Lifetime</span>
                                <span className="text-2xl font-black text-text-primary tracking-tighter">{completions.length} Juz</span>
                            </div>
                        </div>

                        {/* Badges Section */}
                        <div className="w-full mt-8 flex flex-col gap-3">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-caption !text-text-muted font-black">Achievements</span>
                                <span className="text-mono text-[9px] text-neon uppercase font-bold">{badges.length} / 5 Unlocked</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {badges.length > 0 ? badges.map(b => {
                                    const details = (require("@/lib/badges/badgeSystem")).getBadgeDetails(b.badge_type);
                                    return (
                                        <div key={b.id} className="h-12 w-12 rounded-xl bg-stealth-translucent border border-stealth-border flex items-center justify-center text-xl shadow-inner relative group cursor-help" title={details.title + ": " + details.description}>
                                            {details.icon}
                                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-stealth-surface border border-stealth-border p-2 rounded-lg hidden group-hover:block w-32 z-50 pointer-events-none">
                                                <p className="text-[10px] font-black text-neon uppercase tracking-tighter">{details.title}</p>
                                                <p className="text-[8px] text-text-dim font-medium leading-tight">{details.description}</p>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="w-full py-4 text-center border border-dashed border-stealth-border rounded-2xl">
                                        <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">No badges yet</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full h-16 bg-stealth-translucent border border-stealth-border rounded-[24px] flex items-center justify-center text-red-400 font-black text-xs uppercase tracking-widest mt-6 hover:bg-red-400/10 active:scale-95 transition-all"
                        >
                            <LogOut className="mr-2" size={16} />
                            Sign Out
                        </button>
                    </div>
                </div>
            ) : (
                <div className="card-neon p-8 flex flex-col gap-6 text-black mt-4">
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
                        <div className="flex items-center gap-4 bg-stealth-surface border border-neon/30 p-5 rounded-[24px] animate-fade-in shadow-sm">
                            <Loader2 className="animate-spin text-neon" size={20} />
                            <span className="font-black text-[10px] text-neon uppercase tracking-widest">Syncing with cloud...</span>
                        </div>
                    )}

                    {migrationSuccess && (
                        <div className="flex items-center gap-4 bg-neon/10 border border-neon/30 p-5 rounded-[24px] animate-scale-in">
                            <CheckCircle2 className="text-neon" size={20} />
                            <span className="font-black text-[10px] text-neon uppercase tracking-widest">Everything is synced</span>
                        </div>
                    )}
                </div>
            )}

            <section className="flex flex-col gap-6">
                <div className="px-2">
                    <span className="text-caption">Preferences</span>
                    <h3 className="text-large-title text-text-primary mt-1">Settings</h3>
                </div>

                <div className="card-stealth p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between p-2">
                        <div className="flex flex-col">
                            <label className="text-base font-black text-text-primary">Location Data</label>
                            {(() => {
                                if (!prayerSettings) return <span className="text-mono !text-text-muted !text-[9px] uppercase mt-0.5 animate-pulse">Detecting...</span>;
                                return (
                                    <span className="text-mono !text-neon !text-[10px] uppercase mt-0.5">
                                        {prayerSettings.city || "Live GPS Location"}
                                    </span>
                                );
                            })()}
                        </div>
                    </div>
                    <div className="h-px bg-stealth-border opacity-50" />

                    <div className="flex items-center justify-between p-2">
                        <div className="flex flex-col">
                            <label className="text-base font-black text-text-primary">Pengingat Baca</label>
                            <span className="text-mono !text-neon !text-[9px] uppercase mt-0.5">Push Notification / Alarm</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {reminderTime ? (
                                <>
                                    <input
                                        type="time"
                                        value={reminderTime}
                                        onChange={(e) => setReminder(e.target.value)}
                                        className="h-10 px-3 bg-neon/10 border border-neon/30 text-neon rounded-xl text-xs font-black focus:outline-none"
                                    />
                                    <button
                                        onClick={clearReminder}
                                        className="h-10 w-10 flex items-center justify-center bg-red-400/10 border border-red-400/20 rounded-xl text-red-500 hover:bg-red-400/20 active:scale-90 transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setReminder("20:00")}
                                    className="h-10 px-5 bg-neon/10 border border-neon/20 rounded-xl text-neon font-black text-[10px] uppercase tracking-widest hover:bg-neon/20 active:scale-90 transition-all"
                                >
                                    Enable
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="h-px bg-stealth-border opacity-50" />

                    <div className="flex items-center justify-between p-2">
                        <div className="flex flex-col">
                            <label className="text-base font-black text-text-primary">Application</label>
                            <span className="text-mono !text-text-muted !text-[9px] uppercase mt-0.5">Stable Preview Release</span>
                        </div>
                        <span className="text-[10px] font-black text-neon bg-neon/10 px-3 py-1.5 rounded-lg border border-neon/10">v2.1.0</span>
                    </div>
                    <div className="h-px bg-stealth-border opacity-50" />
                    <Link href="/about" className="flex items-center justify-between p-2 hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer rounded-xl group/about">
                        <div className="flex flex-col">
                            <label className="text-base font-black text-text-primary group-hover/about:text-neon transition-colors">Tentang SatuJuz</label>
                            <span className="text-mono !text-text-muted !text-[9px] uppercase mt-0.5">Visi, Misi & Privasi</span>
                        </div>
                        <div className="h-8 w-8 rounded-xl bg-stealth-surface border border-stealth-border flex items-center justify-center text-text-dim group-hover/about:text-neon group-hover/about:border-neon/30 transition-all">
                            <Info size={16} />
                        </div>
                    </Link>
                    <div className="h-px bg-stealth-border opacity-50" />
                    <div className="flex items-center justify-between p-2">
                        <div className="flex flex-col">
                            <label className="text-base font-black text-text-primary">Data Management</label>
                            <span className="text-mono !text-text-muted !text-[9px] uppercase mt-0.5">Backup & Recovery</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={async () => {
                                    const data: any = user ? {
                                        completions,
                                        appSettings,
                                        bookmark: await (await import("@/lib/storage/guestStore")).guestStore.getBookmark(), // Fallback or fetch from DB
                                        // In a real app, fetch all from DB if logged in
                                    } : await (await import("@/lib/storage/guestStore")).guestStore.exportAll();

                                    // If logged in, we should ideally fetch everything from Supabase for the export
                                    let exportData = data;
                                    if (user && supabase) {
                                        const { data: remoteCompletions } = await supabase.from("completion_items").select("*").eq("user_id", user.id);
                                        const { data: remoteSettings } = await supabase.from("settings").select("*").eq("user_id", user.id).single();
                                        const { data: remoteBookmark } = await supabase.from("bookmarks").select("*").eq("user_id", user.id).single();
                                        const { data: remoteBadges } = await supabase.from("badges").select("*").eq("user_id", user.id);

                                        exportData = {
                                            completions: remoteCompletions || [],
                                            appSettings: remoteSettings ? {
                                                dailyTarget: remoteSettings.daily_target,
                                                updated_at: remoteSettings.updated_at
                                            } : appSettings,
                                            bookmark: remoteBookmark || null,
                                            badges: remoteBadges || [],
                                            exportedAt: new Date().toISOString(),
                                            version: "2.1.0"
                                        };
                                    }

                                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement("a");
                                    link.href = url;
                                    link.download = `satujuz-backup-${new Date().toISOString().split('T')[0]}.json`;
                                    link.click();
                                }}
                                className="h-10 px-4 bg-stealth-translucent border border-stealth-border rounded-xl text-text-primary font-black text-[10px] uppercase tracking-widest hover:bg-stealth-surface active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Download size={14} />
                                Export
                            </button>
                            <label className="h-10 px-4 bg-stealth-translucent border border-stealth-border rounded-xl text-text-primary font-black text-[10px] uppercase tracking-widest hover:bg-stealth-surface active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
                                <Save size={14} />
                                Import
                                <input
                                    type="file"
                                    accept=".json"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const reader = new FileReader();
                                        reader.onload = async (event) => {
                                            try {
                                                const imported = JSON.parse(event.target?.result as string);
                                                // Validation
                                                if (!imported.completions) throw new Error("Invalid format");

                                                const confirmImport = window.confirm(`Import ${imported.completions.length} items? This will merge with your current data.`);
                                                if (!confirmImport) return;

                                                if (user && supabase) {
                                                    // Import to Supabase
                                                    setMigrating(true);
                                                    // Use a temporary guest store style merge or direct to DB
                                                    // For simplicity, we can reuse migration logic if we mock the guest store
                                                    // but better to just do it here or in a utility.
                                                    alert("Importing to cloud... please wait.");

                                                    if (imported.appSettings) {
                                                        await supabase.from("settings").upsert({ user_id: user.id, ...imported.appSettings });
                                                    }

                                                    if (imported.completions.length > 0) {
                                                        const chunk = imported.completions.map((c: any) => ({
                                                            user_id: user.id,
                                                            date_id: c.date_id,
                                                            juz_number: c.juz_number,
                                                            item_type: c.item_type,
                                                            completed_at: c.completed_at
                                                        }));
                                                        await supabase.from("completion_items").upsert(chunk, { onConflict: "user_id,date_id,juz_number" });

                                                        const uniqueDates = Array.from(new Set(chunk.map((c: any) => c.date_id)));
                                                        await supabase.from("daily_completions").upsert(
                                                            uniqueDates.map((d: any) => ({ user_id: user.id, date_id: d })),
                                                            { onConflict: "user_id,date_id" }
                                                        );
                                                    }

                                                    if (imported.bookmark) {
                                                        await supabase.from("bookmarks").upsert({ ...imported.bookmark, user_id: user.id });
                                                    }
                                                } else {
                                                    // Import to Guest Store
                                                    const gStore = (await import("@/lib/storage/guestStore")).guestStore;
                                                    for (const c of imported.completions) {
                                                        await gStore.addCompletion(c);
                                                    }
                                                    if (imported.appSettings) await gStore.setAppSettings(imported.appSettings);
                                                    if (imported.bookmark) await gStore.setBookmark(imported.bookmark);
                                                }

                                                alert("Import successful!");
                                                window.location.reload();
                                            } catch (err) {
                                                alert("Import failed: " + (err as Error).message);
                                            }
                                        };
                                        reader.readAsText(file);
                                    }}
                                />
                            </label>
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
                                    if (user && supabase) {
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
