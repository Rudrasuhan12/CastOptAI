"use client";

import React from "react";
import { Crosshair, BarChart3, Activity, SlidersHorizontal, RefreshCw } from "lucide-react";
import type { OptResult, Strategy, WeatherData } from "@/types";

import StrategyCard from "./StrategyCard";
import StrengthCurveChart from "./StrengthCurveChart";
import CostComparisonChart from "./CostComparisonChart";
import ESGDashboard from "./ESGDashboard";
import WhatIfSimulator from "./WhatIfSimulator";
import LearningLoopPanel from "./LearningLoopPanel";

type TabKey = "results" | "whatif" | "learn";

interface ResultsPanelProps {
    result: OptResult;
    selectedStrategy: number;
    onSelectStrategy: (index: number) => void;
    activeTab: TabKey;
    onTabChange: (tab: TabKey) => void;
    weather: WeatherData;
    targetStrength: number;
    targetTime: number;
}

export default function ResultsPanel({
    result,
    selectedStrategy,
    onSelectStrategy,
    activeTab,
    onTabChange,
    weather,
    targetStrength,
    targetTime,
}: ResultsPanelProps) {
    const strat: Strategy | null = result.strategies[selectedStrategy] ?? null;

    const tabs = [
        { key: "results" as const, label: "AI Results", icon: Crosshair },
        { key: "whatif" as const, label: "What-If Simulator", icon: SlidersHorizontal },
        { key: "learn" as const, label: "Learning Loop", icon: RefreshCw },
    ];

    return (
        <div className="space-y-5 animate-slide-right">
            {/* Tabs */}
            <div className="no-print flex items-center border-b border-[#DDD8CE]">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => onTabChange(tab.key)}
                            className={`flex items-center gap-2 px-4 py-3 text-[13px] font-semibold transition-all duration-200 border-b-2 -mb-px ${activeTab === tab.key
                                    ? "border-[#0D9488] text-[#0D9488]"
                                    : "border-transparent text-[#A8A29E] hover:text-[#78716C] hover:border-[#DDD8CE]"
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Results Tab */}
            {activeTab === "results" && strat && (
                <div className="space-y-5">
                    <ESGDashboard
                        carbonReduction={strat.carbon_reduction_percent}
                        energySavings={strat.energy_savings_percent}
                        costSavings={strat.cost_savings_percent}
                        co2Kg={result.baseline.co2 - strat.co2_kg}
                    />

                    <div className="animate-slide-up delay-2">
                        <p className="label mb-2">Top 3 AI Strategies — Click to compare</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {result.strategies.map((s, i) => (
                                <StrategyCard
                                    key={s.name}
                                    strategy={s}
                                    isSelected={selectedStrategy === i}
                                    onClick={() => onSelectStrategy(i)}
                                    targetStrength={result.target_strength}
                                    targetTime={result.target_time}
                                    index={i}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-slide-up delay-4">
                        <div className="card p-5">
                            <h4 className="text-[13px] font-bold text-[#1C1917] mb-0.5 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-[#0D9488]" />
                                Strength Gain Curve (24h)
                            </h4>
                            <p className="text-[10px] text-[#A8A29E] mb-3 ml-6">
                                Predicted compressive strength vs. traditional
                            </p>
                            <StrengthCurveChart
                                data={strat.strength_curve}
                                baselineData={result.baseline.strength_curve}
                                targetStrength={result.target_strength}
                                targetTime={result.target_time}
                            />
                        </div>

                        <div className="card p-5">
                            <h4 className="text-[13px] font-bold text-[#1C1917] mb-0.5 flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-[#D97706]" />
                                Cost Comparison
                            </h4>
                            <p className="text-[10px] text-[#A8A29E] mb-3 ml-6">
                                Traditional vs. AI-optimized recipe cost
                            </p>
                            <CostComparisonChart
                                traditional={result.baseline.cost}
                                optimized={strat.cost}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* What-If Tab */}
            {activeTab === "whatif" && (
                <div className="animate-slide-up">
                    <WhatIfSimulator
                        temp={weather.temp ?? 25}
                        humidity={weather.humidity ?? 60}
                        targetStrength={targetStrength}
                        targetTime={targetTime}
                    />
                </div>
            )}

            {/* Learn Tab */}
            {activeTab === "learn" && (
                <div className="animate-slide-up">
                    <LearningLoopPanel
                        lastRecipe={strat?.recommended_recipe}
                        lastConditions={
                            weather.temp !== null
                                ? {
                                    temp: weather.temp,
                                    humidity: weather.humidity ?? 60,
                                    targetTime,
                                }
                                : undefined
                        }
                    />
                </div>
            )}
        </div>
    );
}
