import React from "react";
import { motion } from "framer-motion";
import { ANIMATION_VARIANTS } from "../utils/constants";

const MobileControls = ({
  isMobile,
  onSwipe,
  showStartScreen,
  gameOver,
  isPaused,
  countdown,
}) => {
  if (!isMobile || showStartScreen || gameOver || isPaused || countdown > 0) {
    return null;
  }

  return (
    <motion.div
      className="grid grid-cols-3 gap-1 sm:gap-3 mt-2 sm:mt-6 w-40 sm:w-48"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div></div>
      <motion.button
        onClick={() => onSwipe("UP")}
        className="bg-white bg-opacity-30 backdrop-blur-sm rounded-lg p-2 sm:p-4 flex items-center justify-center hover:bg-white hover:bg-opacity-40 transition-all"
        variants={ANIMATION_VARIANTS.button}
        whileHover="hover"
        whileTap="tap"
      >
        <span className="text-xl sm:text-2xl">↑</span>
      </motion.button>
      <div></div>

      <motion.button
        onClick={() => onSwipe("LEFT")}
        className="bg-white bg-opacity-30 backdrop-blur-sm rounded-lg p-2 sm:p-4 flex items-center justify-center hover:bg-white hover:bg-opacity-40 transition-all"
        variants={ANIMATION_VARIANTS.button}
        whileHover="hover"
        whileTap="tap"
      >
        <span className="text-l sm:text-2xl">←</span>
      </motion.button>
      <div className="bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
        <span className="text-xs text-white text-center">SWIPE</span>
      </div>
      <motion.button
        onClick={() => onSwipe("RIGHT")}
        className="bg-white bg-opacity-30 backdrop-blur-sm rounded-lg p-2 sm:p-4 flex items-center justify-center hover:bg-white hover:bg-opacity-40 transition-all"
        variants={ANIMATION_VARIANTS.button}
        whileHover="hover"
        whileTap="tap"
      >
        <span className="text-xl sm:text-2xl">→</span>
      </motion.button>

      <div></div>
      <motion.button
        onClick={() => onSwipe("DOWN")}
        className="bg-white bg-opacity-30 backdrop-blur-sm rounded-lg p-2 sm:p-4 flex items-center justify-center hover:bg-white hover:bg-opacity-40 transition-all"
        variants={ANIMATION_VARIANTS.button}
        whileHover="hover"
        whileTap="tap"
      >
        <span className="text-xl sm:text-2xl">↓</span>
      </motion.button>
      <div></div>
    </motion.div>
  );
};

export default MobileControls;
