import { useRef, useCallback, useEffect } from "react";

/**
 * Knob component with mid-century modern aesthetic
 * Supports rotation via pointer drag
 */
export default function Knob() {
  const knobRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startAngleRef = useRef(0);
  const currentRotationRef = useRef(0);

  const KNOB_SIZE = 120;

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
      const currentAngle = getAngle(e.clientX, e.clientY);
      startAngleRef.current = currentAngle - currentRotationRef.current;

      knobRef.current.setPointerCapture(e.pointerId);
      knobRef.current.style.cursor = "grabbing";
    },
    [getAngle]
  );

  /**
   * Handles pointer move event to update rotation
   */
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDraggingRef.current || !knobRef.current) return;

      const currentAngle = getAngle(e.clientX, e.clientY);
      let newRotation = currentAngle - startAngleRef.current;

      // Normalize rotation to 0-360 range
      newRotation = ((newRotation % 360) + 360) % 360;

      currentRotationRef.current = newRotation;
      knobRef.current.style.transform = `rotate(${newRotation}deg)`;
    },
    [getAngle]
  );

  /**
   * Handles pointer up event to end rotation
   */
  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (!knobRef.current) return;

    isDraggingRef.current = false;
    knobRef.current.releasePointerCapture(e.pointerId);
    knobRef.current.style.cursor = "grab";
  }, []);

  // Set up pointer event listeners
  useEffect(() => {
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const TICK_COUNT = 8;
  const TICK_ANGLE_STEP = 360 / TICK_COUNT;

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
          />

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
