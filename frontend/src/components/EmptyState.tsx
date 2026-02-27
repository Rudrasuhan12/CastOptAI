"use client";

import React from "react";
import { Zap, ShieldCheck, Activity, BrainCircuit } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-assembly delay-200">

            <div className="relative w-32 h-32 mb-8 group cursor-pointer">

                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#CBD5E1] animate-[spin_20s_linear_infinite]" />


                <div className="absolute inset-2 rounded-full border border-[#E2E8F0] bg-white shadow-[0_4px_24px_rgba(15,23,42,0.06)] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    <BrainCircuit className="w-12 h-12 text-[#FFCB05] drop-shadow-[0_2px_4px_rgba(15,23,42,0.1)]" />
                </div>


                <div className="absolute bottom-3 right-3 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white shadow-sm flex items-center justify-center z-10">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-[#0F172A] mb-3 tracking-tight">AI Master Control Offline</h2>
            <p className="text-[13px] text-[#64748B] max-w-sm mx-auto mb-10 leading-relaxed font-medium">
                Configure your project boundaries and initiate the quantum optimization engine to assemble AI-driven mix designs.
            </p>

            <div className="flex items-center gap-4 justify-center">
                {[
                    { icon: Zap, text: "Multi-Strategy AI", delay: "delay-300" },
                    { icon: ShieldCheck, text: "94% Confidence", delay: "delay-400" },
                    { icon: Activity, text: "Live Telemetry", delay: "delay-500" },
                ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className={`animate-assembly ${item.delay} flex items-center gap-2 bg-white border border-[#E2E8F0] px-4 py-2 rounded-lg shadow-[2px_2px_0px_#E2E8F0]`}>
                            <Icon className="w-4 h-4 text-[#0F172A]" />
                            <span className="text-[11px] font-bold text-[#0F172A] tracking-wide">{item.text}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
