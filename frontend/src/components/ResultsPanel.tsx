"use client";

import React from "react";
import type { OptResult } from "@/types";
import StrategyCard from "./StrategyCard";
import CostComparisonChart from "./CostComparisonChart";
import StrengthCurveChart from "./StrengthCurveChart";
import ESGDashboard from "./ESGDashboard";
import ConfidenceGauge from "./ConfidenceGauge";
import RiskBadge from "./RiskBadge";
import WhatIfSimulator from "./WhatIfSimulator";
import LearningLoopPanel from "./LearningLoopPanel";
import { LayoutDashboard, Beaker, GitBranch, Layers, Gauge, BarChart3, MapPin, Thermometer, Droplets, Clock, Target, RefreshCw } from "lucide-react";

interface OptContext {
    city: string;
    temp: number;
    humidity: number;
    targetStrength: number;
    targetTime: number;
    timestamp: string;
}

interface ResultsPanelProps {
    result: OptResult;
    selectedStrategy: number;
    onSelectStrategy: (idx: number) => void;
    activeTab: "results" | "whatif" | "learn";
    onTabChange: (tab: "results" | "whatif" | "learn") => void;
    weather: { temp: number | null; humidity: number | null };
    targetStrength: number;
    targetTime: number;
    optContext?: OptContext | null;
    paramsChanged?: boolean;
}

export default function ResultsPanel({
    result, selectedStrategy, onSelectStrategy,
    activeTab, onTabChange, weather, targetStrength, targetTime,
    optContext, paramsChanged,
}: ResultsPanelProps) {
    const strategy = result.strategies[selectedStrategy];


    const chartData = strategy.strength_curve || [];
    const baselineCurve = result.baseline?.strength_curve || [];

    const tabs = [
        { id: "results", label: "Optimization Output", icon: LayoutDashboard },
        { id: "whatif", label: "What-If Simulator", icon: Beaker },
        { id: "learn", label: "Learning Engine", icon: GitBranch },
    ] as const;

    return (
        <div className="space-y-4">

            {optContext && (
                <div className={`rounded-lg border px-4 py-2.5 flex items-center justify-between animate-assembly ${paramsChanged ? "bg-[#FEF3C7] border-[#FDE68A]" : "bg-[#F0FDF4] border-[#D1FAE5]"}`}>
                    <div className="flex items-center gap-4 text-[11px] font-bold flex-wrap">
                        {paramsChanged && (
                            <span className="flex items-center gap-1.5 text-[#D97706]">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                Updating...
                            </span>
                        )}
                        <span className="flex items-center gap-1 text-[#64748B]">
                            <MapPin className="w-3 h-3" />
                            <span className="text-[#0F172A]">{optContext.city}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[#64748B]">
                            <Thermometer className="w-3 h-3" />
                            <span className="text-[#0F172A]">{optContext.temp}°C</span>
                        </span>
                        <span className="flex items-center gap-1 text-[#64748B]">
                            <Droplets className="w-3 h-3" />
                            <span className="text-[#0F172A]">{optContext.humidity}%</span>
                        </span>
                        <span className="flex items-center gap-1 text-[#64748B]">
                            <Target className="w-3 h-3" />
                            <span className="text-[#0F172A]">{optContext.targetStrength} MPa</span>
                        </span>
                        <span className="flex items-center gap-1 text-[#64748B]">
                            <Clock className="w-3 h-3" />
                            <span className="text-[#0F172A]">{optContext.targetTime}h</span>
                        </span>
                    </div>
                    <span className="text-[10px] font-mono-data text-[#94A3B8] shrink-0">
                        AI run @ {optContext.timestamp}
                    </span>
                </div>
            )}

            <div className="flex items-center gap-1 bg-[#F1F5F9] rounded-lg p-1 animate-assembly delay-100">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] font-bold transition-all duration-300 rounded-md
                                ${isActive
                                    ? "bg-white text-[#0F172A] shadow-[2px_2px_0px_#E2E8F0]"
                                    : "text-[#64748B] hover:text-[#0F172A]"
                                }
                            `}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? "text-[#FFCB05]" : "text-[#94A3B8]"}`} />
                            <span className="hidden md:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {activeTab === "results" && (
                <div className="space-y-6 animate-scale-in">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {result.strategies.map((strat, idx) => (
                            <StrategyCard
                                key={strat.name}
                                strategy={strat}
                                isSelected={selectedStrategy === idx}
                                baselineCost={result.baseline?.cost}
                                onClick={() => onSelectStrategy(idx)}
                                delay={`delay-${(idx + 2) * 100}`}
                            />
                        ))}
                    </div>


                    <div className="grid grid-cols-12 gap-5">

                        <div className="col-span-12 lg:col-span-5 space-y-5">

                            <div className="card overflow-hidden animate-assembly delay-400">
                                <div className="px-5 py-3 bg-[#0F172A] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-[#FFCB05]" />
                                        <h3 className="text-[12px] font-extrabold text-white uppercase tracking-widest">Optimized Blueprint</h3>
                                    </div>
                                    <RiskBadge level={strategy.risk_level} />
                                </div>
                                <div className="p-5">

                                    <div className="grid grid-cols-2 gap-3 mb-5">
                                        {[
                                            { label: "Cement", value: `${strategy.recommended_recipe.cement}`, unit: "kg", icon: "🧱" },
                                            { label: "Chemicals", value: `${strategy.recommended_recipe.chemicals}`, unit: "L", icon: "🧪" },
                                            { label: "Water", value: `${strategy.recommended_recipe.water}`, unit: "L", icon: "💧" },
                                            { label: "Steam", value: `${strategy.recommended_recipe.steam_hours}`, unit: "hrs", icon: "♨️" },
                                        ].map((item) => (
                                            <div key={item.label} className="bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <span className="text-[12px]">{item.icon}</span>
                                                    <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">{item.label}</p>
                                                </div>
                                                <p className="text-[18px] font-extrabold text-[#0F172A] font-mono-data leading-none">
                                                    {item.value}
                                                    <span className="text-[10px] font-bold text-[#94A3B8] ml-1">{item.unit}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>


                                    <div className="bg-[#F0FDF4] rounded-lg p-3 border border-[#10B981]/20">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">Predicted Strength</span>
                                            <span className="text-[16px] font-extrabold text-[#10B981] font-mono-data">{strategy.predicted_strength} MPa</span>
                                        </div>
                                        <div className="w-full h-2 bg-[#D1FAE5] rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#10B981] rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min(100, (strategy.predicted_strength / 60) * 100)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-1">
                                            <span className="text-[9px] text-[#94A3B8] font-mono-data">Target: {targetStrength} MPa</span>
                                            <span className="text-[9px] text-[#10B981] font-bold font-mono-data">
                                                +{(strategy.predicted_strength - targetStrength).toFixed(1)} MPa buffer
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="animate-assembly delay-500">
                                <ConfidenceGauge score={strategy.confidence_score} size={160} />
                            </div>
                        </div>


                        <div className="col-span-12 lg:col-span-7 space-y-5">

                            <div className="card overflow-hidden animate-assembly delay-500">
                                <div className="px-5 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2">
                                    <Gauge className="w-4 h-4 text-[#64748B]" />
                                    <h4 className="text-[12px] font-extrabold text-[#0F172A] uppercase tracking-widest">Strength Telemetry</h4>
                                </div>
                                <div className="p-5">
                                    <StrengthCurveChart
                                        data={chartData}
                                        baselineData={baselineCurve}
                                        targetStrength={targetStrength}
                                        targetTime={targetTime}
                                    />
                                </div>
                            </div>


                            <div className="card overflow-hidden animate-assembly delay-600">
                                <div className="px-5 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-[#64748B]" />
                                    <h4 className="text-[12px] font-extrabold text-[#0F172A] uppercase tracking-widest">Cost Variance Matrix</h4>
                                </div>
                                <div className="p-5">
                                    <CostComparisonChart
                                        traditional={result.baseline.cost}
                                        optimized={strategy.cost}
                                    />
                                </div>
                            </div>


                            <div className="animate-assembly delay-700">
                                <ESGDashboard
                                    co2={strategy.co2_kg}
                                    energy={strategy.energy_kwh}
                                    cost={strategy.cost}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "whatif" && (
                <div className="animate-scale-in max-w-[800px]">
                    <WhatIfSimulator
                        temp={weather?.temp ?? 25}
                        humidity={weather?.humidity ?? 50}
                        targetStrength={targetStrength}
                        targetTime={targetTime}
                    />
                </div>
            )}

            {activeTab === "learn" && (
                <div className="animate-scale-in max-w-[800px]">
                    <LearningLoopPanel
                        lastRecipe={strategy.recommended_recipe}
                        lastConditions={{
                            temp: weather?.temp ?? 25,
                            humidity: weather?.humidity ?? 50,
                            targetTime
                        }}
                    />
                </div>
            )}
        </div>
    );
}
