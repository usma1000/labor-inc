export type ToolName = "button" | "lever" | "dial";
export interface UpgradeConfig {
  tool: ToolName;
  id: string; // e.g. "yield", "holdTime"
  name: string;
  description: string;
  baseCost: number;
  costMultiplier: number;
  maxLevel?: number;
  effectBase: number;
  effectStep: number;
  minEffect?: number;
  isUnlocked: boolean;
}

export interface UpgradeState extends UpgradeConfig {
  level: number;
  currentCost: number;
  currentEffect: number | boolean;
}
export type ToolUpgrades = Record<string, UpgradeState>;

export type GameState = {
  // --- Core State ---
  wage: number;
  messages: string[];
  lastWageEarned: Date | null; // Track last wage earned time
  upgradesUnlocked: boolean;
  milestonesReached: Set<string>; // Tracks which milestones have been triggered

  // --- Upgrade System ---
  upgrades: Record<ToolName, ToolUpgrades>;
  meritYield: Record<ToolName, number>;
  holdTime: Record<ToolName, number>;
  cooldownTime: Record<ToolName, number>;
  dragSpeed: Record<ToolName, number>;
  autoPressEnabled: Record<ToolName, boolean>;
  purchaseUpgrade: (tool: ToolName, upgradeId: string) => void;

  // --- Tool Availability ---
  leverUnlocked: boolean; // Whether the lever tool is available to use

  // --- Actions ---
  addWage: (amount: number) => void; // Add to wage and check progression
  spendWage: (amount: number) => void; // Subtract from wage and check progression
  logMessage: (msg: string) => void; // Add a message to the log
  checkProgression: () => void; // Check and trigger milestone logic
};
