import React from "react";
import { motion } from "framer-motion";
import { ANIMATION_VARIANTS } from "../utils/constants";

const GameHeader = ({
  score,
  bestScore,
  speed,
  INITIAL_SPEED,
  isPlaying,
  gameOver,
  isPaused,
  onTogglePause,
}) => {
  return (
    <motion.div
      className="text-center mb-3 sm:mb-4 md:mb-6 w-full max-w-md px-2"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex justify-between items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-2 sm:py-3"
        data-aos="fade-down"
      >
        <div className="text-left">
          <div className="text-white font-semibold text-xs sm:text-sm">
            Score
          </div>
          <motion.div
            className="text-xl sm:text-2xl font-bold text-yellow-300"
            key={score}
            variants={ANIMATION_VARIANTS.score}
            animate="pulse"
          >
            {score}
          </motion.div>
        </div>
        <div className="text-center">
          <div className="text-white font-semibold text-xs sm:text-sm">
            Best
          </div>
          <div className="text-lg sm:text-xl font-bold text-green-300">
            {bestScore}
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-semibold text-xs sm:text-sm">
            Speed
          </div>
          <div className="text-base sm:text-lg font-bold text-blue-300">
            {INITIAL_SPEED - speed + 150}ms
          </div>
        </div>
      </motion.div>
      {isPlaying && !gameOver && (
        <motion.div
          className="mt-2 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={onTogglePause}
            className="bg-white bg-opacity-20 text-white px-4 py-1 rounded-full text-xs font-semibold hover:bg-opacity-30 transition-all"
            variants={ANIMATION_VARIANTS.button}
            whileHover="hover"
            whileTap="tap"
          >
            {isPaused ? "Resume (ESC)" : "Pause (ESC)"}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GameHeader;
