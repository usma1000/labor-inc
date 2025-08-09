import { ObjetLogo } from "./objet-logo";

export default function Header() {
  return (
    <header className="flex items-center justify-center gap-4 p-2">
      <ObjetLogo
        size={32}
        primaryColor="var(--color-ink)"
        accentColor="var(--color-screen)"
      />
      <h1 className="text-xl font-bold font-mono tracking-wider uppercase">
        Objet Systems
      </h1>
    </header>
  );
}
