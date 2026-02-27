"use client";

import React from "react";
import { Download, Bell, Command, Search } from "lucide-react";

interface HeaderProps {
    showExport?: boolean;
    onExport?: () => void;
}

export default function Header({ showExport, onExport }: HeaderProps) {
    return (
        <header className="no-print h-[72px] bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between shrink-0 shadow-sm relative z-10 animate-assembly">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center">
                    <Command className="w-5 h-5 text-[#0F172A]" />
                </div>
                <div>
                    <h2 className="text-lg font-extrabold text-[#0F172A] tracking-tight">AI Master Control</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#64748B] font-bold tracking-widest uppercase">System Status:</span>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                            <span className="text-[10px] font-bold text-[#10B981] font-mono-data">ONLINE & OPTIMIZING</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-5">

                <div className="hidden md:flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md px-3 py-1.5">
                    <Search className="w-4 h-4 text-[#94A3B8]" />
                    <span className="text-[11px] text-[#94A3B8] font-bold tracking-wide">Press ⌘K to commands</span>
                </div>

                <div className="flex items-center gap-3">
                    {showExport && (
                        <button
                            onClick={onExport}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#CBD5E1] text-[#0F172A] rounded-md text-[12px] font-bold hover:bg-[#F8FAFC] hover:border-[#0F172A] transition-all shadow-[2px_2px_0px_#E2E8F0] hover:shadow-[3px_3px_0px_#CBD5E1] hover:-translate-y-px hover:-translate-x-px"
                        >
                            <Download className="w-4 h-4" />
                            Export Blueprint
                        </button>
                    )}
                    <button className="relative w-10 h-10 rounded-md bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-[#0F172A] hover:border-[#CBD5E1] transition-all shadow-[2px_2px_0px_#E2E8F0] hover:shadow-[3px_3px_0px_#CBD5E1] hover:-translate-y-px hover:-translate-x-px">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#EF4444] rounded-full border border-white" />
                    </button>
                </div>
            </div>
        </header>
    );
}
