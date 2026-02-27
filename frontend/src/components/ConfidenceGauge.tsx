"use client";

import React from "react";

interface ConfidenceGaugeProps {
  score: number;
  size?: number;
}

export default function ConfidenceGauge({ score, size = 140 }: ConfidenceGaugeProps) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const center = size / 2;

  const getColor = () => {
    if (score >= 80) return { stroke: "#059669", text: "#059669" };
    if (score >= 60) return { stroke: "#D97706", text: "#D97706" };
    return { stroke: "#DC2626", text: "#DC2626" };
  };

  const colors = getColor();

  return (
    <div className="flex flex-col items-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={center} cy={center} r={radius}
          stroke="#EDE9E0" strokeWidth="7" fill="none" />
        <circle cx={center} cy={center} r={radius}
          stroke={colors.stroke} strokeWidth="7" fill="none"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ width: size, height: size }}>
        <span className="text-xl font-extrabold font-mono-data" style={{ color: colors.text }}>
          {score}%
        </span>
        <span className="label text-[7px]">Confidence</span>
      </div>
    </div>
  );
}
