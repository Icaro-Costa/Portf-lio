"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, Bug, ArrowLeft, Grid, Bomb } from "lucide-react";
import SpaceShooter from "./SpaceShooter";
import SnakeGame from "./SnakeGame";
import TetrisGame from "./TetrisGame";
import MinesweeperGame from "./MinesweeperGame";
import { useLanguage } from "./LanguageContext";

interface GameHubProps {
    onBack: () => void;
}

export default function GameHub({ onBack }: GameHubProps) {
    const [selectedGame, setSelectedGame] = useState<"space" | "snake" | "tetris" | "minesweeper" | null>(null);
    const { t } = useLanguage();

    if (selectedGame === "space") return <SpaceShooter />;
    if (selectedGame === "snake") return <SnakeGame />;
    if (selectedGame === "tetris") return <TetrisGame />;
    if (selectedGame === "minesweeper") return <MinesweeperGame />;

    return (
        <div className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center font-vt323 text-white p-8 overflow-y-auto">
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors z-50"
                onClick={onBack}
            >
                <ArrowLeft size={24} />
                <span className="text-xl">Back to Portfolio</span>
            </motion.button>

            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl mb-12 text-center text-neon-pink glow-text mt-16"
            >
                ARCADE CENTER
            </motion.h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
                {/* Space Shooter Card */}
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: "#ffffff" }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-gray-700 bg-black/50 p-6 rounded-lg cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all group flex flex-col items-center justify-center gap-4 h-64"
                    onClick={() => setSelectedGame("space")}
                >
                    <Rocket size={60} className="text-gray-400 group-hover:text-white transition-colors" />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">SPACE SHOOTER</h2>
                        <p className="text-gray-400 text-sm">Defend the galaxy in this monochrome classic.</p>
                    </div>
                </motion.div>

                {/* Snake Game Card */}
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: "#00ff00" }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-gray-700 bg-black/50 p-6 rounded-lg cursor-pointer hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all group flex flex-col items-center justify-center gap-4 h-64"
                    onClick={() => setSelectedGame("snake")}
                >
                    <Bug size={60} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-green-500 mb-2">SNAKE</h2>
                        <p className="text-gray-400 text-sm">Eat apples and grow in this retro favorite.</p>
                    </div>
                </motion.div>

                {/* Tetris Card */}
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: "#00f0f0" }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-gray-700 bg-black/50 p-6 rounded-lg cursor-pointer hover:shadow-[0_0_20px_rgba(0,240,240,0.3)] transition-all group flex flex-col items-center justify-center gap-4 h-64"
                    onClick={() => setSelectedGame("tetris")}
                >
                    <Grid size={60} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-cyan-400 mb-2">TETRIS</h2>
                        <p className="text-gray-400 text-sm">Stack blocks and clear lines.</p>
                    </div>
                </motion.div>

                {/* Minesweeper Card */}
                <motion.div
                    whileHover={{ scale: 1.05, borderColor: "#f0a000" }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-gray-700 bg-black/50 p-6 rounded-lg cursor-pointer hover:shadow-[0_0_20px_rgba(240,160,0,0.3)] transition-all group flex flex-col items-center justify-center gap-4 h-64"
                    onClick={() => setSelectedGame("minesweeper")}
                >
                    <Bomb size={60} className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-yellow-500 mb-2">MINESWEEPER</h2>
                        <p className="text-gray-400 text-sm">Find mines without blowing up.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
