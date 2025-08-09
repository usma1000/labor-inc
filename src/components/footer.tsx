import Console from "./console";
import { useGameStore } from "../store";

export default function Footer() {
  const messages = useGameStore((state) => state.messages);
  const upgradesUnlocked = useGameStore((state) => state.upgradesUnlocked);

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
      <div className="py-2">
        <button className="btn" disabled={!upgradesUnlocked}>
          Upgrade
        </button>
      </div>
    </div>
  );
}
