import { create } from "zustand";

interface GameState {
  wage: number;
  failures: number;
  successChance: number;
  sliderSpeedLevel: number;
  maxSliderSpeed: number;
  resetDuration: number;
  log: string[];
  increaseWage: (amount: number) => void;
  addFailure: () => void;
  reduceFailure: () => void;
  upgradeSliderSpeed: () => void;
  addLogMessage: (msg: string) => void;
}

// Speed constants
const BASE_SLIDER_SPEED = 0.1; // pixels per ms
const SPEED_INCREMENT = 0.05;
const BASE_RESET_DURATION = 2.0; // seconds

export const useGameStore = create<GameState>((set) => ({
  wage: 0,
  failures: 0,
  successChance: 0.8,
  sliderSpeedLevel: 1,
  maxSliderSpeed: BASE_SLIDER_SPEED,
  resetDuration: BASE_RESET_DURATION,
  log: [
    "Welcome to your new job.",
    "Your first task: hold the button to start working.",
  ],
  increaseWage: (amount) => set((state) => ({ wage: state.wage + amount })),
  addFailure: () => set((state) => ({ failures: state.failures + 1 })),
  reduceFailure: () =>
    set((state) => ({
      failures: state.failures > 0 ? state.failures - 1 : 0,
    })),
  upgradeSliderSpeed: () =>
    set((state) => ({
      sliderSpeedLevel: state.sliderSpeedLevel + 1,
      maxSliderSpeed:
        BASE_SLIDER_SPEED + state.sliderSpeedLevel * SPEED_INCREMENT,
    })),
  addLogMessage: (msg) => set((state) => ({ log: [...state.log, msg] })),
}));
