"use client";

import { motion } from "framer-motion";

interface SkillProps {
    name: string;
    level: number; // 0-100
    type: "hp" | "mana" | "stamina";
}

export default function SkillsBar({ name, level, type }: SkillProps) {
    const getColor = () => {
        switch (type) {
            case "hp":
                return "bg-red-500";
            case "mana":
                return "bg-blue-500";
            case "stamina":
                return "bg-green-500";
            default:
                return "bg-green-500";
        }
    };

    const colorClass = getColor();

    return (
        <div className="flex items-center gap-4 mb-2 font-press-start text-xs md:text-sm">
            <div className="w-24 text-right">{name}</div>
            <div className="flex-1 h-6 bg-gray-900 border-2 border-gray-700 relative">
                <motion.div
                    className={`h-full ${colorClass} absolute top-0 left-0`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
                {/* Pixel grid overlay for retro feel */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(to right, transparent 50%, rgba(0,0,0,0.5) 50%)",
                        backgroundSize: "4px 100%",
                    }}
                />
            </div>
            <div className="w-12 text-right">{level}/100</div>
        </div>
    );
}
