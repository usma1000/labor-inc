import type { UpgradeConfig } from "../types";

export const buttonUpgrades: UpgradeConfig[] = [
  {
    tool: "button",
    id: "yield",
    name: "Output Optimization",
    description:
      "Output Optimization Initiative — every task you complete now produces more measurable productivity units.",
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
    description:
      "Ergonomic Interface Upgrade — your finger fatigue is of great concern to Objet Systems.",
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
    description:
      "Cycle Time Reduction Protocol — increase operational cadence without overheating (monitored for your safety).",
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
    description:
      "Integrated Auto-Press Module — enables perpetual contribution without human oversight.",
    baseCost: 500,
    costMultiplier: 1, // fixed cost
    effectBase: 0, // irrelevant here
    effectStep: 0,
    isUnlocked: false,
  },
];
