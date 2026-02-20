"use client";

import { useEffect, useRef } from "react";
import { JuzCompletion } from "@/types/domain";

interface ShareCanvasProps {
    template: "minimal" | "bold" | "elegant";
    streak: number;
    todayCount: number;
    onReady: (dataUrl: string) => void;
}

export const ShareCanvas = ({ template, streak, todayCount, onReady }: ShareCanvasProps) => {
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
        ctx.fillStyle = "#0B0F1A";
        ctx.fillRect(0, 0, 1080, 1920);

        if (template === "elegant") {
            ctx.globalAlpha = 0.05;
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            for (let i = 0; i < 20; i++) {
                ctx.beginPath();
                ctx.arc(540, 960, i * 100, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        // 2. Glass Card Center
        const cardX = 140;
        const cardY = 600;
        const cardW = 800;
        const cardH = 720;
        const radius = 60;

        // Shadow
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 100;
        ctx.shadowOffsetY = 40;

        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, radius);
        ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
        ctx.fill();

        ctx.shadowBlur = 0; // Reset shadow
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 3. Content
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (template === "minimal") {
            ctx.font = "bold 120px Inter, sans-serif";
            ctx.fillText("One Day", 540, 850);
            ctx.fillText("One Juz", 540, 980);

            ctx.font = "40px Inter, sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillText(`🔥 ${streak} DAY STREAK`, 540, 1150);
        } else if (template === "bold") {
            ctx.font = "bold 200px Inter, sans-serif";
            ctx.fillText(String(streak), 540, 880);

            ctx.font = "40px Inter, sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
            ctx.fillText("DAYS OF QURAN", 540, 1020);

            ctx.font = "bold 80px Inter, sans-serif";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(`${todayCount} JUZ TODAY`, 540, 1180);
        } else {
            ctx.font = "bold 100px Inter, sans-serif";
            ctx.fillText("Spiritual Flow", 540, 880);
            ctx.font = "40px Inter, sans-serif";
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillText(`Juz ${todayCount} Completed`, 540, 1020);
            ctx.fillText(`Streak: ${streak} Days`, 540, 1120);
        }

        // Logo/Branding
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.font = "32px Inter, sans-serif";
        ctx.fillText("OD1J • Modern Quran Tracker", 540, 1800);

        onReady(canvas.toDataURL("image/png"));
    }, [template, streak, todayCount, onReady]);

    return <canvas ref={canvasRef} className="hidden" />;
};
