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
  const TRACK_WIDTH = 30;

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
          }}
          dragElastic={0}
          dragMomentum={false}
          dragTransition={{
            timeConstant: leverDragSpeed,
            power: 0.2,
            modifyTarget: (target) => target,
          }}
          whileDrag={{ cursor: "grabbing" }}
          style={{
            position: "absolute",
            width: HANDLE_RADIUS,
            height: HANDLE_RADIUS,
            boxShadow:
              "0 2px 4px rgba(0,0,0,0.7), inset 0 4px 10px rgba(255, 255, 255, 0.5)",
          }}
          className="rounded-full bg-screen z-10"
        />
      </div>
    </div>
  );
}
