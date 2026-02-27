"use client";

import React from "react";
import {
    Cloud,
    Droplets,
    Thermometer,
    Brain,
    MapPin,
    Clock,
    Target,
    Crosshair,
    Loader2,
} from "lucide-react";
import type { WeatherData } from "@/types";

const CITIES = [
    "Delhi", "Mumbai", "Chennai", "Kolkata",
    "Bangalore", "Hyderabad", "Pune", "Ahmedabad",
];

interface InputPanelProps {
    city: string;
    targetTime: number;
    targetStrength: number;
    weather: WeatherData;
    weatherLoading: boolean;
    loading: boolean;
    error: string;
    onCityChange: (city: string) => void;
    onTargetTimeChange: (time: number) => void;
    onTargetStrengthChange: (strength: number) => void;
    onOptimize: () => void;
}

export default function InputPanel({
    city,
    targetTime,
    targetStrength,
    weather,
    weatherLoading,
    loading,
    error,
    onCityChange,
    onTargetTimeChange,
    onTargetStrengthChange,
    onOptimize,
}: InputPanelProps) {
    return (
        <div className="lg:col-span-3 no-print animate-slide-left">
            <div className="card p-5 sticky top-4">
                <h3 className="text-[13px] font-bold mb-5 flex items-center gap-2 text-[#1C1917]">
                    <Crosshair className="w-4 h-4 text-[#0D9488]" />
                    Project Parameters
                </h3>

                {/* City */}
                <div className="mb-4">
                    <label className="label flex items-center gap-1.5 mb-2">
                        <MapPin className="w-3 h-3" /> Project Location
                    </label>
                    <select
                        className="input-field"
                        value={city}
                        onChange={(e) => onCityChange(e.target.value)}
                    >
                        <option value="">Select City...</option>
                        {CITIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* Weather */}
                <div className="mb-4 rounded-lg border border-[#DDD8CE] bg-[#F5F2EC] overflow-hidden">
                    <div className="px-3.5 py-3">
                        <p className="label flex items-center gap-1.5 mb-2.5">
                            <Cloud className="w-3 h-3" /> Live Weather
                        </p>
                        {weather.temp !== null ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Thermometer className="w-4 h-4 text-[#D97706]" />
                                        <span className="text-xl font-extrabold text-[#1C1917] font-mono-data">{weather.temp}°C</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <Droplets className="w-3 h-3 text-[#0D9488]" />
                                        <span className="text-[11px] font-medium text-[#78716C] font-mono-data">{weather.humidity}%</span>
                                    </div>
                                    <p className="text-[10px] text-[#A8A29E] mt-1 capitalize">{weather.desc}</p>
                                </div>
                                <Cloud className="w-10 h-10 text-[#DDD8CE]" />
                            </div>
                        ) : (
                            <p className="text-[11px] text-[#A8A29E]">
                                {weatherLoading ? (
                                    <span className="flex items-center gap-1.5">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Fetching...
                                    </span>
                                ) : "Select a city above"}
                            </p>
                        )}
                    </div>
                </div>

                {/* Cycle Time */}
                <div className="mb-4">
                    <label className="flex items-center justify-between mb-2">
                        <span className="label flex items-center gap-1.5">
                            <Clock className="w-3 h-3" /> Target Cycle Time
                        </span>
                        <span className="text-[12px] font-bold text-[#0D9488] bg-[#CCFBF1] px-2 py-0.5 rounded font-mono-data">
                            {targetTime}h
                        </span>
                    </label>
                    <input
                        type="range"
                        min="4"
                        max="72"
                        value={targetTime}
                        onChange={(e) => onTargetTimeChange(parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-[9px] text-[#A8A29E] mt-1 font-mono-data">
                        <span>4h</span>
                        <span>72h</span>
                    </div>
                </div>

                {/* Strength */}
                <div className="mb-5">
                    <label className="flex items-center justify-between mb-2">
                        <span className="label flex items-center gap-1.5">
                            <Target className="w-3 h-3" /> Target Strength
                        </span>
                        <span className="text-[12px] font-bold text-[#0D9488] bg-[#CCFBF1] px-2 py-0.5 rounded font-mono-data">
                            {targetStrength} MPa
                        </span>
                    </label>
                    <input
                        type="range"
                        min="10"
                        max="60"
                        value={targetStrength}
                        onChange={(e) => onTargetStrengthChange(parseInt(e.target.value))}
                        className="w-full"
                    />
                    <div className="flex justify-between text-[9px] text-[#A8A29E] mt-1 font-mono-data">
                        <span>10 MPa</span>
                        <span>60 MPa</span>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-600 font-medium animate-scale-in">
                        {error}
                    </div>
                )}

                {/* Optimize */}
                <button
                    onClick={onOptimize}
                    disabled={loading}
                    className="btn-primary w-full"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Simulating Recipes...
                        </>
                    ) : (
                        <>
                            <Brain className="w-4 h-4" />
                            Optimize Strategy
                        </>
                    )}
                </button>

                {/* Status */}
                <div className="flex items-center justify-center gap-2 mt-3 text-[10px] text-[#A8A29E]">
                    <span className="status-dot status-dot-green" />
                    AI Engine Active
                </div>
            </div>
        </div>
    );
}
