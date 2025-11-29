"use client";

import { useEffect, useState, useCallback } from "react";
import { Flag, Bomb } from "lucide-react";

const ROWS = 16;
const COLS = 16;
const MINES = 40;

interface Cell {
    x: number;
    y: number;
    isMine: boolean;
    isOpen: boolean;
    isFlagged: boolean;
    neighborMines: number;
}

export default function MinesweeperGame() {
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [flagsLeft, setFlagsLeft] = useState(MINES);

    const createGrid = useCallback(() => {
        const newGrid: Cell[][] = [];
        for (let y = 0; y < ROWS; y++) {
            const row: Cell[] = [];
            for (let x = 0; x < COLS; x++) {
                row.push({
                    x,
                    y,
                    isMine: false,
                    isOpen: false,
                    isFlagged: false,
                    neighborMines: 0,
                });
            }
            newGrid.push(row);
        }

        // Place Mines
        let minesPlaced = 0;
        while (minesPlaced < MINES) {
            const x = Math.floor(Math.random() * COLS);
            const y = Math.floor(Math.random() * ROWS);
            if (!newGrid[y][x].isMine) {
                newGrid[y][x].isMine = true;
                minesPlaced++;
            }
        }

        // Calculate Neighbors
        for (let y = 0; y < ROWS; y++) {
            for (let x = 0; x < COLS; x++) {
                if (!newGrid[y][x].isMine) {
                    let count = 0;
                    for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                            const ny = y + dy;
                            const nx = x + dx;
                            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && newGrid[ny][nx].isMine) {
                                count++;
                            }
                        }
                    }
                    newGrid[y][x].neighborMines = count;
                }
            }
        }

        setGrid(newGrid);
        setGameOver(false);
        setGameWon(false);
        setFlagsLeft(MINES);
    }, []);

    useEffect(() => {
        if (gameStarted) createGrid();
    }, [gameStarted, createGrid]);

    const revealCell = (x: number, y: number, currentGrid: Cell[][]) => {
        if (x < 0 || x >= COLS || y < 0 || y >= ROWS || currentGrid[y][x].isOpen || currentGrid[y][x].isFlagged) return;

        currentGrid[y][x].isOpen = true;

        if (currentGrid[y][x].neighborMines === 0) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    revealCell(x + dx, y + dy, currentGrid);
                }
            }
        }
    };

    const handleCellClick = (x: number, y: number) => {
        if (gameOver || gameWon || grid[y][x].isFlagged) return;

        const newGrid = [...grid.map(row => [...row.map(cell => ({ ...cell }))])];

        if (newGrid[y][x].isMine) {
            setGameOver(true);
            // Reveal all mines
            newGrid.forEach(row => row.forEach(cell => {
                if (cell.isMine) cell.isOpen = true;
            }));
        } else {
            revealCell(x, y, newGrid);
            // Check Win
            let closedNonMines = 0;
            newGrid.forEach(row => row.forEach(cell => {
                if (!cell.isMine && !cell.isOpen) closedNonMines++;
            }));
            if (closedNonMines === 0) setGameWon(true);
        }

        setGrid(newGrid);
    };

    const handleRightClick = (e: React.MouseEvent, x: number, y: number) => {
        e.preventDefault();
        if (gameOver || gameWon || grid[y][x].isOpen) return;

        const newGrid = [...grid.map(row => [...row.map(cell => ({ ...cell }))])];
        if (newGrid[y][x].isFlagged) {
            newGrid[y][x].isFlagged = false;
            setFlagsLeft(prev => prev + 1);
        } else {
            if (flagsLeft > 0) {
                newGrid[y][x].isFlagged = true;
                setFlagsLeft(prev => prev - 1);
            }
        }
        setGrid(newGrid);
    };

    const getNumberColor = (num: number) => {
        switch (num) {
            case 1: return "text-blue-500";
            case 2: return "text-green-500";
            case 3: return "text-red-500";
            case 4: return "text-purple-500";
            case 5: return "text-yellow-500";
            case 6: return "text-cyan-500";
            case 7: return "text-white";
            case 8: return "text-gray-500";
            default: return "text-white";
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-vt323 text-white select-none">
            {!gameStarted ? (
                <div className="text-center z-10">
                    <h1 className="text-6xl text-yellow-500 mb-8 glow-text">MINESWEEPER</h1>
                    <p className="text-2xl mb-4 text-gray-300">Left Click to Reveal</p>
                    <p className="text-2xl mb-8 text-gray-300">Right Click to Flag</p>
                    <button
                        onClick={() => setGameStarted(true)}
                        className="px-8 py-4 bg-yellow-500/20 border-2 border-yellow-500 text-yellow-500 text-2xl rounded hover:bg-yellow-500/40 transition-all"
                    >
                        START GAME
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-between w-full max-w-md px-4">
                        <div className="text-2xl text-yellow-500 flex items-center gap-2">
                            <Flag size={24} /> {flagsLeft}
                        </div>
                        <div className="text-2xl text-red-500 flex items-center gap-2">
                            <Bomb size={24} /> {MINES}
                        </div>
                    </div>

                    <div
                        className="grid gap-[1px] bg-gray-700 border-4 border-gray-600 p-1"
                        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
                    >
                        {grid.map((row, y) => (
                            row.map((cell, x) => (
                                <div
                                    key={`${x}-${y}`}
                                    className={`
                                        w-8 h-8 flex items-center justify-center text-lg font-bold cursor-pointer
                                        ${cell.isOpen
                                            ? "bg-gray-900"
                                            : "bg-gray-400 hover:bg-gray-300 active:bg-gray-500"
                                        }
                                    `}
                                    onClick={() => handleCellClick(x, y)}
                                    onContextMenu={(e) => handleRightClick(e, x, y)}
                                >
                                    {cell.isOpen ? (
                                        cell.isMine ? <Bomb size={20} className="text-red-500" /> :
                                            cell.neighborMines > 0 ? <span className={getNumberColor(cell.neighborMines)}>{cell.neighborMines}</span> : ""
                                    ) : (
                                        cell.isFlagged ? <Flag size={20} className="text-yellow-500" /> : ""
                                    )}
                                </div>
                            ))
                        ))}
                    </div>

                    {(gameOver || gameWon) && (
                        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
                            <h2 className={`text-6xl mb-4 glow-text ${gameWon ? "text-green-500" : "text-red-500"}`}>
                                {gameWon ? "YOU WIN!" : "GAME OVER"}
                            </h2>
                            <div className="flex gap-4">
                                <button
                                    onClick={createGrid}
                                    className="px-6 py-3 bg-yellow-500/20 border-2 border-yellow-500 text-yellow-500 text-xl rounded hover:bg-yellow-500/40 transition-all"
                                >
                                    PLAY AGAIN
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
            )}
        </div>
    );
}
