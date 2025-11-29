"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useLanguage } from "./LanguageContext";

interface BootSequenceProps {
    onComplete: () => void;
}

export default function BootSequence({ onComplete }: BootSequenceProps) {
    const { language } = useLanguage();
    const [lines, setLines] = useState<string[]>([]);
    const [memory, setMemory] = useState(0);

    useEffect(() => {
        const bootLinesEn = [
            "BIOS Date 01/15/90 19:20:00 Ver: 08.00.15",
            "CPU: Intel(R) Core(TM) i9-13900K CPU @ 5.80GHz",
            "Speed: 5800 MHz",
            "",
            "Memory Test: ",
            "  OK",
            "",
            "Detecting Primary Master ... Icaro Costa Portfolio",
            "Detecting Primary Slave  ... fsociety_v1.0",
            "Detecting Secondary Master ... None",
            "Detecting Secondary Slave  ... None",
            "",
            "Booting from Hard Disk...",
            "Loading kernel...",
            "Starting init process...",
            "Mounting filesystems...",
            "System ready.",
        ];

        const bootLinesPt = [
            "Data da BIOS 15/01/90 19:20:00 Ver: 08.00.15",
            "CPU: Intel(R) Core(TM) i9-13900K CPU @ 5.80GHz",
            "Velocidade: 5800 MHz",
            "",
            "Teste de Memoria: ",
            "  OK",
            "",
            "Detectando Master Primario ... Portfolio Icaro Costa",
            "Detectando Slave Primario  ... fsociety_v1.0",
            "Detectando Master Secundario ... Nenhum",
            "Detectando Slave Secundario  ... Nenhum",
            "",
            "Iniciando do Disco Rigido...",
            "Carregando kernel...",
            "Iniciando processos...",
            "Montando sistemas de arquivos...",
            "Sistema pronto.",
        ];

        const bootLines = language === "pt" ? bootLinesPt : bootLinesEn;

        let currentLine = 0;
        const lineInterval = setInterval(() => {
            if (currentLine < bootLines.length) {
                const lineToAdd = bootLines[currentLine];
                setLines((prev) => [...prev, lineToAdd]);
                currentLine++;
            } else {
                clearInterval(lineInterval);
                setTimeout(onComplete, 1000);
            }
        }, 150);

        // Memory counter effect
        const memInterval = setInterval(() => {
            setMemory((prev) => {
                if (prev < 64000) return prev + 1280;
                clearInterval(memInterval);
                return 64000;
            });
        }, 20);

        return () => {
            clearInterval(lineInterval);
            clearInterval(memInterval);
        };
    }, [onComplete]);

    return (
        <div className="font-vt323 text-xl md:text-2xl leading-tight p-8 h-screen w-screen bg-black text-green-500 overflow-hidden flex flex-col justify-start items-start">
            <div className="mb-4">
                <p>Award Modular BIOS v4.51PG, An Energy Star Ally</p>
                <p>Copyright (C) 1984-98, Award Software, Inc.</p>
            </div>

            <div className="flex flex-col w-full">
                {lines.map((line, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1 }}
                    >
                        {(line && (line.includes("Memory Test:") || line.includes("Teste de Memoria:"))) ? (
                            <span>
                                Memory Test: {memory}K {memory === 64000 ? "OK" : ""}
                            </span>
                        ) : (
                            line
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="mt-auto w-full border-t-2 border-green-500 pt-2">
                <p>{language === "pt" ? "Pressione DEL para entrar no SETUP" : "Press DEL to enter SETUP"}</p>
                <p>01/15/90-i440BX-8671-2A69KD4FC-00</p>
            </div>
        </div>
    );
}
