"use client";

import React from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, LabelList,
} from "recharts";

interface CostComparisonChartProps {
    traditional: number;
    optimized: number;
}

export default function CostComparisonChart({ traditional, optimized }: CostComparisonChartProps) {
    const data = [
        { name: "Traditional", cost: Math.round(traditional), fill: "#C4BDB2" },
        { name: "AI Optimized", cost: Math.round(optimized), fill: "#0D9488" },
    ];

    const savings = traditional - optimized;
    const savingsPct = traditional > 0 ? ((savings / traditional) * 100).toFixed(0) : "0";

    return (
        <div className="w-full">
            <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 30, right: 20, left: 0, bottom: 5 }} barSize={56}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E0" vertical={false} />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fontWeight: 600, fill: "#78716C" }}
                            stroke="#DDD8CE"
                        />
                        <YAxis tick={{ fontSize: 11, fill: "#A8A29E", fontFamily: "var(--font-mono)" }} stroke="#DDD8CE" />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #DDD8CE",
                                boxShadow: "0 4px 16px rgba(28,25,23,0.08)",
                                fontSize: 12,
                                background: "#FFFFFF",
                                color: "#1C1917",
                            }}
                            formatter={(value) => [`₹${value}`]}
                        />
                        <Bar dataKey="cost" radius={[6, 6, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.fill} />
                            ))}
                            <LabelList
                                dataKey="cost"
                                position="top"
                                style={{ fontSize: 12, fontWeight: 700, fill: "#78716C", fontFamily: "var(--font-mono)" }}
                                formatter={(v) => `₹${v}`}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {savings > 0 && (
                <div className="text-center mt-2">
                    <span className="inline-flex items-center gap-1.5 bg-[#CCFBF1] text-[#0D9488] text-[12px] font-bold px-3 py-1.5 rounded-lg font-mono-data">
                        Saving ₹{Math.round(savings)} per m³ ({savingsPct}% reduction)
                    </span>
                </div>
            )}
        </div>
    );
}
