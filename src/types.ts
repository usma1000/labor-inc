export type ButtonUpgradeType = "yield" | "holdTime" | "cooldown" | "autoPress";

export interface UpgradeConfig {
  id: ButtonUpgradeType;
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  maxLevel?: number;
  effectBase: number; // starting effect (e.g. 1 merit, 5 sec)
  effectStep: number; // increment or decrement per level
  minEffect?: number; // for holdTime/cooldown limits
  isUnlocked: boolean;
}

export interface UpgradeState extends UpgradeConfig {
  level: number;
  currentCost: number;
  currentEffect: number | boolean; // boolean for autoPress (on/off)
}
