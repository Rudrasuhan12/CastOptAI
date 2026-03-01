"use client";

import React from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";

interface RiskAssessmentProps {
  riskData?: any;
  loading?: boolean;
  onAnalyze?: () => void;
}

export default function RiskAssessmentPanel({ riskData, loading, onAnalyze }: RiskAssessmentProps) {

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-3 bg-[#0F172A] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#FFCB05]" />
          <h3 className="text-[12px] font-extrabold text-white uppercase tracking-widest">Risk Assessment</h3>
        </div>
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#FFCB05] animate-spin" />
          <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider animate-pulse">
            Analyzing risk vectors…
          </p>
          <div className="w-full space-y-2 mt-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-3 bg-[#E2E8F0] rounded-full animate-pulse" style={{ width: `${60 + i * 8}%` }} />
                <div className="h-3 w-10 bg-[#E2E8F0] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!riskData) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-3 bg-[#0F172A] flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#FFCB05]" />
          <h3 className="text-[12px] font-extrabold text-white uppercase tracking-widest">Risk Assessment</h3>
        </div>
        <div className="p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6 text-[#94A3B8]" />
          </div>
          <p className="text-[13px] text-[#94A3B8] font-medium">Click below to assess risk profile</p>
          {onAnalyze && (
            <button
              onClick={onAnalyze}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-lg border border-[#0F172A] shadow-[3px_3px_0px_#CBD5E1] hover:shadow-[1px_1px_0px_#CBD5E1] transition-all duration-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFCB05]" />
              Analyze Risk Profile
            </button>
          )}
        </div>
      </div>
    );
  }

  const { risk_assessment, monte_carlo_results, emergency_triggers } = riskData;

  const riskItems = [
    { label: "Strength Risk", value: risk_assessment?.strength_risk, color: "#EF4444" },
    { label: "Cost Risk", value: risk_assessment?.cost_risk, color: "#F59E0B" },
    { label: "Time Risk", value: risk_assessment?.time_risk, color: "#3B82F6" },
    { label: "Quality Risk", value: risk_assessment?.quality_risk, color: "#8B5CF6" },
  ];

  const radarData = riskItems.map(item => ({
    subject: item.label.replace(' Risk', ''),
    value: item.value || 0,
    fullMark: 100,
  }));

  const overallRisk = risk_assessment?.overall_risk ?? 0;
  const successProb = (monte_carlo_results?.probability_of_success ?? 0) * 100;

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 bg-[#0F172A] flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-[#FFCB05]" />
        <h3 className="text-[12px] font-extrabold text-white uppercase tracking-widest">Risk Assessment</h3>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`rounded-xl p-3 border text-center transition-all duration-500 ${overallRisk > 50 ? 'bg-red-50 border-red-300' : overallRisk > 20 ? 'bg-amber-50 border-amber-300' : 'bg-emerald-50 border-emerald-300'
            }`}>
            <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Overall Risk</p>
            <p className={`text-[22px] font-extrabold font-mono-data leading-tight ${overallRisk > 50 ? 'text-red-600' : overallRisk > 20 ? 'text-amber-600' : 'text-emerald-600'
              }`}>
              {overallRisk.toFixed(1)}%
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-300 text-center">
            <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">Success Probability</p>
            <p className="text-[22px] font-extrabold text-emerald-600 font-mono-data leading-tight">
              {successProb.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="h-48 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#E2E8F0" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fontSize: 8, fill: "#94A3B8" }}
                axisLine={false}
              />
              <Radar
                name="Risk Score"
                dataKey="value"
                stroke="#EF4444"
                fill="#EF4444"
                fillOpacity={0.15}
                strokeWidth={2}
                dot={{ r: 4, fill: "#EF4444", stroke: "#fff", strokeWidth: 2 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px", border: "1px solid #E2E8F0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 11,
                  fontWeight: 700, padding: "6px 10px"
                }}
                formatter={(v: any) => [`${Number(v).toFixed(1)}%`, "Risk"]}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {riskItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#64748B]">{item.label}</span>
              <div className="flex items-center gap-2">
                <div className="w-28 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(100, item.value || 0)}%`, backgroundColor: item.color }}
                  />
                </div>
                <span className="text-[11px] font-extrabold font-mono-data text-[#0F172A] w-10 text-right">
                  {item.value?.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {emergency_triggers && emergency_triggers.recommended_actions?.length > 0 && (
          <div className="mt-4 bg-[#FEF3C7] rounded-lg p-3 border border-[#FDE68A]">
            <p className="text-[10px] font-bold text-[#92400E] uppercase mb-1">⚠️ Emergency Actions</p>
            <ul className="space-y-0.5">
              {emergency_triggers.recommended_actions.map((action: string, idx: number) => (
                <li key={idx} className="text-[10px] text-[#78350F] flex items-start gap-1">
                  <span className="text-[#FFCB05] mt-0.5">•</span> {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {onAnalyze && (
          <button
            onClick={onAnalyze}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-lg border border-[#0F172A] shadow-[3px_3px_0px_#CBD5E1] hover:shadow-[1px_1px_0px_#CBD5E1] transition-all duration-200"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#FFCB05]" />
            Re-Analyze Risk Profile
          </button>
        )}
      </div>
    </div>
  );
}