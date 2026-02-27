"use client";

import React, { useState } from "react";
import {
    Settings,
    Server,
    Cloud,
    Bell,
    Shield,
    Key,
    Globe,
    Save,
    CheckCircle,
    AlertCircle,
    Database,
    History,
    PiggyBank,
    Leaf,
    Zap,
    ShieldAlert
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function SettingsPage() {
    return (
        <div className="flex h-screen w-full bg-transparent overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full bg-transparent">
                <Header showExport={false} onExport={() => { }} />
                <main className="flex-1 overflow-auto p-4 md:p-8">
                    <div className="max-w-[1400px] mx-auto w-full">
                        <div className="flex items-center justify-between mb-8 animate-assembly">
                            <div>
                                <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">System Configuration</h1>
                                <p className="text-[13px] text-[#64748B] font-medium mt-1">Manage global AI parameters, model weights, and API connections.</p>
                            </div>
                            <button className="btn-primary">
                                <Save className="w-4 h-4" /> Apply Configuration
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                            <div className="lg:col-span-4 space-y-6">
                                <div className="card animate-assembly delay-100 border-2 border-[#0F172A] overflow-hidden">
                                    <div className="px-5 py-4 bg-[#0F172A] flex justify-between items-center text-white">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-md bg-[#1E293B] flex items-center justify-center border border-[#334155]">
                                                <Server className="w-4 h-4 text-[#10B981]" />
                                            </div>
                                            <h3 className="text-[13px] font-extrabold tracking-wide uppercase">Core Intelligence</h3>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-5">
                                        <div>
                                            <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Primary AI Service Endpoint</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    defaultValue="http://10.247.14.118:8000"
                                                    className="input-field w-full font-mono-data text-[13px]"
                                                />
                                                <span className="absolute right-3 top-2.5 flex items-center gap-1.5 px-2 py-0.5 bg-[#F0FDF4] border border-[#16A34A] text-[#16A34A] text-[9px] font-bold rounded uppercase tracking-wider shadow-[2px_2px_0px_rgba(22,163,74,0.2)]">
                                                    <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse" />
                                                    Online
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-[#E2E8F0]">
                                            <label className="block text-[10px] font-bold text-[#64748B] uppercase tracking-wider mb-2">Weather API Key (OpenWeatherMap)</label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    defaultValue="************************"
                                                    className="input-field w-full font-mono-data text-[13px] tracking-widest"
                                                />
                                            </div>
                                            <p className="text-[11px] text-[#64748B] mt-2 flex items-center gap-1.5 font-medium">
                                                <ShieldAlert className="w-3.5 h-3.5 text-[#D97706]" />
                                                Stored securely via .env.local
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="card p-6 animate-assembly delay-200 shadow-[3px_3px_0px_#E2E8F0]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-[#F8FAFC] rounded border border-[#E2E8F0]">
                                            <Database className="w-5 h-5 text-[#64748B]" />
                                        </div>
                                        <div>
                                            <h3 className="text-[12px] font-extrabold text-[#0F172A] uppercase tracking-widest">Model Weights</h3>
                                            <p className="text-[11px] text-[#64748B]">RandomForest_v2.1.pkl</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#F1F5F9] rounded-lg p-3 border border-[#CBD5E1]">
                                        <div className="flex justify-between text-[11px] mb-1 font-bold">
                                            <span className="text-[#64748B]">Last Retrained</span>
                                            <span className="text-[#0F172A] font-mono-data">Today, 09:41 AM</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] font-bold border-t border-[#CBD5E1] pt-1 mt-1">
                                            <span className="text-[#64748B]">Samples</span>
                                            <span className="text-[#0F172A] font-mono-data">14,285</span>
                                        </div>
                                    </div>
                                    <button className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#CBD5E1] text-[#0F172A] rounded-md text-[12px] font-bold shadow-[2px_2px_0px_#E2E8F0] hover:shadow-[3px_3px_0px_#CBD5E1] transition-all">
                                        <History className="w-4 h-4" /> View Training Logs
                                    </button>
                                </div>
                            </div>


                            <div className="lg:col-span-8">
                                <div className="card p-6 animate-assembly delay-300">
                                    <h3 className="text-[14px] font-extrabold text-[#0F172A] border-b border-[#E2E8F0] pb-3 mb-6 uppercase tracking-widest">Global Objective Weights</h3>

                                    <p className="text-[12px] text-[#64748B] mb-8 font-medium max-w-2xl">
                                        Distribute the optimization focus across Cost, Carbon Footprint, and Energy Usage.
                                        The AI engine will prioritize strategies based on these coefficient values. Total must equal 1.0.
                                    </p>

                                    <div className="space-y-8">
                                        {[
                                            { label: "Cost Reduction", desc: "Prioritize minimizing material and operational costs.", value: "0.6", color: "text-[#0F172A]", icon: PiggyBank },
                                            { label: "Carbon Minimization", desc: "Favor designs with lower embodied CO₂.", value: "0.25", color: "text-[#10B981]", icon: Leaf },
                                            { label: "Energy Efficiency", desc: "Reduce dependent energy consumption (e.g. Steam).", value: "0.15", color: "text-[#D97706]", icon: Zap },
                                        ].map((w) => (
                                            <div key={w.label}>
                                                <div className="flex justify-between items-end mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <w.icon className="w-5 h-5 text-[#64748B]" />
                                                        <div>
                                                            <p className="text-[12px] font-extrabold text-[#0F172A] uppercase tracking-wider">{w.label}</p>
                                                            <p className="text-[11px] text-[#94A3B8] font-medium">{w.desc}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-xl font-extrabold font-mono-data text-[#0F172A] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#CBD5E1]">{w.value}</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0" max="1" step="0.05"
                                                    defaultValue={w.value}
                                                    className="w-full accent-current"
                                                    style={{ color: "var(--color)" } as React.CSSProperties} // Set accent color via current color strategy
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC] p-4 rounded-lg border border-[#E2E8F0]">
                                        <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Total Weight Sum</p>
                                        <span className="text-lg font-extrabold text-[#10B981] font-mono-data bg-[#F0FDF4] px-3 py-1 rounded border border-[#10B981]">1.00</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
