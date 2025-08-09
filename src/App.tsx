import Header from "./components/header";
import Console from "./components/console";
import Button from "./components/button";
import { useGameStore } from "./store";
import Lever from "./components/lever";
import Footer from "./components/footer";

export default function App() {
  const wage = useGameStore((state) => state.wage);
  const leverUnlocked = useGameStore((state) => state.leverUnlocked);

  return (
    <div className="space-y-4 p-2 w-full min-h-screen flex flex-col justify-between font-mono">
      <Header />

      <div className="flex flex-col items-center space-y-4">
        <div className="flex justify-center">
          <div className="panel">
            <Console recessed height="auto" minWidth="200px">
              <div className="flex justify-between items-baseline">
                <span className="text-sm">Merits™: </span>
                <span className="font-semibold">₥{wage}</span>
              </div>
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
