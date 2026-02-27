// ===== Shared Types for CastOpt AI =====

export interface Recipe {
    cement: number;
    chemicals: number;
    steam_hours: number;
    water: number;
}

export interface Strategy {
    name: string;
    label: string;
    recommended_recipe: Recipe;
    predicted_strength: number;
    confidence_score: number;
    risk_level: string;
    cost: number;
    co2_kg: number;
    energy_kwh: number;
    cost_savings_percent: number;
    carbon_reduction_percent: number;
    energy_savings_percent: number;
    strength_curve: { hour: number; strength: number }[];
}

export interface Baseline {
    cement: number;
    chemicals: number;
    steam_hours: number;
    predicted_strength: number;
    cost: number;
    co2: number;
    energy: number;
    strength_curve: { hour: number; strength: number }[];
}

export interface OptResult {
    status: string;
    target_strength: number;
    target_time: number;
    strategies: Strategy[];
    baseline: Baseline;
}

export interface WeatherData {
    temp: number | null;
    humidity: number | null;
    desc: string;
}
