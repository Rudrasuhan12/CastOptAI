"use client";

import React from "react";
import { ShieldCheck, AlertTriangle, ShieldAlert } from "lucide-react";

interface RiskBadgeProps {
    level: string;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
    const config: Record<string, { bg: string; text: string; border: string; icon: React.ElementType }> = {
        Low: { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0", icon: ShieldCheck },
        Medium: { bg: "#FEFCE8", text: "#CA8A04", border: "#FDE68A", icon: AlertTriangle },
        High: { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA", icon: ShieldAlert },
    };

    const c = config[level] || config["Medium"];
    const Icon = c.icon;

    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
        >
            <Icon className="w-3 h-3" />
            {level} Risk
        </span>
    );
}
