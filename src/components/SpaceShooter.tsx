"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "./LanguageContext";

export default function SpaceShooter() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { t } = useLanguage();
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const player = {
            x: canvas.width / 2,
            y: canvas.height - 100,
            width: 50,
            height: 50,
            speed: 7,
            dx: 0
        };

        const bullets: { x: number; y: number; width: number; height: number; speed: number }[] = [];
        const enemies: { x: number; y: number; width: number; height: number; speed: number }[] = [];
        const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

        let frameId: number;
        let scoreCount = 0;

        const keys: { [key: string]: boolean } = {};

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === "ArrowLeft") keys.ArrowLeft = true;
            if (e.code === "ArrowRight") keys.ArrowRight = true;
            if (e.code === "Space") {
                if (!keys.Space) { // Prevent rapid fire holding space
                    bullets.push({
                        x: player.x + player.width / 2 - 2.5,
                        y: player.y,
                        width: 5,
                        height: 15,
                        speed: 10
                    });
                }
                keys.Space = true;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === "ArrowLeft") keys.ArrowLeft = false;
            if (e.code === "ArrowRight") keys.ArrowRight = false;
            if (e.code === "Space") keys.Space = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        const createExplosion = (x: number, y: number, color: string) => {
            for (let i = 0; i < 15; i++) {
                particles.push({
                    x,
                    y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    life: 1.0,
                    color
                });
            }
        };

        const update = () => {
            // Player Movement
            if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
            if (keys.ArrowRight && player.x < canvas.width - player.width) player.x += player.speed;

            // Bullets
            for (let i = bullets.length - 1; i >= 0; i--) {
                bullets[i].y -= bullets[i].speed;
                if (bullets[i].y < 0) bullets.splice(i, 1);
            }

            // Enemies
            if (Math.random() < 0.02 + (scoreCount * 0.0001)) { // Increase difficulty
                enemies.push({
                    x: Math.random() * (canvas.width - 50),
                    y: -50,
                    width: 40 + Math.random() * 20,
                    height: 40 + Math.random() * 20,
                    speed: 3 + Math.random() * 2 + (scoreCount * 0.001)
                });
            }

            for (let i = enemies.length - 1; i >= 0; i--) {
                enemies[i].y += enemies[i].speed;

                // Collision Player vs Enemy
                if (
                    player.x < enemies[i].x + enemies[i].width &&
                    player.x + player.width > enemies[i].x &&
                    player.y < enemies[i].y + enemies[i].height &&
                    player.y + player.height > enemies[i].y
                ) {
                    setGameOver(true);
                    createExplosion(player.x + player.width / 2, player.y + player.height / 2, "#ffffff"); // White explosion
                }

                // Remove off-screen enemies
                if (enemies[i].y > canvas.height) {
                    enemies.splice(i, 1);
                    // Optional: Penalty for missing enemies?
                }
            }

            // Collision Bullets vs Enemies
            for (let i = bullets.length - 1; i >= 0; i--) {
                for (let j = enemies.length - 1; j >= 0; j--) {
                    if (
                        bullets[i].x < enemies[j].x + enemies[j].width &&
                        bullets[i].x + bullets[i].width > enemies[j].x &&
                        bullets[i].y < enemies[j].y + enemies[j].height &&
                        bullets[i].y + bullets[i].height > enemies[j].y
                    ) {
                        createExplosion(enemies[j].x + enemies[j].width / 2, enemies[j].y + enemies[j].height / 2, "#808080"); // Gray explosion
                        bullets.splice(i, 1);
                        enemies.splice(j, 1);
                        scoreCount += 10;
                        setScore(scoreCount);
                        break; // Bullet hit something, stop checking this bullet
                    }
                }
            }

            // Particles
            for (let i = particles.length - 1; i >= 0; i--) {
                particles[i].x += particles[i].vx;
                particles[i].y += particles[i].vy;
                particles[i].life -= 0.05;
                if (particles[i].life <= 0) particles.splice(i, 1);
            }
        };

        const draw = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // Trail effect
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw Player
            ctx.fillStyle = "#ffffff"; // White
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#ffffff";
            ctx.beginPath();
            ctx.moveTo(player.x + player.width / 2, player.y);
            ctx.lineTo(player.x + player.width, player.y + player.height);
            ctx.lineTo(player.x, player.y + player.height);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Draw Bullets
            ctx.fillStyle = "#ffffff"; // White
            bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

            // Draw Enemies
            ctx.fillStyle = "#808080"; // Gray
            enemies.forEach(e => {
                ctx.shadowBlur = 10;
                ctx.shadowColor = "#808080";
                ctx.fillRect(e.x, e.y, e.width, e.height);
                ctx.shadowBlur = 0;
            });

            // Draw Particles
            particles.forEach(p => {
                ctx.globalAlpha = p.life;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            });
        };

        const loop = () => {
            if (gameOver) return;
            update();
            draw();
            frameId = requestAnimationFrame(loop);
        };

        loop();

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            cancelAnimationFrame(frameId);
        };
    }, [gameStarted, gameOver]);

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-vt323 text-white">
            {!gameStarted ? (
                <div className="text-center z-10">
                    <h1 className="text-6xl text-white mb-8 glow-text">SPACE SHOOTER</h1>
                    <p className="text-2xl mb-4 text-gray-300">Use <span className="text-white">← →</span> to move</p>
                    <p className="text-2xl mb-8 text-gray-300">Press <span className="text-white">SPACE</span> to shoot</p>
                    <button
                        onClick={() => setGameStarted(true)}
                        className="px-8 py-4 bg-white/20 border-2 border-white text-white text-2xl rounded hover:bg-white/40 transition-all"
                    >
                        START GAME
                    </button>
                </div>
            ) : (
                <>
                    <canvas ref={canvasRef} className="absolute inset-0" />
                    <div className="absolute top-4 left-4 text-2xl text-white">
                        SCORE: {score}
                    </div>
                </>
            )}

            {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
                    <h2 className="text-6xl text-white mb-4 glow-text">GAME OVER</h2>
                    <p className="text-3xl text-gray-300 mb-8">Final Score: {score}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setGameOver(false);
                                setScore(0);
                                setGameStarted(true);
                            }}
                            className="px-6 py-3 bg-white/20 border-2 border-white text-white text-xl rounded hover:bg-white/40 transition-all"
                        >
                            TRY AGAIN
                        </button>
                        <button
                            onClick={() => window.location.reload()} // Simple way to exit to main menu for now, or we can pass a prop to exit
                            className="px-6 py-3 bg-gray-500/20 border-2 border-gray-500 text-gray-300 text-xl rounded hover:bg-gray-500/40 transition-all"
                        >
                            EXIT
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
