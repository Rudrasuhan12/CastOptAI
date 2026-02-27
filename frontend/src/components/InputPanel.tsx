"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    MapPin,
    Cloud,
    Thermometer,
    Droplets,
    Clock,
    Target,
    Zap,
    AlertCircle,
    Loader2,
    ChevronDown,
    Search,
} from "lucide-react";
import type { WeatherData } from "@/types";

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

interface GeoResult {
    name: string;
    state?: string;
    country: string;
    lat: number;
    lon: number;
}

const POPULAR_CITIES = ["Delhi", "Mumbai", "Chennai", "Kolkata", "Bangalore", "Hyderabad", "Pune", "Ahmedabad"];

export default function InputPanel({
    city, targetTime, targetStrength, weather, weatherLoading, loading, error,
    onCityChange, onTargetTimeChange, onTargetStrengthChange, onOptimize,
}: InputPanelProps) {
    const [query, setQuery] = useState(city);
    const [results, setResults] = useState<GeoResult[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searching, setSearching] = useState(false);
    const [showPopular, setShowPopular] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setShowPopular(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);


    const searchPlaces = useCallback(async (q: string) => {
        if (q.length < 2) {
            setResults([]);
            return;
        }
        setSearching(true);
        try {
            const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "";
            if (!apiKey) {

                const filtered = POPULAR_CITIES.filter(c =>
                    c.toLowerCase().includes(q.toLowerCase())
                ).map(c => ({ name: c, country: "IN", lat: 0, lon: 0 }));
                setResults(filtered);
                setSearching(false);
                return;
            }
            const res = await fetch(
                `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=6&appid=${apiKey}`
            );
            const data: GeoResult[] = await res.json();
            setResults(data);
        } catch {
            setResults([]);
        }
        setSearching(false);
    }, []);

    const handleInputChange = (value: string) => {
        setQuery(value);
        setIsOpen(true);
        setShowPopular(false);


        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => searchPlaces(value), 350);
    };

    const handleSelect = (placeName: string) => {
        setQuery(placeName);
        onCityChange(placeName);
        setIsOpen(false);
        setShowPopular(false);
        setResults([]);
    };

    const handleInputFocus = () => {
        if (query.length >= 2) {
            setIsOpen(true);
        } else {
            setShowPopular(true);
        }
    };

    const toggleDropdown = () => {
        if (isOpen || showPopular) {
            setIsOpen(false);
            setShowPopular(false);
        } else {
            setShowPopular(true);
        }
    };

    return (
        <div className="lg:col-span-3 space-y-5 animate-assembly delay-100">
            <div className="card overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E2E8F0] bg-white flex justify-between items-center">
                    <h3 className="text-[13px] font-extrabold text-[#0F172A] flex items-center gap-2">
                        <Target className="w-4 h-4 text-[#FFCB05]" />
                        Parameter Matrix
                    </h3>
                    <span className="text-[9px] font-bold text-[#64748B] px-1.5 py-0.5 rounded border border-[#E2E8F0] uppercase tracking-widest">Input</span>
                </div>

                <div className="p-5 space-y-6">

                    <div ref={containerRef} className="relative">
                        <label className="label flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                            Project Location
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onFocus={handleInputFocus}
                                placeholder="Search any city..."
                                className="input-field w-full pr-10 text-[13px]"
                                autoComplete="off"
                            />
                            <button
                                type="button"
                                onClick={toggleDropdown}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded hover:bg-[#F1F5F9] transition-colors"
                            >
                                <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${(isOpen || showPopular) ? "rotate-180" : ""}`} />
                            </button>
                        </div>


                        {(isOpen && (results.length > 0 || searching)) && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-[3px_3px_0px_#E2E8F0] z-50 max-h-[240px] overflow-y-auto animate-scale-in">
                                {searching ? (
                                    <div className="flex items-center justify-center gap-2 px-4 py-3 text-[12px] text-[#64748B]">
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        Searching...
                                    </div>
                                ) : (
                                    results.map((r, i) => (
                                        <button
                                            key={`${r.name}-${r.country}-${i}`}
                                            onClick={() => handleSelect(r.name)}
                                            className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5 border-b border-[#F1F5F9] last:border-0 transition-colors"
                                        >
                                            <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                                            <span className="truncate">
                                                {r.name}
                                                {r.state && <span className="text-[#94A3B8]">, {r.state}</span>}
                                                <span className="text-[#94A3B8]"> — {r.country}</span>
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}


                        {showPopular && !isOpen && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E2E8F0] rounded-lg shadow-[3px_3px_0px_#E2E8F0] z-50 max-h-[260px] overflow-y-auto animate-scale-in">
                                <div className="px-4 py-2 border-b border-[#E2E8F0]">
                                    <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-widest flex items-center gap-1.5">
                                        <Search className="w-3 h-3" />
                                        Popular Locations
                                    </p>
                                </div>
                                {POPULAR_CITIES.map((c) => (
                                    <button
                                        key={c}
                                        onClick={() => handleSelect(c)}
                                        className="w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2.5 border-b border-[#F1F5F9] last:border-0 transition-colors"
                                    >
                                        <MapPin className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>


                    <div className="card-flat p-4 group hover:border-[#94A3B8]">
                        <label className="label flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <Cloud className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#0F172A] transition-colors" />
                                Live Telemetry
                            </span>
                            {weatherLoading && <Loader2 className="w-3 h-3 animate-spin text-[#0F172A]" />}
                        </label>
                        <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <Thermometer className="w-3.5 h-3.5 text-[#EF4444]" />
                                    <span className="text-lg font-extrabold text-[#0F172A] font-mono-data">
                                        {weather.temp !== null ? `${weather.temp}°` : "--"}
                                    </span>
                                </div>
                                <div className="h-6 w-px bg-[#CBD5E1]" />
                                <div className="flex items-center gap-1.5">
                                    <Droplets className="w-3.5 h-3.5 text-[#3B82F6]" />
                                    <span className="text-[13px] font-bold text-[#64748B] font-mono-data">
                                        {weather.humidity !== null ? `${weather.humidity}%` : "--"}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-[#64748B] capitalize text-right max-w-[80px] leading-tight">
                                {weather.desc}
                            </span>
                        </div>
                    </div>

                    <hr className="border-[#E2E8F0]" />


                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="label flex items-center gap-1.5 mb-0">
                                <Clock className="w-3.5 h-3.5 text-[#64748B]" />
                                Target Cycle Time
                            </label>
                            <span className="text-[11px] font-extrabold text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0] font-mono-data">
                                {targetTime}h
                            </span>
                        </div>
                        <input
                            type="range" min="4" max="72" step="1"
                            value={targetTime}
                            onChange={(e) => onTargetTimeChange(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-[#94A3B8] font-bold font-mono-data mt-2">
                            <span>4h</span>
                            <span>72h</span>
                        </div>
                    </div>


                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="label flex items-center gap-1.5 mb-0">
                                <Target className="w-3.5 h-3.5 text-[#64748B]" />
                                Demolding Strength
                            </label>
                            <span className="text-[11px] font-extrabold text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0] font-mono-data">
                                {targetStrength} MPa
                            </span>
                        </div>
                        <input
                            type="range" min="10" max="60" step="1"
                            value={targetStrength}
                            onChange={(e) => onTargetStrengthChange(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-[10px] text-[#94A3B8] font-bold font-mono-data mt-2">
                            <span>10 MPa</span>
                            <span>60 MPa</span>
                        </div>
                    </div>
                </div>


                <div className="p-5 bg-[#F8FAFC] border-t border-[#E2E8F0]">
                    <button
                        onClick={onOptimize}
                        disabled={loading}
                        className="btn-primary w-full h-12 text-[14px]"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Compiling AI Model...</>
                        ) : (
                            <><Zap className="w-5 h-5" /> Execute Optimization</>
                        )}
                    </button>
                    <p className="text-center text-[9px] text-[#64748B] font-bold tracking-widest uppercase mt-3 flex items-center justify-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                        Engine Ready
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-[#FEF2F2] border border-[#FECACA] text-[#EF4444] p-4 rounded-xl text-[12px] font-bold flex items-start gap-2 animate-scale-in shadow-[3px_3px_0px_#FECACA]">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}
