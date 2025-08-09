import Console from "./console";
import { useGameStore } from "../store";
import { useState } from "react";
import type { UpgradeState } from "../types";
import * as Dialog from "@radix-ui/react-dialog";

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
        className="bg-beige/50 rounded-md p-4 space-y-3 border-t-1 border-screen shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-mono font-semibold text-lg">{upgrade.name}</h3>
            <p className="text-sm text-darkstone/80 italic mt-1">
              {upgrade.description}
            </p>
          </div>
          <div className="font-mono text-right text-sm shrink-0">
            <p className="text-darkstone">Level {upgrade.level}</p>
            <p className="font-semibold whitespace-nowrap">
              Cost: ₥{upgrade.currentCost}
            </p>
          </div>
        </div>
        <p className="font-mono text-sm">
          Effect:{" "}
          <span className="font-semibold">
            {upgrade.id === "autoPress"
              ? upgrade.currentEffect
                ? "Enabled"
                : "Disabled"
              : upgrade.currentEffect}
          </span>
        </p>
        <button
          className="btn w-full"
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
        <Dialog.Root open={showUpgrades} onOpenChange={setShowUpgrades}>
          <Dialog.Trigger asChild disabled={!upgradesUnlocked}>
            <button className="btn mb-2">Expanded Operations</button>
          </Dialog.Trigger>

          {upgradesUnlocked && (
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-darkstone/50 backdrop-blur-sm" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[600px] max-h-[85vh] bg-screen panel z-30 p-8">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-2xl font-semibold">
                    Expanded Operations (Merits: {wage})
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button className="btn p-2 px-3">×</button>
                  </Dialog.Close>
                </div>
                <div className="overflow-y-auto pr-2 space-y-4">
                  {Object.values(buttonUpgrades).map(renderUpgrade)}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </Dialog.Root>
      </div>
    </div>
  );
}
