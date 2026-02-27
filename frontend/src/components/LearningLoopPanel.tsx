"use client";

import React, { useState } from "react";
import axios from "axios";
import { GitBranch, CheckCircle, AlertCircle, Loader2, Save } from "lucide-react";

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
        <div className="card overflow-hidden border-2 border-[#0F172A]">

            <div className="px-5 py-4 bg-[#0F172A] flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[#1E293B] flex items-center justify-center border border-[#334155]">
                        <GitBranch className="w-4 h-4 text-[#10B981]" />
                    </div>
                    <div>
                        <h3 className="text-[13px] font-extrabold tracking-wide uppercase">Continuous Learning Node</h3>
                        <p className="text-[9px] text-[#94A3B8] font-mono-data tracking-widest mt-0.5">FEEDBACK_LOOP_SYSTEM</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {!lastRecipe ? (
                    <div className="text-center py-12 text-[#94A3B8] text-[13px]">
                        <div className="w-12 h-12 rounded-full border border-dashed border-[#CBD5E1] mx-auto flex items-center justify-center mb-4">
                            <GitBranch className="w-5 h-5 text-[#94A3B8]" />
                        </div>
                        <p className="font-medium">Execute an optimization sequence to calibrate the feedback node.</p>
                    </div>
                ) : (
                    <>
                        <p className="text-[12px] text-[#475569] mb-5 font-medium leading-relaxed">
                            Log actual laboratory test results for the recent cast to <strong className="text-[#0F172A]">retrain and continuously improve</strong> the Random Forest predictive model.
                        </p>


                        <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl shadow-[3px_3px_0px_#E2E8F0] mb-6">
                            <p className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider mb-3">Snapshot Payload</p>
                            <div className="grid grid-cols-4 gap-3 text-center">
                                {[
                                    { label: "Cement", value: `${lastRecipe.cement} kg` },
                                    { label: "Water", value: `${lastRecipe.water} L` },
                                    { label: "Chem.", value: `${lastRecipe.chemicals} kg` },
                                    { label: "Steam", value: `${lastRecipe.steam_hours} hrs` },
                                ].map((item) => (
                                    <div key={item.label} className="bg-white border border-[#E2E8F0] rounded py-2">
                                        <p className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider">{item.label}</p>
                                        <p className="text-[13px] font-bold text-[#0F172A] font-mono-data mt-0.5">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className="mb-6 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-[4px_4px_0px_#0F172A]">
                            <label className="block text-[11px] font-extrabold text-[#0F172A] uppercase tracking-widest mb-3">
                                Actual Laboratory Strength (MPa)
                            </label>
                            <div className="flex gap-4">
                                <input
                                    type="number" step="0.1" placeholder="e.g. 25.4"
                                    value={actualStrength}
                                    onChange={(e) => setActualStrength(e.target.value)}
                                    className="input-field text-lg font-bold font-mono-data py-3 shadow-[2px_2px_0px_#CBD5E1]"
                                />
                                <button onClick={handleSubmit} disabled={loading || !actualStrength}
                                    className="btn-primary shrink-0"
                                >
                                    {loading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> COMMITTING...</>
                                    ) : (
                                        <><Save className="w-4 h-4" /> COMMIT DATA</>
                                    )}
                                </button>
                            </div>
                        </div>

                        {feedback && (
                            <div className={`p-4 rounded-xl flex items-start gap-3 animate-scale-in text-[13px] font-bold border-2 ${feedback.type === "success"
                                ? "bg-[#F0FDF4] border-[#16A34A] text-[#16A34A] shadow-[4px_4px_0px_#16A34A]"
                                : "bg-[#FEF2F2] border-[#DC2626] text-[#DC2626] shadow-[4px_4px_0px_#DC2626]"
                                }`}>
                                {feedback.type === "success"
                                    ? <CheckCircle className="w-5 h-5 shrink-0" />
                                    : <AlertCircle className="w-5 h-5 shrink-0" />
                                }
                                <div>
                                    <p className="uppercase tracking-widest text-[10px] mb-0.5 text-current/80">
                                        {feedback.type === "success" ? "MODEL SYNC SUCCESSFUL" : "SYNC FAILED"}
                                    </p>
                                    {feedback.message}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
