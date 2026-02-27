"use client";

import React from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ReferenceLine, ResponsiveContainer, Legend,
} from "recharts";

interface DataPoint { hour: number; strength: number; }

interface StrengthCurveChartProps {
    data: DataPoint[];
    baselineData?: DataPoint[];
    targetStrength: number;
    targetTime: number;
}

export default function StrengthCurveChart({
    data, baselineData, targetStrength, targetTime,
}: StrengthCurveChartProps) {
    const merged = data.map((d, i) => ({
        hour: d.hour,
        optimized: d.strength,
        baseline: baselineData?.[i]?.strength ?? null,
    }));

    return (
        <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={merged} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E0" />
                    <XAxis
                        dataKey="hour"
                        tick={{ fontSize: 11, fill: "#78716C", fontFamily: "var(--font-mono)" }}
                        label={{ value: "Hours", position: "insideBottomRight", offset: -5, fontSize: 11, fill: "#78716C" }}
                        stroke="#DDD8CE"
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: "#78716C", fontFamily: "var(--font-mono)" }}
                        label={{ value: "MPa", angle: -90, position: "insideLeft", fontSize: 11, fill: "#78716C" }}
                        stroke="#DDD8CE"
                    />
                    <Tooltip
                        contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #DDD8CE",
                            boxShadow: "0 4px 16px rgba(28,25,23,0.08)",
                            fontSize: 12,
                            background: "#FFFFFF",
                            color: "#1C1917",
                            fontFamily: "var(--font-mono)",
                        }}
                        formatter={(value) => [`${value} MPa`]}
                    />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#78716C" }} />
                    <ReferenceLine
                        y={targetStrength}
                        stroke="#DC2626"
                        strokeDasharray="6 4"
                        strokeWidth={1.5}
                        label={{ value: `Target: ${targetStrength} MPa`, position: "right", fill: "#DC2626", fontSize: 10, fontWeight: 700 }}
                    />
                    <ReferenceLine
                        x={targetTime}
                        stroke="#7C3AED"
                        strokeDasharray="4 4"
                        strokeWidth={1}
                        label={{ value: `${targetTime}h`, position: "top", fill: "#7C3AED", fontSize: 10, fontWeight: 600 }}
                    />
                    {baselineData && (
                        <Line name="Traditional" type="monotone" dataKey="baseline"
                            stroke="#C4BDB2" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    )}
                    <Line name="AI Optimized" type="monotone" dataKey="optimized"
                        stroke="#0D9488" strokeWidth={2.5} dot={false}
                        activeDot={{ r: 4, strokeWidth: 2, fill: "#FFFFFF", stroke: "#0D9488" }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
