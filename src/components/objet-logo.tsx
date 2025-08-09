// ObjetLogo.tsx
import React from "react";

interface ObjetLogoProps {
  size?: number | string; // e.g. 64, "2rem", "100%"
  primaryColor?: string; // ring color
  accentColor?: string; // wedge color
  backgroundColor?: string; // inner disk color
}

export const ObjetLogo: React.FC<ObjetLogoProps> = ({
  size = 200,
  primaryColor = "#323232",
  accentColor = "#CDEEE3",
  backgroundColor = "transparent",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-labelledby="objet-logo-title objet-logo-desc"
    >
      <title id="objet-logo-title">Objet Systems logo</title>
      <desc id="objet-logo-desc">
        A thick circular ring with a deliberate gap and a small offset wedge.
      </desc>

      {/* background circle */}
      <circle cx="100" cy="100" r="62" fill={backgroundColor} />

      {/* main ring with gap */}
      <circle
        cx="100"
        cy="100"
        r="78"
        fill="none"
        stroke={primaryColor}
        strokeWidth="20"
        strokeLinecap="round"
        strokeDasharray="330 110"
        transform="rotate(-45 100 100)"
      />

      {/* subtle inner ring */}
      <circle
        cx="100"
        cy="100"
        r="46"
        fill="none"
        stroke={accentColor}
        strokeWidth="8"
      />
    </svg>
  );
};
