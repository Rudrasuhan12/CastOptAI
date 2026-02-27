"use client";

import React, { useState, useCallback } from "react";
import axios from "axios";
import { SlidersHorizontal, Loader2, Play } from "lucide-react";
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
        { label: "Cement Mix", value: cement, set: setCement, min: 200, max: 550, step: 10, unit: "kg" },
        { label: "Admixture", value: chemicals, set: setChemicals, min: 0, max: 15, step: 0.5, unit: "kg" },
        { label: "Steam Curing", value: steam, set: setSteam, min: 0, max: 12, step: 0.5, unit: "h" },
        { label: "Yard Temp", value: simTemp, set: setSimTemp, min: 0, max: 50, step: 1, unit: "°C" },
        { label: "Target Age", value: simTime, set: setSimTime, min: 4, max: 72, step: 1, unit: "h" },
    ];

    return (
        <div className="card overflow-hidden">

            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#0F172A] flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#1E293B] flex items-center justify-center border border-[#334155]">
                        <SlidersHorizontal className="w-4 h-4 text-[#FFCB05]" />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-extrabold text-white tracking-wide uppercase">Sandbox Environment</h3>
                        <p className="text-[9px] text-[#94A3B8] font-mono-data tracking-widest mt-0.5">MANUAL_OVERRIDE_ACTIVE</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {sliders.map((s) => (
                        <div key={s.label} className="relative">
                            <label className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">{s.label}</span>
                                <span className="text-[11px] font-extrabold text-[#0F172A] bg-[#F1F5F9] border border-[#CBD5E1] px-1.5 py-0.5 rounded font-mono-data">
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

                <div className="flex justify-center border-t border-[#E2E8F0] pt-6 gap-4">
                    <button onClick={runSimulation} disabled={loading}
                        className="btn-primary"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> EXECUTING...</>
                        ) : (
                            <><Play className="w-4 h-4 fill-current" /> EXECUTE SIMULATION</>
                        )}
                    </button>
                </div>

                {result && (
                    <div className="mt-8 pt-6 border-t border-[#E2E8F0] animate-slide-up">
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {[
                                { label: "Projected Strength", value: `${result.predicted_strength}`, unit: "MPa", borderColor: "#10B981" },
                                { label: "Cost Variant", value: `₹${Math.round(result.cost)}`, unit: "", borderColor: "#0F172A" },
                                { label: "Carbon Output", value: `${result.co2_kg.toFixed(0)}`, unit: "kg", borderColor: "#64748B" },
                                { label: "Energy Delta", value: `${result.energy_kwh.toFixed(0)}`, unit: "kWh", borderColor: "#64748B" },
                            ].map((m) => (
                                <div key={m.label} className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 text-center rounded-xl shadow-[3px_3px_0px_#E2E8F0]" style={{ borderBottomWidth: "3px", borderBottomColor: m.borderColor }}>
                                    <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest mb-1.5">{m.label}</p>
                                    <p className="text-xl font-extrabold font-mono-data text-[#0F172A]">
                                        {m.value} {m.unit && <span className="text-[11px] font-normal text-[#94A3B8]">{m.unit}</span>}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {result.strength_curve && (
                            <div className="border border-[#E2E8F0] rounded-xl p-5 bg-white shadow-[4px_4px_0px_#E2E8F0]">
                                <p className="text-[11px] font-extrabold text-[#0F172A] uppercase tracking-widest mb-4">Simulated Telemetry</p>
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
