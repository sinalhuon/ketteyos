'use client';

import { motion } from 'framer-motion';

export default function FlowerBloom() {
    // Animation variants for different corners
    const cornerVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1.5,
                delay: 0.2
            }
        }
    };

    return (
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
            {/* Top Left Bouquet (Mix of 01 and 05) */}
            <motion.div
                className="absolute -top-24 -left-24 w-64 md:w-96"
                initial="hidden"
                animate="visible"
                variants={cornerVariants}
                style={{ transformOrigin: 'top left', zIndex: 10 }}
            >
                <img src="/assets/flowers/01.png" alt="Flower Decoration" className="w-full h-auto drop-shadow-2xl" />
            </motion.div>
            <motion.div
                className="absolute -top-10 -left-16 w-48 md:w-72"
                initial="hidden"
                animate="visible"
                variants={{ ...cornerVariants, visible: { ...cornerVariants.visible, transition: { ...cornerVariants.visible.transition, delay: 0.4 } } }}
                style={{ transformOrigin: 'top left', zIndex: 5 }}
            >
                <img src="/assets/flowers/05.png" alt="Flower Decoration" className="w-full h-auto drop-shadow-xl opacity-90" />
            </motion.div>

            {/* Top Right Bouquet (Mix of 02 and 06 - Flipped) */}
            <motion.div
                className="absolute -top-28 -right-28 w-56 md:w-80"
                initial="hidden"
                animate="visible"
                variants={cornerVariants}
                style={{ transformOrigin: 'top right', zIndex: 10 }}
            >
                <img src="/assets/flowers/02.png" alt="Flower Decoration" className="w-full h-auto drop-shadow-2xl transform scale-x-[-1]" />
            </motion.div>
            <motion.div
                className="absolute -top-12 -right-6 w-40 md:w-60"
                initial="hidden"
                animate="visible"
                variants={{ ...cornerVariants, visible: { ...cornerVariants.visible, transition: { ...cornerVariants.visible.transition, delay: 0.5 } } }}
                style={{ transformOrigin: 'top right', zIndex: 5 }}
            >
                <img src="/assets/flowers/06.png" alt="Flower Decoration" className="w-full h-auto drop-shadow-xl transform scale-x-[-1] rotate-12" />
            </motion.div>

            {/* Bottom Left Bouquet (Mix of 03 and 07) */}
            <motion.div
                className="absolute -bottom-24 -left-24 w-60 md:w-80"
                initial="hidden"
                animate="visible"
                variants={cornerVariants}
                style={{ transformOrigin: 'bottom left', zIndex: 10 }}
            >
                <img src="/assets/flowers/03.png" alt="Flower Decoration" className="w-full h-auto drop-shadow-2xl" />
            </motion.div>
            <motion.div
                className="absolute -bottom-6 -left-10 w-48 md:w-64"
                initial="hidden"
                animate="visible"
                variants={{ ...cornerVariants, visible: { ...cornerVariants.visible, transition: { ...cornerVariants.visible.transition, delay: 0.6 } } }}
                style={{ transformOrigin: 'bottom left', zIndex: 5 }}
            >
                <img src="/assets/flowers/07.png" alt="Flower Decoration" className="w-full h-auto drop-shadow-xl rotate-45" />
            </motion.div>

            {/* Bottom Right Bouquet (Mix of 04 and 08) */}
            <motion.div
                className="absolute -bottom-28 -right-28 w-72 md:w-[30rem]"
                initial="hidden"
                animate="visible"
                variants={cornerVariants}
                style={{ transformOrigin: 'bottom right', zIndex: 10 }}
            >
                <img src="/assets/flowers/04.png" alt="Flower Decoration" className="w-full h-auto drop-shadow-2xl" />
            </motion.div>
            <motion.div
                className="absolute -bottom-5 -right-5 w-56 md:w-80"
                initial="hidden"
                animate="visible"
                variants={{ ...cornerVariants, visible: { ...cornerVariants.visible, transition: { ...cornerVariants.visible.transition, delay: 0.7 } } }}
                style={{ transformOrigin: 'bottom right', zIndex: 5 }}
            >
                <img src="/assets/flowers/08.png" alt="Flower Decoration" className="w-full h-auto drop-shadow-xl rotate-12" />
            </motion.div>
        </div>
    );
}
