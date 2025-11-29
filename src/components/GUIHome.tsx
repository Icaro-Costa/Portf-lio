"use client";

import { motion } from "framer-motion";
import { User, Code, Briefcase, Mail, ExternalLink } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import MatrixRain from "./MatrixRain";

export default function GUIHome() {
    const { t } = useLanguage();
    // const { playHover } = useSoundManager(); // Removed SFX

    const sections = [
        {
            id: "about",
            title: t("about_desc"),
            icon: <User size={32} />,
            content: (
                <div className="space-y-4">
                    <p className="text-lg">{t("about_text_1")}</p>
                    <p className="text-gray-400">{t("about_text_2")}</p>
                </div>
            ),
        },
        {
            id: "skills",
            title: t("skills_desc"),
            icon: <Code size={32} />,
            content: (
                <div className="grid grid-cols-2 gap-4">
                    {["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "PostgreSQL"].map((skill) => (
                        <div key={skill} className="bg-gray-800 p-3 rounded border border-gray-700 text-center">
                            {skill}
                        </div>
                    ))}
                </div>
            ),
        },
        {
            id: "projects",
            title: t("projects_desc"),
            icon: <Briefcase size={32} />,
            content: (
                <div className="space-y-6">
                    <div className="border border-gray-700 p-4 rounded bg-gray-900/50">
                        <h3 className="text-xl font-bold mb-2">Portfolio v1</h3>
                        <p className="text-gray-400 mb-4">{t("projects_list_1")}</p>
                        <button className="flex items-center gap-2 text-neon-blue hover:underline">
                            {t("view_project")} <ExternalLink size={16} />
                        </button>
                    </div>
                    <div className="border border-gray-700 p-6 rounded bg-gray-900/50 hover:border-neon-blue transition-colors">
                        <h3 className="text-2xl font-bold mb-3 text-neon-green">Java Akademika</h3>
                        <p className="text-gray-300 mb-4 italic">"{t("akademika_desc")}"</p>

                        <div className="mb-4">
                            <h4 className="font-bold text-neon-blue mb-2">{t("akademika_features_title")}</h4>
                            <ul className="list-disc list-inside text-gray-400 space-y-1">
                                <li>{t("akademika_feat_1")}</li>
                                <li>{t("akademika_feat_2")}</li>
                            </ul>
                        </div>

                        <p className="text-sm text-gray-500 mb-4 border-t border-gray-800 pt-2">
                            {t("akademika_stack")}
                        </p>

                        <button
                            className="flex items-center gap-2 bg-neon-blue/10 text-neon-blue px-4 py-2 rounded hover:bg-neon-blue/20 transition-colors"
                            onClick={() => window.open("https://github.com/ArthurEstevaum/java-akademika", "_blank")}
                        >
                            {t("view_project")} <ExternalLink size={16} />
                        </button>
                    </div>
                    <div className="border border-gray-700 p-6 rounded bg-gray-900/50 hover:border-neon-green transition-colors">
                        <h3 className="text-2xl font-bold mb-3 text-neon-green">WoodStock</h3>
                        <p className="text-gray-300 mb-4 italic">"{t("woodstock_desc")}"</p>

                        <div className="mb-4">
                            <h4 className="font-bold text-neon-blue mb-2">{t("woodstock_features_title")}</h4>
                            <ul className="list-disc list-inside text-gray-400 space-y-1">
                                <li>{t("woodstock_feat_1")}</li>
                                <li>{t("woodstock_feat_2")}</li>
                            </ul>
                        </div>

                        <p className="text-sm text-gray-500 mb-4 border-t border-gray-800 pt-2">
                            {t("woodstock_stack")}
                        </p>

                        <button
                            className="flex items-center gap-2 bg-neon-green/10 text-neon-green px-4 py-2 rounded hover:bg-neon-green/20 transition-colors"
                            onClick={() => window.open("https://github.com/ArthurEstevaum/WoodStock", "_blank")}
                        >
                            {t("view_project")} <ExternalLink size={16} />
                        </button>
                    </div>
                </div>
            ),
        },
        {
            id: "contact",
            title: t("contact_desc"),
            icon: <Mail size={32} />,
            content: (
                <div className="space-y-4 whitespace-pre-line">
                    <p>{t("contact_info")}</p>
                    <button className="bg-neon-green text-black px-6 py-2 rounded font-bold hover:bg-green-400 transition-colors mt-4">
                        {t("contact_me")}
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen w-full p-8 overflow-y-auto font-sans text-gray-200 relative">
            <MatrixRain />
            <div className="relative z-10">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-neon-blue mb-4">Icaro Costa</h1>
                    <p className="text-xl text-gray-400">Full Stack Developer</p>
                </header>

                <div className="max-w-4xl mx-auto grid gap-12 pb-20">
                    {sections.map((section, index) => (
                        <motion.section
                            key={section.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-gray-900/80 border border-gray-800 p-8 rounded-xl shadow-lg backdrop-blur-sm hover:border-neon-blue/50 transition-colors"
                        >
                            <div className="flex items-center gap-4 mb-6 border-b border-gray-800 pb-4">
                                <div className="text-neon-green">{section.icon}</div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white">{section.title}</h2>
                            </div>
                            <div>{section.content}</div>
                        </motion.section>
                    ))}
                </div>
            </div>
        </div>
    );
}
