import { create } from "zustand";

type GameState = {
  wage: number;

  // Button upgrades
  buttonWageAmount: number;
  buttonCooldownTime: number;
  buttonHoldTime: number;

  messages: string[];
  upgradesUnlocked: boolean;
  addWage: (amount: number) => void;
  logMessage: (msg: string) => void;
  checkProgression: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  wage: 0,
  messages: [
    "Welcome to your new job.",
    "Your first task: hold the button to start working.",
  ],
  upgradesUnlocked: false,
  buttonWageAmount: 1,
  buttonCooldownTime: 5000,
  buttonHoldTime: 1000,

  addWage: (amount) => {
    set((state) => ({ wage: state.wage + amount }));
    get().checkProgression();
  },

  logMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  checkProgression: () => {
    const { wage, logMessage } = get();

    if (wage === 1) {
      logMessage(
        "You have proven that you can do basic tasks. Keep going. Remember — steady work leads to steady pay."
      );
    }

    if (wage === 5) {
      logMessage("Upgrades are now available.");
      set({ upgradesUnlocked: true });
    }
  },
}));
