import { create } from "zustand";
import type {
  GameState,
  ToolName,
  ToolUpgrades,
  UpgradeConfig,
  UpgradeState,
} from "./types";
import { calcCost, calcEffect } from "./upgrades/helpers";
import { allUpgrades } from "./upgrades";

function initUpgradeState(cfg: UpgradeConfig): UpgradeState {
  return {
    ...cfg,
    level: 0,
    currentCost: calcCost(cfg.baseCost, cfg.costMultiplier, 0),
    currentEffect:
      cfg.id === "autoPress"
        ? false
        : calcEffect(cfg.effectBase, cfg.effectStep, 0, cfg.minEffect),
  };
}

function groupUpgradesByTool(
  configs: UpgradeConfig[]
): Record<ToolName, ToolUpgrades> {
  const grouped: Record<ToolName, ToolUpgrades> = {
    button: {},
    lever: {},
    dial: {},
  };

  for (const cfg of configs) {
    grouped[cfg.tool][cfg.id] = initUpgradeState(cfg);
  }

  return grouped;
}

export const useGameStore = create<GameState>((set, get) => {
  // Audio for message notification
  let messageAudio: HTMLAudioElement | null = null;
  if (typeof window !== "undefined" && typeof Audio !== "undefined") {
    messageAudio = new Audio("/message.wav");
  }

  const upgradesInit = groupUpgradesByTool(allUpgrades);

  // Initialize stats per tool or zero if missing
  const meritYield: Record<ToolName, number> = {
    button: (upgradesInit.button.yield?.currentEffect as number) || 0,
    lever: (upgradesInit.lever.yield?.currentEffect as number) || 0,
    dial: (upgradesInit.dial.yield?.currentEffect as number) || 0,
  };

  const holdTime: Record<ToolName, number> = {
    button: (upgradesInit.button.holdTime?.currentEffect as number) || 0,
    lever: (upgradesInit.lever.holdTime?.currentEffect as number) || 0,
    dial: (upgradesInit.dial.holdTime?.currentEffect as number) || 0,
  };

  const cooldownTime: Record<ToolName, number> = {
    button: (upgradesInit.button.cooldown?.currentEffect as number) || 0,
    lever: (upgradesInit.lever.cooldown?.currentEffect as number) || 0,
    dial: (upgradesInit.dial.cooldown?.currentEffect as number) || 0,
  };

  const autoPressEnabled: Record<ToolName, boolean> = {
    button: (upgradesInit.button.autoPress?.currentEffect as boolean) || false,
    lever: (upgradesInit.lever.autoPress?.currentEffect as boolean) || false,
    dial: (upgradesInit.dial.autoPress?.currentEffect as boolean) || false,
  };

  const store: GameState = {
    upgrades: upgradesInit,
    meritYield,
    holdTime,
    cooldownTime,
    autoPressEnabled,

    purchaseUpgrade: (tool, upgradeId) => {
      const upgrades = { ...get().upgrades };
      const upgrade = upgrades[tool][upgradeId];
      if (!upgrade) return;

      // TODO: check if player has enough merits here before buying

      const newLevel = upgrade.level + 1;
      const newCost = calcCost(
        upgrade.baseCost,
        upgrade.costMultiplier,
        newLevel
      );
      const newEffect =
        upgrade.id === "autoPress"
          ? true
          : calcEffect(
              upgrade.effectBase,
              upgrade.effectStep,
              newLevel,
              upgrade.minEffect
            );

      upgrades[tool] = {
        ...upgrades[tool],
        [upgradeId]: {
          ...upgrade,
          level: newLevel,
          currentCost: newCost,
          currentEffect: newEffect,
        },
      };

      set({
        upgrades,
        meritYield: {
          ...get().meritYield,
          [tool]: upgrades[tool].yield
            ? (upgrades[tool].yield.currentEffect as number)
            : 0,
        },
        holdTime: {
          ...get().holdTime,
          [tool]: upgrades[tool].holdTime
            ? (upgrades[tool].holdTime.currentEffect as number)
            : 0,
        },
        cooldownTime: {
          ...get().cooldownTime,
          [tool]: upgrades[tool].cooldown
            ? (upgrades[tool].cooldown.currentEffect as number)
            : 0,
        },
        autoPressEnabled: {
          ...get().autoPressEnabled,
          [tool]: upgrades[tool].autoPress
            ? (upgrades[tool].autoPress.currentEffect as boolean)
            : false,
        },
      });
    },
    // --- Core State ---
    wage: 0,
    messages: [
      "Welcome, Associate. You are now an essential part of Objet Systems, where every spark of Desire is refined into measurable Productivity™.",
      "Your first Task awaits. Remember: your output ensures your well-being, and your well-being ensures output. (Your work is being monitored for your safety.)",
    ],
    lastWageEarned: null,
    upgradesUnlocked: false,
    milestonesReached: new Set(),

    // --- Button Upgrade State ---
    buttonWageAmount: 1,
    buttonCooldownTime: 5000,
    buttonHoldTime: 3000,

    // --- Lever Upgrade State ---
    leverUnlocked: false,
    leverWageAmount: 1,
    leverDragSpeed: 0.2,
    leverResetSpeed: 1000,

    // --- Actions ---
    addWage: (amount) => {
      set((state) => ({ wage: state.wage + amount }));
      get().checkProgression();
      set({ lastWageEarned: new Date() });
    },

    spendWage: (amount) => {
      set((state) => ({ wage: state.wage - amount }));
      get().checkProgression();
    },

    logMessage: (msg) => {
      set((state) => ({ messages: [...state.messages, msg] }));
      if (messageAudio) {
        messageAudio.currentTime = 0;
        messageAudio.play();
      }
    },

    checkProgression: () => {
      const { wage, milestonesReached, lastWageEarned, logMessage } = get();

      const triggerMilestone = (
        id: string,
        condition: boolean,
        callback: () => void
      ) => {
        if (condition && !milestonesReached.has(id)) {
          callback();
          set((state) => ({
            milestonesReached: new Set([...state.milestonesReached, id]),
          }));
        }
      };

      triggerMilestone("first_wage", wage >= 1, () => {
        logMessage(
          "You have earned your first of many Objet Merits™. Your contributions are now officially recognized in the Merits™ System. Every Merits™ earned is proof you have aligned your desires with ours. Remember — steady work leads to steady pay*."
        );
      });

      triggerMilestone("third_wage", wage >= 3, () => {
        logMessage(
          "The Button is not merely a tool — it is a conduit. Push with intent, release with purpose."
        );
      });

      triggerMilestone("unlock_upgrades", wage >= 5, () => {
        logMessage(
          "Congratulations on completing your Orientation Cycle. Your capacity for focus has been logged for future assignments. Associates who consistently produce value are granted access to Expanded Operations."
        );
        set({ upgradesUnlocked: true });
      });

      triggerMilestone("unlock_lever", wage >= 10, () => {
        logMessage(
          "A new Task is now available. A good Associate knows how to use all available tools to maximize productivity. Remember: Efficiency is the highest form of self-respect. The Lever serves you as much as you serve The Lever."
        );
        set({ leverUnlocked: true });
      });

      triggerMilestone(
        "wage_idle",
        lastWageEarned !== null &&
          new Date().getTime() - lastWageEarned.getTime() > 3000,
        () => {
          logMessage(
            "A minor deviation in your output curve has been observed and logged. Your last Merits™ acquisition occurred at " +
              lastWageEarned?.toLocaleTimeString() +
              ". Every moment of idleness is a moment of lost potential."
          );
        }
      );
    },
  };
  return store;
});
