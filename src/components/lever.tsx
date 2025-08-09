import { useState, useRef, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { useGameStore } from "../store";

export default function Lever() {
  const [isResetting, setIsResetting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  // const animationFrameRef = useRef<number | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  const sliderWidth = 300; // Total slider width
  const threshold = sliderWidth * 0.95; // Success threshold
  const controls = useAnimation();
  const x = useMotionValue(0);

  const { successChance, increaseWage, maxSliderSpeed, resetDuration } =
    useGameStore();

  // Calculate background gradient based on slider position
  const background = useTransform(
    x,
    [0, threshold],
    [
      "linear-gradient(to right, #e5e7eb, #9ca3af)",
      "linear-gradient(to right, #10b981, #34d399)",
    ]
  );

  // Move the slider with speed limiting
  const moveSlider = (targetX: number) => {
    const now = Date.now();
    const elapsed = now - lastUpdateTimeRef.current;
    const currentX = x.get();

    // Don't move left
    if (targetX < currentX) return;

    // Calculate maximum allowed movement based on speed limit
    const maxMovement = maxSliderSpeed * elapsed; // pixels per millisecond

    // Calculate desired movement
    const desiredMovement = targetX - currentX;

    // Apply speed limit
    const actualMovement = Math.min(desiredMovement, maxMovement);

    // Apply the movement (capped to slider bounds)
    const newPosition = Math.min(currentX + actualMovement, sliderWidth - 56);
    x.set(newPosition);

    // Update the time reference
    lastUpdateTimeRef.current = now;
  };

  // Handle mouse down on the knob or track
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isResetting) return;

    // Immediately start tracking the mouse
    setIsDragging(true);
    lastUpdateTimeRef.current = Date.now();

    // Get initial slider container position and handle first move
    const sliderRect = sliderContainerRef.current?.getBoundingClientRect();
    if (sliderRect) {
      const initialTargetX = Math.max(
        0,
        Math.min(e.clientX - sliderRect.left, sliderWidth - 56)
      );
      moveSlider(initialTargetX);
    }

    // Add event listeners to track mouse movement and release
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || isResetting) return;

    // Get slider container position
    const sliderRect = sliderContainerRef.current?.getBoundingClientRect();
    if (!sliderRect) return;

    // Calculate target position relative to slider container
    const targetX = Math.max(
      0,
      Math.min(e.clientX - sliderRect.left, sliderWidth - 56)
    );

    // Move the slider with speed limiting
    moveSlider(targetX);
  };

  // Handle mouse up - end drag
  const handleMouseUp = async () => {
    if (!isDragging) return;

    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    const currentPosition = x.get();

    // Check if slider has been dragged far enough
    const completed = currentPosition >= threshold;
    if (completed) {
      // Success - completed the slider
      const success = Math.random() < successChance;
      if (success) {
        increaseWage(1); // Add wage on success
        console.log(
          `Success! Earned $1. New wage: ${useGameStore.getState().wage}`
        );
      } else {
        // Handle failure case
        useGameStore.getState().addFailure();
        console.log(
          `Failed attempt. Failures: ${useGameStore.getState().failures}`
        );
      }
    }

    // Reset the slider
    await resetSlider();
  };

  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Reset the slider to initial position
  const resetSlider = async () => {
    setIsResetting(true);
    await controls.start({
      x: 0,
      transition: { duration: resetDuration, ease: "easeInOut" },
    });
    setIsResetting(false);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div
        ref={sliderContainerRef}
        className={`h-16 bg-gray-200 rounded-full overflow-hidden relative ${
          isResetting ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{ width: `${sliderWidth}px` }}
        onMouseDown={isResetting ? undefined : handleMouseDown}
      >
        {/* Track background */}
        <motion.div
          className="w-full h-full absolute"
          style={{ background: background as any }}
        />

        {/* Draggable knob */}
        <motion.div
          className={`w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center 
            ${
              isResetting
                ? "cursor-not-allowed pointer-events-none"
                : "cursor-grab active:cursor-grabbing"
            }
            absolute top-1`}
          animate={controls}
          style={{ x }}
          whileHover={isResetting ? {} : { scale: 1.03 }}
          whileTap={isResetting ? {} : { scale: 1.05 }}
          onMouseDown={(e) => {
            e.stopPropagation(); // Prevent double handling
            if (!isResetting) handleMouseDown(e);
          }}
        >
          <div className="w-2 h-8 bg-gray-300 rounded-full" />
        </motion.div>
      </div>
      <p className="text-center mt-2 text-sm text-gray-600">
        {isResetting ? "Resetting..." : "Drag to increase wage"}
      </p>
    </div>
  );
}
