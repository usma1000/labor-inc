import Console from "./components/console";
import Button from "./components/button";
import { useGameStore } from "./store";

export default function App() {
  const wage = useGameStore((state) => state.wage);
  const upgradesUnlocked = useGameStore((state) => state.upgradesUnlocked);
  const messages = useGameStore((state) => state.messages);

  return (
    <div className="space-y-6 p-4 w-full">
      <div className="flex justify-center">
        <Console recessed height="auto" minWidth="200px">
          <p>Wage: ${wage.toFixed(2)}</p>
        </Console>

        {upgradesUnlocked && (
          <button className="ml-4 px-3 py-1 text-white rounded bg-screen">
            Upgrade
          </button>
        )}
      </div>
      <div className="flex justify-center">
        <Button />
      </div>
      <Console>
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </Console>
    </div>
  );
}
