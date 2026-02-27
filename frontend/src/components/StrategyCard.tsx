"use client";

import React from "react";
import { DollarSign, Wind, FlaskConical, Coins, Gauge, Leaf } from "lucide-react";
import ConfidenceGauge from "./ConfidenceGauge";
import RiskBadge from "./RiskBadge";

interface Recipe {
    cement: number;
    chemicals: number;
    steam_hours: number;
    water: number;
}

interface Strategy {
    name: string;
    label: string;
    recommended_recipe: Recipe;
    predicted_strength: number;
    confidence_score: number;
    risk_level: string;
    cost: number;
    co2_kg: number;
    energy_kwh: number;
    cost_savings_percent: number;
    carbon_reduction_percent: number;
    energy_savings_percent: number;
}

interface StrategyCardProps {
    strategy: Strategy;
    isSelected: boolean;
    onClick: () => void;
    targetStrength: number;
    targetTime: number;
    index?: number;
}

const STRATEGY_ICONS: Record<string, React.ReactNode> = {
    cheapest: <Coins className="w-4 h-4 text-[#D97706]" />,
    fastest: <Gauge className="w-4 h-4 text-[#0D9488]" />,
    eco: <Leaf className="w-4 h-4 text-[#059669]" />,
};

const STRATEGY_LABELS: Record<string, string> = {
    cheapest: "Cheapest",
    fastest: "Fastest",
    eco: "Most Eco-Friendly",
};

export default function StrategyCard({
    strategy,
    isSelected,
    onClick,
    targetStrength,
    targetTime,
    index = 0,
}: StrategyCardProps) {
    const s = strategy;

    return (
        <div
            onClick={onClick}
            className={`
                relative cursor-pointer rounded-xl p-4 transition-all duration-200 animate-slide-up
                ${isSelected
                    ? "bg-white border-2 border-[#0D9488] shadow-lg ring-2 ring-[#0D9488]/10"
                    : "bg-white border border-[#DDD8CE] shadow-sm hover:shadow-md hover:border-[#C4BDB2]"
                }
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-[13px] font-bold flex items-center gap-2 text-[#1C1917]">
                    <div className="w-7 h-7 rounded-md bg-[#F5F2EC] border border-[#DDD8CE] flex items-center justify-center">
                        {STRATEGY_ICONS[s.name] || <FlaskConical className="w-4 h-4 text-[#78716C]" />}
                    </div>
                    {STRATEGY_LABELS[s.name] || s.label}
                </h4>
                <RiskBadge level={s.risk_level} />
            </div>

            {/* Confidence + Key Metric */}
            <div className="flex items-center gap-4 mb-3">
                <ConfidenceGauge score={Math.round(s.confidence_score)} size={80} />
                <div className="flex-1">
                    <div className="bg-[#F5F2EC] rounded-lg p-2.5 border border-[#DDD8CE]">
                        <p className="label mb-0.5">Predicted Strength</p>
                        <p className="text-lg font-extrabold text-[#0D9488] font-mono-data">
                            {s.predicted_strength} <span className="text-[10px] font-medium text-[#A8A29E]">MPa</span>
                        </p>
                        <p className="text-[9px] text-[#A8A29E] mt-0.5 font-mono-data">
                            Target: {targetStrength} MPa in {targetTime}h
                        </p>
                    </div>
                </div>
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-4 gap-1.5 mb-3">
                {[
                    { label: "Cement", value: `${s.recommended_recipe.cement}`, unit: "kg" },
                    { label: "Water", value: `${s.recommended_recipe.water}`, unit: "L" },
                    { label: "Chemicals", value: `${s.recommended_recipe.chemicals}`, unit: "kg" },
                    { label: "Steam", value: `${s.recommended_recipe.steam_hours}`, unit: "hrs" },
                ].map((item) => (
                    <div key={item.label} className="bg-[#F5F2EC] rounded-md p-1.5 text-center border border-[#EDE9E0]">
                        <p className="text-[8px] font-bold uppercase text-[#A8A29E] tracking-wider">{item.label}</p>
                        <p className="text-[12px] font-extrabold text-[#1C1917] font-mono-data">
                            {item.value}
                            <span className="text-[8px] font-normal text-[#A8A29E] ml-0.5">{item.unit}</span>
                        </p>
                    </div>
                ))}
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-1.5 text-[10px]">
                <span className="flex items-center gap-1 bg-[#CCFBF1] text-[#0D9488] font-bold px-2 py-1 rounded font-mono-data">
                    <DollarSign className="w-2.5 h-2.5" /> ₹{Math.round(s.cost)}
                </span>
                <span className="flex items-center gap-1 bg-[#ECFDF5] text-[#059669] font-bold px-2 py-1 rounded font-mono-data">
                    <Wind className="w-2.5 h-2.5" /> {s.co2_kg.toFixed(0)} kg
                </span>
                <span className="flex items-center gap-1 bg-[#FEF3C7] text-[#D97706] font-bold px-2 py-1 rounded font-mono-data">
                    <FlaskConical className="w-2.5 h-2.5" /> {s.energy_kwh.toFixed(0)} kWh
                </span>
            </div>

            {/* Selected indicator */}
            {isSelected && (
                <div className="absolute top-3 right-3 w-2 h-2 bg-[#0D9488] rounded-full" />
            )}
        </div>
    );
}
