"use client";

import React from "react";

interface RiskBadgeProps {
    level: string;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
    const config: Record<string, { bg: string; text: string; dot: string }> = {
        Low: { bg: "bg-[#ECFDF5]", text: "text-[#059669]", dot: "bg-[#059669]" },
        Medium: { bg: "bg-[#FEF3C7]", text: "text-[#D97706]", dot: "bg-[#D97706]" },
        High: { bg: "bg-red-50", text: "text-[#DC2626]", dot: "bg-[#DC2626]" },
    };

    const c = config[level] || config["Medium"];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold ${c.bg} ${c.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {level} Risk
        </span>
    );
}
