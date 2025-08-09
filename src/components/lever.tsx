import { useState, useRef, useCallback, useEffect } from "react";
import { useGameStore } from "../store";
import StatusLight, { type StatusLightColor } from "./status-light";

export default function Lever() {
  const leverDragSpeed = useGameStore((state) => state.leverDragSpeed);
  const leverResetSpeed = useGameStore((state) => state.leverResetSpeed);
  const leverWageAmount = useGameStore((state) => state.leverWageAmount);
  const addWage = useGameStore((state) => state.addWage);

  // Refs
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastUpdateTimeRef = useRef(0);
  const targetXRef = useRef(0);
  const currentXRef = useRef(0);
  const leverFullSoundRef = useRef<HTMLAudioElement | null>(null);
  const leverResetSoundRef = useRef<HTMLAudioElement | null>(null);

  // State
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [lightColor, setLightColor] = useState<StatusLightColor>("inactive");

  // Track dimensions
  const TRACK_WIDTH = 320;
  const HANDLE_RADIUS = 30;
  const TRACK_HEIGHT = 30;
  const MAX_X = TRACK_WIDTH - HANDLE_RADIUS;

  const updateHandlePosition = useCallback(() => {
    if (!handleRef.current || !isDraggingRef.current) return;

    const now = performance.now();
    const deltaTime = now - lastUpdateTimeRef.current;
    lastUpdateTimeRef.current = now;

    // Calculate max distance the handle can move this frame
    const maxMove = leverDragSpeed * deltaTime;

    // Calculate distance to target
    const diff = targetXRef.current - currentXRef.current;
    // Move handle toward target, but only up to maxMove
    const move = Math.min(Math.abs(diff), maxMove) * Math.sign(diff);

    currentXRef.current += move;
    handleRef.current.style.transform = `translateX(${currentXRef.current}px)`;

    // Update light color based on position
    if (currentXRef.current >= MAX_X * 0.95) {
      setLightColor("green");
    } else {
      setLightColor("inactive");
    }

    // Continue animation if still dragging
    if (isDraggingRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateHandlePosition);
    }
  }, [leverDragSpeed, MAX_X]);

  const startResetAnimation = useCallback(() => {
    isDraggingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsInCooldown(true);
    setLightColor("yellow");

    if (handleRef.current) {
      handleRef.current.style.transition = `transform ${leverResetSpeed}ms ease-in-out`;
      handleRef.current.style.transform = "translateX(0px)";
      currentXRef.current = 0;
      targetXRef.current = 0;

      setTimeout(() => {
        // Play reset sound when lever reaches start position
        if (leverResetSoundRef.current) {
          leverResetSoundRef.current.currentTime = 0;
          leverResetSoundRef.current.play().catch(() => {
            // Silently handle play() promise rejection
          });
        }

        if (handleRef.current) {
          handleRef.current.style.transition = "";
        }
        setIsInCooldown(false);
        setLightColor("inactive");
      }, leverResetSpeed);
    }
  }, [leverResetSpeed]);

  // Initialize audio and handle cleanup
  useEffect(() => {
    const basePath =
      window.location.hostname === "localhost" ? "" : "/labor-inc";
    leverFullSoundRef.current = new Audio(`${basePath}/lever-full.wav`);
    leverFullSoundRef.current.volume = 0.5;
    leverResetSoundRef.current = new Audio(`${basePath}/lever-reset.wav`);
    leverResetSoundRef.current.volume = 0.5;

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isInCooldown) return;

    const track = trackRef.current;
    if (!track) return;

    isDraggingRef.current = true;
    lastUpdateTimeRef.current = performance.now();

    const trackRect = track.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(MAX_X, e.clientX - trackRect.left - HANDLE_RADIUS / 2)
    );
    targetXRef.current = x;

    animationFrameRef.current = requestAnimationFrame(updateHandlePosition);

    // Add pointer move and up listeners to document
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDraggingRef.current || !trackRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(MAX_X, e.clientX - trackRect.left - HANDLE_RADIUS / 2)
      );
      targetXRef.current = x;
    },
    [MAX_X]
  );

  const handlePointerUp = useCallback(() => {
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);

    // Award merits if handle is near right end
    if (currentXRef.current >= MAX_X * 0.95) {
      addWage(leverWageAmount);
      // Play full lever sound
      if (leverFullSoundRef.current) {
        leverFullSoundRef.current.currentTime = 0;
        leverFullSoundRef.current.play().catch(() => {
          // Silently handle play() promise rejection
        });
      }
    }

    startResetAnimation();
  }, [addWage, leverWageAmount, handlePointerMove, startResetAnimation, MAX_X]);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4">
        <div
          ref={trackRef}
          className="relative bg-stone-400"
          style={{
            width: TRACK_WIDTH,
            height: TRACK_HEIGHT,
            borderRadius: TRACK_WIDTH,
            boxShadow:
              "inset 0 8px 10px rgba(30, 30, 30, 0.7), inset 0px -1px 0px #ffffff",
            position: "relative",
          }}
        >
          {/* Tick marks */}
          <div className="absolute -bottom-3 left-0 w-full flex flex-row justify-between px-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-2 w-[1px] bg-stone" />
            ))}
          </div>

          {/* Right highlight */}
          <div
            className="absolute right-0 top-0 h-full"
            style={{
              width: "1px",
              background: "rgba(255, 255, 255, 0.15)",
            }}
          />

          {/* Groove effect */}
          <div
            className="absolute top-1/2 bg-stone-600 rounded-2xl"
            style={{
              height: "6px",
              width: TRACK_WIDTH - HANDLE_RADIUS,
              left: HANDLE_RADIUS / 2,
              transform: "translateY(-50%)",
              boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.5)",
            }}
          />

          {/* Handle */}
          <div
            ref={handleRef}
            onPointerDown={handlePointerDown}
            style={{
              position: "absolute",
              width: HANDLE_RADIUS,
              height: HANDLE_RADIUS,
              background:
                "radial-gradient(circle at 35% 35%, #ffffff 0%, #d1d1d1 100%)",
              boxShadow: `
                0 2px 4px rgba(0,0,0,0.7),
                inset 2px 1px 4px rgba(255, 255, 255, 0.8),
                inset -1px -3px 4px rgba(0, 0, 0, 0.4)
              `,
              border: "1px solid rgba(0, 0, 0, 0.2)",
              cursor: isInCooldown ? "not-allowed" : "grab",
              userSelect: "none",
              touchAction: "none",
            }}
            className="rounded-full"
          />
        </div>
        {/* Status light */}
        <StatusLight color={lightColor} size={12} />
      </div>
    </div>
  );
}
