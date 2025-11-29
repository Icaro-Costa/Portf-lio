"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Language = "pt" | "en";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const translations = {
    en: {
        welcome: "Welcome to the system.",
        help_desc: "Available commands: help, about, skills, projects, contact, clear, lang",
        about_desc: "Who am I?",
        skills_desc: "My technical abilities",
        projects_desc: "Recent work",
        contact_desc: "How to reach me",
        clear_desc: "Clear terminal",
        lang_desc: "Switch language (usage: lang pt / lang en)",
        about_text_1: "Researcher at CTI Renato Archer, focusing on Educational Robotics and Computer Vision.",
        about_text_2: "My research is dedicated to empowering public school teachers by developing methodologies and tools that bridge technology and education to transform the classroom. I am proactive and focused on creating practical solutions with real impact. Driven by a passion for learning and teaching, I believe in the power of technology as a bridge to knowledge.",
        projects_list_1: "1. Portfolio v1 (You are here)",
        projects_list_2: "2. Java Akademika - Student platform with AI, Java Spring Boot & React.",
        projects_list_3: "3. Retro Game Engine",
        contact_info: "Email: icaro.developerr@gmail.com\nGitHub: github.com/Icaro-Costa\nLinkedIn: linkedin.com/in/icaro-costa-ic",
        command_not_found: "Command not found:",
        lang_changed: "Language changed to English.",
        visitor: "visitor@fsociety:~$",
        select_mode: "Select Interface Mode",
        terminal_mode: "Terminal Mode",
        terminal_desc: "For hackers and power users. Command line interface.",
        gui_mode: "Graphical Mode",
        gui_desc: "For humans. Visual interface with cards and scrolling.",
        view_project: "View Project",
        contact_me: "Contact Me",
        akademika_desc: "Academic management platform with AI.",
        akademika_features_title: "Key Features:",
        akademika_feat_1: "Academic Organization: Dashboard, Management, Grade Control.",
        akademika_feat_2: "AI Study: Summaries & Exercises via Azure OpenAI.",
        akademika_stack: "Stack: Java Spring Boot, React, PostgreSQL, Azure OpenAI.",
        woodstock_desc: "CLI Inventory Manager. Simple, clear, and organized.",
        woodstock_features_title: "Key Features:",
        woodstock_feat_1: "Products & Batches: Manage entities with arrival and expiration dates.",
        woodstock_feat_2: "Exact Count: Automatic total calculation from batches.",
        woodstock_stack: "Stack: Python, JSON Persistence, Repository Pattern.",
        music_desc: "Toggle background music (on/off)",
        game_mode: "Arcade Mode",
        game_desc: "Play Space Shooter",
    },
    pt: {
        welcome: "Bem-vindo ao sistema.",
        help_desc: "Comandos disponíveis: help, about, skills, projects, contact, clear, lang",
        about_desc: "Quem sou eu?",
        skills_desc: "Minhas habilidades técnicas",
        projects_desc: "Trabalhos recentes",
        contact_desc: "Como me encontrar",
        clear_desc: "Limpar terminal",
        lang_desc: "Trocar idioma (uso: lang pt / lang en)",
        about_text_1: "Pesquisador no CTI Renato Archer, com foco em Robótica Educacional e Visão Computacional.",
        about_text_2: "Minha pesquisa é dedicada a capacitar professores da rede pública, desenvolvendo metodologias e ferramentas que unem tecnologia e educação para transformar a sala de aula. Sou proativo e focado em criar soluções práticas que tenham um impacto real. Movido pela paixão de aprender e ensinar, acredito no poder da tecnologia como ponte para o conhecimento.",
        projects_list_1: "1. Portfólio v1 (Você está aqui)",
        projects_list_2: "2. Java Akademika - Plataforma estudantil com IA, Java Spring Boot & React.",
        projects_list_3: "3. WoodStock - Gerente de Estoque CLI em Python.",
        contact_info: "Email: icaro.developerr@gmail.com\nGitHub: github.com/Icaro-Costa\nLinkedIn: linkedin.com/in/icaro-costa-ic",
        command_not_found: "Comando não encontrado:",
        lang_changed: "Idioma alterado para Português.",
        visitor: "visitante@fsociety:~$",
        select_mode: "Selecione o Modo de Interface",
        terminal_mode: "Modo Terminal",
        terminal_desc: "Para hackers e usuários avançados. Interface de linha de comando.",
        gui_mode: "Modo Gráfico",
        gui_desc: "Para humanos. Interface visual com cards e rolagem.",
        view_project: "Ver Projeto",
        contact_me: "Entrar em Contato",
        akademika_desc: "A solução danada de boa que veio pra ajeitar a vida de todo estudante.",
        akademika_features_title: "Funcionalidades:",
        akademika_feat_1: "Arrumação Acadêmica: Dashboard, Gerenciamento e Controle de Notas.",
        akademika_feat_2: "Estudo com IA: Resumos e Exercícios personalizados com Azure OpenAI.",
        akademika_stack: "Tecnologias: Java Spring Boot, React, PostgreSQL, Azure OpenAI.",
        woodstock_desc: "O Gerente de Estoque do Sertão! Simples e organizado.",
        woodstock_features_title: "Funcionalidades:",
        woodstock_feat_1: "Produtos e Lotes: Controle de entrada, saída e validade.",
        woodstock_feat_2: "Contagem Exata: Cálculo automático de totais por lotes.",
        woodstock_stack: "Tecnologias: Python, JSON, Padrão Repository.",
        music_desc: "Ligar/Desligar música de fundo",
        game_mode: "Modo Arcade",
        game_desc: "Jogar Space Shooter",
    },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>("pt"); // Default to PT as requested

    const t = (key: string) => {
        // @ts-expect-error - simple key access
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
