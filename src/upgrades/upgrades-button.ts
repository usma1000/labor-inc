import type { UpgradeConfig, UpgradeState } from "../types";

export const initialUpgrades: UpgradeConfig[] = [
  {
    id: "yield",
    name: "Output Optimization",
    description: "Increase merit earned per completed task.",
    baseCost: 10,
    costMultiplier: 1.6,
    effectBase: 1,
    effectStep: 1,
    isUnlocked: true,
  },
  {
    id: "holdTime",
    name: "Ergonomic Interface",
    description: "Reduce button hold time (min 2s).",
    baseCost: 15,
    costMultiplier: 1.8,
    effectBase: 5,
    effectStep: -0.5,
    minEffect: 2,
    isUnlocked: true,
  },
  {
    id: "cooldown",
    name: "Cycle Time Reduction",
    description: "Reduce button cooldown time (min 1s).",
    baseCost: 20,
    costMultiplier: 1.8,
    effectBase: 3,
    effectStep: -0.25,
    minEffect: 1,
    isUnlocked: true,
  },
  {
    id: "autoPress",
    name: "Auto-Press Module",
    description: "Automate the button press, removing hold time.",
    baseCost: 500,
    costMultiplier: 1, // fixed cost
    effectBase: 0, // irrelevant here
    effectStep: 0,
    isUnlocked: false,
  },
];

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

export function initUpgradeState(cfg: UpgradeConfig): UpgradeState {
  return {
    ...cfg,
    level: 0,
    currentCost: calcCost(cfg.baseCost, cfg.costMultiplier, 0),
    currentEffect:
      cfg.id === "autoPress"
        ? false // off at start
        : calcEffect(cfg.effectBase, cfg.effectStep, 0, cfg.minEffect),
  };
}
