"use client";

import React from "react";
import Link from "next/link";
import {
    Activity,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Pause,
    ArrowRight,
    Thermometer,
    MapPin,
    Calendar,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const CASTINGS = [
    {
        id: "CST-2024-0847",
        product: "Precast Wall Panel — Type A",
        location: "Delhi NCR Yard",
        startTime: "2024-12-15 06:30",
        targetStrength: 25,
        currentStrength: 18.5,
        targetTime: 12,
        elapsedTime: 8,
        status: "curing",
        temp: 12,
        strategy: "Fastest",
    },
    {
        id: "CST-2024-0846",
        product: "Hollow Core Slab — 200mm",
        location: "Mumbai Yard",
        startTime: "2024-12-15 02:00",
        targetStrength: 30,
        currentStrength: 28.2,
        targetTime: 16,
        elapsedTime: 14,
        status: "curing",
        temp: 28,
        strategy: "Eco-Friendly",
    },
    {
        id: "CST-2024-0845",
        product: "Bridge Beam — Grade 40",
        location: "Chennai Yard",
        startTime: "2024-12-14 18:00",
        targetStrength: 40,
        currentStrength: 41.3,
        targetTime: 24,
        elapsedTime: 24,
        status: "completed",
        temp: 30,
        strategy: "Cheapest",
    },
    {
        id: "CST-2024-0844",
        product: "Column — 450x450",
        location: "Pune Yard",
        startTime: "2024-12-14 14:00",
        targetStrength: 35,
        currentStrength: 12.1,
        targetTime: 18,
        elapsedTime: 6,
        status: "paused",
        temp: 22,
        strategy: "Fastest",
    },
    {
        id: "CST-2024-0843",
        product: "Retaining Wall Segment",
        location: "Hyderabad Yard",
        startTime: "2024-12-14 08:00",
        targetStrength: 20,
        currentStrength: 21.0,
        targetTime: 12,
        elapsedTime: 12,
        status: "completed",
        temp: 26,
        strategy: "Eco-Friendly",
    },
];

const STATUS_CONFIG: Record<string, { icon: React.ElementType; bg: string; text: string; label: string }> = {
    curing: { icon: Activity, bg: "bg-[#CCFBF1]", text: "text-[#0D9488]", label: "Curing" },
    completed: { icon: CheckCircle2, bg: "bg-[#ECFDF5]", text: "text-[#059669]", label: "Completed" },
    paused: { icon: Pause, bg: "bg-[#FEF3C7]", text: "text-[#D97706]", label: "Paused" },
    alert: { icon: AlertTriangle, bg: "bg-red-50", text: "text-[#DC2626]", label: "Alert" },
};

export default function ActiveCastingsPage() {
    const curingCount = CASTINGS.filter((c) => c.status === "curing").length;
    const completedCount = CASTINGS.filter((c) => c.status === "completed").length;

    return (
        <div className="flex h-screen font-[family-name:var(--font-inter)] text-[#1C1917]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header showExport={false} onExport={() => { }} />
                <div className="flex-1 overflow-y-auto bg-[#F5F2EC]">
                    <div className="p-6 max-w-[1400px] mx-auto">
                        {/* Page header */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-[#1C1917] flex items-center gap-2">
                                <Activity className="w-5 h-5 text-[#0D9488]" />
                                Active Castings
                            </h2>
                            <p className="text-[13px] text-[#78716C] mt-1">
                                Monitor all ongoing precast casting jobs across yards
                            </p>
                        </div>

                        {/* Summary cards */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {[
                                { label: "Total Jobs", value: CASTINGS.length, color: "#1C1917" },
                                { label: "Curing", value: curingCount, color: "#0D9488" },
                                { label: "Completed", value: completedCount, color: "#059669" },
                                { label: "Paused / Alert", value: CASTINGS.length - curingCount - completedCount, color: "#D97706" },
                            ].map((s) => (
                                <div key={s.label} className="card p-4">
                                    <p className="label mb-1">{s.label}</p>
                                    <p className="text-2xl font-extrabold font-mono-data" style={{ color: s.color }}>
                                        {s.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Castings table */}
                        <div className="card overflow-hidden">
                            <div className="px-5 py-3 border-b border-[#DDD8CE] bg-[#F5F2EC]">
                                <p className="label">All Casting Jobs</p>
                            </div>
                            <div className="divide-y divide-[#EDE9E0]">
                                {CASTINGS.map((c) => {
                                    const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.curing;
                                    const Icon = st.icon;
                                    const progress = Math.min(100, (c.currentStrength / c.targetStrength) * 100);
                                    return (
                                        <div key={c.id} className="px-5 py-4 hover:bg-[#F5F2EC]/50 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[11px] font-bold text-[#A8A29E] font-mono-data">{c.id}</span>
                                                    <h4 className="text-[13px] font-bold text-[#1C1917]">{c.product}</h4>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${st.bg} ${st.text}`}>
                                                        <Icon className="w-3 h-3" />
                                                        {st.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-[11px] text-[#78716C]">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {c.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Thermometer className="w-3 h-3" /> {c.temp}°C
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {c.startTime}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6">
                                                {/* Progress bar */}
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-[10px] text-[#A8A29E]">
                                                            Strength: <span className="font-bold text-[#1C1917] font-mono-data">{c.currentStrength}</span> / {c.targetStrength} MPa
                                                        </span>
                                                        <span className="text-[10px] font-bold text-[#0D9488] font-mono-data">{progress.toFixed(0)}%</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-[#EDE9E0] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${progress}%`,
                                                                background: progress >= 100 ? "#059669" : "#0D9488",
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Time */}
                                                <div className="text-right shrink-0">
                                                    <div className="flex items-center gap-1 text-[10px] text-[#A8A29E]">
                                                        <Clock className="w-3 h-3" />
                                                        <span className="font-mono-data font-bold text-[#1C1917]">{c.elapsedTime}h</span> / {c.targetTime}h
                                                    </div>
                                                    <p className="text-[9px] text-[#A8A29E] mt-0.5">Strategy: {c.strategy}</p>
                                                </div>

                                                {/* Link */}
                                                <Link href="/" className="shrink-0 w-8 h-8 rounded-lg border border-[#DDD8CE] flex items-center justify-center text-[#A8A29E] hover:text-[#0D9488] hover:border-[#0D9488] transition-all">
                                                    <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
