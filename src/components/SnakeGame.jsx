import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

// Components
import StartScreen from "./StartScreen";
import GameOverScreen from "./GameOverScreen";
import GameBoard from "./GameBoard";
import GameHeader from "./GameHeader";
import MobileControls from "./MobileControls";

// Hooks
import { useGameLogic } from "../hooks/useGameLogic";
import { useResponsive } from "../hooks/useResponsive";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Constants
import { INITIAL_SPEED, ANIMATION_VARIANTS } from "../utils/constants";

const SnakeGame = () => {
  // State
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [logoError, setLogoError] = useState(false);

  // Hooks
  const [bestScore, setBestScore] = useLocalStorage("snakeBestScore", 0);
  const { isMobile, cellSize } = useResponsive();
  const gameLogic = useGameLogic();

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 50,
    });
  }, []);

  // Update best score
  useEffect(() => {
    if (gameLogic.score > bestScore) {
      setBestScore(gameLogic.score);
    }
  }, [gameLogic.score, bestScore, setBestScore]);

  // Handler functions
  const handleStartGame = () => {
    gameLogic.startGame();
    setShowStartScreen(false);
  };

  const handleResetToStartScreen = () => {
    gameLogic.resetGame();
    setShowStartScreen(true);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleResetToStartScreen();
    }
  };

  const handleLogoError = () => {
    setLogoError(true);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-800 flex flex-col items-center justify-center p-2 sm:p-4"
      initial="hidden"
      animate="visible"
      variants={ANIMATION_VARIANTS.container}
    >
      {/* Start Screen */}
      <StartScreen
        showStartScreen={showStartScreen}
        bestScore={bestScore}
        isMobile={isMobile}
        onStartGame={handleStartGame}
        onOverlayClick={handleOverlayClick}
        logoError={logoError}
        onLogoError={handleLogoError}
      />

      {/* Game Header */}
      {!showStartScreen && (
        <GameHeader
          score={gameLogic.score}
          bestScore={bestScore}
          speed={gameLogic.speed}
          INITIAL_SPEED={INITIAL_SPEED}
          isPlaying={gameLogic.isPlaying}
          gameOver={gameLogic.gameOver}
          isPaused={gameLogic.isPaused}
          onTogglePause={gameLogic.togglePause}
        />
      )}

      {/* Game Board */}
      {!showStartScreen && (
        <motion.div
          className="bg-gray-900 border-2 sm:border-4 border-gray-700 rounded-lg sm:rounded-xl shadow-2xl transition-all duration-300"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GameBoard
            snake={gameLogic.snake}
            food={gameLogic.food}
            cellSize={cellSize}
            countdown={gameLogic.countdown}
            isPaused={gameLogic.isPaused}
            gameOver={gameLogic.gameOver}
            score={gameLogic.score}
            onContinue={gameLogic.continueGame}
            onMainMenu={handleResetToStartScreen}
            onOverlayClick={handleOverlayClick}
          />

          {/* Game Over Screen */}
          <GameOverScreen
            gameOver={gameLogic.gameOver}
            score={gameLogic.score}
            bestScore={bestScore}
            onPlayAgain={handleStartGame}
            onMainMenu={handleResetToStartScreen}
            onOverlayClick={handleOverlayClick}
          />
        </motion.div>
      )}

      {/* Mobile Controls */}
      <MobileControls
        isMobile={isMobile}
        onSwipe={gameLogic.handleSwipe}
        showStartScreen={showStartScreen}
        gameOver={gameLogic.gameOver}
        isPaused={gameLogic.isPaused}
        countdown={gameLogic.countdown}
      />

      {/* Instructions */}
      {!showStartScreen &&
        !gameLogic.gameOver &&
        !gameLogic.isPaused &&
        gameLogic.countdown === 0 && (
          <motion.div
            className="mt-2 sm:mt-4 text-center px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-white text-opacity-70 text-xs sm:text-sm">
              {isMobile ? "Swipe to control • " : "Arrow keys to control • "}
              <span className="text-yellow-300">
                ESC to pause • Space to pause
              </span>
            </p>
          </motion.div>
        )}
    </motion.div>
  );
};

export default SnakeGame;
