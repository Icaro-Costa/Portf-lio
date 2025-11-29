"use client";

import { Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function PowerUps() {
    const powerUps = [
        {
            name: "Github",
            icon: <Github size={24} />,
            link: "https://github.com/Icaro-Costa",
            color: "hover:text-purple-500 hover:shadow-[0_0_10px_#a855f7]",
        },
        {
            name: "LinkedIn",
            icon: <Linkedin size={24} />,
            link: "https://www.linkedin.com/in/icaro-costa-ic/",
            color: "hover:text-blue-500 hover:shadow-[0_0_10px_#3b82f6]",
        },
        {
            name: "Email",
            icon: <Mail size={24} />,
            link: "mailto:icaro.developerr@gmail.com",
            color: "hover:text-yellow-500 hover:shadow-[0_0_10px_#eab308]",
        },
    ];

    return (
        <div className="fixed bottom-8 right-8 flex gap-4 z-50">
            {powerUps.map((item) => (
                <motion.a
                    key={item.name}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-black border-2 border-gray-700 text-gray-400 transition-all duration-200 ${item.color} cursor-pointer rounded-full`}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {item.icon}
                </motion.a>
            ))}
        </div>
    );
}
