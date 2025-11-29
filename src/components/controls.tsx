import { useGameStore } from "../store";
import Button from "./button";
import Lever from "./lever";
import Knob from "./knob";

export default function Controls() {
  const leverUnlocked = useGameStore((state) => state.leverUnlocked);

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="flex justify-center gap-4">
        <div className="panel relative flex-1">
          <Button />
          <div className="absolute inset-x-0 bottom-0 h-8 warning-stripes">
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0.5">
              <div className="sticker">Button</div>
            </div>
          </div>
        </div>
        <div className="panel relative flex-1 overflow-hidden">
          <Knob />
          <div
            className={`absolute inset-0 bg-beige transition-transform duration-500 ${
              leverUnlocked ? "-translate-y-full" : ""
            }`}
          >
            <div className="absolute inset-0 z-10 warning-stripes">
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0.5">
                <div className="sticker">Knob</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel relative overflow-hidden">
        <div className="pt-8">
          <Lever />
        </div>
        <div
          className={`absolute inset-0 bg-beige transition-transform duration-500 ${
            leverUnlocked ? "-translate-y-8/12" : ""
          }`}
        >
          <div className="absolute inset-0 z-10 warning-stripes">
            <div className="absolute left-1/2 bottom-2 -translate-x-1/2">
              <div className="sticker">Lever</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
