import Console from "./components/console";
import Button from "./components/button";
import { useGameStore } from "./store";

export default function App() {
  const wage = useGameStore((state) => state.wage);

  return (
    <div className="space-y-6 p-4 w-full">
      <div className="flex justify-center">
        <Console recessed height="auto" minWidth="200px">
          <p>Wage: ${wage.toFixed(2)}</p>
        </Console>
      </div>
      <div className="flex justify-center">
        <Button />
      </div>
      <Console>
        <p>Welcome to your new job.</p>
        <p>
          <strong>Your first task:</strong> hold the button to start working.
        </p>
      </Console>
    </div>
  );
}
