import Console from "./components/console";
import Button from "./components/button";
import { useGameStore } from "./store";
import Lever from "./components/lever";

export default function App() {
  const wage = useGameStore((state) => state.wage);
  const messages = useGameStore((state) => state.messages);
  const upgradesUnlocked = useGameStore((state) => state.upgradesUnlocked);
  const leverUnlocked = useGameStore((state) => state.leverUnlocked);

  return (
    <div className="space-y-6 p-4 w-full">
      <div className="flex justify-center">
        <div className="panel">
          <Console recessed height="auto" minWidth="200px">
            <p>Wage: ${wage.toFixed(2)}</p>
          </Console>
        </div>

        {upgradesUnlocked && <button className="btn ml-6">Upgrade</button>}
      </div>
      <div className="flex justify-center gap-6">
        <div className="panel">
          <Button />
        </div>

        {leverUnlocked && (
          <div className="panel">
            <Lever />
          </div>
        )}
      </div>
      <Console>
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </Console>
    </div>
  );
}
