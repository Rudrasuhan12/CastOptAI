"use client";

import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { TrendingUp, Loader2, BarChart3 } from "lucide-react";

interface AnalyticsDataPoint {
  date?: string;
  value?: number;
  forecasted_demand?: number;
  predicted_value?: number;
  confidence_lower?: number;
  confidence_upper?: number;
  confidence_interval?: [number, number];
  trend_direction?: string;
  seasonality_factor?: number;
}

interface PredictiveAnalyticsProps {
  predictions?: AnalyticsDataPoint[];
  demandForecasts?: AnalyticsDataPoint[];
  loading?: boolean;
  onRun?: () => void;
}

function enrichWithDates(data: AnalyticsDataPoint[]): AnalyticsDataPoint[] {
  const today = new Date();
  return data.map((d, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i + 1);
    return {
      ...d,
      date: d.date || date.toISOString(),
      confidence_lower: d.confidence_lower ?? (d.confidence_interval ? d.confidence_interval[0] : undefined),
      confidence_upper: d.confidence_upper ?? (d.confidence_interval ? d.confidence_interval[1] : undefined),
    };
  });
}

export default function PredictiveAnalyticsPanel({
  predictions,
  demandForecasts,
  loading,
  onRun,
}: PredictiveAnalyticsProps) {

  const hasData = (predictions && predictions.length > 0) || (demandForecasts && demandForecasts.length > 0);
  const rawData = demandForecasts || predictions || [];
  const currentData = enrichWithDates(rawData);

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-3 bg-[#0F172A] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#FFCB05]" />
          <h3 className="text-[12px] font-extrabold text-white uppercase tracking-widest">Predictive Analytics</h3>
        </div>
        <div className="p-8 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#FFCB05] animate-spin" />
          <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider animate-pulse">
            Generating forecasts…
          </p>
          <div className="w-full space-y-2 mt-2">
            <div className="h-32 bg-[#F1F5F9] rounded-lg animate-pulse" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-12 bg-[#F1F5F9] rounded-lg animate-pulse" />
              <div className="h-12 bg-[#F1F5F9] rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="card overflow-hidden">
        <div className="px-5 py-3 bg-[#0F172A] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#FFCB05]" />
          <h3 className="text-[12px] font-extrabold text-white uppercase tracking-widest">Predictive Analytics</h3>
        </div>
        <div className="p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto">
            <BarChart3 className="w-6 h-6 text-[#94A3B8]" />
          </div>
          <p className="text-[13px] text-[#94A3B8] font-medium">Click below to generate demand forecasts</p>
          {onRun && (
            <button
              onClick={onRun}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-lg border border-[#0F172A] shadow-[3px_3px_0px_#CBD5E1] hover:shadow-[1px_1px_0px_#CBD5E1] transition-all duration-200"
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#FFCB05]" />
              Run Predictive Analytics
            </button>
          )}
        </div>
      </div>
    );
  }

  const avgForecast = currentData.length > 0
    ? currentData.reduce((sum, d) => sum + (d.forecasted_demand ?? d.predicted_value ?? 0), 0) / currentData.length
    : 0;

  const risingCount = currentData.filter(d => d.trend_direction === 'increasing').length;
  const fallingCount = currentData.filter(d => d.trend_direction === 'decreasing').length;
  const trend = risingCount > currentData.length / 2 ? "Rising" : fallingCount > currentData.length / 2 ? "Falling" : "Stable";
  const trendColor = trend === "Rising" ? "#10B981" : trend === "Falling" ? "#EF4444" : "#F59E0B";
  const trendIcon = trend === "Rising" ? "↗" : trend === "Falling" ? "↘" : "→";

  const values = currentData.map(d => d.forecasted_demand ?? d.predicted_value ?? 0);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const volatility = maxValue > 0 ? (((maxValue - minValue) / maxValue) * 100) : 0;

  const chartData = currentData.map((d, i) => ({
    ...d,
    dayIndex: i + 1,
    dayLabel: new Date(d.date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-3 bg-[#0F172A] flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[#FFCB05]" />
        <h3 className="text-[12px] font-extrabold text-white uppercase tracking-widest">Predictive Analytics</h3>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-xl p-3 border border-[#E2E8F0] text-center">
            <p className="text-[8px] font-bold text-[#94A3B8] uppercase tracking-wider">Avg Forecast</p>
            <p className="text-[18px] font-extrabold text-[#0F172A] font-mono-data leading-tight">{avgForecast.toFixed(0)}</p>
          </div>
          <div className="rounded-xl p-3 border text-center" style={{ background: `${trendColor}08`, borderColor: `${trendColor}30` }}>
            <p className="text-[8px] font-bold text-[#94A3B8] uppercase tracking-wider">Trend</p>
            <p className="text-[18px] font-extrabold font-mono-data leading-tight" style={{ color: trendColor }}>
              {trendIcon} {trend}
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-xl p-3 border border-[#E2E8F0] text-center">
            <p className="text-[8px] font-bold text-[#94A3B8] uppercase tracking-wider">Volatility</p>
            <p className="text-[18px] font-extrabold text-[#0F172A] font-mono-data leading-tight">{volatility.toFixed(1)}%</p>
          </div>
        </div>

        <div className="h-56 mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="predAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFCB05" stopOpacity={0.35} />
                  <stop offset="50%" stopColor="#FFCB05" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#FFCB05" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="confUpperGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="dayIndex"
                tick={{ fontSize: 9, fill: "#94A3B8", fontWeight: 600 }}
                stroke="#CBD5E1"
                axisLine={{ strokeWidth: 1.5 }}
                interval={Math.max(0, Math.floor(chartData.length / 8) - 1)}
                tickFormatter={(v) => {
                  const item = chartData[v - 1];
                  return item ? item.dayLabel : `D${v}`;
                }}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#94A3B8", fontWeight: 600 }}
                stroke="#CBD5E1"
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "10px", border: "1px solid #E2E8F0",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)", fontSize: 11,
                  fontWeight: 700, padding: "8px 12px", background: "#fff"
                }}
                formatter={(v: any, name?: string) => [Number(v).toFixed(1), name || 'Value']}
                labelFormatter={(v) => {
                  const item = chartData[Number(v) - 1];
                  return item ? item.dayLabel : `Day ${v}`;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 9, fontWeight: 800, paddingTop: "8px" }}
                iconType="circle"
                iconSize={6}
              />

              <Area
                name="Confidence Upper"
                type="monotone"
                dataKey="confidence_upper"
                stroke="#3B82F6"
                fill="url(#confUpperGrad)"
                strokeDasharray="4 3"
                strokeWidth={1}
                dot={false}
                legendType="none"
              />
              <Area
                name="Confidence Lower"
                type="monotone"
                dataKey="confidence_lower"
                stroke="#3B82F6"
                fill="none"
                strokeDasharray="4 3"
                strokeWidth={1}
                dot={false}
                legendType="none"
              />

              <Area
                name="Demand Forecast"
                type="monotone"
                dataKey="forecasted_demand"
                stroke="#FFCB05"
                fill="url(#predAreaGrad)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#FFCB05", stroke: "#0F172A", strokeWidth: 2 }}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {onRun && (
          <button
            onClick={onRun}
            className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-[11px] font-extrabold uppercase tracking-wider rounded-lg border border-[#0F172A] shadow-[3px_3px_0px_#CBD5E1] hover:shadow-[1px_1px_0px_#CBD5E1] transition-all duration-200"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#FFCB05]" />
            Re-Run Predictive Analytics
          </button>
        )}
      </div>
    </div>
  );
}