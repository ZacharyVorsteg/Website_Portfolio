"""Illustrative fixed-horizon planning only; rates are not site measurements."""
from math import ceil, sqrt
from statistics import NormalDist
import json

alpha, power = 0.05, 0.80
z_alpha = NormalDist().inv_cdf(1 - alpha / 2)
z_power = NormalDist().inv_cdf(power)
results = []
for control, treatment in [(0.03, 0.045), (0.03, 0.033)]:
    pooled = (control + treatment) / 2
    null_sd = sqrt(2 * pooled * (1 - pooled))
    alternative_sd = sqrt(control * (1 - control) + treatment * (1 - treatment))
    approximate_n = ((z_alpha * null_sd + z_power * alternative_sd) / (treatment - control)) ** 2
    per_arm = ceil(approximate_n)
    # Verify power in the direction of the specified alternative at the rounded n.
    achieved_approximate_power = NormalDist().cdf((sqrt(per_arm) * (treatment - control) - z_alpha * null_sd) / alternative_sd)
    assert achieved_approximate_power >= power
    results.append({
        "assumed_control": control, "assumed_treatment": treatment,
        "alpha_two_sided": alpha, "target_power": power,
        "normal_approximate_n_per_arm": approximate_n,
        "rounded_n_per_arm": per_arm, "total_eligible_visitors": 2 * per_arm,
        "achieved_approximate_directional_power": achieved_approximate_power,
        "enrollment_weeks_at_total_visitors_per_week": {
            str(rate): 2 * per_arm / rate for rate in [100, 500, 1000]
        }
    })
assert [row['total_eligible_visitors'] for row in results] == [5036, 106422]
print(json.dumps({"illustrative_only": True, "results": results}, indent=2))
