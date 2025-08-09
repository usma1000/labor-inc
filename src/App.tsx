import Header from "./components/header";
import Console from "./components/console";
import Button from "./components/button";
import { useGameStore } from "./store";
import Lever from "./components/lever";
import Footer from "./components/footer";

export default function App() {
  const wage = useGameStore((state) => state.wage);
  const upgradesUnlocked = useGameStore((state) => state.upgradesUnlocked);
  const leverUnlocked = useGameStore((state) => state.leverUnlocked);

  return (
    <div className="space-y-4 p-2 w-full min-h-screen flex flex-col justify-between">
      <Header />

      <div className="flex flex-col items-center space-y-4">
        <div className="flex justify-center">
          <div className="panel">
            <Console recessed height="auto" minWidth="200px">
              <p>Merits™: ${wage.toFixed(2)}</p>
            </Console>
          </div>
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
      </div>

      <Footer />
    </div>
  );
}
