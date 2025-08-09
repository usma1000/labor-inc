export type StatusLightColor = "green" | "yellow" | "inactive";

const lightStyles = {
  green: {
    background:
      "radial-gradient(circle at 60% 35%, #baffc9 0%, #00ff77 60%, #007f3b 100%)",
    boxShadow:
      "0 0 16px 4px #00ff77, 0 2px 8px 0 #007f3b, 0 0 0 2px #baffc9 inset",
    highlight: "rgba(255,255,255,0.55)",
    shadow: "rgba(0,64,32,0.22)",
  },
  yellow: {
    background:
      "radial-gradient(circle at 60% 35%, #fff9c4 0%, #ffe066 60%, #bfa600 100%)",
    boxShadow:
      "0 0 16px 4px #ffe066, 0 2px 8px 0 #bfa600, 0 0 0 2px #fff9c4 inset",
    highlight: "rgba(255,255,255,0.55)",
    shadow: "rgba(64,64,0,0.22)",
  },
  inactive: {
    background:
      "radial-gradient(circle at 60% 35%, #e5e5e5 0%, #888 60%, #4c4c4c 100%)",
    boxShadow: "0 1px 2px 0 #111, 0 0 0 2px #888 inset",
    highlight: "rgba(255,255,255,0.08)",
    shadow: "rgba(0,0,0,0.22)",
  },
};

export default function StatusLight({
  color = "inactive",
  size = "0.75em",
}: {
  color?: StatusLightColor;
  size?: string | number;
}) {
  const style = lightStyles[color];
  return (
    <span className="relative flex items-center justify-center">
      <span
        className="block"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: style.background,
          boxShadow: style.boxShadow,
          border: "1px solid #22222266",
          display: "block",
          position: "relative",
        }}
      >
        {/* highlight reflection */}
        <span
          style={{
            position: "absolute",
            left: "28%",
            top: "18%",
            width: "28%",
            height: "18%",
            borderRadius: "50%",
            background: style.highlight,
            filter: "blur(1.5px)",
            pointerEvents: "none",
          }}
        />
        {/* bottom shadow */}
        <span
          style={{
            position: "absolute",
            left: "18%",
            bottom: "10%",
            width: "64%",
            height: "22%",
            borderRadius: "50%",
            background: style.shadow,
            filter: "blur(2.5px)",
            pointerEvents: "none",
          }}
        />
      </span>
    </span>
  );
}
