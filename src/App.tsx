import Header from "./components/header";
import Footer from "./components/footer";
import Dashboard from "./components/dashboard";
import Controls from "./components/controls";

export default function App() {
  return (
    <div className="space-y-4 p-2 w-full min-h-screen flex flex-col justify-between font-mono">
      <Header />

      <div className="flex flex-col items-center space-y-4">
        <Dashboard />
        <Controls />
      </div>

      <Footer />
    </div>
  );
}
