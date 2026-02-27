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
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function SettingsPage() {
    const [aiUrl, setAiUrl] = useState("http://localhost:8000");
    const [weatherKey, setWeatherKey] = useState("");
    const [notifications, setNotifications] = useState(true);
    const [autoRetrain, setAutoRetrain] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="flex h-screen font-[family-name:var(--font-inter)] text-[#1C1917]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header showExport={false} onExport={() => { }} />
                <div className="flex-1 overflow-y-auto bg-[#F5F2EC]">
                    <div className="p-6 max-w-[900px] mx-auto">
                        {/* Page header */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-[#1C1917] flex items-center gap-2">
                                <Settings className="w-5 h-5 text-[#78716C]" />
                                Settings
                            </h2>
                            <p className="text-[13px] text-[#78716C] mt-1">
                                Configure CastOpt AI service connections and preferences
                            </p>
                        </div>

                        <div className="space-y-5">
                            {/* AI Service */}
                            <div className="card overflow-hidden">
                                <div className="px-5 py-3 border-b border-[#DDD8CE] bg-[#F5F2EC] flex items-center gap-2">
                                    <Server className="w-4 h-4 text-[#0D9488]" />
                                    <p className="text-[12px] font-bold text-[#1C1917]">AI Service Configuration</p>
                                </div>
                                <div className="p-5 space-y-4">
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
                                            <Globe className="w-3.5 h-3.5 text-[#78716C]" />
                                            FastAPI Service URL
                                        </label>
                                        <input
                                            type="text"
                                            value={aiUrl}
                                            onChange={(e) => setAiUrl(e.target.value)}
                                            className="input-field font-mono-data text-[13px]"
                                            placeholder="http://localhost:8000"
                                        />
                                        <p className="text-[10px] text-[#A8A29E] mt-1">
                                            URL of the Python FastAPI AI service for optimization, what-if, and retraining
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between py-3 border-t border-[#EDE9E0]">
                                        <div>
                                            <p className="text-[12px] font-bold text-[#1C1917]">Service Status</p>
                                            <p className="text-[10px] text-[#A8A29E]">Connection to AI prediction engine</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[#059669]" />
                                            <span className="text-[11px] font-semibold text-[#059669]">Connected</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Weather API */}
                            <div className="card overflow-hidden">
                                <div className="px-5 py-3 border-b border-[#DDD8CE] bg-[#F5F2EC] flex items-center gap-2">
                                    <Cloud className="w-4 h-4 text-[#D97706]" />
                                    <p className="text-[12px] font-bold text-[#1C1917]">Weather API</p>
                                </div>
                                <div className="p-5">
                                    <div>
                                        <label className="block text-[12px] font-bold text-[#1C1917] mb-1.5 flex items-center gap-1.5">
                                            <Key className="w-3.5 h-3.5 text-[#78716C]" />
                                            OpenWeatherMap API Key
                                        </label>
                                        <input
                                            type="password"
                                            value={weatherKey}
                                            onChange={(e) => setWeatherKey(e.target.value)}
                                            className="input-field font-mono-data text-[13px]"
                                            placeholder="Enter your API key..."
                                        />
                                        <p className="text-[10px] text-[#A8A29E] mt-1">
                                            Get a free key at <span className="text-[#0D9488] font-semibold">openweathermap.org/api</span>. Leave empty to use demo weather data.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="card overflow-hidden">
                                <div className="px-5 py-3 border-b border-[#DDD8CE] bg-[#F5F2EC] flex items-center gap-2">
                                    <Bell className="w-4 h-4 text-[#7C3AED]" />
                                    <p className="text-[12px] font-bold text-[#1C1917]">Preferences</p>
                                </div>
                                <div className="divide-y divide-[#EDE9E0]">
                                    {/* Toggle: Notifications */}
                                    <div className="px-5 py-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-[13px] font-semibold text-[#1C1917] flex items-center gap-1.5">
                                                <Bell className="w-3.5 h-3.5 text-[#78716C]" />
                                                Casting Notifications
                                            </p>
                                            <p className="text-[10px] text-[#A8A29E] mt-0.5 ml-5">
                                                Receive alerts when castings complete or need attention
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setNotifications(!notifications)}
                                            className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${notifications ? "bg-[#0D9488]" : "bg-[#DDD8CE]"
                                                }`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-200 ${notifications ? "translate-x-[22px]" : "translate-x-0.5"
                                                }`} />
                                        </button>
                                    </div>

                                    {/* Toggle: Auto-retrain */}
                                    <div className="px-5 py-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-[13px] font-semibold text-[#1C1917] flex items-center gap-1.5">
                                                <Shield className="w-3.5 h-3.5 text-[#78716C]" />
                                                Auto-Retrain Model
                                            </p>
                                            <p className="text-[10px] text-[#A8A29E] mt-0.5 ml-5">
                                                Automatically retrain AI model when new field data is submitted
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setAutoRetrain(!autoRetrain)}
                                            className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${autoRetrain ? "bg-[#0D9488]" : "bg-[#DDD8CE]"
                                                }`}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform duration-200 ${autoRetrain ? "translate-x-[22px]" : "translate-x-0.5"
                                                }`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Save button */}
                            <div className="flex items-center justify-between">
                                <div>
                                    {saved && (
                                        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[#059669] animate-scale-in">
                                            <CheckCircle className="w-4 h-4" />
                                            Settings saved successfully
                                        </span>
                                    )}
                                </div>
                                <button onClick={handleSave} className="btn-primary">
                                    <Save className="w-4 h-4" />
                                    Save Settings
                                </button>
                            </div>

                            {/* System info */}
                            <div className="card-flat p-4 text-[11px] text-[#A8A29E] flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    CastOpt AI v2.0 — Precast Cycle Optimization Engine
                                </div>
                                <span className="font-mono-data">Build 2024.12.15</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
