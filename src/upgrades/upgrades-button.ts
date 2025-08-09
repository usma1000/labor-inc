import type { UpgradeConfig } from "../types";

export const buttonUpgrades: UpgradeConfig[] = [
  {
    tool: "button",
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
    tool: "button",
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
    tool: "button",
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
    tool: "button",
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
