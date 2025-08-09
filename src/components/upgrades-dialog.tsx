import * as Dialog from "@radix-ui/react-dialog";
import type { UpgradeState } from "../types";
import { useGameStore } from "../store";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UpgradesDialog({ isOpen, onOpenChange }: Props) {
  const buttonUpgrades = useGameStore((state) => state.upgrades.button);
  const wage = useGameStore((state) => state.wage);
  const purchaseUpgrade = useGameStore((state) => state.purchaseUpgrade);

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
            <p className="text-darkstone/60">Level {upgrade.level}</p>
            <p className="font-semibold whitespace-nowrap">
              Cost: {upgrade.currentCost} ₥
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
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
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
    </Dialog.Root>
  );
}
