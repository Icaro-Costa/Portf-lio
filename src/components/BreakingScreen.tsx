import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BreakingScreenProps {
    onComplete: () => void;
}

const BreakingScreen: React.FC<BreakingScreenProps> = ({ onComplete }) => {
    const [isBreaking, setIsBreaking] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 2500); // Animation duration
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
            {/* Glitch Overlay */}
            <motion.div
                className="absolute inset-0 bg-black mix-blend-overlay opacity-50"
                animate={{
                    x: [-5, 5, -5, 5, 0],
                    opacity: [0.5, 0.8, 0.5, 0.9, 0],
                }}
                transition={{ duration: 0.5, repeat: 3 }}
            />

            {/* Cracks / Shards */}
            {[...Array(10)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-black"
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 300 + 100}px`,
                        height: `${Math.random() * 300 + 100}px`,
                        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle shards
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                        scale: [0, 1.5],
                        opacity: [0, 1],
                        y: [0, 1000], // Fall down
                        rotate: [0, Math.random() * 360],
                    }}
                    transition={{
                        duration: 1.5,
                        delay: Math.random() * 0.5,
                        ease: "easeIn",
                    }}
                />
            ))}

            {/* Flash */}
            <motion.div
                className="absolute inset-0 bg-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.2, delay: 1.8 }}
            />
        </div>
    );
};

export default BreakingScreen;
