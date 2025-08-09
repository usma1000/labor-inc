import Console from "./console";
import { useGameStore } from "../store";
import { useState } from "react";
import type { UpgradeState } from "../types";

export default function Footer() {
  const messages = useGameStore((state) => state.messages);
  const upgradesUnlocked = useGameStore((state) => state.upgradesUnlocked);
  const buttonUpgrades = useGameStore((state) => state.upgrades.button);
  const wage = useGameStore((state) => state.wage);
  const purchaseUpgrade = useGameStore((state) => state.purchaseUpgrade);
  const [showUpgrades, setShowUpgrades] = useState(false);

  const renderUpgrade = (upgrade: UpgradeState) => {
    const canAfford = wage >= upgrade.currentCost;
    return (
      <div
        key={upgrade.id}
        style={{ border: "1px solid #666", padding: "8px", margin: "8px 0" }}
      >
        <h3>{upgrade.name}</h3>
        <p>{upgrade.description}</p>
        <p>Level: {upgrade.level}</p>
        <p>Cost: {upgrade.currentCost} Merits</p>
        <p>
          Current Effect:{" "}
          {upgrade.id === "autoPress"
            ? upgrade.currentEffect
              ? "Enabled"
              : "Disabled"
            : upgrade.currentEffect}
        </p>
        <button
          className="btn"
          disabled={!canAfford}
          onClick={() => purchaseUpgrade("button", upgrade.id)}
        >
          {canAfford ? "Purchase" : "Cannot Afford"}
        </button>
      </div>
    );
  };

  return (
    <div className="flex justify-between p-4 gap-4">
      <div className="grow">
        <Console>
          {messages.map((msg, i) => (
            <p className="mb-2" key={i}>
              {msg}
            </p>
          ))}
        </Console>
      </div>
      <div className="py-2 flex flex-col">
        <button
          className="btn mb-2"
          disabled={!upgradesUnlocked}
          onClick={() => setShowUpgrades(!showUpgrades)}
        >
          Expanded Operations
        </button>
        {showUpgrades && upgradesUnlocked && (
          <div
            style={{
              position: "fixed",
              right: "20px",
              bottom: "80px",
              background: "#eee",
              padding: "16px",
              border: "1px solid #666",
              maxHeight: "60vh",
              overflowY: "auto",
            }}
          >
            <h2>Available Upgrades (Merits: {wage})</h2>
            {Object.values(buttonUpgrades).map(renderUpgrade)}
          </div>
        )}
      </div>
    </div>
  );
}
