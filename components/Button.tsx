"use client";

import React from "react";

interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary";
    onClick?: () => void;
    className?: string;
    ariaLabel?: string;
}

export default function Button({
    children,
    variant = "primary",
    onClick,
    className = "",
    ariaLabel,
}: ButtonProps) {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 text-base font-semibold transition-all duration-300";

    const variants = {
        primary:
            "border border-[#d4a843] bg-gradient-to-l from-[#c89f33] via-[#d4ae42] to-[#e2c25b] text-[#14100a] shadow-[0_12px_30px_rgba(212,168,67,0.25)] hover:brightness-105 active:scale-[0.98]",
        secondary:
            "border border-white/15 bg-[linear-gradient(120deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-white/25 hover:text-white active:scale-[0.98]",
    };

    return (
        <button
            onClick={onClick}
            className={`${base} ${variants[variant]} ${className}`}
            aria-label={ariaLabel}
        >
            {children}
        </button>
    );
}
