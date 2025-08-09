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
  const targetYRef = useRef(0);
  const currentYRef = useRef(0);

  // State
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [lightColor, setLightColor] = useState<StatusLightColor>("inactive");

  // Track dimensions
  const TRACK_HEIGHT = 160;
  const HANDLE_RADIUS = 30;
  const TRACK_WIDTH = 30;
  const MAX_Y = TRACK_HEIGHT - HANDLE_RADIUS;

  const updateHandlePosition = useCallback(() => {
    if (!handleRef.current || !isDraggingRef.current) return;

    const now = performance.now();
    const deltaTime = now - lastUpdateTimeRef.current;
    lastUpdateTimeRef.current = now;

    // Calculate max distance the handle can move this frame
    const maxMove = leverDragSpeed * deltaTime;

    // Calculate distance to target
    const diff = targetYRef.current - currentYRef.current;
    // Move handle toward target, but only up to maxMove
    const move = Math.min(Math.abs(diff), maxMove) * Math.sign(diff);

    currentYRef.current += move;
    handleRef.current.style.transform = `translateY(${currentYRef.current}px)`;

    // Continue animation if still dragging
    if (isDraggingRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateHandlePosition);
    }
  }, [leverDragSpeed]);

  const startResetAnimation = useCallback(() => {
    isDraggingRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsInCooldown(true);
    setLightColor("yellow");

    if (handleRef.current) {
      handleRef.current.style.transition = `transform ${leverResetSpeed}ms ease-in-out`;
      handleRef.current.style.transform = "translateY(0px)";
      currentYRef.current = 0;
      targetYRef.current = 0;

      setTimeout(() => {
        if (handleRef.current) {
          handleRef.current.style.transition = "";
        }
        setIsInCooldown(false);
      }, leverResetSpeed);
    }
  }, [leverResetSpeed]);

  // Cleanup animation frame on unmount
  useEffect(() => {
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
    const y = Math.max(
      0,
      Math.min(MAX_Y, e.clientY - trackRect.top - HANDLE_RADIUS / 2)
    );
    targetYRef.current = y;

    animationFrameRef.current = requestAnimationFrame(updateHandlePosition);

    // Add pointer move and up listeners to document
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDraggingRef.current || !trackRef.current) return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const y = Math.max(
        0,
        Math.min(MAX_Y, e.clientY - trackRect.top - HANDLE_RADIUS / 2)
      );
      targetYRef.current = y;
    },
    [MAX_Y]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);

      // Award merits if handle is near bottom
      if (currentYRef.current >= MAX_Y * 0.95) {
        addWage(leverWageAmount);
        setLightColor("green");
      }

      startResetAnimation();
    },
    [addWage, leverWageAmount, handlePointerMove, startResetAnimation, MAX_Y]
  );

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
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
            overflow: "hidden",
          }}
        >
          {/* Tick marks */}
          <div className="absolute -right-3 top-0 h-full flex flex-col justify-between py-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-[1px] bg-stone-400"
                style={{
                  boxShadow: "0 1px 1px rgba(0, 0, 0, 0.3)",
                }}
              />
            ))}
          </div>

          {/* Bottom highlight */}
          <div
            className="absolute left-0 bottom-0 w-full"
            style={{
              height: "1px",
              background: "rgba(255, 255, 255, 0.15)",
            }}
          />

          {/* Groove effect */}
          <div
            className="absolute left-1/2 bg-stone-600 rounded-2xl"
            style={{
              width: "6px",
              height: TRACK_HEIGHT - HANDLE_RADIUS,
              top: HANDLE_RADIUS / 2,
              transform: "translateX(-50%)",
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
            className="rounded-full z-10"
          />
        </div>
      </div>

      {/* Status light */}
      <StatusLight color={lightColor} size={12} />
    </div>
  );
}
