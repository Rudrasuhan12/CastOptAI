"use client";

import React from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ReferenceLine, ResponsiveContainer, Legend,
    Area, AreaChart,
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
        <div className="w-full h-[320px]">
            <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={merged} margin={{ top: 16, right: 24, left: 4, bottom: 8 }}>
                    <defs>
                        <linearGradient id="optimizedGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0F172A" stopOpacity={0.18} />
                            <stop offset="50%" stopColor="#FFCB05" stopOpacity={0.08} />
                            <stop offset="100%" stopColor="#FFCB05" stopOpacity={0.01} />
                        </linearGradient>
                        <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#94A3B8" stopOpacity={0.12} />
                            <stop offset="100%" stopColor="#94A3B8" stopOpacity={0.02} />
                        </linearGradient>
                        <filter id="glowDot" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 6"
                        stroke="#E2E8F0"
                        vertical={false}
                    />

                    <XAxis
                        dataKey="hour"
                        tick={{ fontSize: 11, fill: "#64748B", fontFamily: "var(--font-mono)", fontWeight: 600 }}
                        label={{
                            value: "Curing Time (Hours)", position: "insideBottomRight",
                            offset: -4, fontSize: 10, fill: "#94A3B8", fontWeight: 700, textAnchor: "end"
                        }}
                        stroke="#CBD5E1"
                        tickMargin={8}
                        axisLine={{ strokeWidth: 1.5 }}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: "#64748B", fontFamily: "var(--font-mono)", fontWeight: 600 }}
                        label={{
                            value: "Strength (MPa)", angle: -90, position: "insideLeft",
                            fontSize: 10, fill: "#94A3B8", fontWeight: 700
                        }}
                        stroke="#CBD5E1"
                        tickMargin={8}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip
                        contentStyle={{
                            borderRadius: "10px",
                            border: "1px solid #E2E8F0",
                            boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                            fontSize: 12,
                            background: "#FFFFFF",
                            color: "#0F172A",
                            fontFamily: "var(--font-mono)",
                            fontWeight: 700,
                            padding: "10px 14px"
                        }}
                        itemStyle={{ color: "#0F172A", fontWeight: 800 }}
                        formatter={(value: any) => [`${Number(value).toFixed(1)} MPa`]}
                        cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }}
                        labelFormatter={(label) => `Hour ${label}`}
                    />

                    <Legend
                        wrapperStyle={{
                            fontSize: 10, color: "#64748B", fontWeight: 800,
                            paddingTop: "12px"
                        }}
                        iconType="circle"
                        iconSize={8}
                    />

                    <ReferenceLine
                        y={targetStrength}
                        stroke="#EF4444"
                        strokeDasharray="6 4"
                        strokeWidth={1.5}
                        label={{
                            value: `TARGET ${targetStrength} MPa`,
                            position: "right", fill: "#EF4444", fontSize: 9,
                            fontWeight: 800, fontFamily: "var(--font-mono)"
                        }}
                    />
                    <ReferenceLine
                        x={targetTime}
                        stroke="#0F172A"
                        strokeDasharray="4 4"
                        strokeWidth={1}
                        label={{
                            value: `T+${targetTime}h`, position: "top",
                            fill: "#0F172A", fontSize: 9, fontWeight: 800,
                            fontFamily: "var(--font-mono)"
                        }}
                    />
                    {baselineData && (
                        <Area
                            name="Traditional Mix"
                            type="monotone"
                            dataKey="baseline"
                            stroke="#94A3B8"
                            strokeWidth={2}
                            strokeDasharray="6 3"
                            fill="url(#baselineGrad)"
                            dot={false}
                            animationDuration={1200}
                            animationEasing="ease-in-out"
                        />
                    )}

                    <Area
                        name="AI Optimized Mix"
                        type="monotone"
                        dataKey="optimized"
                        stroke="#0F172A"
                        strokeWidth={3}
                        fill="url(#optimizedGrad)"
                        dot={false}
                        activeDot={{
                            r: 6, strokeWidth: 2,
                            fill: "#FFCB05", stroke: "#0F172A",
                            filter: "url(#glowDot)",
                        }}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
