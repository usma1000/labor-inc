import Console from "./console";
import { useGameStore } from "../store";
import { useState } from "react";
import UpgradesDialog from "./upgrades-dialog";

export default function Footer() {
  const messages = useGameStore((state) => state.messages);
  const upgradesUnlocked = useGameStore((state) => state.upgradesUnlocked);
  const [showUpgrades, setShowUpgrades] = useState(false);

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
          onClick={() => setShowUpgrades(true)}
        >
          Expanded Operations
        </button>
        {upgradesUnlocked && (
          <UpgradesDialog
            isOpen={showUpgrades}
            onOpenChange={setShowUpgrades}
          />
        )}
      </div>
    </div>
  );
}
