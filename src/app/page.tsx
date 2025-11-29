"use client";

import { useState } from "react";
import BootSequence from "@/components/BootSequence";
import Terminal from "@/components/Terminal";
import PanicMode from "@/components/PanicMode";
import PowerUps from "@/components/PowerUps";
import { LanguageProvider } from "@/components/LanguageContext";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import ModeSelection from "@/components/ModeSelection";
import GUIHome from "@/components/GUIHome";
import GameHub from "@/components/GameHub";

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const [modeSelected, setModeSelected] = useState<"terminal" | "gui" | "game" | null>(null);
  const [godMode, setGodMode] = useState(false);

  useKonamiCode(() => {
    setGodMode((prev) => !prev);
    alert("GOD MODE ACTIVATED: Unlimited Power!");
    document.documentElement.style.setProperty("--foreground", "#ff00ff");
  });

  return (
    <LanguageProvider>
      <main
        className={`flex flex-col ${godMode ? "hue-rotate-90" : ""} ${modeSelected === "gui" ? "min-h-screen" : "h-screen overflow-hidden"
          }`}
      >
        <PanicMode />
        {modeSelected !== "game" && <PowerUps />}

        {!bootComplete ? (
          <BootSequence onComplete={() => setBootComplete(true)} />
        ) : !modeSelected ? (
          <ModeSelection onSelectMode={setModeSelected} />
        ) : modeSelected === "terminal" ? (
          <Terminal onSwitchMode={setModeSelected} />
        ) : modeSelected === "game" ? (
          <GameHub onBack={() => setModeSelected(null)} />
        ) : (
          <GUIHome onBack={() => setModeSelected(null)} />
        )}
      </main>
    </LanguageProvider>
  );
}
