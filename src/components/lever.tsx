import { useState, useRef } from "react";
import { useGameStore } from "../store";
import * as motion from "motion/react-client";

export default function Lever() {
  const leverDragSpeed = useGameStore((state) => state.leverDragSpeed);
  const leverResetSpeed = useGameStore((state) => state.leverResetSpeed);
  const trackRef = useRef<HTMLDivElement>(null);

  // Track dimensions
  const TRACK_HEIGHT = 160;
  const HANDLE_RADIUS = 30;
  const TRACK_WIDTH = 12;

  return (
    <div
      className="flex flex-col items-center"
      style={{ height: TRACK_HEIGHT }}
    >
      <div
        ref={trackRef}
        className="relative bg-stone-400"
        style={{
          width: TRACK_WIDTH,
          height: TRACK_HEIGHT,
          borderRadius: TRACK_WIDTH,
          boxShadow: "inset 0 0 10px rgba(30, 30, 30, 0.7)",
        }}
      >
        <motion.div
          drag="y"
          dragConstraints={{
            top: 0,
            bottom: TRACK_HEIGHT - HANDLE_RADIUS,
            left: -HANDLE_RADIUS / 2, // Center the handle
          }}
          dragElastic={0}
          dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
          whileDrag={{ cursor: "grabbing" }}
          style={{
            position: "absolute",
            width: HANDLE_RADIUS,
            height: HANDLE_RADIUS,
            borderRadius: "50%",
            left: "50%",
            transform: "translateX(-50%)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
            border: "2px solid #535149",
            background: "var(--color-screen)",
            zIndex: 2,
          }}
        />
      </div>
    </div>
  );
}
