"use client";

import React, { useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

interface ObjectiveWeights {
  cost: number;
  time: number;
  strength: number;
  environmental: number;
}

interface ParetoSolution {
  id: number;
  recipe: {
    cement: number;
    chemicals: number;
    steam_hours: number;
    water: number;
  };
  cost: number;
  strength_score: number;
  environmental_score: number;
  time_score: number;
  constraints_satisfied: boolean;
}

interface ParetoOptimizerProps {
  onOptimize: (weights: ObjectiveWeights) => void;
  paretoData?: ParetoSolution[];
}

export default function ParetoOptimizerPanel({ onOptimize, paretoData }: ParetoOptimizerProps) {
  const [weights, setWeights] = useState<ObjectiveWeights>({
    cost: 0.4,
    time: 0.3,
    strength: 0.2,
    environmental: 0.1
  });

  const handleWeightChange = (key: keyof ObjectiveWeights, val: number) => {
    const newWeights = { ...weights, [key]: val };
    const total = Object.values(newWeights).reduce((sum, v) => sum + v, 0);
    if (total > 0) {
      setWeights({
        cost: newWeights.cost / total,
        time: newWeights.time / total,
        strength: newWeights.strength / total,
        environmental: newWeights.environmental / total
      });
    }
  };

  const sliders = [
    { key: "cost" as const, label: "Cost Priority", color: "#0F172A" },
    { key: "time" as const, label: "Time Priority", color: "#3B82F6" },
    { key: "strength" as const, label: "Strength", color: "#10B981" },
    { key: "environmental" as const, label: "Environmental", color: "#22C55E" },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 bg-[#0F172A] flex items-center gap-2">
        <h3 className="text-[12px] font-extrabold text-white uppercase tracking-widest">Multi-Objective Optimization</h3>
      </div>
      <div className="p-5">
        <div className="space-y-3 mb-4">
          {sliders.map((s) => (
            <div key={s.key}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-bold text-[#64748B]">{s.label}</span>
                <span className="font-mono-data font-extrabold text-[#0F172A]">{weights[s.key].toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={weights[s.key]}
                onChange={(e) => handleWeightChange(s.key, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#E2E8F0] rounded-full appearance-none cursor-pointer accent-[#0F172A]"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => onOptimize(weights)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-lg shadow-[3px_3px_0px_#CBD5E1] hover:shadow-[1px_1px_0px_#CBD5E1] transition-all duration-200"
        >
          Find Pareto Optimal Solutions
        </button>

        {paretoData && paretoData.length > 0 && (
          <div className="mt-5">
            <h4 className="text-[10px] font-extrabold text-[#0F172A] uppercase tracking-wider mb-3">Pareto Frontier</h4>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="cost"
                    type="number"
                    tick={{ fontSize: 9, fill: "#94A3B8" }}
                    label={{ value: 'Cost (₹)', position: 'insideBottomRight', offset: -5, style: { fontSize: 9 } }}
                  />
                  <YAxis
                    dataKey="strength_score"
                    type="number"
                    tick={{ fontSize: 9, fill: "#94A3B8" }}
                    label={{ value: 'Strength', angle: -90, position: 'insideLeft', style: { fontSize: 9 } }}
                  />
                  <Tooltip />
                  <Scatter data={paretoData} fill="#FFCB05" stroke="#0F172A" strokeWidth={1} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(!paretoData || paretoData.length === 0) && (
          <p className="mt-4 text-[11px] text-[#94A3B8] text-center">Adjust priorities and click above to find optimal trade-offs</p>
        )}
      </div>
    </div>
  );
}