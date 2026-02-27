"use client";

import React from "react";
import Link from "next/link";
import {
    Activity,
    Clock,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    Pause,
    ChevronRight,
    ArrowRight,
    Thermometer,
    MapPin,
    Calendar,
    Filter,
    Plus,
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


const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string; border: string; label: string }> = {
    curing: { icon: Activity, color: "text-[#D97706]", bg: "bg-[#FEF3C7]", border: "border-[#FDE68A]", label: "Curing" },
    completed: { icon: CheckCircle2, color: "text-[#16A34A]", bg: "bg-[#D1FAE5]", border: "border-[#A7F3D0]", label: "Completed" },
    paused: { icon: Pause, color: "text-[#475569]", bg: "bg-[#F1F5F9]", border: "border-[#E2E8F0]", label: "Paused" },
    alert: { icon: AlertTriangle, color: "text-[#DC2626]", bg: "bg-[#FEE2E2]", border: "border-[#FECACA]", label: "Alert" },
};


const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status] || STATUS_CONFIG.curing; // Default to curing if status not found
};

export default function ActiveCastings() {

    const totalJobs = CASTINGS.length;
    const curingCount = CASTINGS.filter((c) => c.status === "curing").length;
    const completedCount = CASTINGS.filter((c) => c.status === "completed").length;
    const pausedCount = CASTINGS.filter((c) => c.status === "paused").length;
    const alertCount = CASTINGS.filter((c) => c.status === "alert").length; // Assuming 'alert' status might exist

    return (
        <div className="flex h-screen w-full bg-transparent overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full bg-transparent">
                <Header showExport={false} onExport={() => { }} /> {/* Retained Header props from original */}
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-[1400px] mx-auto w-full">
                        <div className="flex items-center justify-between mb-8 animate-assembly">
                            <div>
                                <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Active Castings</h1>
                                <p className="text-[13px] text-[#64748B] font-medium mt-1">Live tracking and status of ongoing precast production.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#CBD5E1] text-[#0F172A] rounded-md text-[12px] font-bold shadow-[2px_2px_0px_#E2E8F0] hover:shadow-[3px_3px_0px_#CBD5E1] hover:-translate-y-px transition-all">
                                    <Filter className="w-4 h-4" /> Filter
                                </button>
                                <button className="btn-primary flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-md text-[12px] font-bold shadow-[2px_2px_0px_#64748B] hover:shadow-[3px_3px_0px_#334155] hover:-translate-y-px transition-all">
                                    <Plus className="w-4 h-4" /> New Casting
                                </button>
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: "Total Jobs", value: totalJobs, icon: Activity, color: "text-[#2563EB]" },
                                { label: "In Curing", value: curingCount, icon: Thermometer, color: "text-[#D97706]" },
                                { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-[#16A34A]" },
                                { label: "Paused / Alert", value: pausedCount + alertCount, icon: AlertCircle, color: "text-[#DC2626]" },
                            ].map((stat, i) => (
                                <div key={i} className={`card p-5 animate-assembly delay-${(i + 1) * 100} shadow-[3px_3px_0px_#E2E8F0] bg-white rounded-lg border border-[#E2E8F0]`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                        <h3 className="text-[12px] font-extrabold text-[#64748B] uppercase tracking-widest">{stat.label}</h3>
                                    </div>
                                    <p className="text-3xl font-extrabold text-[#0F172A] font-mono-data tracking-tight">{stat.value}</p>
                                </div>
                            ))}
                        </div>


                        <div className="card overflow-hidden animate-assembly delay-500 border-2 border-[#0F172A] rounded-lg bg-white">
                            <div className="px-5 py-4 bg-[#0F172A] flex justify-between items-center text-white">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-md bg-[#1E293B] flex items-center justify-center border border-[#334155]">
                                        <Activity className="w-4 h-4 text-[#10B981]" />
                                    </div>
                                    <h3 className="text-[13px] font-extrabold tracking-wide uppercase">Production Roster</h3>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                                            <th className="p-4 text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">ID / Location</th>
                                            <th className="p-4 text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">Status</th>
                                            <th className="p-4 text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">Progress</th>
                                            <th className="p-4 text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">Strength Limit</th>
                                            <th className="p-4 text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">Time Remaining</th>
                                            <th className="p-4 text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#E2E8F0]">
                                        {CASTINGS.map((cast, index) => {
                                            const statusConfig = getStatusConfig(cast.status);
                                            const StatusIcon = statusConfig.icon;
                                            const progress = Math.min(100, (cast.currentStrength / cast.targetStrength) * 100);
                                            const timeRemaining = Math.max(0, cast.targetTime - cast.elapsedTime);

                                            return (
                                                <tr key={cast.id} className="hover:bg-[#F8FAFC] transition-colors group">
                                                    <td className="p-4">
                                                        <p className="text-[13px] font-bold text-[#0F172A] font-mono-data">{cast.id}</p>
                                                        <p className="text-[11px] text-[#64748B] flex items-center gap-1 mt-1">
                                                            <MapPin className="w-3 h-3" /> {cast.location}
                                                        </p>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border shadow-[2px_2px_0px_rgba(15,23,42,0.05)] rounded-md text-[10px] font-bold uppercase tracking-wide ${statusConfig.color} ${statusConfig.bg} ${statusConfig.border}`}>
                                                            <StatusIcon className="w-3.5 h-3.5" />
                                                            {statusConfig.label}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 w-48">
                                                        <div className="flex justify-between text-[11px] font-bold text-[#64748B] mb-1.5 font-mono-data">
                                                            <span>{progress.toFixed(0)}%</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden border border-[#CBD5E1]">
                                                            <div className={`h-full ${statusConfig.bg.replace("bg-", "bg-").replace("50", "500").replace("emerald-50", "bg-[#10B981]").replace("amber-50", "bg-[#FFCB05]").replace("blue-50", "bg-[#3B82F6]")}`} style={{ width: `${progress}%` }} />
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[13px] font-extrabold text-[#0F172A] font-mono-data">{cast.currentStrength}</span>
                                                            <span className="text-[11px] text-[#64748B]">/ {cast.targetStrength} MPa</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-1.5 text-[#0F172A]">
                                                            <Clock className="w-4 h-4 text-[#64748B]" />
                                                            <span className="text-[13px] font-bold font-mono-data">{timeRemaining} hr</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Link href="/" className="p-2 text-[#94A3B8] hover:text-[#0F172A] hover:bg-white border hover:border-[#CBD5E1] rounded transition-all opacity-0 group-hover:opacity-100 shadow-[2px_2px_0px_#E2E8F0]">
                                                            <ChevronRight className="w-4 h-4" />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
