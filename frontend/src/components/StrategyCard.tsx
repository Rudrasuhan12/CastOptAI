"use client";

import React from "react";
import type { Strategy } from "@/types";
import { Zap, Timer, Leaf, ArrowRight, TrendingDown, ShieldCheck, AlertTriangle } from "lucide-react";

interface StrategyCardProps {
    strategy: Strategy;
    isSelected: boolean;
    baselineCost?: number;
    onClick: () => void;
    delay?: string;
}

export default function StrategyCard({ strategy, isSelected, baselineCost, onClick, delay = "" }: StrategyCardProps) {
    const isCheapest = strategy.name.includes("cheapest") || strategy.name.includes("Cost");
    const isFastest = strategy.name.includes("fastest") || strategy.name.includes("Fast");
    const isEco = strategy.name.includes("eco") || strategy.name.includes("Eco");

    const Icon = isCheapest ? Zap : isFastest ? Timer : isEco ? Leaf : Zap;
    const accentColor = isCheapest ? "#2563EB" : isFastest ? "#D97706" : "#10B981";


    const savingsPercent = baselineCost && baselineCost > 0
        ? Math.round(((baselineCost - strategy.cost) / baselineCost) * 100)
        : 0;


    const riskConfig: Record<string, { color: string; bg: string }> = {
        Low: { color: "#10B981", bg: "#F0FDF4" },
        Medium: { color: "#D97706", bg: "#FEFCE8" },
        High: { color: "#EF4444", bg: "#FEF2F2" },
    };
    const risk = riskConfig[strategy.risk_level] || riskConfig["Medium"];


    let borderClass = "border-[#E2E8F0]";
    let shadowClass = "shadow-[3px_3px_0px_#E2E8F0]";

    if (isSelected) {
        borderClass = "border-[#0F172A] border-2";
        shadowClass = "shadow-[4px_4px_0px_#0F172A] -translate-y-[2px] -translate-x-[2px]";
    }

    return (
        <button
            onClick={onClick}
            className={`
                animate-assembly ${delay}
                text-left w-full relative rounded-xl border ${borderClass} bg-white p-0 ${shadowClass} transition-all duration-300 overflow-hidden
                hover:-translate-y-[2px] hover:-translate-x-[2px]
                ${!isSelected ? "hover:border-[#CBD5E1] hover:shadow-[4px_4px_0px_#CBD5E1]" : ""}
            `}
        >

            <div className="h-1.5 w-full" style={{ backgroundColor: accentColor }} />

            <div className="p-5">

                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${accentColor}18` }}
                        >
                            <Icon className="w-5 h-5" style={{ color: accentColor }} />
                        </div>
                        <div>
                            <h3 className="text-[14px] font-extrabold text-[#0F172A] leading-tight">{strategy.label}</h3>
                            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mt-0.5">
                                {strategy.risk_level} Risk
                            </p>
                        </div>
                    </div>
                    {isSelected && (
                        <span className="text-[9px] font-bold text-[#0F172A] bg-[#FFCB05] px-2 py-0.5 rounded uppercase tracking-widest shrink-0">
                            Selected
                        </span>
                    )}
                </div>


                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#F8FAFC] rounded-lg p-2.5 border border-[#F1F5F9]">
                        <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Cost</p>
                        <p className="text-[16px] font-extrabold text-[#0F172A] font-mono-data leading-tight mt-0.5">
                            ₹{Math.round(strategy.cost).toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-[#F8FAFC] rounded-lg p-2.5 border border-[#F1F5F9]">
                        <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Strength</p>
                        <p className="text-[16px] font-extrabold text-[#0F172A] font-mono-data leading-tight mt-0.5">
                            {strategy.predicted_strength} <span className="text-[10px] text-[#94A3B8]">MPa</span>
                        </p>
                    </div>
                </div>


                <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
                    {savingsPercent > 0 ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-[#10B981]">
                            <TrendingDown className="w-3 h-3" />
                            {savingsPercent}% savings
                        </span>
                    ) : (
                        <span className="text-[11px] font-bold text-[#94A3B8]">Baseline match</span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] font-bold" style={{ color: risk.color }}>
                        <ShieldCheck className="w-3 h-3" />
                        {strategy.confidence_score}%
                    </span>
                </div>
            </div>
        </button>
    );
}
