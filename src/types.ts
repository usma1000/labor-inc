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

// TODO: this needs to be merged with GameState below
// this is the new approach to track upgrades
// instead of tracking upgrade state for each tool separately, track it per upgrade

// export interface GameState {
//   upgrades: Record<ToolName, ToolUpgrades>;
//   meritYield: Record<ToolName, number>;
//   holdTime: Record<ToolName, number>;
//   cooldownTime: Record<ToolName, number>;
//   autoPressEnabled: Record<ToolName, boolean>;

//   purchaseUpgrade: (tool: ToolName, upgradeId: string) => void;
// }

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
  autoPressEnabled: Record<ToolName, boolean>;
  purchaseUpgrade: (tool: ToolName, upgradeId: string) => void;

  // --- Button Upgrade State ---
  buttonWageAmount: number; // Amount earned per button press
  buttonCooldownTime: number; // Cooldown time (ms) after button is pressed
  buttonHoldTime: number; // Time (ms) required to hold button

  // --- Lever Upgrade State ---
  leverUnlocked: boolean; // Whether lever upgrades are available
  leverWageAmount: number; // Amount earned per lever pull
  leverDragSpeed: number; // Speed of lever drag (px/ms)
  leverResetSpeed: number; // Speed of lever reset (px/ms)

  // --- Actions ---
  addWage: (amount: number) => void; // Add to wage and check progression
  spendWage: (amount: number) => void; // Subtract from wage and check progression
  logMessage: (msg: string) => void; // Add a message to the log
  checkProgression: () => void; // Check and trigger milestone logic
};
