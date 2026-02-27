"use client";

import React from "react";

interface ConfidenceGaugeProps {
  score: number;
  size?: number;
}

export default function ConfidenceGauge({ score, size = 160 }: ConfidenceGaugeProps) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  const getColor = () => {
    if (score >= 85) return "#10B981";
    if (score >= 70) return "#FFCB05";
    if (score >= 55) return "#F59E0B";
    return "#EF4444";
  };

  const getLabel = () => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 55) return "Fair";
    return "Low";
  };

  const color = getColor();

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <h3 className="text-[12px] font-extrabold text-[#0F172A] uppercase tracking-widest text-center">
          AI Engine Confidence
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center p-6">
        <div className="relative" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">

            <circle
              cx={center} cy={center} r={radius}
              stroke="#F1F5F9" strokeWidth={strokeWidth} fill="none"
            />

            <circle
              cx={center} cy={center} r={radius}
              stroke="#E2E8F0" strokeWidth={1} fill="none"
              strokeDasharray="2 8"
            />

            <circle
              cx={center} cy={center} r={radius}
              stroke={color} strokeWidth={strokeWidth - 2} fill="none"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold font-mono-data tracking-tighter text-[#0F172A]">
              {score}<span className="text-[14px] text-[#94A3B8]">%</span>
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.15em] mt-1"
              style={{ color }}
            >
              {getLabel()}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-[10px] text-[#94A3B8] font-bold">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            Model Accuracy
          </span>
          <span className="font-mono-data">{score}% reliable</span>
        </div>
      </div>
    </div>
  );
}
