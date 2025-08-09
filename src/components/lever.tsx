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
          boxShadow:
            "inset 0 8px 10px rgba(30, 30, 30, 0.7), inset 0px -1px 0px #ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
            background:
              "radial-gradient(circle at 35% 35%, #ffffff 0%, #d1d1d1 100%)",
            boxShadow: `
              0 2px 4px rgba(0,0,0,0.7),
              inset 2px 1px 4px rgba(255, 255, 255, 0.8),
              inset -1px -3px 4px rgba(0, 0, 0, 0.4)
            `,
            border: "1px solid rgba(0, 0, 0, 0.2)",
          }}
          className="rounded-full z-10"
        />
      </div>
    </div>
  );
}
