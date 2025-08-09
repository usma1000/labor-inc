import { useState, useRef, useEffect } from "react";
import { useGameStore } from "../store";
import StatusLight, { type StatusLightColor } from "./status-light";

// Constants for cleaner code
const LIGHT_COUNT = 5;
const FLASH_INTERVAL_MS = 350;

export default function Button() {
  // State for button and lights
  const [lights, setLights] = useState<number>(0);
  const [cooldown, setCooldown] = useState(false);
  const [flash, setFlash] = useState(false);

  // Refs for timers
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cooldownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sound refs
  const depressSoundRef = useRef<HTMLAudioElement | null>(null);

  // Store access
  const buttonWageAmount = useGameStore((state) => state.buttonWageAmount);
  const buttonCooldownTime = useGameStore((state) => state.buttonCooldownTime);
  const buttonHoldTime = useGameStore((state) => state.buttonHoldTime);
  const addWage = useGameStore((state) => state.addWage);

  // Initialize audio elements once
  useEffect(() => {
    depressSoundRef.current = new Audio("/button-depress.wav");
  }, []);

  /**
   * Clears all active timers and intervals
   */
  const clearAllTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (flashIntervalRef.current) {
      clearInterval(flashIntervalRef.current);
      flashIntervalRef.current = null;
    }
    if (cooldownTimeoutRef.current) {
      clearTimeout(cooldownTimeoutRef.current);
      cooldownTimeoutRef.current = null;
    }
  };

  /**
   * Starts cooldown mode after lights are filled
   */
  const startCooldown = () => {
    setCooldown(true);
    addWage(buttonWageAmount);

    // Configure flashing lights
    setFlash(true);
    flashIntervalRef.current = setInterval(() => {
      setFlash((prevFlash) => !prevFlash);
    }, FLASH_INTERVAL_MS);

    // Set cooldown timer
    cooldownTimeoutRef.current = setTimeout(() => {
      setCooldown(false);
      setFlash(false);
      setLights(0);
      if (flashIntervalRef.current) clearInterval(flashIntervalRef.current);
      flashIntervalRef.current = null;
      cooldownTimeoutRef.current = null;
      // Play depress sound after cooldown ends
      if (depressSoundRef.current) {
        depressSoundRef.current.currentTime = 0;
        depressSoundRef.current.play();
      }
    }, buttonCooldownTime);
  };

  const handlePointerDown = () => {
    // Don't do anything if already in progress or cooldown
    if (intervalRef.current || cooldown) return;

    // Play depress sound on press
    if (depressSoundRef.current) {
      depressSoundRef.current.currentTime = 0;
      depressSoundRef.current.play();
    }

    // Start with first light
    setLights(1);
    let count = 1;

    // Start filling lights
    intervalRef.current = setInterval(() => {
      count += 1;
      setLights(count);

      // Check if all lights are filled
      if (count === LIGHT_COUNT) {
        clearAllTimers();
        startCooldown();
      }
    }, buttonHoldTime / LIGHT_COUNT);
  };

  const handlePointerUp = () => {
    // Clear light filling interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Reset lights if not in cooldown
    if (!cooldown) setLights(0);
  };

  // Clean up on unmount
  useEffect(() => {
    return clearAllTimers;
  }, []);

  // Helper to determine light color
  const getLightColor = (index: number): StatusLightColor => {
    if (cooldown) {
      // During cooldown, flash yellow
      return flash ? "yellow" : "inactive";
    }
    // While charging, show green for filled lights
    return lights > index ? "green" : "inactive";
  };

  // Stay pressed in during cooldown with the pressed CSS class
  const buttonPressedClass = cooldown ? "scale-[0.975]" : "";
  const buttonShadowClass = cooldown ? "shadow-none" : "";

  return (
    <div className="flex flex-col items-center justify-center p-6 select-none">
      <button
        className={`relative cursor-pointer rounded-full bg-black/75 shadow-[-0.25em_-0.25em_0.25em_-0.1em_rgba(5,5,5,0.35),0.09em_0.09em_0.15em_0_rgba(5,5,5,0.18)] after:absolute after:left-[-0.2em] after:top-[-0.2em] after:z-0 after:h-[calc(100%+0.4em)] after:w-[calc(100%+0.4em)] after:rounded-[inherit] after:bg-[linear-gradient(-135deg,rgba(5,5,5,0.5),transparent_20%,transparent_100%)] after:opacity-25 after:blur-[0.018em] after:mix-blend-multiply z-10 ${buttonPressedClass}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        disabled={cooldown}
        style={{
          opacity: cooldown ? 0.6 : 1,
          pointerEvents: cooldown ? "none" : undefined,
          transform: cooldown ? "scale(0.975)" : undefined,
        }}
      >
        <div
          className={`relative z-[1] rounded-[inherit] shadow-[0_0.12em_0.12em_-0.02em_rgba(5,5,5,1),0_0.02em_0.02em_-0.01em_rgba(5,5,5,0.5),0.22em_0.4em_0.18em_-0.01em_rgba(5,5,5,0.28)] transition-shadow duration-300 will-change-[box-shadow] active:shadow-none ${buttonShadowClass}`}
        >
          <div
            className={`relative z-[1] overflow-clip rounded-[inherit] bg-[linear-gradient(135deg,rgba(230,230,230,1),rgba(180,180,180,1))] p-[1.4em_2.2em] transition-[box-shadow,clip-path,background-image,transform] duration-[300ms,250ms,250ms,250ms] will-change-[box-shadow,clip-path,background-image,transform] [clip-path:inset(0_0_0_0_round_999vw)] shadow-[0_0_0_0_inset_rgba(5,5,5,0.1),-0.09em_-0.09em_0.09em_0_inset_rgba(5,5,5,0.32),0_0_0_0_inset_rgba(5,5,5,0.1),0_0_0.09em_0.28em_inset_rgba(255,255,255,0.28),0.045em_0.09em_0.18em_0_inset_rgba(255,255,255,1),0.18em_0.18em_0.18em_inset_rgba(255,255,255,0.28),-0.12em_-0.32em_0.32em_0.14em_inset_rgba(5,5,5,0.28)] active:shadow-[0.1em_0.15em_0.05em_0_inset_rgba(5,5,5,0.75),-0.025em_-0.03em_0.05em_0.025em_inset_rgba(5,5,5,0.5),0.25em_0.25em_0.2em_0_inset_rgba(5,5,5,0.5),0_0_0.05em_0.5em_inset_rgba(255,255,255,0.15),0_0_0_0_inset_rgba(255,255,255,1),0.12em_0.12em_0.12em_inset_rgba(255,255,255,0.25),-0.075em_-0.12em_0.2em_0.1em_inset_rgba(5,5,5,0.25)] active:scale-[0.975] ${buttonPressedClass}`}
          >
            <span className="relative z-[4] block select-none uppercase font-mono text-lg tracking-wider font-semibold text-transparent bg-[linear-gradient(135deg,rgba(25,25,25,1),rgba(75,75,75,1))] bg-clip-text transition-transform duration-250 will-change-transform text-shadow-[rgba(0,0,0,0.1)_0_0_0.1em] active:scale-[0.975]">
              Push
            </span>
          </div>
        </div>
      </button>

      {/* Progress lights */}
      <div className="flex gap-3 mt-6">
        {Array.from({ length: LIGHT_COUNT }).map((_, i) => (
          <StatusLight key={i} color={getLightColor(i)} />
        ))}
      </div>
    </div>
  );
}
