"""
Comprehensive test suite for CastOpt AI - finds all execution failure points
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import json
import traceback

PASS = 0
FAIL = 0
RESULTS = []

def test(name, fn):
    global PASS, FAIL
    try:
        fn()
        PASS += 1
        RESULTS.append(f"  PASS: {name}")
    except Exception as e:
        FAIL += 1
        RESULTS.append(f"  FAIL: {name} -> {type(e).__name__}: {e}")


# TEST 1: Module imports
def test_imports():
    from optimizer import (
        predict_strength, calculate_cost, calculate_co2, calculate_energy,
        calculate_risk, get_traditional_baseline, get_all_strategies,
        get_strength_curve, predict_whatif, build_feature_vector
    )
    from constraints import constraint_engine

test("All module imports", test_imports)


#TEST 2: Cost calculation
def test_cost_basic():
    from optimizer import calculate_cost
    cost = calculate_cost(350, 5, 4)
    assert cost > 0, f"Cost should be positive, got {cost}"
    expected = 350 * 6 + 5 * 150 + 4 * 500
    assert abs(cost - expected) < 0.01, f"Cost mismatch: {cost} vs {expected}"

test("Cost calculation - basic", test_cost_basic)


def test_cost_zero_inputs():
    from optimizer import calculate_cost
    cost = calculate_cost(0, 0, 0)
    assert cost == 0, f"Zero inputs should give zero cost, got {cost}"

test("Cost calculation - zero inputs", test_cost_zero_inputs)


def test_cost_negative_inputs():
    from optimizer import calculate_cost
    cost = calculate_cost(-100, -5, -2)
    # Negative inputs shouldn't crash but cost will be negative
    assert isinstance(cost, (int, float)), "Cost should be numeric"

test("Cost calculation - negative inputs (no crash)", test_cost_negative_inputs)


#TEST 3: CO2 calculation
def test_co2_basic():
    from optimizer import calculate_co2
    co2 = calculate_co2(350, 4)
    expected = 350 * 0.9 + 4 * 40
    assert abs(co2 - expected) < 0.01, f"CO2 mismatch: {co2} vs {expected}"

test("CO2 calculation", test_co2_basic)


#TEST 4: Energy calculation
def test_energy_basic():
    from optimizer import calculate_energy
    energy = calculate_energy(4)
    assert energy == 200, f"Energy should be 200 kWh, got {energy}"

test("Energy calculation", test_energy_basic)


#TEST 5: Strength prediction
def test_predict_strength():
    from optimizer import predict_strength
    strength = predict_strength(350, 5, 4, 12, 25, 50)
    assert strength > 0, f"Strength should be positive, got {strength}"
    assert strength < 200, f"Strength unrealistically high: {strength}"

test("Strength prediction - normal", test_predict_strength)


def test_predict_strength_extreme_temp():
    from optimizer import predict_strength
    s1 = predict_strength(350, 5, 4, 12, -10, 50)  # Very cold
    s2 = predict_strength(350, 5, 4, 12, 60, 50)   # Very hot
    assert isinstance(s1, float), "Should not crash with extreme cold"
    assert isinstance(s2, float), "Should not crash with extreme heat"

test("Strength prediction - extreme temps", test_predict_strength_extreme_temp)


def test_predict_strength_zero_time():
    from optimizer import predict_strength
    s = predict_strength(350, 5, 4, 0, 25, 50)  # 0 hours
    assert isinstance(s, float), "Should not crash with zero time"

test("Strength prediction - zero time", test_predict_strength_zero_time)


def test_predict_strength_very_low_cement():
    from optimizer import predict_strength
    s = predict_strength(50, 0, 0, 12, 25, 50)
    assert isinstance(s, float), f"Should not crash with very low cement"

test("Strength prediction - very low cement", test_predict_strength_very_low_cement)


#TEST 6: Risk/Confidence calculation
def test_risk_normal():
    from optimizer import calculate_risk
    risk, conf = calculate_risk(40, 30)
    assert risk in ["Low", "Medium", "High"], f"Invalid risk: {risk}"
    assert 45 <= conf <= 96, f"Confidence out of range: {conf}"

test("Risk calculation - normal buffer", test_risk_normal)


def test_risk_under_target():
    from optimizer import calculate_risk
    risk, conf = calculate_risk(25, 30)  # Under target
    assert risk == "High", f"Should be High risk, got {risk}"
    assert conf < 60, f"Should have low confidence, got {conf}"

test("Risk calculation - under target", test_risk_under_target)


def test_risk_zero_target():
    from optimizer import calculate_risk
    risk, conf = calculate_risk(30, 0)  # Zero target
    assert risk == "Low", f"Expected Low risk for zero target, got {risk}"

test("Risk calculation - zero target (division by zero guard)", test_risk_zero_target)


def test_risk_negative_target():
    from optimizer import calculate_risk
    risk, conf = calculate_risk(30, -10)  # Negative target
    assert isinstance(risk, str), "Should not crash with negative target"

test("Risk calculation - negative target", test_risk_negative_target)


def test_risk_equal_values():
    from optimizer import calculate_risk
    risk, conf = calculate_risk(30, 30)  # Exactly at target
    assert risk == "High", f"Should be High risk at exact target, got {risk}"

test("Risk calculation - exact target match", test_risk_equal_values)


#TEST 7: Optimization
def test_optimization_normal():
    from optimizer import get_all_strategies
    strategies, baseline = get_all_strategies(30, 12, 25, 50)
    assert len(strategies) > 0, "Should return at least 1 strategy"
    assert len(strategies) <= 3, "Should return at most 3 strategies"
    assert baseline is not None, "Baseline should not be None"

test("Full optimization - normal inputs", test_optimization_normal)


def test_optimization_very_high_strength():
    from optimizer import get_all_strategies
    strategies, baseline = get_all_strategies(90, 12, 25, 50)  # Very high target
    # May return empty strategies if target is too aggressive
    assert isinstance(strategies, list), "Should return a list even if empty"

test("Full optimization - very high target (90 MPa)", test_optimization_very_high_strength)


def test_optimization_very_short_time():
    from optimizer import get_all_strategies
    strategies, baseline = get_all_strategies(30, 1, 25, 50)  # 1 hour
    assert isinstance(strategies, list)

test("Full optimization - very short time (1h)", test_optimization_very_short_time)


def test_optimization_extreme_weather():
    from optimizer import get_all_strategies
    strategies, baseline = get_all_strategies(30, 12, 50, 95)  # Hot & humid
    assert isinstance(strategies, list)

test("Full optimization - extreme weather (50°C, 95%)", test_optimization_extreme_weather)


#TEST 8: Baseline
def test_baseline():
    from optimizer import get_traditional_baseline
    b = get_traditional_baseline(30, 12, 25, 50)
    assert b["cost"] > 0, f"Baseline cost should be positive: {b['cost']}"
    assert b["co2"] > 0, f"Baseline CO2 should be positive: {b['co2']}"
    assert b["predicted_strength"] > 0, f"Baseline strength should be positive"

test("Baseline calculation", test_baseline)


#TEST 9: Strength curve
def test_strength_curve():
    from optimizer import get_strength_curve
    curve = get_strength_curve(350, 5, 4, 25, 50, max_hours=24)
    assert len(curve) == 24, f"Curve should have 24 points, got {len(curve)}"
    assert all("hour" in p and "strength" in p for p in curve), "Invalid curve format"

test("Strength curve generation", test_strength_curve)


#TEST 10: What-If simulation
def test_whatif():
    from optimizer import predict_whatif
    result = predict_whatif(350, 5, 4, 12, 25, 50)
    assert "predicted_strength" in result
    assert "cost" in result
    assert "co2_kg" in result
    assert "energy_kwh" in result

test("What-If simulation", test_whatif)


#TEST 11: Feature vector
def test_feature_vector():
    from optimizer import build_feature_vector
    df = build_feature_vector(350, 5, 4, 12, 25, 50)
    assert df.shape == (1, 11), f"Feature vector wrong shape: {df.shape}"
    assert list(df.columns) == [
        'cement', 'slag', 'fly_ash', 'water',
        'superplasticizer', 'coarse_agg', 'fine_agg',
        'age_hours', 'temperature', 'humidity', 'curing_method'
    ]

test("Feature vector shape & columns", test_feature_vector)


def test_curing_method_logic():
    from optimizer import build_feature_vector
    df_steam = build_feature_vector(350, 5, 4, 12, 25, 50)
    df_nosteam = build_feature_vector(350, 5, 0, 12, 25, 50)
    assert df_steam['curing_method'].iloc[0] == 1, "Steam > 0.1 should be curing method 1"
    assert df_nosteam['curing_method'].iloc[0] == 0, "No steam should be curing method 0"

test("Curing method logic (steam threshold)", test_curing_method_logic)


#TEST 12: Constraint engine
def test_constraints_default_bounds():
    from constraints import constraint_engine
    bounds = constraint_engine.get_dynamic_bounds()
    assert 'cement' in bounds
    assert 'chemicals' in bounds
    assert 'steam' in bounds
    assert 'water' in bounds

test("Constraint engine - default bounds", test_constraints_default_bounds)


def test_constraints_site_profiles():
    from constraints import constraint_engine
    sites = constraint_engine.get_available_sites()
    assert len(sites) >= 3, f"Should have at least 3 sites, got {len(sites)}"

test("Constraint engine - site profiles loaded", test_constraints_site_profiles)


#TEST 13: JSON serialization of strategy output
def test_strategy_json_serializable():
    from optimizer import get_all_strategies
    strategies, baseline = get_all_strategies(30, 12, 25, 50)
    try:
        json.dumps({"strategies": strategies, "baseline": baseline})
    except TypeError as e:
        raise AssertionError(f"Strategy output not JSON serializable: {e}")

test("Strategy output JSON-serializable", test_strategy_json_serializable)


#TEST 14: Context info serialization (main.py bug)
def test_context_serialization():
    from constraints import constraint_engine
    constraint_engine.set_current_site("delhi_yard")
    constraints = constraint_engine.get_current_constraints()
    if constraints:
        try:
            json.dumps(constraints.__dict__, default=str)
        except TypeError as e:
            raise AssertionError(f"Constraint __dict__ not serializable: {e}")

test("Constraint context JSON serialization", test_context_serialization)


#TEST 15: get_all_strategies docstring bug
def test_get_all_strategies_runs():
    from optimizer import get_all_strategies
    # This tests the misplaced docstring doesn't cause execution issues
    result = get_all_strategies(30, 12, 25, 50, site_id=None)
    assert result is not None

test("get_all_strategies executes correctly", test_get_all_strategies_runs)


def test_get_all_strategies_with_site():
    from optimizer import get_all_strategies
    result = get_all_strategies(30, 12, 25, 50, site_id="delhi_yard")
    assert result is not None

test("get_all_strategies with site_id", test_get_all_strategies_with_site)


def test_get_all_strategies_unknown_site():
    from optimizer import get_all_strategies
    result = get_all_strategies(30, 12, 25, 50, site_id="nonexistent_yard")
    assert result is not None, "Should handle unknown site gracefully"

test("get_all_strategies with unknown site_id", test_get_all_strategies_unknown_site)


#TEST 16: validate_proposed_recipe working hours bug
def test_validate_recipe():
    from constraints import constraint_engine
    constraint_engine.set_current_site("delhi_yard")
    is_valid, violations = constraint_engine.validate_proposed_recipe(350, 5, 4, 180)
    # Note: may fail due to working hours check
    assert isinstance(is_valid, bool)
    assert isinstance(violations, list)

test("Recipe validation runs", test_validate_recipe)


#PRINT RESULTS
print("\n" + "=" * 70)
print(f"  AI LOGIC AUDIT RESULTS: {PASS} PASSED, {FAIL} FAILED")
print("=" * 70)
for r in RESULTS:
    print(r)
print("=" * 70)
