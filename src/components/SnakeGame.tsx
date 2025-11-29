"use client";

import { useEffect, useRef, useState } from "react";

export default function SnakeGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Grid settings
        const gridSize = 20;
        const tileCountX = Math.floor(window.innerWidth / gridSize);
        const tileCountY = Math.floor(window.innerHeight / gridSize);

        canvas.width = tileCountX * gridSize;
        canvas.height = tileCountY * gridSize;

        let snake = [{ x: 10, y: 10 }];
        let apple = { x: 15, y: 15 };
        let velocity = { x: 0, y: 0 };
        let nextVelocity = { x: 0, y: 0 }; // Buffer for next move to prevent self-collision on quick turns

        const spawnApple = () => {
            apple = {
                x: Math.floor(Math.random() * tileCountX),
                y: Math.floor(Math.random() * tileCountY)
            };
            // Ensure apple doesn't spawn on snake
            for (let part of snake) {
                if (part.x === apple.x && part.y === apple.y) {
                    spawnApple();
                    break;
                }
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.code) {
                case "ArrowLeft":
                    if (velocity.x !== 1) nextVelocity = { x: -1, y: 0 };
                    break;
                case "ArrowRight":
                    if (velocity.x !== -1) nextVelocity = { x: 1, y: 0 };
                    break;
                case "ArrowUp":
                    if (velocity.y !== 1) nextVelocity = { x: 0, y: -1 };
                    break;
                case "ArrowDown":
                    if (velocity.y !== -1) nextVelocity = { x: 0, y: 1 };
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        const update = () => {
            velocity = nextVelocity;
            if (velocity.x === 0 && velocity.y === 0) return;

            const head = { x: snake[0].x + velocity.x, y: snake[0].y + velocity.y };

            // Wall Collision
            if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
                setGameOver(true);
                return;
            }

            // Self Collision
            for (let part of snake) {
                if (part.x === head.x && part.y === head.y) {
                    setGameOver(true);
                    return;
                }
            }

            snake.unshift(head);

            // Eat Apple
            if (head.x === apple.x && head.y === apple.y) {
                setScore(s => s + 1);
                spawnApple();
            } else {
                snake.pop();
            }
        };

        const draw = () => {
            // Background
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Snake
            ctx.fillStyle = "#00ff00"; // Green
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#00ff00";
            for (let part of snake) {
                ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
            }
            ctx.shadowBlur = 0;

            // Apple
            ctx.fillStyle = "#ff0000"; // Red
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#ff0000";
            ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 2, gridSize - 2);
            ctx.shadowBlur = 0;
        };

        const gameLoop = setInterval(() => {
            if (!gameOver) {
                update();
                draw();
            }
        }, 100); // Game speed

        return () => {
            clearInterval(gameLoop);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [gameStarted, gameOver]);

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-vt323 text-white">
            {!gameStarted ? (
                <div className="text-center z-10">
                    <h1 className="text-6xl text-green-500 mb-8 glow-text">SNAKE GAME</h1>
                    <p className="text-2xl mb-4 text-gray-300">Use <span className="text-green-500">Arrows</span> to move</p>
                    <p className="text-2xl mb-8 text-gray-300">Eat the <span className="text-red-500">Red Apple</span></p>
                    <button
                        onClick={() => {
                            setGameStarted(true);
                            setGameOver(false);
                            setScore(0);
                        }}
                        className="px-8 py-4 bg-green-500/20 border-2 border-green-500 text-green-500 text-2xl rounded hover:bg-green-500/40 transition-all"
                    >
                        START GAME
                    </button>
                </div>
            ) : (
                <>
                    <canvas ref={canvasRef} className="absolute inset-0" />
                    <div className="absolute top-4 left-4 text-2xl text-green-500">
                        SCORE: {score}
                    </div>
                </>
            )}

            {gameOver && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
                    <h2 className="text-6xl text-red-500 mb-4 glow-text">GAME OVER</h2>
                    <p className="text-3xl text-white mb-8">Final Score: {score}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setGameOver(false);
                                setScore(0);
                                setGameStarted(true);
                            }}
                            className="px-6 py-3 bg-green-500/20 border-2 border-green-500 text-green-500 text-xl rounded hover:bg-green-500/40 transition-all"
                        >
                            TRY AGAIN
                        </button>
                        <button
                            onClick={() => window.location.reload()}
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
