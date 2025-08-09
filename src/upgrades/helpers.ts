export function calcCost(
  baseCost: number,
  multiplier: number,
  level: number
): number {
  return Math.floor(baseCost * Math.pow(multiplier, level));
}

export function calcEffect(
  effectBase: number,
  effectStep: number,
  level: number,
  minEffect?: number
): number {
  const rawEffect = effectBase + effectStep * level;
  if (minEffect !== undefined) {
    return effectStep < 0
      ? Math.max(minEffect, rawEffect)
      : Math.min(minEffect, rawEffect);
  }
  return rawEffect;
}
