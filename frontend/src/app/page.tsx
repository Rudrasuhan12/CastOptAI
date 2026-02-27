"use client";

import { useState } from "react";
import axios from "axios";
import type { OptResult, WeatherData } from "@/types";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import InputPanel from "@/components/InputPanel";
import EmptyState from "@/components/EmptyState";
import ResultsPanel from "@/components/ResultsPanel";

const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:8000";
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "";

const DEMO_WEATHER: Record<string, WeatherData> = {
  Delhi: { temp: 10, humidity: 45, desc: "haze" },
  Mumbai: { temp: 32, humidity: 80, desc: "partly cloudy" },
  Chennai: { temp: 30, humidity: 75, desc: "clear sky" },
  Kolkata: { temp: 22, humidity: 65, desc: "mist" },
  Bangalore: { temp: 26, humidity: 55, desc: "scattered clouds" },
  Hyderabad: { temp: 28, humidity: 50, desc: "clear sky" },
  Pune: { temp: 25, humidity: 48, desc: "few clouds" },
  Ahmedabad: { temp: 35, humidity: 30, desc: "clear sky" },
};

export default function Dashboard() {
  const [city, setCity] = useState("Delhi");
  const [targetTime, setTargetTime] = useState(12);
  const [targetStrength, setTargetStrength] = useState(20);
  const [weather, setWeather] = useState<WeatherData>({ temp: null, humidity: null, desc: "Select a city" });
  const [weatherLoading, setWeatherLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptResult | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState(0);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"results" | "whatif" | "learn">("results");

  const fetchWeather = async (selectedCity: string) => {
    setCity(selectedCity);
    if (!WEATHER_API_KEY) {
      setWeather(DEMO_WEATHER[selectedCity] || { temp: 25, humidity: 60, desc: "moderate" });
      return;
    }
    setWeatherLoading(true);
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity},IN&units=metric&appid=${WEATHER_API_KEY}`
      );
      setWeather({
        temp: Math.round(res.data.main.temp),
        humidity: res.data.main.humidity,
        desc: res.data.weather[0].description,
      });
    } catch {
      setWeather({ temp: 25, humidity: 60, desc: "fetch failed" });
    }
    setWeatherLoading(false);
  };

  const handleOptimize = async () => {
    if (weather.temp === null) {
      setError("Please select a city first.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${AI_SERVICE_URL}/optimize`, {
        target_strength: targetStrength,
        target_time: targetTime,
        temp: weather.temp,
        humidity: weather.humidity,
      });
      if (res.data.status === "success") {
        setResult(res.data);
        setSelectedStrategy(0);
        setActiveTab("results");
      } else {
        setError(res.data.message || "Optimization failed.");
      }
    } catch {
      setError("Cannot connect to CastOpt AI service. Ensure FastAPI is running on port 8000.");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen font-[family-name:var(--font-inter)] text-[#1C1917]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header showExport={!!result} onExport={() => window.print()} />
        <div className="flex-1 overflow-y-auto bg-[#F5F2EC]">
          <div className="p-6 max-w-[1600px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <InputPanel
                city={city} targetTime={targetTime} targetStrength={targetStrength}
                weather={weather} weatherLoading={weatherLoading}
                loading={loading} error={error}
                onCityChange={fetchWeather}
                onTargetTimeChange={setTargetTime}
                onTargetStrengthChange={setTargetStrength}
                onOptimize={handleOptimize}
              />
              <div className="lg:col-span-9">
                {!result ? <EmptyState /> : (
                  <ResultsPanel
                    result={result} selectedStrategy={selectedStrategy}
                    onSelectStrategy={setSelectedStrategy}
                    activeTab={activeTab} onTabChange={setActiveTab}
                    weather={weather} targetStrength={targetStrength} targetTime={targetTime}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}