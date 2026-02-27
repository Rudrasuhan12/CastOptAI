"use client";

import React from "react";
import { Brain, Download, Bell } from "lucide-react";

interface HeaderProps {
    showExport: boolean;
    onExport: () => void;
}

export default function Header({ showExport, onExport }: HeaderProps) {
    return (
        <header className="no-print bg-white border-b border-[#DDD8CE] px-8 py-4 flex justify-between items-center shrink-0">
            <div>
                <h2 className="text-[15px] font-bold text-[#1C1917] flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-[#F5F2EC] border border-[#DDD8CE] flex items-center justify-center">
                        <Brain className="w-4 h-4 text-[#0D9488]" />
                    </div>
                    Precast Optimization Engine
                    <span className="text-[10px] font-bold bg-[#CCFBF1] text-[#0D9488] px-2 py-0.5 rounded font-mono">
                        v2.0
                    </span>
                </h2>
                <p className="text-[11px] text-[#A8A29E] mt-0.5 ml-[38px]">
                    AI-powered mix design · Real-time weather · Multi-strategy optimization
                </p>
            </div>

            <div className="flex items-center gap-2.5">
                <button className="relative w-9 h-9 rounded-lg border border-[#DDD8CE] flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#F5F2EC] transition-all duration-200">
                    <Bell className="w-4 h-4" />
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D97706] rounded-full" />
                </button>

                {showExport && (
                    <button
                        onClick={onExport}
                        className="btn-primary text-[13px] py-2 px-4"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export Report
                    </button>
                )}
            </div>
        </header>
    );
}
