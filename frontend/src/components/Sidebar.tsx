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
    { icon: BarChart3, label: "Dashboard", href: "/" },
    { icon: Activity, label: "Active Castings", href: "/active-castings" },
    { icon: FlaskConical, label: "ESG Reports", href: "/esg-reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="no-print w-64 bg-[#EDE9E0] border-r border-[#DDD8CE] flex flex-col shrink-0">
            {/* Logo */}
            <div className="px-6 pt-6 pb-5">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#0D9488] flex items-center justify-center">
                        <Hexagon className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-base font-extrabold text-[#1C1917] tracking-tight">
                            CastOpt AI
                        </h1>
                        <p className="text-[9px] font-semibold text-[#A8A29E] tracking-[0.15em] uppercase">
                            Precast Intelligence
                        </p>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 space-y-0.5">
                <p className="label px-3 mb-2">Navigation</p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`
                                group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all duration-200 relative
                                ${isActive
                                    ? "bg-white text-[#0D9488] shadow-sm border border-[#DDD8CE]"
                                    : "text-[#78716C] hover:text-[#1C1917] hover:bg-white/60"
                                }
                            `}
                        >
                            {isActive && (
                                <div className="absolute left-0 w-[3px] h-5 bg-[#0D9488] rounded-r-full" />
                            )}
                            <Icon className={`w-[16px] h-[16px] ${isActive ? "text-[#0D9488]" : "text-[#A8A29E] group-hover:text-[#78716C]"}`} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Help */}
            <div className="px-3 mb-3">
                <div className="bg-white border border-[#DDD8CE] rounded-lg p-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#0D9488]" />
                        <span className="text-[11px] font-bold text-[#1C1917]">Need Help?</span>
                    </div>
                    <p className="text-[10px] text-[#A8A29E] leading-relaxed">
                        Optimize precast cycles with AI-powered insights.
                    </p>
                </div>
            </div>

            {/* User */}
            <div className="px-3 pb-5 pt-3 border-t border-[#DDD8CE]">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-colors cursor-pointer">
                    <div className="relative">
                        <div className="w-9 h-9 bg-[#0D9488] rounded-lg flex items-center justify-center text-[11px] font-extrabold text-white">
                            YM
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#059669] rounded-full border-2 border-[#EDE9E0]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-bold text-[#1C1917] truncate">Yard Manager</p>
                        <p className="text-[10px] text-[#A8A29E] truncate">L&T Precast Division</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
