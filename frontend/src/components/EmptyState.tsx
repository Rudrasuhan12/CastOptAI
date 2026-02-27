"use client";

import React from "react";
import { Brain, ChevronRight, Zap, Shield, Activity } from "lucide-react";

export default function EmptyState() {
    return (
        <div className="card flex flex-col items-center justify-center min-h-[480px] text-center animate-scale-in">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#F5F2EC] border border-[#DDD8CE] flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-[#0D9488]" />
            </div>

            {/* Text */}
            <h3 className="text-lg font-bold text-[#1C1917] mb-2">
                Ready to Optimize
            </h3>
            <p className="text-[13px] text-[#78716C] max-w-sm leading-relaxed">
                Enter your project parameters and click{" "}
                <span className="font-bold text-[#0D9488]">Optimize Strategy</span>{" "}
                to get AI-powered mix design recommendations.
            </p>

            {/* Feature chips */}
            <div className="flex items-center gap-2 mt-6">
                {[
                    { icon: Zap, label: "3 AI Strategies" },
                    { icon: Shield, label: "94%+ Confidence" },
                    { icon: Activity, label: "Real-time Results" },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.label}
                            className="flex items-center gap-1.5 text-[11px] font-semibold text-[#78716C] bg-[#F5F2EC] border border-[#DDD8CE] rounded-full px-3 py-1.5"
                        >
                            <Icon className="w-3 h-3 text-[#0D9488]" />
                            {item.label}
                        </div>
                    );
                })}
            </div>

            {/* Status */}
            <div className="flex items-center gap-1.5 mt-6 text-[10px] text-[#A8A29E]">
                <span className="status-dot status-dot-green" />
                AI Model Ready
                <ChevronRight className="w-3 h-3" />
                Multi-Strategy Engine
            </div>
        </div>
    );
}
