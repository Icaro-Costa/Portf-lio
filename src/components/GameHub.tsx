"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Bug, ArrowLeft } from "lucide-react";
import SpaceShooter from "./SpaceShooter";
import SnakeGame from "./SnakeGame";
import { useLanguage } from "./LanguageContext";

interface GameHubProps {
    onBack: () => void;
}

export default function GameHub({ onBack }: GameHubProps) {
    const [selectedGame, setSelectedGame] = useState<"space" | "snake" | null>(null);
    const { t } = useLanguage();

    if (selectedGame === "space") {
        return <SpaceShooter />;
    }

    if (selectedGame === "snake") {
        return <SnakeGame />;
    }

    return (
        <div className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center font-vt323 text-white p-8">
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                onClick={onBack}
            >
                <ArrowLeft size={24} />
                <span className="text-xl">Back to Portfolio</span>
            </motion.button>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl mb-16 text-center text-neon-pink glow-text"
            >
                ARCADE CENTER
            </motion.h1>

            <div className="flex flex-col md:flex-row gap-12">
                {/* Space Shooter Card */}
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: "#ffffff" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-80 h-96 border-2 border-gray-700 bg-black/50 p-8 rounded-lg cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all group flex flex-col items-center justify-center gap-6"
                    onClick={() => setSelectedGame("space")}
                >
                    <Rocket size={80} className="text-gray-400 group-hover:text-white transition-colors" />
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">SPACE SHOOTER</h2>
                        <p className="text-gray-400">Defend the galaxy in this monochrome classic.</p>
                    </div>
                </motion.div>

                {/* Snake Game Card */}
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: "#00ff00" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-80 h-96 border-2 border-gray-700 bg-black/50 p-8 rounded-lg cursor-pointer hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all group flex flex-col items-center justify-center gap-6"
                    onClick={() => setSelectedGame("snake")}
                >
                    <Bug size={80} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-green-500 mb-2">SNAKE</h2>
                        <p className="text-gray-400">Eat apples and grow in this retro favorite.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
