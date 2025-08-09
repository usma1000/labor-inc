import { create } from "zustand";

type GameState = {
  // --- Core State ---
  wage: number;
  messages: string[];
  upgradesUnlocked: boolean;
  milestonesReached: Set<string>; // Tracks which milestones have been triggered

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

export const useGameStore = create<GameState>((set, get) => ({
  // --- Core State ---
  wage: 0,
  messages: [
    "Welcome to your new job.",
    "Your first task: hold the button to start working.",
  ],
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
  },

  spendWage: (amount) => {
    set((state) => ({ wage: state.wage - amount }));
    get().checkProgression();
  },

  logMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  checkProgression: () => {
    const { wage, milestonesReached, logMessage } = get();

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
        "You have proven that you can do basic tasks. Keep going. Remember — steady work leads to steady pay."
      );
    });

    triggerMilestone("unlock_upgrades", wage >= 5, () => {
      logMessage(
        "Upgrades are now available for purchase. Use your own wage to buy them."
      );
      set({ upgradesUnlocked: true });
    });

    triggerMilestone("lever_unlock", wage >= 10, () => {
      logMessage(
        "Lever upgrades are now available. A good employee knows how to use all available tools to maximize productivity."
      );
      set({ leverUnlocked: true });
    });
  },
}));
