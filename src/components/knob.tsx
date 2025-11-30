import { useRef, useCallback, useEffect, useState } from "react";
import { useGameStore } from "../store";
import StatusLight, { type StatusLightColor } from "./status-light";

/**
 * Knob component with mid-century modern aesthetic
 * Supports rotation via pointer drag with snap-to-tick functionality
 */
export default function Knob() {
  const knobRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startAngleRef = useRef(0);
  const currentRotationRef = useRef(0);
  const previousRotationRef = useRef(0);
  const lastUpdateTimeRef = useRef(0);

  const [lightColor, setLightColor] = useState<StatusLightColor>("inactive");
  const [activeTickIndex, setActiveTickIndex] = useState<number>(0);
  const [isCorrectlyPositioned, setIsCorrectlyPositioned] = useState(false);

  const addWage = useGameStore((state) => state.addWage);
  const meritYield = useGameStore((state) => state.meritYield.dial || 1);

  const KNOB_SIZE = 120;
  const TICK_COUNT = 8;
  const TICK_ANGLE_STEP = 360 / TICK_COUNT;
  const MAX_ROTATION_SPEED = 0.1; // degrees per millisecond (slower, more controlled)
  const SNAP_THRESHOLD = TICK_ANGLE_STEP / 2; // Half a tick step for snapping detection
  const ACTIVE_TICK_INTERVAL = 10000; // 5 seconds

  /**
   * Calculates angle from center point to mouse/touch position
   */
  const getAngle = useCallback((clientX: number, clientY: number): number => {
    if (!knobRef.current) return 0;

    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  }, []);

  /**
   * Handles pointer down event to start rotation
   */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!knobRef.current) return;

      isDraggingRef.current = true;
      lastUpdateTimeRef.current = performance.now();
      previousRotationRef.current = currentRotationRef.current;

      // Remove any transition for smooth dragging
      knobRef.current.style.transition = "";

      const currentAngle = getAngle(e.clientX, e.clientY);
      startAngleRef.current = currentAngle - currentRotationRef.current;

      knobRef.current.setPointerCapture(e.pointerId);
      knobRef.current.style.cursor = "grabbing";
    },
    [getAngle]
  );

  /**
   * Snaps rotation to nearest tick mark and returns the tick index
   */
  const snapToNearestTick = useCallback(
    (rotation: number): { angle: number; tickIndex: number } => {
      const normalizedRotation = ((rotation % 360) + 360) % 360;
      const tickIndex =
        Math.round(normalizedRotation / TICK_ANGLE_STEP) % TICK_COUNT;
      const angle = (tickIndex * TICK_ANGLE_STEP) % 360;
      return { angle, tickIndex };
    },
    []
  );

  /**
   * Checks if current rotation is within snapping distance of a target tick
   */
  const isNearTick = useCallback(
    (rotation: number, targetTickIndex: number): boolean => {
      const targetAngle = (targetTickIndex * TICK_ANGLE_STEP) % 360;
      const normalizedRotation = ((rotation % 360) + 360) % 360;
      let diff = Math.abs(normalizedRotation - targetAngle);
      if (diff > 180) {
        diff = 360 - diff;
      }
      return diff <= SNAP_THRESHOLD;
    },
    []
  );

  /**
   * Handles pointer move event to update rotation with speed limiting
   */
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDraggingRef.current || !knobRef.current) return;

      const now = performance.now();
      const deltaTime = now - lastUpdateTimeRef.current;
      lastUpdateTimeRef.current = now;

      const currentAngle = getAngle(e.clientX, e.clientY);
      let targetRotation = currentAngle - startAngleRef.current;

      // Normalize rotation to 0-360 range
      targetRotation = ((targetRotation % 360) + 360) % 360;

      // Cap rotation speed
      const previousRotation = currentRotationRef.current;
      let rotationDelta = targetRotation - previousRotation;

      // Handle wrap-around (e.g., going from 350° to 10°)
      if (rotationDelta > 180) {
        rotationDelta -= 360;
      } else if (rotationDelta < -180) {
        rotationDelta += 360;
      }

      // Limit rotation speed
      const maxDelta = MAX_ROTATION_SPEED * deltaTime;
      const limitedDelta = Math.max(
        -maxDelta,
        Math.min(maxDelta, rotationDelta)
      );
      const newRotation = (previousRotation + limitedDelta + 360) % 360;

      currentRotationRef.current = newRotation;
      knobRef.current.style.transform = `rotate(${newRotation}deg)`;

      // Check if near active tick while dragging (yellow light)
      if (isNearTick(newRotation, activeTickIndex)) {
        setLightColor("yellow");
      } else {
        setLightColor("inactive");
      }
    },
    [getAngle, isNearTick, activeTickIndex]
  );

  /**
   * Handles pointer up event to end rotation and snap to nearest tick
   */
  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (!knobRef.current) return;

      isDraggingRef.current = false;
      knobRef.current.releasePointerCapture(e.pointerId);
      knobRef.current.style.cursor = "grab";

      // Snap to nearest tick mark
      const { angle: snappedRotation, tickIndex } = snapToNearestTick(
        currentRotationRef.current
      );
      currentRotationRef.current = snappedRotation;

      // Check if snapped to correct active tick
      const isCorrect = tickIndex === activeTickIndex;
      setIsCorrectlyPositioned(isCorrect);

      if (isCorrect) {
        setLightColor("green");
      } else {
        setLightColor("inactive");
      }

      // Animate to snapped position
      knobRef.current.style.transition =
        "transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)";
      knobRef.current.style.transform = `rotate(${snappedRotation}deg)`;

      // Remove transition after animation completes
      setTimeout(() => {
        if (knobRef.current) {
          knobRef.current.style.transition = "";
        }
      }, 200);
    },
    [snapToNearestTick, activeTickIndex]
  );

  // Set up pointer event listeners
  useEffect(() => {
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  // Change active tick every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newActiveTick = Math.floor(Math.random() * TICK_COUNT);
      setActiveTickIndex(newActiveTick);

      // Check if already at the new active tick
      const { tickIndex } = snapToNearestTick(currentRotationRef.current);
      if (tickIndex === newActiveTick) {
        setIsCorrectlyPositioned(true);
        setLightColor("green");
      } else {
        setIsCorrectlyPositioned(false);
        setLightColor("inactive");
      }
    }, ACTIVE_TICK_INTERVAL);

    return () => clearInterval(interval);
  }, [snapToNearestTick]);

  // Earn merits while correctly positioned (green light)
  useEffect(() => {
    if (!isCorrectlyPositioned || lightColor !== "green") return;

    const meritInterval = setInterval(() => {
      addWage(meritYield);
    }, 1000); // 1 merit per second

    return () => clearInterval(meritInterval);
  }, [isCorrectlyPositioned, lightColor, addWage, meritYield]);

  return (
    <div className="flex flex-col items-center justify-center p-6 select-none">
      <div
        className="relative"
        style={{
          width: KNOB_SIZE,
          height: KNOB_SIZE,
        }}
      >
        {/* Fixed outer container with shadows and highlights */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Outer ring with subtle shadow - fixed */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(
                circle at 30% 30%,
                rgba(255, 255, 255, 0.4) 0%,
                rgba(220, 219, 216, 0.95) 25%,
                rgba(197, 194, 189, 0.98) 50%,
                rgba(178, 175, 167, 1) 75%,
                rgba(115, 113, 106, 1) 100%
              )`,
              boxShadow: `
                inset 0 2px 4px rgba(255, 255, 255, 0.6),
                inset 0 -2px 4px rgba(5, 5, 5, 0.4),
                0 4px 8px rgba(5, 5, 5, 0.35),
                0 8px 16px rgba(5, 5, 5, 0.25),
                0 12px 24px rgba(5, 5, 5, 0.15),
                0 0 0 1px rgba(5, 5, 5, 0.2)
              `,
              border: "1px solid rgba(5, 5, 5, 0.2)",
            }}
          />

          {/* Inner raised center - fixed */}
          <div
            className="absolute rounded-full"
            style={{
              width: KNOB_SIZE * 0.65,
              height: KNOB_SIZE * 0.65,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(
                circle at 35% 35%,
                rgba(255, 255, 255, 0.5) 0%,
                rgba(245, 243, 239, 0.8) 30%,
                rgba(220, 219, 216, 0.9) 60%,
                rgba(178, 175, 167, 1) 100%
              )`,
              boxShadow: `
                inset 0 1px 2px rgba(255, 255, 255, 0.8),
                inset 0 -1px 2px rgba(55, 54, 51, 0.2),
                0 2px 4px rgba(55, 54, 51, 0.15)
              `,
            }}
          >
            {/* Status light in center */}
            <div
              className="absolute"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <StatusLight color={lightColor} size={12} />
            </div>
          </div>

          {/* Subtle highlight on top - fixed */}
          <div
            className="absolute rounded-full"
            style={{
              width: KNOB_SIZE * 0.4,
              height: KNOB_SIZE * 0.15,
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              background:
                "radial-gradient(ellipse, rgba(255, 255, 255, 0.3), transparent 70%)",
            }}
          />
        </div>

        {/* Tick marks - fixed around perimeter, outside the knob */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: TICK_COUNT }).map((_, i) => {
            const angle = i * TICK_ANGLE_STEP;
            const radian = (angle * Math.PI) / 180;
            const tickLength = 12; // 50% longer than before (was 8)
            const tickWidth = 1;
            const radius = KNOB_SIZE / 2 + 16; // Position outside with gap

            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            return (
              <div
                key={i}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  width: `${tickWidth}px`,
                  height: `${tickLength}px`,
                  background: "rgba(178, 175, 167, 1)",
                  transformOrigin: "center",
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${
                    angle + 90
                  }deg)`,
                }}
              />
            );
          })}
        </div>

        {/* Rotating knob with indicator line */}
        <div
          ref={knobRef}
          onPointerDown={handlePointerDown}
          className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        >
          {/* Position indicator indentation - rotates with knob, only on outer ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: "4px",
              height: `${((1 - 0.65) / 2) * 100}%`, // Height matches outer ring thickness (17.5%)
              top: "1%",
              left: "50%",
              transform: "translateX(-50%)",
              background:
                "linear-gradient(to bottom, rgba(55, 54, 51, 0.4), rgba(55, 54, 51, 0.6))",
              boxShadow: `
                inset 0 2px 4px rgba(0, 0, 0, 0.3),
                inset 0 -1px 2px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(0, 0, 0, 0.1)
              `,
              borderRadius: "2px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
