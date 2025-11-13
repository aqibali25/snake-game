import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ANIMATION_VARIANTS } from "../utils/constants";
import Logo from "../../public/logo.png";

const StartScreen = ({
  showStartScreen,
  bestScore,
  isMobile,
  onStartGame,
  onOverlayClick,
  logoError,
  onLogoError,
}) => {
  return (
    <AnimatePresence>
      {showStartScreen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4"
          onClick={onOverlayClick}
          variants={ANIMATION_VARIANTS.overlay}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-12 max-w-md w-full border-2 border-white border-opacity-20 shadow-2xl mx-4"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <motion.div
              className="text-center"
              variants={ANIMATION_VARIANTS.container}
            >
              <motion.div
                className="flex justify-center items-center mb-4"
                variants={ANIMATION_VARIANTS.logo}
                initial="hidden"
                animate="visible"
              >
                {!logoError ? (
                  <motion.img
                    src={Logo}
                    alt="Snake Game Logo"
                    className="h-16 sm:h-30 md:h-40 object-contain"
                    onError={onLogoError}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                ) : (
                  <motion.h1
                    className="text-3xl sm:text-4xl md:text-6xl font-bold text-green-400 drop-shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    🐍 Snake
                  </motion.h1>
                )}
              </motion.div>

              <motion.p
                className="text-white text-base sm:text-lg md:text-xl mb-2"
                variants={ANIMATION_VARIANTS.item}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                Best Score:{" "}
                <span className="text-yellow-300 font-bold">{bestScore}</span>
              </motion.p>
              <motion.p
                className="text-gray-300 text-sm sm:text-base mb-6 md:mb-8"
                variants={ANIMATION_VARIANTS.item}
                data-aos="fade-up"
                data-aos-delay="200"
              >
                {isMobile
                  ? "Swipe to control the snake"
                  : "Use arrow keys to control the snake"}
              </motion.p>

              <motion.button
                onClick={onStartGame}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold text-lg sm:text-xl shadow-lg mb-6 w-full"
                variants={ANIMATION_VARIANTS.button}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                data-aos="zoom-in"
                data-aos-delay="300"
              >
                Start Game
              </motion.button>

              <motion.div
                className="text-left text-white bg-white bg-opacity-10 rounded-xl p-3 sm:p-4"
                variants={ANIMATION_VARIANTS.item}
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <h3 className="font-bold text-yellow-300 mb-3 text-center text-sm sm:text-base">
                  How to Play:
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Don't hit walls or yourself
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Eat{" "}
                    <span className="text-red-400 font-bold mx-2">APPLE</span>{" "}
                    to grow
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Game speeds up every 5 points
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Press ESC to pause/resume
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                    Space bar also pauses
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StartScreen;
