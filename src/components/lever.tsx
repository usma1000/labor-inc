import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function Lever() {
  const [isDragging, setIsDragging] = useState(false);
  const [y, setY] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Track dimensions
  const TRACK_HEIGHT = 160;
  const HANDLE_RADIUS = 20;
  const TRACK_WIDTH = 12;

  // Mouse/touch drag handlers
  const startDrag = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const stopDrag = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const onDrag = (e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let newY = e.clientY - rect.top - HANDLE_RADIUS;
    newY = Math.max(0, Math.min(newY, TRACK_HEIGHT - HANDLE_RADIUS * 2));
    setY(newY);
  };

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
          borderRadius: TRACK_WIDTH / 2,
          boxShadow: "inset 0 0 10px rgba(30, 30, 30, 0.7)",
        }}
      >
        <motion.div
          ref={handleRef}
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer transition-colors bg-screen rounded-full shadow-lg shadow-gray-950 border-4 border-stone-400"
          style={{
            top: y,
            width: HANDLE_RADIUS * 2,
            height: HANDLE_RADIUS * 2,
            zIndex: 2,
          }}
          onPointerDown={startDrag}
          onPointerUp={stopDrag}
          onPointerMove={onDrag}
          layout
        />
      </div>
    </div>
  );
}
