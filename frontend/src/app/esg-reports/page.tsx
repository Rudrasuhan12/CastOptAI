"use client";

import React from "react";
import {
    FlaskConical,
    Leaf,
    Zap,
    TrendingDown,
    Factory,
    Droplets,
    BarChart3,
    Calendar,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const MONTHLY_DATA = [
    { month: "Jul", co2: 12400, energy: 8200, cost: 185000, jobs: 42 },
    { month: "Aug", co2: 11800, energy: 7900, cost: 178000, jobs: 45 },
    { month: "Sep", co2: 10500, energy: 7100, cost: 162000, jobs: 48 },
    { month: "Oct", co2: 9800, energy: 6500, cost: 155000, jobs: 50 },
    { month: "Nov", co2: 9200, energy: 6100, cost: 148000, jobs: 52 },
    { month: "Dec", co2: 8600, energy: 5700, cost: 140000, jobs: 55 },
];

const ESG_SCORES = [
    { label: "Carbon Intensity", value: "0.72", unit: "kg CO₂/m³", target: "< 0.80", status: "good" },
    { label: "Energy Efficiency", value: "85", unit: "%", target: "> 80%", status: "good" },
    { label: "Water Recycling Rate", value: "62", unit: "%", target: "> 70%", status: "warning" },
    { label: "Waste Diversion", value: "91", unit: "%", target: "> 85%", status: "good" },
];

export default function ESGReportsPage() {
    const latest = MONTHLY_DATA[MONTHLY_DATA.length - 1];
    const previous = MONTHLY_DATA[MONTHLY_DATA.length - 2];

    const co2Change = ((latest.co2 - previous.co2) / previous.co2 * 100).toFixed(1);
    const energyChange = ((latest.energy - previous.energy) / previous.energy * 100).toFixed(1);
    const costChange = ((latest.cost - previous.cost) / previous.cost * 100).toFixed(1);

    return (
        <div className="flex h-screen font-[family-name:var(--font-inter)] text-[#1C1917]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header showExport={true} onExport={() => window.print()} />
                <div className="flex-1 overflow-y-auto bg-[#F5F2EC]">
                    <div className="p-6 max-w-[1400px] mx-auto">
                        {/* Page header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-[#1C1917] flex items-center gap-2">
                                    <FlaskConical className="w-5 h-5 text-[#059669]" />
                                    ESG Reports
                                </h2>
                                <p className="text-[13px] text-[#78716C] mt-1">
                                    Environmental, Social & Governance performance metrics
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#78716C]">
                                <Calendar className="w-3.5 h-3.5" />
                                Report Period: Jul — Dec 2024
                            </div>
                        </div>

                        {/* Top KPI cards */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {[
                                {
                                    icon: Leaf, label: "Total CO₂ Saved",
                                    value: "3,800", unit: "kg",
                                    change: co2Change, changeLabel: "vs last month",
                                    iconBg: "#ECFDF5", iconColor: "#059669", borderColor: "#059669",
                                },
                                {
                                    icon: Zap, label: "Energy Reduced",
                                    value: "2,500", unit: "kWh",
                                    change: energyChange, changeLabel: "vs last month",
                                    iconBg: "#FEF3C7", iconColor: "#D97706", borderColor: "#D97706",
                                },
                                {
                                    icon: TrendingDown, label: "Cost Savings",
                                    value: "₹45,000", unit: "",
                                    change: costChange, changeLabel: "vs last month",
                                    iconBg: "#CCFBF1", iconColor: "#0D9488", borderColor: "#0D9488",
                                },
                                {
                                    icon: Factory, label: "Jobs Optimized",
                                    value: latest.jobs.toString(), unit: "this month",
                                    change: `+${latest.jobs - previous.jobs}`, changeLabel: "more than last",
                                    iconBg: "#EDE9FE", iconColor: "#7C3AED", borderColor: "#7C3AED",
                                },
                            ].map((kpi) => {
                                const Icon = kpi.icon;
                                return (
                                    <div key={kpi.label} className="card p-4 animate-slide-up" style={{ borderLeftWidth: "3px", borderLeftColor: kpi.borderColor }}>
                                        <div className="flex items-start gap-3">
                                            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: kpi.iconBg }}>
                                                <Icon className="w-4 h-4" style={{ color: kpi.iconColor }} />
                                            </div>
                                            <div>
                                                <p className="label mb-1">{kpi.label}</p>
                                                <p className="text-xl font-extrabold font-mono-data" style={{ color: kpi.borderColor }}>
                                                    {kpi.value} {kpi.unit && <span className="text-[10px] font-normal text-[#A8A29E]">{kpi.unit}</span>}
                                                </p>
                                                <p className="text-[10px] text-[#059669] font-semibold mt-0.5">
                                                    {kpi.change}% {kpi.changeLabel}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Monthly trend table */}
                            <div className="card overflow-hidden">
                                <div className="px-5 py-3 border-b border-[#DDD8CE] bg-[#F5F2EC] flex items-center gap-2">
                                    <BarChart3 className="w-4 h-4 text-[#0D9488]" />
                                    <p className="text-[12px] font-bold text-[#1C1917]">Monthly Trends</p>
                                </div>
                                <table className="w-full text-[12px]">
                                    <thead>
                                        <tr className="border-b border-[#EDE9E0]">
                                            <th className="px-5 py-2.5 text-left label">Month</th>
                                            <th className="px-5 py-2.5 text-right label">CO₂ (kg)</th>
                                            <th className="px-5 py-2.5 text-right label">Energy (kWh)</th>
                                            <th className="px-5 py-2.5 text-right label">Cost (₹)</th>
                                            <th className="px-5 py-2.5 text-right label">Jobs</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {MONTHLY_DATA.map((row) => (
                                            <tr key={row.month} className="border-b border-[#EDE9E0] last:border-0 hover:bg-[#F5F2EC]/50">
                                                <td className="px-5 py-2.5 font-semibold text-[#1C1917]">{row.month}</td>
                                                <td className="px-5 py-2.5 text-right font-mono-data text-[#78716C]">{row.co2.toLocaleString()}</td>
                                                <td className="px-5 py-2.5 text-right font-mono-data text-[#78716C]">{row.energy.toLocaleString()}</td>
                                                <td className="px-5 py-2.5 text-right font-mono-data text-[#78716C]">₹{row.cost.toLocaleString()}</td>
                                                <td className="px-5 py-2.5 text-right font-mono-data font-bold text-[#0D9488]">{row.jobs}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* ESG Scorecard */}
                            <div className="card overflow-hidden">
                                <div className="px-5 py-3 border-b border-[#DDD8CE] bg-[#F5F2EC] flex items-center gap-2">
                                    <Droplets className="w-4 h-4 text-[#059669]" />
                                    <p className="text-[12px] font-bold text-[#1C1917]">ESG Scorecard</p>
                                </div>
                                <div className="divide-y divide-[#EDE9E0]">
                                    {ESG_SCORES.map((score) => (
                                        <div key={score.label} className="px-5 py-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-[13px] font-semibold text-[#1C1917]">{score.label}</p>
                                                <p className="text-[10px] text-[#A8A29E] mt-0.5">Target: {score.target}</p>
                                            </div>
                                            <div className="text-right flex items-center gap-3">
                                                <span className="text-lg font-extrabold font-mono-data text-[#1C1917]">
                                                    {score.value}<span className="text-[10px] font-normal text-[#A8A29E] ml-0.5">{score.unit}</span>
                                                </span>
                                                <span className={`w-2.5 h-2.5 rounded-full ${score.status === "good" ? "bg-[#059669]" : "bg-[#D97706]"}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
