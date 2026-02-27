"use client";

import React, { useState } from "react";
import axios from "axios";
import { RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";

interface LearningLoopPanelProps {
    lastRecipe?: { cement: number; chemicals: number; steam_hours: number; water: number };
    lastConditions?: { temp: number; humidity: number; targetTime: number };
}

export default function LearningLoopPanel({ lastRecipe, lastConditions }: LearningLoopPanelProps) {
    const [actualStrength, setActualStrength] = useState("");
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleSubmit = async () => {
        if (!actualStrength || !lastRecipe || !lastConditions) return;
        setLoading(true);
        setFeedback(null);

        try {
            const res = await axios.post(`${AI_SERVICE_URL}/retrain`, {
                cement: lastRecipe.cement, chemicals: lastRecipe.chemicals,
                steam_hours: lastRecipe.steam_hours, water: lastRecipe.water,
                age_hours: lastConditions.targetTime, temperature: lastConditions.temp,
                humidity: lastConditions.humidity,
                curing_method: lastRecipe.steam_hours > 0 ? 1 : 0,
                actual_strength: parseFloat(actualStrength),
            });

            if (res.data.status === "success") {
                setFeedback({ type: "success", message: `${res.data.message} (${res.data.total_samples} samples)` });
                setActualStrength("");
            } else {
                setFeedback({ type: "error", message: res.data.message });
            }
        } catch {
            setFeedback({ type: "error", message: "Failed to submit. Is the AI service running?" });
        }
        setLoading(false);
    };

    return (
        <div className="card overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#DDD8CE] bg-[#CCFBF1]/30">
                <h3 className="text-[13px] font-bold flex items-center gap-2 text-[#1C1917]">
                    <div className="w-7 h-7 rounded-md bg-[#CCFBF1] flex items-center justify-center">
                        <RefreshCw className="w-3.5 h-3.5 text-[#0D9488]" />
                    </div>
                    Continuous Learning Loop
                </h3>
                <p className="text-[10px] text-[#A8A29E] mt-1 ml-9">
                    Log actual tested strength to retrain the AI model
                </p>
            </div>

            <div className="p-5">
                {!lastRecipe ? (
                    <div className="text-center py-10 text-[#A8A29E] text-[13px]">
                        <RefreshCw className="w-7 h-7 mx-auto mb-3 text-[#DDD8CE]" />
                        Run an optimization first, then log results here.
                    </div>
                ) : (
                    <>
                        {/* Recipe summary */}
                        <div className="rounded-lg border border-[#DDD8CE] bg-[#F5F2EC] p-4 mb-4">
                            <p className="label mb-2">Recipe Used</p>
                            <div className="grid grid-cols-4 gap-3 text-center">
                                {[
                                    { label: "Cement", value: `${lastRecipe.cement} kg` },
                                    { label: "Water", value: `${lastRecipe.water} L` },
                                    { label: "Chemicals", value: `${lastRecipe.chemicals} kg` },
                                    { label: "Steam", value: `${lastRecipe.steam_hours} hrs` },
                                ].map((item) => (
                                    <div key={item.label}>
                                        <p className="text-[9px] text-[#A8A29E] font-semibold uppercase">{item.label}</p>
                                        <p className="text-[13px] font-bold text-[#1C1917] font-mono-data">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="mb-4">
                            <label className="block text-[12px] font-bold text-[#1C1917] mb-2">
                                Actual Tested Strength (MPa)
                            </label>
                            <input
                                type="number" step="0.1" placeholder="e.g. 22.5"
                                value={actualStrength}
                                onChange={(e) => setActualStrength(e.target.value)}
                                className="input-field text-base font-bold font-mono-data"
                            />
                        </div>

                        <button onClick={handleSubmit} disabled={loading || !actualStrength}
                            className="btn-primary w-full"
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Retraining Model...</>
                            ) : (
                                <><RefreshCw className="w-4 h-4" /> Submit & Retrain</>
                            )}
                        </button>

                        {feedback && (
                            <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 animate-scale-in text-[12px] font-medium ${feedback.type === "success"
                                    ? "bg-[#ECFDF5] border border-[#059669]/20 text-[#059669]"
                                    : "bg-red-50 border border-red-200 text-[#DC2626]"
                                }`}>
                                {feedback.type === "success"
                                    ? <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                }
                                {feedback.message}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
