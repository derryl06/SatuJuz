"use client";

import { useEffect, useRef } from "react";
import { JuzCompletion } from "@/types/domain";

interface ShareCanvasProps {
    template: "minimal" | "bold" | "elegant";
    streak: number;
    todayCount: number;
    totalJuz: number;
    monthCount: number;
    onReady: (dataUrl: string) => void;
}

export const ShareCanvas = ({ template, streak, todayCount, totalJuz, monthCount, onReady }: ShareCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Canvas size for IG Story
        canvas.width = 1080;
        canvas.height = 1920;

        // 1. Background
        ctx.fillStyle = "#0B0F10";
        ctx.fillRect(0, 0, 1080, 1920);

        if (template === "elegant") {
            ctx.globalAlpha = 0.1;
            ctx.strokeStyle = "#FFD60A";
            ctx.lineWidth = 2;
            for (let i = 0; i < 20; i++) {
                ctx.beginPath();
                ctx.arc(540, 960, i * 120, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        // 2. Premium Card Center
        const cardX = 120;
        const cardY = 500;
        const cardW = 840;
        const cardH = 920;
        const radius = 80;

        // Glow and Shadow
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 120;
        ctx.shadowOffsetY = 60;

        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, radius);
        ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 3;
        ctx.stroke();

        if (template === "bold") {
            ctx.strokeStyle = "#FFD60A";
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // 3. Content
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (template === "minimal") {
            ctx.fillStyle = "#FFD60A";
            ctx.font = "900 140px Inter, sans-serif";
            ctx.fillText("SATU JUZ", 540, 780);
            ctx.fillText("SATU HARI", 540, 910);

            ctx.font = "900 48px Inter, sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fillText(`🔥 STREAK ${streak} HARI`, 540, 1100);

            ctx.font = "900 36px Inter, sans-serif";
            ctx.fillText(`${totalJuz} TOTAL JUZ • ${monthCount} BULAN INI`, 540, 1220);
        } else if (template === "bold") {
            ctx.font = "900 320px Inter, sans-serif";
            ctx.fillStyle = "#FFD60A";
            ctx.fillText(String(streak), 540, 800);

            ctx.font = "900 48px Inter, sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.fillText("HARI BERTURUT-TURUT", 540, 1000);

            ctx.font = "900 80px Inter, sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(`${todayCount} JUZ HARI INI`, 540, 1140);

            ctx.font = "900 40px Inter, sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.fillText(`${totalJuz} TOTAL • ${monthCount} BULANAN`, 540, 1260);
        } else {
            ctx.font = "900 110px Inter, sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.fillText("Progress Membaca", 540, 820);

            ctx.font = "900 56px Inter, sans-serif";
            ctx.fillStyle = "#FFD60A";
            ctx.fillText(`Juz ${todayCount} Selesai`, 540, 1000);

            ctx.font = "900 40px Inter, sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            ctx.fillText(`Streak Performance: ${streak} Hari`, 540, 1120);

            ctx.font = "900 32px Inter, sans-serif";
            ctx.fillText(`Total Progress: ${totalJuz} Juz Dibaca`, 540, 1220);
        }

        // Logo/Branding
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
        ctx.font = "900 36px Inter, sans-serif";
        ctx.fillText("SATUJUZ • STEALTH NEON AKTIF", 540, 1820);

        onReady(canvas.toDataURL("image/png"));
    }, [template, streak, todayCount, totalJuz, monthCount, onReady]);

    return <canvas ref={canvasRef} className="hidden" />;
};
