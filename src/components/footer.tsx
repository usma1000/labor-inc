import Console from "./console";
import { useGameStore } from "../store";

export default function Footer() {
  const messages = useGameStore((state) => state.messages);

  return (
    <div className="p-4">
      <Console height="h-48">
        {messages.map((msg, i) => (
          <p className="mb-2" key={i}>
            {msg}
          </p>
        ))}
      </Console>
    </div>
  );
}
