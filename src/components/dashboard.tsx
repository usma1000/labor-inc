import { useState } from "react";
import { useGameStore } from "../store";
import Console from "./console";
import UpgradesDialog from "./upgrades-dialog";

export default function Dashboard() {
  const wage = useGameStore((state) => state.wage);
  const upgradesUnlocked = useGameStore((state) => state.upgradesUnlocked);
  const [showUpgrades, setShowUpgrades] = useState(false);

  return (
    <div className="flex justify-center flex-wrap gap-4">
      <div className="panel">
        <Console recessed height="auto" minWidth="200px">
          <div className="flex justify-between items-baseline">
            <span className="text-sm">Merits™: </span>
            <span className="font-semibold">₥{wage}</span>
          </div>
        </Console>
      </div>
      <UpgradesDialog isOpen={showUpgrades} onOpenChange={setShowUpgrades} />
      <button
        className="btn"
        disabled={!upgradesUnlocked}
        onClick={() => setShowUpgrades(true)}
      >
        Expanded Operations
      </button>
    </div>
  );
}
