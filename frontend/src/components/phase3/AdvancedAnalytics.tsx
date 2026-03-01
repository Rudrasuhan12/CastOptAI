"use client";

import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, Legend,
  PieChart, Pie, RadialBarChart, RadialBar,
} from "recharts";
import { Crosshair, Loader2, Lightbulb, Layers, Activity } from "lucide-react";

interface Insight {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  recommendations: string[];
  data_points: Record<string, any>;
}

interface ClusterItem {
  size: number;
  avg_values: Record<string, number>;
  characteristics: string;
}

interface ClusterResponse {
  clusters?: Record<string, ClusterItem>;
  n_clusters?: number;
  feature_importance?: string[];
}

interface AdvancedAnalyticsProps {
  insights?: Insight[];
  clusters?: ClusterResponse;
  performanceReport?: Record<string, any>;
  loading?: boolean;
  onRun?: () => void;
}

const CHART_COLORS = ["#FFCB05", "#0F172A", "#3B82F6", "#10B981", "#8B5CF6", "#EF4444"];

export default function AdvancedAnalyticsPanel({
  insights,
  clusters,
  performanceReport,
  loading,
  onRun,
}: AdvancedAnalyticsProps) {
  const [analysisType, setAnalysisType] = useState<'insights' | 'clusters' | 'performance'>('insights');

  const hasData = (insights && insights.length > 0) || clusters || performanceReport;

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-3 bg-[#0F172A] flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-[#FFCB05]" />
          <h3 className="text-[12px] font-extrabold text-white uppercase tracking-widest">Advanced Analytics</h3>
        </div>
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#FFCB05] animate-spin" />
          <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider animate-pulse">
            Analyzing patterns…
          </p>
          <div className="w-full space-y-2 mt-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-[#F1F5F9] rounded-lg animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-3 bg-[#0F172A] flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-[#FFCB05]" />
          <h3 className="text-[12px] font-extrabold text-white uppercase tracking-widest">Advanced Analytics</h3>
        </div>
        <div className="p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto">
            <Activity className="w-6 h-6 text-[#94A3B8]" />
          </div>
          <p className="text-[13px] text-[#94A3B8] font-medium">Click below to analyze patterns & performance</p>
          {onRun && (
            <button
              onClick={onRun}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-lg border border-[#0F172A] shadow-[3px_3px_0px_#CBD5E1] hover:shadow-[1px_1px_0px_#CBD5E1] transition-all duration-200"
            >
              <Crosshair className="w-3.5 h-3.5 text-[#FFCB05]" />
              Run Advanced Analytics
            </button>
          )}
        </div>
      </div>
    );
  }

  // The API returns { clusters: { cluster_0: {...} }, n_clusters, feature_importance }
  const actualClusters: Record<string, ClusterItem> | undefined = clusters?.clusters;
  const nClusters = clusters?.n_clusters ?? 0;

  const clusterChartData = actualClusters
    ? Object.entries(actualClusters).map(([key, cluster], idx) => ({
      name: `C${idx + 1}`,
      fullName: key.replace(/_/g, ' '),
      size: cluster.size,
      avg_cost: Math.round(cluster.avg_values?.cost || 0),
      avg_strength: Number((cluster.avg_values?.predicted_strength || 0).toFixed(1)),
      fill: CHART_COLORS[idx % CHART_COLORS.length],
    }))
    : [];

  const pieData = actualClusters
    ? Object.entries(actualClusters).map(([key, cluster], idx) => ({
      name: `Cluster ${idx + 1}`,
      value: cluster.size,
      fill: CHART_COLORS[idx % CHART_COLORS.length],
    }))
    : [];

  const totalProjects = pieData.reduce((sum, c) => sum + c.value, 0);

  const severityColors: Record<string, { bg: string; border: string; badge: string; badgeText: string; icon: string }> = {
    high: { bg: "bg-red-50", border: "border-l-red-500", badge: "bg-red-100", badgeText: "text-red-700", icon: "🔴" },
    medium: { bg: "bg-amber-50", border: "border-l-amber-500", badge: "bg-amber-100", badgeText: "text-amber-700", icon: "🟡" },
    low: { bg: "bg-emerald-50", border: "border-l-emerald-500", badge: "bg-emerald-100", badgeText: "text-emerald-700", icon: "🟢" },
  };

  // Determine which tab to auto-select based on available data
  // Always respect the user's tab selection — no auto-redirect

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 bg-[#0F172A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-[#FFCB05]" />
          <h3 className="text-[12px] font-extrabold text-white uppercase tracking-widest">Advanced Analytics</h3>
        </div>
        <div className="flex gap-1">
          {([
            { id: "insights" as const, label: "Patterns", icon: Lightbulb, hasData: insights && insights.length > 0 },
            { id: "clusters" as const, label: "Clusters", icon: Layers, hasData: !!actualClusters },
            { id: "performance" as const, label: "Report", icon: Activity, hasData: !!performanceReport },
          ]).map((t) => {
            const Icon = t.icon;
            const isActive = analysisType === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setAnalysisType(t.id)}
                className={`flex items-center gap-1 px-2 py-1 text-[9px] font-bold uppercase rounded-md transition-all ${isActive
                  ? "bg-[#FFCB05] text-[#0F172A] shadow-sm"
                  : t.hasData
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-[#94A3B8] hover:text-white/60"
                  }`}
              >
                <Icon className="w-3 h-3" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="p-5">

        {analysisType === 'insights' && insights && insights.length > 0 && (
          <div className="space-y-3">
            {insights.map((insight, idx) => {
              const colors = severityColors[insight.severity] || severityColors.low;
              return (
                <div key={idx} className={`border-l-4 ${colors.border} ${colors.bg} rounded-r-xl pl-4 pr-4 py-3 transition-all duration-300 hover:shadow-md`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{colors.icon}</span>
                      <h5 className="text-[12px] font-extrabold text-[#0F172A]">{insight.title}</h5>
                    </div>
                    <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-full ${colors.badge} ${colors.badgeText}`}>
                      {insight.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#64748B] leading-relaxed">{insight.description}</p>
                  {insight.recommendations.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {insight.recommendations.map((rec, i) => (
                        <li key={i} className="text-[10px] text-[#64748B] flex items-start gap-1.5 leading-relaxed">
                          <span className="text-[#FFCB05] mt-0.5 font-bold">→</span> {rec}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {analysisType === 'insights' && (!insights || insights.length === 0) && (
          <div className="text-center py-8">
            <Lightbulb className="w-8 h-8 text-[#E2E8F0] mx-auto mb-2" />
            <p className="text-[12px] text-[#94A3B8] font-medium">No pattern insights detected yet</p>
            <p className="text-[10px] text-[#CBD5E1] mt-1">Run more optimizations to generate pattern data</p>
          </div>
        )}

        {analysisType === 'clusters' && actualClusters && Object.keys(actualClusters).length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4 bg-[#F8FAFC] rounded-lg p-3 border border-[#E2E8F0]">
              <div>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase">Project Clusters</p>
                <p className="text-[16px] font-extrabold text-[#0F172A]">{nClusters} Clusters · {totalProjects} Projects</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                      strokeWidth={2}
                      stroke="#fff"
                      animationDuration={1000}
                      animationEasing="ease-out"
                      label={({ name, percent }: any) => `${name || ''} (${((percent ?? 0) * 100).toFixed(0)}%)`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px", border: "1px solid #E2E8F0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 10,
                        fontWeight: 700, padding: "6px 10px"
                      }}
                      formatter={(v: any) => [`${v} projects`]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-48">
                {Object.entries(actualClusters).map(([key, cluster], idx) => (
                  <div key={key} className="bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] rounded-lg p-3 border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all hover:shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                      <h5 className="text-[11px] font-extrabold text-[#0F172A]">Cluster {idx + 1}</h5>
                      <span className="text-[9px] font-bold text-[#94A3B8] ml-auto">{cluster.size} projects</span>
                    </div>
                    <div className="ml-5 grid grid-cols-2 gap-x-3 gap-y-0.5">
                      {cluster.avg_values?.cost !== undefined && (
                        <span className="text-[9px] font-mono-data text-[#64748B]">Cost: ₹{cluster.avg_values.cost.toFixed(0)}</span>
                      )}
                      {cluster.avg_values?.predicted_strength !== undefined && (
                        <span className="text-[9px] font-mono-data text-[#10B981]">Str: {cluster.avg_values.predicted_strength.toFixed(1)} MPa</span>
                      )}
                      {cluster.avg_values?.target_strength !== undefined && (
                        <span className="text-[9px] font-mono-data text-[#64748B]">Target: {cluster.avg_values.target_strength.toFixed(0)} MPa</span>
                      )}
                      {cluster.avg_values?.target_time !== undefined && (
                        <span className="text-[9px] font-mono-data text-[#64748B]">Time: {cluster.avg_values.target_time.toFixed(0)}h</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {clusterChartData.length > 0 && (
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clusterChartData} margin={{ top: 8, right: 8, left: -10, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 6" stroke="#E2E8F0" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }}
                      stroke="#CBD5E1"
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 9, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px", border: "1px solid #E2E8F0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 10,
                        fontWeight: 700, padding: "8px 12px"
                      }}
                      labelFormatter={(label) => {
                        const item = clusterChartData.find(c => c.name === label);
                        return item ? item.fullName : label;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 9, fontWeight: 700 }} iconType="circle" iconSize={6} />
                    <Bar name="Projects" dataKey="size" radius={[6, 6, 0, 0]} animationDuration={800}>
                      {clusterChartData.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                    <Bar name="Avg Cost (₹)" dataKey="avg_cost" fill="#94A3B8" radius={[6, 6, 0, 0]} animationDuration={1000} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {analysisType === 'clusters' && (!actualClusters || Object.keys(actualClusters).length === 0) && (
          <div className="text-center py-8">
            <Layers className="w-8 h-8 text-[#E2E8F0] mx-auto mb-2" />
            <p className="text-[12px] text-[#94A3B8] font-medium">No cluster data available</p>
          </div>
        )}

        {analysisType === 'performance' && performanceReport && (
          <div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-xl p-3 border border-[#E2E8F0] text-center">
                <p className="text-[8px] font-bold text-[#94A3B8] uppercase tracking-wider">Total Runs</p>
                <p className="text-[20px] font-extrabold text-[#0F172A] font-mono-data leading-tight">{performanceReport.summary?.total_optimizations || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-[#F0FDF4] rounded-xl p-3 border border-[#10B981]/20 text-center">
                <p className="text-[8px] font-bold text-[#10B981] uppercase tracking-wider">Avg Savings</p>
                <p className="text-[20px] font-extrabold text-[#10B981] font-mono-data leading-tight">{performanceReport.efficiency_metrics?.avg_savings_percent?.toFixed(1) || 0}%</p>
              </div>
              <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-xl p-3 border border-[#E2E8F0] text-center">
                <p className="text-[8px] font-bold text-[#94A3B8] uppercase tracking-wider">₹/MPa</p>
                <p className="text-[20px] font-extrabold text-[#0F172A] font-mono-data leading-tight">₹{performanceReport.efficiency_metrics?.avg_cost_per_strength?.toFixed(0) || 0}</p>
              </div>
            </div>

            {performanceReport.trends && performanceReport.trends.length > 0 && (
              <div className="space-y-2 mb-4">
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Trend Analysis</p>
                {performanceReport.trends.map((t: any, i: number) => (
                  <div key={i} className="flex items-center justify-between bg-[#F8FAFC] rounded-lg p-2.5 border border-[#E2E8F0]">
                    <span className="text-[10px] font-bold text-[#0F172A] capitalize">{t.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold ${t.trend_direction === 'improving' ? 'text-emerald-600' : t.trend_direction === 'declining' ? 'text-red-600' : 'text-amber-600'}`}>
                        {t.trend_direction === 'improving' ? '↗' : t.trend_direction === 'declining' ? '↘' : '→'} {t.trend_direction}
                      </span>
                      <span className="text-[9px] font-mono-data text-[#94A3B8]">{(t.confidence * 100).toFixed(0)}% conf</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {performanceReport.efficiency_metrics && (
              <div className="h-36 mb-3">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="30%" outerRadius="85%"
                    data={[
                      { name: "Savings %", value: performanceReport.efficiency_metrics.avg_savings_percent || 0, fill: "#10B981" },
                      { name: "₹/MPa Eff.", value: Math.min(100, (performanceReport.efficiency_metrics.avg_cost_per_strength || 0) / 10), fill: "#FFCB05" },
                    ]}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      dataKey="value"
                      cornerRadius={8}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px", border: "1px solid #E2E8F0",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)", fontSize: 10,
                        fontWeight: 700, padding: "6px 10px"
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 9, fontWeight: 700 }}
                      iconType="circle"
                      iconSize={6}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            )}

            {performanceReport.recommendations && performanceReport.recommendations.length > 0 && (
              <div className="bg-gradient-to-r from-[#FEF3C7] to-[#FFFBEB] rounded-xl p-3 border border-[#FDE68A]">
                <p className="text-[10px] font-bold text-[#92400E] uppercase mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3 h-3" /> Recommendations
                </p>
                <ul className="space-y-1">
                  {performanceReport.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-[11px] text-[#78350F] flex items-start gap-1.5 leading-relaxed">
                      <span className="text-[#FFCB05] mt-0.5 font-bold">→</span> {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {analysisType === 'performance' && !performanceReport && (
          <div className="text-center py-8">
            <Activity className="w-8 h-8 text-[#E2E8F0] mx-auto mb-2" />
            <p className="text-[12px] text-[#94A3B8] font-medium">No performance data available</p>
          </div>
        )}

        {onRun && (
          <button
            onClick={onRun}
            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-lg border border-[#0F172A] shadow-[3px_3px_0px_#CBD5E1] hover:shadow-[1px_1px_0px_#CBD5E1] transition-all duration-200"
          >
            <Crosshair className="w-3.5 h-3.5 text-[#FFCB05]" />
            {hasData ? "Re-Run" : "Run"} Advanced Analytics
          </button>
        )}
      </div>
    </div>
  );
}