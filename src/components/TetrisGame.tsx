"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TETROMINOS = {
    I: { shape: [[1, 1, 1, 1]], color: "#00f0f0" }, // Cyan
    J: { shape: [[1, 0, 0], [1, 1, 1]], color: "#0000f0" }, // Blue
    L: { shape: [[0, 0, 1], [1, 1, 1]], color: "#f0a000" }, // Orange
    O: { shape: [[1, 1], [1, 1]], color: "#f0f000" }, // Yellow
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: "#00f000" }, // Green
    T: { shape: [[0, 1, 0], [1, 1, 1]], color: "#a000f0" }, // Purple
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: "#f00000" }, // Red
};

type TetrominoType = keyof typeof TETROMINOS;

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

export default function TetrisGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState<(string | null)[][]>(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
    const [currentPiece, setCurrentPiece] = useState<{ type: TetrominoType; shape: number[][]; x: number; y: number; color: string } | null>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [dropTime, setDropTime] = useState(1000);

    const getRandomTetromino = () => {
        const types = Object.keys(TETROMINOS) as TetrominoType[];
        const type = types[Math.floor(Math.random() * types.length)];
        return {
            type,
            shape: TETROMINOS[type].shape,
            x: Math.floor(COLS / 2) - Math.floor(TETROMINOS[type].shape[0].length / 2),
            y: 0,
            color: TETROMINOS[type].color,
        };
    };

    const checkCollision = (piece: typeof currentPiece, moveX: number, moveY: number, rotatedShape?: number[][]) => {
        if (!piece) return false;
        const shape = rotatedShape || piece.shape;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const newX = piece.x + x + moveX;
                    const newY = piece.y + y + moveY;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && grid[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const rotate = (matrix: number[][]) => {
        return matrix[0].map((_, index) => matrix.map(row => row[index]).reverse());
    };

    const mergePiece = useCallback(() => {
        if (!currentPiece) return;
        const newGrid = [...grid];
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    if (currentPiece.y + y >= 0) {
                        newGrid[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
                    }
                }
            });
        });

        // Check for cleared lines
        let linesCleared = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
            if (newGrid[y].every(cell => cell !== null)) {
                newGrid.splice(y, 1);
                newGrid.unshift(Array(COLS).fill(null));
                linesCleared++;
                y++; // Check same row again
            }
        }

        if (linesCleared > 0) {
            setScore(prev => prev + linesCleared * 100);
            setDropTime(prev => Math.max(100, prev - 50)); // Speed up
        }

        setGrid(newGrid);
        const newPiece = getRandomTetromino();
        if (checkCollision(newPiece, 0, 0)) {
            setGameOver(true);
        } else {
            setCurrentPiece(newPiece);
        }
    }, [currentPiece, grid]);

    const move = useCallback((dirX: number, dirY: number) => {
        if (!currentPiece || gameOver) return;
        if (!checkCollision(currentPiece, dirX, dirY)) {
            setCurrentPiece(prev => prev ? { ...prev, x: prev.x + dirX, y: prev.y + dirY } : null);
        } else if (dirY > 0) {
            mergePiece();
        }
    }, [currentPiece, gameOver, mergePiece]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!gameStarted || gameOver) return;
        if (e.code === "ArrowLeft") move(-1, 0);
        if (e.code === "ArrowRight") move(1, 0);
        if (e.code === "ArrowDown") move(0, 1);
        if (e.code === "ArrowUp") {
            if (currentPiece) {
                const rotated = rotate(currentPiece.shape);
                if (!checkCollision(currentPiece, 0, 0, rotated)) {
                    setCurrentPiece(prev => prev ? { ...prev, shape: rotated } : null);
                }
            }
        }
    }, [gameStarted, gameOver, move, currentPiece]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (!gameStarted || gameOver) return;
        const interval = setInterval(() => {
            move(0, 1);
        }, dropTime);
        return () => clearInterval(interval);
    }, [gameStarted, gameOver, dropTime, move]);

    useEffect(() => {
        if (gameStarted && !currentPiece && !gameOver) {
            setCurrentPiece(getRandomTetromino());
        }
    }, [gameStarted, currentPiece, gameOver]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Grid
        grid.forEach((row, y) => {
            row.forEach((color, x) => {
                if (color) {
                    ctx.fillStyle = color;
                    ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                } else {
                    ctx.strokeStyle = "#111";
                    ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                }
            });
        });

        // Draw Current Piece
        if (currentPiece) {
            ctx.fillStyle = currentPiece.color;
            currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        ctx.fillRect((currentPiece.x + x) * BLOCK_SIZE, (currentPiece.y + y) * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                    }
                });
            });
        }
    }, [grid, currentPiece]);

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-vt323 text-white">
            {!gameStarted ? (
                <div className="text-center z-10">
                    <h1 className="text-6xl text-neon-blue mb-8 glow-text">TETRIS</h1>
                    <p className="text-2xl mb-4 text-gray-300">Use <span className="text-neon-blue">Arrows</span> to move/rotate</p>
                    <button
                        onClick={() => {
                            setGameStarted(true);
                            setGameOver(false);
                            setScore(0);
                            setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
                            setCurrentPiece(null);
                        }}
                        className="px-8 py-4 bg-neon-blue/20 border-2 border-neon-blue text-neon-blue text-2xl rounded hover:bg-neon-blue/40 transition-all"
                    >
                        START GAME
                    </button>
                </div>
            ) : (
                <div className="flex gap-8 items-start">
                    <canvas
                        ref={canvasRef}
                        width={COLS * BLOCK_SIZE}
                        height={ROWS * BLOCK_SIZE}
                        className="border-2 border-gray-700 bg-black"
                    />
                    <div className="flex flex-col gap-4">
                        <div className="text-2xl text-neon-blue">SCORE</div>
                        <div className="text-4xl text-white">{score}</div>
                        {gameOver && (
                            <div className="mt-8">
                                <div className="text-red-500 text-3xl mb-4">GAME OVER</div>
                                <button
                                    onClick={() => {
                                        setGameOver(false);
                                        setScore(0);
                                        setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(null)));
                                        setCurrentPiece(null);
                                    }}
                                    className="px-6 py-3 bg-neon-blue/20 border-2 border-neon-blue text-neon-blue text-xl rounded hover:bg-neon-blue/40 transition-all w-full mb-4"
                                >
                                    RETRY
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 bg-gray-500/20 border-2 border-gray-500 text-gray-300 text-xl rounded hover:bg-gray-500/40 transition-all w-full"
                                >
                                    EXIT
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
