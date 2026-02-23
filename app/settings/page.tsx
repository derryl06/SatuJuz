"use client";

import { useState } from "react";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    const enablePush = async () => {
        setLoading(true);
        setStatus("Meminta izin...");
        try {
            if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
                throw new Error("Push Notification tidak didukung di browser ini.");
            }

            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                throw new Error("Izin notifikasi ditolak oleh browser.");
            }

            setStatus("Mendaftarkan Service Worker...");
            // Register service worker jika belum
            const registration = await navigator.serviceWorker.register("/sw.js");
            await navigator.serviceWorker.ready;

            setStatus("Berlangganan (Subscribe)...");
            // Subscribe ke push notification
            const applicationServerKey = urlBase64ToUint8Array(
                process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string
            );

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey,
            });

            setStatus("Menyimpan ke Server...");
            // Kirim ke server
            const res = await fetch("/api/push/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(subscription),
            });

            if (!res.ok) throw new Error("Gagal menyimpan subscription. Periksa API.");

            setStatus("Notifikasi berhasil diaktifkan!");
        } catch (err: any) {
            console.error(err);
            setStatus(err.message || "Terjadi kesalahan.");
        } finally {
            setLoading(false);
        }
    };

    const testPush = async () => {
        try {
            setStatus("Mengirim test push...");
            const res = await fetch("/api/push/test", { method: "POST" });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Gagal mengirim notif");
            setStatus(result.message);
        } catch (err: any) {
            setStatus(err.message);
        }
    }

    return (
        <div className="max-w-xl mx-auto flex flex-col gap-8 animate-fade-up">
            <header className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-caption">Preferences</span>
                    <h1 className="text-large-title text-text-primary mt-1">Web Push</h1>
                </div>
            </header>

            <div className="card-stealth flex flex-col gap-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">Push Notification</h2>
                    <p className="text-sm text-text-muted">
                        Aktifkan notifikasi Web Push untuk menerima alarm (Daily Reminder)
                        walaupun tab browser ditutup.
                    </p>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={enablePush}
                        disabled={loading}
                        className="bg-neon text-black px-6 py-4 rounded-xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all text-center disabled:opacity-50"
                    >
                        {loading ? "Memproses..." : "Aktifkan Notifikasi"}
                    </button>

                    <button
                        onClick={testPush}
                        className="bg-stealth-translucent border border-stealth-border text-text-primary px-6 py-4 rounded-xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all text-center"
                    >
                        Test Kirim Notif (Broadcast)
                    </button>
                </div>

                {status && (
                    <div className="mt-2 p-3 bg-white/5 border border-white/10 rounded-lg">
                        <p className="text-xs font-mono text-neon">{status}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
