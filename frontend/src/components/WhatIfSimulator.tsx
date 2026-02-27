"use client";

import React, { useState, useCallback } from "react";
import axios from "axios";
import { SlidersHorizontal, Loader2 } from "lucide-react";
import StrengthCurveChart from "./StrengthCurveChart";

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";

interface WhatIfSimulatorProps {
    temp: number;
    humidity: number;
    targetStrength: number;
    targetTime: number;
}

export default function WhatIfSimulator({
    temp, humidity, targetStrength, targetTime,
}: WhatIfSimulatorProps) {
    const [cement, setCement] = useState(300);
    const [chemicals, setChemicals] = useState(2);
    const [steam, setSteam] = useState(2);
    const [simTemp, setSimTemp] = useState(temp);
    const [simTime, setSimTime] = useState(targetTime);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const runSimulation = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.post(`${AI_SERVICE_URL}/what-if`, {
                cement, chemicals, steam_hours: steam,
                time_hours: simTime, temp: simTemp, humidity,
            });
            if (res.data.status === "success") setResult(res.data);
        } catch (err) {
            console.error("What-If simulation failed", err);
        }
        setLoading(false);
    }, [cement, chemicals, steam, simTime, simTemp, humidity]);

    const sliders = [
        { label: "Cement", value: cement, set: setCement, min: 200, max: 550, step: 10, unit: "kg" },
        { label: "Chemicals", value: chemicals, set: setChemicals, min: 0, max: 15, step: 0.5, unit: "kg" },
        { label: "Steam", value: steam, set: setSteam, min: 0, max: 12, step: 0.5, unit: "hrs" },
        { label: "Temp", value: simTemp, set: setSimTemp, min: 0, max: 50, step: 1, unit: "°C" },
        { label: "Time", value: simTime, set: setSimTime, min: 4, max: 72, step: 1, unit: "hrs" },
    ];

    return (
        <div className="card overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#DDD8CE] bg-[#EDE9FE]/30">
                <h3 className="text-[13px] font-bold flex items-center gap-2 text-[#1C1917]">
                    <div className="w-7 h-7 rounded-md bg-[#EDE9FE] flex items-center justify-center">
                        <SlidersHorizontal className="w-3.5 h-3.5 text-[#7C3AED]" />
                    </div>
                    What-If Scenario Simulator
                </h3>
                <p className="text-[10px] text-[#A8A29E] mt-1 ml-9">
                    Adjust mix parameters and see predicted results
                </p>
            </div>

            <div className="p-5">
                <div className="grid grid-cols-5 gap-4 mb-4">
                    {sliders.map((s) => (
                        <div key={s.label}>
                            <label className="flex justify-between items-center mb-1.5">
                                <span className="label">{s.label}</span>
                                <span className="text-[11px] font-bold text-[#7C3AED] bg-[#EDE9FE] px-1.5 py-0.5 rounded font-mono-data">
                                    {s.value}{s.unit}
                                </span>
                            </label>
                            <input
                                type="range" min={s.min} max={s.max} step={s.step}
                                value={s.value} onChange={(e) => s.set(parseFloat(e.target.value))}
                                className="w-full"
                            />
                        </div>
                    ))}
                </div>

                <button onClick={runSimulation} disabled={loading}
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-[13px]"
                >
                    {loading ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Simulating...</>
                    ) : (
                        <><SlidersHorizontal className="w-4 h-4" /> Run Simulation</>
                    )}
                </button>

                {result && (
                    <div className="mt-4 space-y-4 animate-slide-up">
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { label: "Strength", value: `${result.predicted_strength}`, unit: "MPa", bg: "#CCFBF1", color: "#0D9488" },
                                { label: "Cost", value: `₹${Math.round(result.cost)}`, unit: "", bg: "#CCFBF1", color: "#0D9488" },
                                { label: "CO₂", value: `${result.co2_kg.toFixed(0)}`, unit: "kg", bg: "#ECFDF5", color: "#059669" },
                                { label: "Energy", value: `${result.energy_kwh.toFixed(0)}`, unit: "kWh", bg: "#FEF3C7", color: "#D97706" },
                            ].map((m) => (
                                <div key={m.label} className="rounded-lg p-3 text-center border border-[#DDD8CE]" style={{ background: m.bg }}>
                                    <p className="label mb-0.5">{m.label}</p>
                                    <p className="text-base font-extrabold font-mono-data" style={{ color: m.color }}>
                                        {m.value} {m.unit && <span className="text-[9px] font-normal opacity-60">{m.unit}</span>}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {result.strength_curve && (
                            <div className="card-flat p-4">
                                <p className="text-[12px] font-bold text-[#1C1917] mb-3">Predicted Strength Gain</p>
                                <StrengthCurveChart
                                    data={result.strength_curve}
                                    targetStrength={targetStrength}
                                    targetTime={simTime}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
