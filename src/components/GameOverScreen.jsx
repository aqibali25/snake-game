import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ANIMATION_VARIANTS } from "../utils/constants";

const GameOverScreen = ({
  gameOver,
  score,
  bestScore,
  onPlayAgain,
  onMainMenu,
  onOverlayClick,
}) => {
  return (
    <AnimatePresence>
      {gameOver && (
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center rounded-lg sm:rounded-xl backdrop-blur-sm"
          onClick={onOverlayClick}
          variants={ANIMATION_VARIANTS.overlay}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-gray-900 bg-opacity-90 rounded-2xl p-6 sm:p-8 text-center border-2 border-white border-opacity-20 max-w-xs w-full mx-4"
            data-aos="zoom-in"
          >
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-red-500 mb-4 drop-shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              Game Over!
            </motion.h2>
            <div className="space-y-3 mb-6">
              <p className="text-lg sm:text-xl text-white">
                Score:{" "}
                <span className="text-yellow-300 font-bold">{score}</span>
              </p>
              <p className="text-base sm:text-lg text-white">
                Best:{" "}
                <span className="text-green-300 font-bold">{bestScore}</span>
              </p>
              {score === bestScore && score > 0 && (
                <motion.p
                  className="text-green-400 font-bold text-sm sm:text-base"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  🎉 New Best Score! 🎉
                </motion.p>
              )}
            </div>
            <div className="space-y-3">
              <motion.button
                onClick={onPlayAgain}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg w-full"
                variants={ANIMATION_VARIANTS.button}
                whileHover="hover"
                whileTap="tap"
              >
                Play Again
              </motion.button>
              <motion.button
                onClick={onMainMenu}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg w-full"
                variants={ANIMATION_VARIANTS.button}
                whileHover="hover"
                whileTap="tap"
              >
                Main Menu
              </motion.button>
            </div>
          </motion.div>
          <motion.p
            className="text-white text-opacity-60 text-xs sm:text-sm mt-4 text-center max-w-xs px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Click anywhere outside to return to main menu
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameOverScreen;
