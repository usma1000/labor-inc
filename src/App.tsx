import Header from "./components/header";
import Console from "./components/console";
import Button from "./components/button";
import { useGameStore } from "./store";
import Lever from "./components/lever";
import Footer from "./components/footer";
import UpgradesDialog from "./components/upgrades-dialog";
import { useState } from "react";

export default function App() {
  const wage = useGameStore((state) => state.wage);
  const leverUnlocked = useGameStore((state) => state.leverUnlocked);
  const upgradesUnlocked = useGameStore((state) => state.upgradesUnlocked);
  const [showUpgrades, setShowUpgrades] = useState(false);

  return (
    <div className="space-y-4 p-2 w-full min-h-screen flex flex-col justify-between font-mono">
      <Header />

      <div className="flex flex-col items-center space-y-4">
        <div className="flex justify-center flex-wrap gap-4">
          <div className="panel">
            <Console recessed height="auto" minWidth="200px">
              <div className="flex justify-between items-baseline">
                <span className="text-sm">Merits™: </span>
                <span className="font-semibold">₥{wage}</span>
              </div>
            </Console>
          </div>
          <UpgradesDialog
            isOpen={showUpgrades}
            onOpenChange={setShowUpgrades}
          />
          <button
            className="btn"
            disabled={!upgradesUnlocked}
            onClick={() => setShowUpgrades(true)}
          >
            Expanded Operations
          </button>
        </div>
        <div className="flex justify-center gap-6">
          <div className="panel">
            <Button />
          </div>

          <div className="panel relative overflow-hidden">
            <div>
              <Lever />
            </div>
            <div
              className={`absolute inset-0 bg-beige transition-transform duration-500 ${
                leverUnlocked ? "-translate-y-full" : ""
              }`}
            >
              <div
                className="absolute inset-0 z-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(-45deg, #313130 0, #313130 10px, #f8cf30 10px, #f8cf30 20px)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
