"use client";

import { useEffect, useState } from "react";

export const useKonamiCode = (action: () => void) => {
    const [input, setInput] = useState<string[]>([]);
    const konamiCode = [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "b",
        "a",
    ];

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setInput((prev) => {
                const newInput = [...prev, e.key];
                if (newInput.length > konamiCode.length) {
                    newInput.shift();
                }
                return newInput;
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (JSON.stringify(input) === JSON.stringify(konamiCode)) {
            action();
            setInput([]);
        }
    }, [input, action, konamiCode]);
};
