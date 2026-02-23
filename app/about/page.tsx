"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Info, Github, Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function AboutPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-8 animate-fade-up min-h-screen pb-20">
            {/* Header */}
            <header className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="h-12 w-12 rounded-2xl bg-stealth-surface border border-stealth-border flex items-center justify-center text-text-dim active:scale-95 transition-all"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <span className="text-caption">Informasi</span>
                    <h1 className="text-large-title text-text-primary mt-1">Tentang</h1>
                </div>
            </header>

            {/* Intro Card */}
            <div className="card-stealth p-8 flex flex-col gap-4">
                <div className="h-12 w-12 rounded-2xl bg-neon/10 flex items-center justify-center text-neon mb-2">
                    <Info size={24} />
                </div>
                <h2 className="text-2xl font-black text-text-primary tracking-tighter">SatuJuz</h2>
                <p className="text-sm text-text-dim leading-relaxed">
                    SatuJuz adalah tracker baca Al-Qur&apos;an sederhana yang dirancang untuk membantu Anda tetap konsisten dalam tilawah harian, dengan target satu juz satu hari.
                </p>
            </div>

            {/* How it Works */}
            <div className="flex flex-col gap-4">
                <h3 className="text-caption px-2">Cara Kerja</h3>
                <div className="grid gap-3">
                    <div className="card-stealth p-6 bg-stealth-surface/30">
                        <h4 className="text-sm font-black text-text-primary mb-2 uppercase tracking-tighter">Guest Mode</h4>
                        <p className="text-xs text-text-dim leading-relaxed">
                            Semua data Anda tersimpan secara lokal di browser peringkat ini (Local Storage). Data tidak akan hilang selama cache atau storage browser tidak dihapus.
                        </p>
                    </div>
                    <div className="card-stealth p-6 bg-stealth-surface/30">
                        <h4 className="text-sm font-black text-text-primary mb-2 uppercase tracking-tighter">Login & Sync</h4>
                        <p className="text-xs text-text-dim leading-relaxed">
                            Dengan login via email, data Anda akan tersinkronisasi ke cloud (Supabase), memungkinkan Anda mengakses tracker yang sama di berbagai perangkat.
                        </p>
                    </div>
                </div>
            </div>

            {/* Privacy & Motivation */}
            <div className="flex flex-col gap-4">
                <h3 className="text-caption px-2">Privasi & Data</h3>
                <div className="card-stealth p-6 border-dashed border-neon/20">
                    <ul className="flex flex-col gap-4">
                        <li className="flex gap-3">
                            <div className="h-5 w-5 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-neon" />
                            </div>
                            <p className="text-xs text-text-dim">Data bersifat pribadi dan hanya bisa diakses oleh pemilik akun.</p>
                        </li>
                        <li className="flex gap-3">
                            <div className="h-5 w-5 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-neon" />
                            </div>
                            <p className="text-xs text-text-dim">Kami tidak menjual data Anda kepada pihak ketiga manapun.</p>
                        </li>
                        <li className="flex gap-3">
                            <div className="h-5 w-5 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-neon" />
                            </div>
                            <p className="text-xs text-text-dim">Email hanya digunakan untuk proses login (Magic Link).</p>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Creator */}
            <div className="mt-4 flex flex-col items-center text-center gap-6">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-[3px] text-text-muted">Developed By</span>
                    <h4 className="text-lg font-black text-text-primary tracking-tighter">Mas Derryl</h4>
                    <p className="text-xs text-text-dim italic">&quot;Dibuat supaya kita lebih mudah konsisten.&quot;</p>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/derryl06/SatuJuz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-10 px-4 bg-stealth-surface border border-stealth-border rounded-xl flex items-center gap-2 text-text-dim hover:text-text-primary transition-all active:scale-95"
                    >
                        <Github size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Github</span>
                    </a>
                    <div className="flex items-center gap-2 text-red-500/40">
                        <Heart size={14} fill="currentColor" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">2026</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
