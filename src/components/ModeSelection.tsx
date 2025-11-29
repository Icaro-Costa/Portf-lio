"use client";

import { motion } from "framer-motion";
import { Terminal, LayoutTemplate, Gamepad2 } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import StickFightBackground from "./StickFightBackground";

interface ModeSelectionProps {
    onSelectMode: (mode: "terminal" | "gui" | "game") => void;
}

export default function ModeSelection({ onSelectMode }: ModeSelectionProps) {
    const { t } = useLanguage();

    const handleSelectMode = (mode: "terminal" | "gui" | "game") => {
        onSelectMode(mode);
    };

    return (
        <div className="relative flex flex-col items-center justify-center h-full w-full p-8 font-vt323 text-green-500 overflow-hidden">
            <StickFightBackground />
            <div className="relative z-10 flex flex-col items-center w-full">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl mb-12 text-center text-neon-green glow-text"
                >
                    {t("select_mode")}
                </motion.h1>

                <div className="flex flex-col md:flex-row gap-8 w-full max-w-6xl justify-center">
                    {/* Terminal Mode Card */}
                    <motion.div
                        whileHover={{ scale: 1.05, borderColor: "#00ff00" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 border-2 border-gray-700 bg-black/50 p-8 rounded-lg cursor-pointer hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all group"
                        onClick={() => handleSelectMode("terminal")}
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <Terminal size={64} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                            <h2 className="text-2xl md:text-3xl font-bold">{t("terminal_mode")}</h2>
                            <p className="text-gray-400 group-hover:text-gray-300">{t("terminal_desc")}</p>
                        </div>
                    </motion.div>

                    {/* GUI Mode Card */}
                    <motion.div
                        whileHover={{ scale: 1.05, borderColor: "#0055ff" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 border-2 border-gray-700 bg-black/50 p-8 rounded-lg cursor-pointer hover:shadow-[0_0_20px_rgba(0,85,255,0.3)] transition-all group"
                        onClick={() => handleSelectMode("gui")}
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <LayoutTemplate size={64} className="text-gray-400 group-hover:text-neon-blue transition-colors" />
                            <h2 className="text-2xl md:text-3xl font-bold group-hover:text-neon-blue">{t("gui_mode")}</h2>
                            <p className="text-gray-400 group-hover:text-gray-300">{t("gui_desc")}</p>
                        </div>
                    </motion.div>

                    {/* Game Mode Card */}
                    <motion.div
                        whileHover={{ scale: 1.05, borderColor: "#ff00ff" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 border-2 border-gray-700 bg-black/50 p-8 rounded-lg cursor-pointer hover:shadow-[0_0_20px_rgba(255,0,255,0.3)] transition-all group"
                        onClick={() => handleSelectMode("game")}
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <Gamepad2 size={64} className="text-gray-400 group-hover:text-neon-pink transition-colors" />
                            <h2 className="text-2xl md:text-3xl font-bold group-hover:text-neon-pink">{t("game_mode")}</h2>
                            <p className="text-gray-400 group-hover:text-gray-300">{t("game_desc")}</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
