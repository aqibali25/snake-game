import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ANIMATION_VARIANTS, GRID_SIZE } from "../utils/constants";

const GameBoard = ({
  snake,
  food,
  cellSize,
  countdown,
  isPaused,
  gameOver,
  score,
  onContinue,
  onMainMenu,
  onOverlayClick,
}) => {
  const renderBoard = () => {
    const board = [];

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some(
          (segment) => segment.x === x && segment.y === y
        );
        const isHead = snake[0].x === x && snake[0].y === y;
        const isFood = food.x === x && food.y === y;
        const snakeIndex = snake.findIndex(
          (segment) => segment.x === x && segment.y === y
        );

        let cellClass = "absolute border border-gray-700";

        if (isHead) {
          // Realistic snake head with eyes
          cellClass += " rounded-lg relative overflow-hidden";
          const headStyle = {
            background:
              "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
            boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.2)",
          };

          board.push(
            <motion.div
              key={`${x}-${y}`}
              className={cellClass}
              style={{
                ...headStyle,
                width: cellSize,
                height: cellSize,
                left: x * cellSize,
                top: y * cellSize,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {/* Snake eyes */}
              <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full"></div>
            </motion.div>
          );
        } else if (isSnake) {
          // Realistic snake body with gradient and segments
          const intensity = Math.max(
            0.3,
            1 - (snakeIndex / snake.length) * 0.7
          );
          const bodyStyle = {
            background: `linear-gradient(135deg, 
              rgb(5, 150, 105) 0%, 
              rgb(16, 185, 129) 50%, 
              rgb(34, 197, 94) 100%)`,
            opacity: intensity,
            boxShadow: "inset 0 -1px 2px rgba(0,0,0,0.1)",
          };

          board.push(
            <motion.div
              key={`${x}-${y}`}
              className={cellClass + " rounded-sm"}
              style={{
                ...bodyStyle,
                width: cellSize,
                height: cellSize,
                left: x * cellSize,
                top: y * cellSize,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: intensity }}
              transition={{ duration: 0.2 }}
            />
          );
        } else if (isFood) {
          // Realistic apple with stem and leaf
          board.push(
            <motion.div
              key={`${x}-${y}`}
              className="absolute flex items-center justify-center"
              style={{
                width: cellSize,
                height: cellSize,
                left: x * cellSize,
                top: y * cellSize,
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {/* Apple body */}
              <motion.div
                className="relative rounded-full shadow-lg"
                style={{
                  width: cellSize * 0.8,
                  height: cellSize * 0.8,
                  background:
                    "linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)",
                  boxShadow:
                    "inset -2px -2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {/* Apple stem */}
                <div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-2 bg-amber-900 rounded-full"
                  style={{ transform: "translateX(-50%) translateY(-50%)" }}
                />
                {/* Apple leaf */}
                <div className="absolute top-0 left-1/2 transform -translate-x-2 -translate-y-1/2 w-2 h-1 bg-green-500 rounded-full rotate-45" />
                {/* Apple highlight */}
                <div className="absolute top-2 left-2 w-1 h-1 bg-red-200 rounded-full opacity-60" />
              </motion.div>
            </motion.div>
          );
        } else {
          // Empty cell
          board.push(
            <motion.div
              key={`${x}-${y}`}
              className={cellClass + " bg-gray-800"}
              style={{
                width: cellSize,
                height: cellSize,
                left: x * cellSize,
                top: y * cellSize,
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          );
        }
      }
    }

    return board;
  };

  return (
    <div
      className="relative"
      style={{
        width: GRID_SIZE * cellSize,
        height: GRID_SIZE * cellSize,
      }}
    >
      {renderBoard()}

      {/* Countdown Overlay */}
      <AnimatePresence>
        {countdown > 0 && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg sm:rounded-xl backdrop-blur-sm"
            variants={ANIMATION_VARIANTS.overlay}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="text-center"
              variants={ANIMATION_VARIANTS.countdown}
              initial="initial"
              animate="animate"
              exit="exit"
              key={countdown}
            >
              <motion.div
                className="text-8xl sm:text-9xl font-bold text-white drop-shadow-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  color:
                    countdown === 1
                      ? "#ef4444"
                      : countdown === 2
                      ? "#f59e0b"
                      : "#10b981",
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                {countdown}
              </motion.div>
              {countdown === 1 && (
                <motion.p
                  className="text-2xl sm:text-3xl text-yellow-300 font-bold mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Go!
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center rounded-lg sm:rounded-xl backdrop-blur-sm"
            variants={ANIMATION_VARIANTS.overlay}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-gray-900 bg-opacity-90 rounded-2xl p-6 sm:p-8 text-center border-2 border-white border-opacity-20 max-w-xs w-full mx-4"
              data-aos="zoom-in"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4 drop-shadow-lg">
                Game Paused
              </h2>
              <p className="text-white text-sm sm:text-base mb-2">
                Score:{" "}
                <span className="text-yellow-300 font-bold">{score}</span>
              </p>
              <p className="text-white text-xs sm:text-sm mb-6">
                Press ESC or click Continue to resume
              </p>
              <div className="space-y-3">
                <motion.button
                  onClick={onContinue}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg w-full"
                  variants={ANIMATION_VARIANTS.button}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Continue Game
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameBoard;
