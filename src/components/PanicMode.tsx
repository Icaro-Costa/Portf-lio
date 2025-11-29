"use client";

import { useEffect, useState } from "react";

export default function PanicMode() {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsActive((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    if (!isActive) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white text-black font-sans text-sm overflow-hidden">
            {/* Excel-like Header */}
            <div className="bg-[#217346] text-white p-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="font-bold">Book1 - Excel</span>
                </div>
                <div className="flex gap-2">
                    <button className="px-2 hover:bg-[#1e6b41]">-</button>
                    <button className="px-2 hover:bg-[#1e6b41]">□</button>
                    <button className="px-2 hover:bg-red-500">×</button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="bg-[#f3f2f1] border-b border-gray-300 p-2 flex gap-4 text-gray-700">
                <span>File</span>
                <span>Home</span>
                <span>Insert</span>
                <span>Page Layout</span>
                <span>Formulas</span>
                <span>Data</span>
                <span>Review</span>
                <span>View</span>
            </div>

            {/* Formula Bar */}
            <div className="flex items-center border-b border-gray-300 p-1 bg-white">
                <div className="w-10 text-center border-r border-gray-300 bg-gray-100">A1</div>
                <div className="flex-1 px-2">Q3 Financial Projections</div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-12 h-full">
                {/* Row Headers */}
                <div className="col-span-12 flex">
                    <div className="w-10 bg-gray-100 border-r border-b border-gray-300"></div>
                    {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"].map((col) => (
                        <div
                            key={col}
                            className="flex-1 text-center bg-gray-100 border-r border-b border-gray-300 py-1"
                        >
                            {col}
                        </div>
                    ))}
                </div>

                {/* Cells */}
                <div className="col-span-12 h-full overflow-auto">
                    {Array.from({ length: 20 }).map((_, row) => (
                        <div key={row} className="flex">
                            <div className="w-10 text-center bg-gray-100 border-r border-b border-gray-300 py-1">
                                {row + 1}
                            </div>
                            {Array.from({ length: 11 }).map((_, col) => (
                                <div
                                    key={col}
                                    className="flex-1 border-r border-b border-gray-200 py-1 px-2 whitespace-nowrap overflow-hidden"
                                >
                                    {row === 0 && col === 0 && "Q3 Financial Projections"}
                                    {row === 2 && col === 0 && "Revenue"}
                                    {row === 2 && col === 1 && "$1,200,000"}
                                    {row === 3 && col === 0 && "Expenses"}
                                    {row === 3 && col === 1 && "$850,000"}
                                    {row === 4 && col === 0 && "Net Profit"}
                                    {row === 4 && col === 1 && "$350,000"}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
