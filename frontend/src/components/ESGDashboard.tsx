"use client";

import React from "react";
import { Leaf, Zap, TrendingDown } from "lucide-react";

interface ESGDashboardProps {
    carbonReduction: number;
    energySavings: number;
    costSavings: number;
    co2Kg: number;
}

export default function ESGDashboard({
    carbonReduction,
    energySavings,
    costSavings,
    co2Kg,
}: ESGDashboardProps) {
    const metrics = [
        {
            icon: Leaf,
            label: "CO₂ Reduced",
            value: `${carbonReduction.toFixed(0)}%`,
            sub: `${co2Kg.toFixed(0)} kg CO₂ saved`,
            borderColor: "#059669",
            iconBg: "#ECFDF5",
            iconColor: "#059669",
            valueColor: "#059669",
        },
        {
            icon: Zap,
            label: "Energy Saved",
            value: `${energySavings.toFixed(0)}%`,
            sub: "vs. traditional curing",
            borderColor: "#D97706",
            iconBg: "#FEF3C7",
            iconColor: "#D97706",
            valueColor: "#D97706",
        },
        {
            icon: TrendingDown,
            label: "Cost Reduction",
            value: `${costSavings.toFixed(0)}%`,
            sub: "per cubic meter",
            borderColor: "#0D9488",
            iconBg: "#CCFBF1",
            iconColor: "#0D9488",
            valueColor: "#0D9488",
        },
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {metrics.map((m, i) => {
                const Icon = m.icon;
                return (
                    <div
                        key={m.label}
                        className="card p-4 animate-slide-up"
                        style={{
                            animationDelay: `${i * 0.05}s`,
                            borderLeftWidth: "3px",
                            borderLeftColor: m.borderColor,
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: m.iconBg }}
                            >
                                <Icon className="w-4.5 h-4.5" style={{ color: m.iconColor }} />
                            </div>
                            <div>
                                <p className="label mb-1">{m.label}</p>
                                <p className="text-2xl font-extrabold font-mono-data" style={{ color: m.valueColor }}>
                                    {m.value}
                                </p>
                                <p className="text-[10px] text-[#A8A29E] mt-0.5">{m.sub}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
