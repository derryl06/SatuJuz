"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "auto";
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />
            <div
                className={cn(
                    "glass-surface relative w-full rounded-[32px] p-6 shadow-2xl transition-all duration-500 ease-out sm:max-w-[360px] animate-in fade-in zoom-in-95 duration-300",
                )}
            >
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-text-primary">{title}</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full bg-stealth-surface p-2 hover:bg-stealth-surface/80 text-text-dim"
                    >
                        <X size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};
