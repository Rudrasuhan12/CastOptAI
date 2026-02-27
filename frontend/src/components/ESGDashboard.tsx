"use client";

import React from "react";
import { Leaf, Zap, DollarSign, TrendingDown } from "lucide-react";

interface ESGDashboardProps {
    co2: number;
    energy: number;
    cost: number;
}

export default function ESGDashboard({ co2, energy, cost }: ESGDashboardProps) {
    const metrics = [
        {
            title: "CO₂ Emissions",
            value: co2.toFixed(1),
            unit: "kg",
            icon: Leaf,
            accent: "#10B981",
            bg: "#F0FDF4",
            border: "#D1FAE5",
        },
        {
            title: "Energy Usage",
            value: energy.toFixed(0),
            unit: "kWh",
            icon: Zap,
            accent: "#D97706",
            bg: "#FEF3C7",
            border: "#FDE68A",
        },
        {
            title: "Recipe Cost",
            value: Number(cost.toFixed(0)).toLocaleString(),
            unit: "₹",
            icon: DollarSign,
            accent: "#2563EB",
            bg: "#EFF6FF",
            border: "#BFDBFE",
        },
    ];

    return (
        <div className="card overflow-hidden">
            <div className="px-5 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#64748B]" />
                <h4 className="text-[12px] font-extrabold text-[#0F172A] uppercase tracking-widest">ESG Impact Summary</h4>
            </div>
            <div className="p-5">
                <div className="grid grid-cols-3 gap-4">
                    {metrics.map((m) => {
                        const Icon = m.icon;
                        return (
                            <div
                                key={m.title}
                                className="rounded-lg p-3.5 transition-all hover:scale-[1.02]"
                                style={{ backgroundColor: m.bg, border: `1px solid ${m.border}` }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className="w-7 h-7 rounded-md flex items-center justify-center"
                                        style={{ backgroundColor: `${m.accent}20` }}
                                    >
                                        <Icon className="w-3.5 h-3.5" style={{ color: m.accent }} />
                                    </div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: m.accent }}>{m.title}</p>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    {m.unit === "₹" && <span className="text-sm font-bold" style={{ color: m.accent }}>₹</span>}
                                    <span className="text-xl font-extrabold text-[#0F172A] font-mono-data tracking-tight leading-none">
                                        {m.value}
                                    </span>
                                    {m.unit !== "₹" && <span className="text-[11px] font-bold text-[#94A3B8] ml-0.5">{m.unit}</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
