import type { UpgradeConfig } from "../types";

export const leverUpgrades: UpgradeConfig[] = [
  {
    tool: "lever",
    id: "yield",
    name: "Lever Output Optimization",
    description:
      "Greater yield per motion—because the company values every ounce of you.",
    baseCost: 10,
    costMultiplier: 1.5,
    effectBase: 1,
    effectStep: 1,
    maxLevel: 5,
    isUnlocked: true,
  },
  {
    tool: "lever",
    id: "dragSpeed",
    name: "Lever Ergonomic Adjustment",
    description:
      "Streamlined design to prevent worker fatigue—and maintain pace.",
    baseCost: 15,
    costMultiplier: 1.6,
    effectBase: 1.0,
    effectStep: 1.0,
    minEffect: 1.0,
    maxLevel: 4,
    isUnlocked: true,
  },
  {
    tool: "lever",
    id: "cooldown",
    name: "Lever Reset Optimization",
    description:
      "Why wait, when every moment of delay is a loss for the greater good?",
    baseCost: 20,
    costMultiplier: 1.6,
    effectBase: 3,
    effectStep: -0.25,
    minEffect: 1,
    maxLevel: 4,
    isUnlocked: true,
  },
  {
    tool: "lever",
    id: "autoPress",
    name: "Auto-Pull Mechanism",
    description:
      "Unyielding, mechanical, and tireless—an operator as perfect as the company envisioned.",
    baseCost: 250,
    costMultiplier: 1,
    effectBase: 0,
    effectStep: 0,
    maxLevel: 1,
    isUnlocked: false,
  },
];
