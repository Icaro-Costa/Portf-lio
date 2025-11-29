"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SkillsBar from "./SkillsBar";
import { useLanguage } from "./LanguageContext";

interface Command {
    input: string;
    output: React.ReactNode;
}

interface TerminalProps {
    onSwitchMode?: (mode: "terminal" | "gui" | "game" | null) => void;
}

export default function Terminal({ onSwitchMode }: TerminalProps) {
    const { t, setLanguage, language } = useLanguage();
    const [input, setInput] = useState("");
    const [history, setHistory] = useState<Command[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Initialize history with help message on mount or language change
    useEffect(() => {
        setHistory([
            {
                input: "help",
                output: t("help_desc"),
            },
        ]);
    }, [language, t]); // Re-run when language changes to show localized help

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleCommand = (cmd: string) => {
        const trimmedCmd = cmd.trim().toLowerCase();
        const parts = trimmedCmd.split(" ");
        const command = parts[0];
        const arg = parts[1];

        let output: React.ReactNode = "";

        switch (command) {
            case "help":
                output = (
                    <div className="text-green-400">
                        <p>{t("help_desc")}</p>
                        <ul className="list-disc pl-5">
                            <li>about    - {t("about_desc")}</li>
                            <li>skills   - {t("skills_desc")}</li>
                            <li>projects - {t("projects_desc")}</li>
                            <li>contact  - {t("contact_desc")}</li>
                            <li>lang     - {t("lang_desc")}</li>
                            <li>game     - {t("game_desc")}</li>
                            <li>exit     - {t("exit_desc")}</li>
                            <li>clear    - {t("clear_desc")}</li>
                        </ul>
                    </div>
                );
                break;
            case "about":
                output = (
                    <div>
                        <p>{t("about_text_1")}</p>
                        <p>{t("about_text_2")}</p>
                    </div>
                );
                break;
            case "skills":
                output = (
                    <div className="mt-2">
                        <SkillsBar name="React" level={90} type="mana" />
                        <SkillsBar name="Next.js" level={85} type="mana" />
                        <SkillsBar name="TypeScript" level={80} type="stamina" />
                        <SkillsBar name="Node.js" level={75} type="hp" />
                    </div>
                );
                break;
            case "projects":
                output = (
                    <div>
                        <p>{t("projects_list_1")}</p>
                        <p className="text-neon-blue cursor-pointer hover:underline" onClick={() => window.open("https://github.com/ArthurEstevaum/java-akademika", "_blank")}>
                            {t("projects_list_2")}
                        </p>
                        <p className="text-neon-green cursor-pointer hover:underline" onClick={() => window.open("https://github.com/ArthurEstevaum/WoodStock", "_blank")}>
                            {t("projects_list_3")}
                        </p>
                    </div>
                );
                break;
            case "contact":
                output = (
                    <div className="whitespace-pre-line">
                        {t("contact_info")}
                    </div>
                );
                break;
            case "lang":
                if (arg === "pt") {
                    setLanguage("pt");
                    output = "Idioma alterado para Português.";
                } else if (arg === "en") {
                    setLanguage("en");
                    output = "Language changed to English.";
                } else {
                    output = t("lang_desc");
                }
                break;
            case "game":
                if (onSwitchMode) {
                    onSwitchMode("game");
                    output = "Starting Arcade Mode...";
                } else {
                    output = "Game mode not available.";
                }
                break;
            case "exit":
                if (onSwitchMode) {
                    onSwitchMode(null);
                    output = "Exiting terminal mode...";
                }
                break;
            case "clear":
                setHistory([]);
                return;
            default:
                output = <span className="text-red-500">{t("command_not_found")} {cmd}</span>;
        }

        setHistory((prev) => [...prev, { input: cmd, output }]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input) return;
        handleCommand(input);
        setInput("");
    };

    return (
        <div
            className="font-vt323 text-xl w-full max-w-4xl mx-auto p-4 h-full overflow-y-auto"
            onClick={() => inputRef.current?.focus()}
        >
            {history.map((entry, i) => (
                <div key={i} className="mb-2">
                    <div className="flex items-center">
                        <span className="text-neon-blue mr-2">{t("visitor")}</span>
                        <span>{entry.input}</span>
                    </div>
                    <div className="ml-4 mb-2 text-gray-300">{entry.output}</div>
                </div>
            ))}

            <form onSubmit={handleSubmit} className="flex items-center">
                <span className="text-neon-blue mr-2">{t("visitor")}</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                    className="bg-transparent border-none outline-none flex-1 text-green-500 caret-green-500"
                    autoFocus
                />
            </form>
            <div ref={bottomRef} />
        </div>
    );
}
