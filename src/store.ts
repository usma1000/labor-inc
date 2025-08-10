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

// Dev mode configuration
const DEV_MODE = import.meta.env.DEV; // This will be true in development, false in production
const INITIAL_DEV_MERITS = 500; // Adjust this value for testing

export const useGameStore = create<GameState>((set, get) => {
  // Audio for message notification
  let messageAudio: HTMLAudioElement | null = null;
  if (typeof window !== "undefined" && typeof Audio !== "undefined") {
    const basePath =
      window.location.hostname === "localhost" ? "" : "/labor-inc";
    messageAudio = new Audio(`${basePath}/message.wav`);
    messageAudio.volume = 0.15;
  }

  const upgradesInit = groupUpgradesByTool(allUpgrades);

  // Initialize stats per tool or zero if missing
  const meritYield: Record<ToolName, number> = {
    button: (upgradesInit.button.yield?.currentEffect as number) || 0,
    lever: (upgradesInit.lever.yield?.currentEffect as number) || 0,
    dial: (upgradesInit.dial.yield?.currentEffect as number) || 0,
  };

  const dragSpeed: Record<ToolName, number> = {
    button: 0,
    lever: (upgradesInit.lever.dragSpeed?.currentEffect as number) || 0.1,
    dial: 0,
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
    dragSpeed,
    holdTime,
    cooldownTime,
    autoPressEnabled,

    purchaseUpgrade: (tool: ToolName, upgradeId: string) => {
      const state = get();
      const upgrades = { ...state.upgrades };
      const upgrade = upgrades[tool][upgradeId];
      if (!upgrade) return;

      // Check if player has enough merits
      if (state.wage < upgrade.currentCost) return;

      const newLevel = upgrade.level + 1;
      if (upgrade.maxLevel && newLevel > upgrade.maxLevel) return;

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

      // Spend the merits
      state.spendWage(upgrade.currentCost);

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
        dragSpeed: {
          ...get().dragSpeed,
          [tool]: upgrades[tool].dragSpeed
            ? (upgrades[tool].dragSpeed.currentEffect as number)
            : tool === "lever"
            ? 0.1
            : 0,
        },
      });
    },
    // --- Core State ---
    wage: DEV_MODE ? INITIAL_DEV_MERITS : 0,
    messages: [
      "Welcome, Associate. You are now an essential part of Objet Systems, where every spark of Desire is refined into measurable Productivity™.",
      "Your first Task awaits. Remember: your output ensures your well-being, and your well-being ensures output. (Your work is being monitored for your safety.)",
      ...(DEV_MODE ? ["[DEV MODE ACTIVE]"] : []),
    ],
    lastWageEarned: null,
    upgradesUnlocked: DEV_MODE,
    milestonesReached: new Set(),

    // --- Tool Availability ---
    leverUnlocked: false,

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
        messageAudio.play().catch(() => {
          // Silently handle play() promise rejection
        });
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
          "The Button is not merely a Tool — it is a conduit. Push with intent, release with purpose."
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
          "A new Tool is now available. A good Associate knows how to use all available Tools to maximize productivity. Remember: Efficiency is the highest form of self-respect. The Lever serves you as much as you serve The Lever."
        );
        set({ leverUnlocked: true });
      });

      triggerMilestone("wage_500", wage >= 500, () => {
        logMessage(
          "Congratulations, Associate. You have successfully accrued 500 Merits™. Remember: wealth is meaningless until it is reinvested into the Company. Your loyalty compounds faster than your earnings."
        );
      });

      triggerMilestone(
        "wage_idle",
        lastWageEarned !== null &&
          new Date().getTime() - lastWageEarned.getTime() > 30000,
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
