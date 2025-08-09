import React, { useRef, useEffect, useState } from "react";
/**
 * Props for the Console component
 */
interface ConsoleProps {
  /** Content to display inside the console */
  children: React.ReactNode;
  /** Controls padding of the middle layer: 'p-6' (default) or 'p-2' for small mode */
  padding?: "p-6" | "p-2";
  /** When true, hides only the outermost layer of the console. If undefined, will be responsive. */
  recessed?: boolean;
  /** Controls height of the content area: 'h-48' (fixed, default) or 'auto' */
  height?: "h-48" | "auto";
  /** Optional minimum width (CSS value like '300px' or '20rem') */
  minWidth?: string;
}

/**
 * Console component that displays content in a retro-style screen with gradient borders
 */
export default function Console(props: ConsoleProps) {
  const {
    children,
    padding = "p-5",
    recessed: recessedProp,
    height = "h-32",
    minWidth,
  } = props;

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsSmallScreen(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches);
    };

    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // Use the prop if provided, otherwise use responsive behavior
  const recessed = recessedProp ?? isSmallScreen;

  // Convert height prop to actual class name
  const heightClass = height === "auto" ? "" : height;

  // Ref for the scrollable content
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when children change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [children]);

  /**
   * Renders the inner screen with content
   */
  const renderInnerScreen = () => (
    <div
      className="relative rounded-lg border-4 border-ink"
      style={minWidth ? { minWidth } : undefined}
    >
      <div
        ref={scrollRef}
        className={`bg-screen py-2 px-4 rounded-md shadow-inner shadow-gray-500 overflow-y-auto ${heightClass}`}
      >
        {children}
      </div>
    </div>
  );

  /**
   * Renders the middle layer with gradient border
   */
  const renderMiddleLayer = (paddingClass = "p-2") => (
    <div
      className={`relative rounded-lg ${paddingClass}`}
      style={{
        background:
          "linear-gradient(to bottom, var(--color-darkstone) 0%, var(--color-darkstone) 4px, var(--color-stone) 12px, var(--color-stone) calc(100% - 12px), var(--color-screen) calc(100% - 4px), var(--color-screen) 100%)",
      }}
    >
      {renderInnerScreen()}
    </div>
  );

  // In recessed mode, we only render the middle and inner layers
  if (recessed) {
    return (
      <div className={`bg-beige rounded-xl`}>{renderMiddleLayer("p-1")}</div>
    );
  }

  // Full console mode with all layers
  return (
    <div
      className="bg-beige text-ink p-1 rounded-2xl font-mono m-2 relative"
      style={{
        background:
          "linear-gradient(to bottom, var(--color-screen) 0%, var(--color-screen) 4px, var(--color-stone) 12px, var(--color-stone) calc(100% - 12px), var(--color-darkstone) calc(100% - 4px), var(--color-darkstone) 100%)",
        boxShadow: "0 6px 10px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className={`bg-beige rounded-xl ${padding}`}>
        {renderMiddleLayer()}
      </div>
    </div>
  );
}
