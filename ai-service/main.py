from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import joblib
import os
from optimizer import (
    get_all_strategies, get_strength_curve, predict_whatif,
    predict_strength, calculate_cost, calculate_co2, calculate_energy, model
)
from train_model import train_model

app = FastAPI(title="CastOpt AI", version="2.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OptimizeRequest(BaseModel):
    target_strength: float
    target_time: float
    temp: float
    humidity: float


class WhatIfRequest(BaseModel):
    cement: float
    chemicals: float
    steam_hours: float
    time_hours: float
    temp: float
    humidity: float


class RetrainRequest(BaseModel):
    cement: float
    chemicals: float
    steam_hours: float
    water: float
    age_hours: float
    temperature: float
    humidity: float
    curing_method: int
    actual_strength: float

@app.get("/")
async def root():
    return {"service": "CastOpt AI", "version": "2.0", "status": "running"}

@app.post("/optimize")
async def optimize_cycle(data: OptimizeRequest):
    """
    Main optimization endpoint.
    Returns 3 strategies (cheapest, fastest, eco) + baseline + strength curves.
    """
    try:
        strategies, baseline = get_all_strategies(
            data.target_strength, data.target_time, data.temp, data.humidity
        )

        if not strategies:
            return {
                "status": "error",
                "message": "Could not find any optimal recipe. Target may be too aggressive for the given conditions."
            }


        for s in strategies:
            r = s["recommended_recipe"]
            s["strength_curve"] = get_strength_curve(
                r["cement"], r["chemicals"], r["steam_hours"],
                data.temp, data.humidity, max_hours=24
            )


        baseline["strength_curve"] = get_strength_curve(
            baseline["cement"], baseline["chemicals"], baseline["steam_hours"],
            data.temp, data.humidity, max_hours=24
        )

        return {
            "status": "success",
            "target_strength": data.target_strength,
            "target_time": data.target_time,
            "strategies": strategies,
            "baseline": baseline,
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/what-if")
async def what_if_simulation(data: WhatIfRequest):
    """
    What-If endpoint: user manually sets recipe + conditions,
    gets back predicted strength, cost, CO₂.
    """
    try:
        result = predict_whatif(
            data.cement, data.chemicals, data.steam_hours,
            data.time_hours, data.temp, data.humidity
        )

        curve = get_strength_curve(
            data.cement, data.chemicals, data.steam_hours,
            data.temp, data.humidity, max_hours=24
        )
        result["strength_curve"] = curve
        return {"status": "success", **result}

    except Exception as e:
        return {"status": "error", "message": str(e)}


@app.post("/retrain")
async def retrain_model_endpoint(data: RetrainRequest):
    """
    Continuous Learning Loop: receive actual field data and retrain the model.
    """
    try:
        curing_method = data.curing_method
        new_row = {
            'cement': data.cement,
            'slag': 0,
            'fly_ash': 0,
            'water': data.water,
            'superplasticizer': data.chemicals,
            'coarse_agg': 1000,
            'fine_agg': 700,
            'age_hours': data.age_hours,
            'temperature': data.temperature,
            'humidity': data.humidity,
            'curing_method': curing_method,
            'strength': data.actual_strength
        }

        csv_path = 'processed_concrete_data.csv'
        df = pd.read_csv(csv_path)
        df = pd.concat([df, pd.DataFrame([new_row])], ignore_index=True)
        df.to_csv(csv_path, index=False)


        train_model()


        import optimizer
        optimizer.model = joblib.load('model.pkl')

        return {
            "status": "success",
            "message": "Model retrained with new field data. CastOpt AI is now smarter!",
            "total_samples": len(df)
        }

    except Exception as e:
        return {"status": "error", "message": str(e)}