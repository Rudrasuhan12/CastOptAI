"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    BarChart3,
    Activity,
    FlaskConical,
    Settings,
    HelpCircle,
    Hexagon,
} from "lucide-react";

const navItems = [
    { icon: BarChart3, label: "Optimization Hub", href: "/" },
    { icon: Activity, label: "Active Castings", href: "/active-castings" },
    { icon: FlaskConical, label: "ESG Reports", href: "/esg-reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="no-print w-64 bg-[#0F172A] border-r border-[#1E293B] flex flex-col shrink-0 animate-assembly shadow-[4px_0_12px_rgba(0,0,0,0.1)] relative z-20">

            <div className="px-6 pt-7 pb-6">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-lg border-2 border-[#FFCB05] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <Hexagon className="w-5 h-5 text-[#FFCB05]" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-extrabold text-white tracking-tight">
                            <span className="text-[#FFCB05]">CastOpt</span> AI
                        </h1>
                        <p className="text-[9px] font-bold text-[#94A3B8] tracking-[0.2em] uppercase mt-0.5">
                            AI Structure Cmd
                        </p>
                    </div>
                </Link>
            </div>


            <nav className="flex-1 px-4 space-y-1.5 mt-2">
                <p className="label px-2 text-[#475569] mb-3">Core Modules</p>
                {navItems.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    const delayClass = `delay-${(i + 1) * 100}`;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`
                                animate-assembly ${delayClass}
                                group flex items-center gap-3 px-4 py-3 rounded-md text-[13px] font-bold transition-all duration-300 relative overflow-hidden
                                ${isActive
                                    ? "bg-[#1E293B] text-white"
                                    : "text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/50"
                                }
                            `}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFCB05]" />
                            )}
                            <Icon className={`w-4 h-4 transition-colors duration-300 ${isActive ? "text-[#FFCB05]" : "text-[#64748B] group-hover:text-white"}`} />
                            <span className="tracking-wide">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>


            <div className="px-4 mb-4 animate-assembly delay-400">
                <div className="bg-[#1E293B] rounded-md p-4 border border-[#334155] hover:border-[#475569] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-2 mb-2">
                        <HelpCircle className="w-4 h-4 text-[#FFCB05]" />
                        <span className="text-[12px] font-bold text-white tracking-wide">Command Assist</span>
                    </div>
                    <p className="text-[10px] text-[#94A3B8] leading-relaxed">
                        Access AI models and documentation for precast structural optimization.
                    </p>
                </div>
            </div>


            <div className="px-4 pb-6 pt-4 border-t border-[#1E293B] bg-[#0B1120] animate-assembly delay-500">
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-[#1E293B] transition-colors duration-300 cursor-pointer">
                    <div className="relative">
                        <div className="w-10 h-10 bg-[#FFCB05] rounded-md flex items-center justify-center text-[12px] font-extrabold text-[#0F172A] shadow-[2px_2px_0px_#1E293B]">
                            CO
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#10B981] rounded-full border-2 border-[#0B1120]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-white truncate tracking-wide">Yard Manager</p>
                        <p className="text-[10px] text-[#FFCB05] truncate font-bold tracking-widest uppercase mt-0.5">Level 3 Access</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
