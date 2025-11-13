import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../public/logo.png";
import AOS from "aos";
import "aos/dist/aos.css";

const SnakeGame = () => {
  // Game constants
  const GRID_SIZE = 20;
  const INITIAL_SPEED = 150;

  // Game state
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [isMobile, setIsMobile] = useState(false);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [cellSize, setCellSize] = useState(20);
  const [logoError, setLogoError] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isFirstStart, setIsFirstStart] = useState(true);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 50,
    });
  }, []);

  // Load best score from localStorage
  useEffect(() => {
    const savedBestScore = localStorage.getItem("snakeBestScore");
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // Save best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem("snakeBestScore", score.toString());
    }
  }, [score, bestScore]);

  // Responsive cell size calculation
  useEffect(() => {
    const calculateCellSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      if (width < 400) {
        return 14; // Very small screens
      } else if (width < 640) {
        return 16; // Small mobile
      } else if (width < 768) {
        return 18; // Large mobile
      } else if (width < 1024) {
        return 20; // Tablet
      } else {
        return 22; // Desktop
      }
    };

    const handleResize = () => {
      setCellSize(calculateCellSize());
    };

    handleResize(); // Initial calculation
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate random food position
  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

    const isOnSnake = snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    );

    if (isOnSnake) {
      generateFood();
    } else {
      setFood(newFood);
    }
  }, [snake]);

  // Start countdown
  const startCountdown = () => {
    setCountdown(3);
  };

  // Initialize game
  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    setShowStartScreen(false);
    generateFood();

    if (isFirstStart) {
      startCountdown();
      setIsFirstStart(false);
    }
  };

  // Reset to start screen
  const resetToStartScreen = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setGameOver(false);
    setShowStartScreen(true);
    setScore(0);
    setIsFirstStart(true);
  };

  // Toggle pause
  const togglePause = () => {
    if (isPlaying && !gameOver) {
      setIsPaused(!isPaused);
    }
  };

  // Continue game
  const continueGame = () => {
    setIsPaused(false);
  };

  // Check collision
  const checkCollision = useCallback(
    (head) => {
      if (
        head.x < 0 ||
        head.x >= GRID_SIZE ||
        head.y < 0 ||
        head.y >= GRID_SIZE
      ) {
        return true;
      }

      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          return true;
        }
      }

      return false;
    },
    [snake]
  );

  // Move snake
  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver || isPaused || countdown > 0) return;

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      switch (direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
        default:
          break;
      }

      if (checkCollision(head)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          if (newScore % 5 === 0 && speed > 50) {
            setSpeed((prevSpeed) => prevSpeed - 10);
          }
          return newScore;
        });
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [
    direction,
    food,
    isPlaying,
    gameOver,
    isPaused,
    checkCollision,
    generateFood,
    speed,
    countdown,
  ]);

  // Handle countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showStartScreen || countdown > 0) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN" && isPlaying && !isPaused)
            setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP" && isPlaying && !isPaused)
            setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT" && isPlaying && !isPaused)
            setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT" && isPlaying && !isPaused)
            setDirection("RIGHT");
          break;
        case "Escape":
          if (isPlaying && !gameOver) {
            togglePause();
          } else if (showStartScreen) {
            // Do nothing on start screen
          } else {
            resetToStartScreen();
          }
          break;
        case " ":
          if (isPlaying && !gameOver) {
            togglePause();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction, isPlaying, isPaused, gameOver, showStartScreen, countdown]);

  // Touch controls for mobile
  const handleSwipe = (newDirection) => {
    if (!isPlaying || showStartScreen || isPaused || countdown > 0) return;

    const oppositeDirections = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };

    if (direction !== oppositeDirections[newDirection]) {
      setDirection(newDirection);
    }
  };

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver || showStartScreen || isPaused || countdown > 0)
      return;

    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [
    moveSnake,
    isPlaying,
    gameOver,
    speed,
    showStartScreen,
    isPaused,
    countdown,
  ]);

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const scoreVariants = {
    pulse: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 0.3,
        repeat: 1,
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  const countdownVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [1.5, 1, 1.2, 1],
      opacity: 1,
      transition: {
        scale: {
          duration: 1,
          times: [0, 0.3, 0.8, 1],
        },
      },
    },
    exit: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  // Handle logo image error
  const handleLogoError = () => {
    setLogoError(true);
  };

  // Render game board with animations
  const renderBoard = () => {
    const board = [];

    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some(
          (segment) => segment.x === x && segment.y === y
        );
        const isHead = snake[0].x === x && snake[0].y === y;
        const isFood = food.x === x && food.y === y;

        let cellClass = "absolute border border-gray-700";

        if (isHead) {
          cellClass += " bg-green-500 rounded-lg";
        } else if (isSnake) {
          cellClass += " bg-green-600 rounded-sm";
        } else if (isFood) {
          cellClass += " bg-red-500 rounded-full animate-pulse";
        } else {
          cellClass += " bg-gray-800";
        }

        board.push(
          <motion.div
            key={`${x}-${y}`}
            className={cellClass}
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

    return board;
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      resetToStartScreen();
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-800 flex flex-col items-center justify-center p-2 sm:p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Start Screen */}
      <AnimatePresence>
        {showStartScreen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4"
            onClick={handleOverlayClick}
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className="bg-gray-900 bg-opacity-90 backdrop-blur-lg rounded-3xl p-6 sm:p-8 md:p-12 max-w-md w-full border-2 border-white border-opacity-20 shadow-2xl mx-4"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <motion.div className="text-center" variants={containerVariants}>
                <motion.div
                  className="flex justify-center items-center mb-4"
                  variants={logoVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {!logoError ? (
                    <motion.img
                      src={Logo}
                      alt="Snake Game Logo"
                      className="h-16 sm:h-30 md:h-40 object-contain"
                      onError={handleLogoError}
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
                  variants={itemVariants}
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  Best Score:{" "}
                  <span className="text-yellow-300 font-bold">{bestScore}</span>
                </motion.p>
                <motion.p
                  className="text-gray-300 text-sm sm:text-base mb-6 md:mb-8"
                  variants={itemVariants}
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  {isMobile
                    ? "Swipe to control the snake"
                    : "Use arrow keys to control the snake"}
                </motion.p>

                <motion.button
                  onClick={startGame}
                  className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 sm:px-12 py-3 sm:py-4 rounded-full font-bold text-lg sm:text-xl shadow-lg mb-6 w-full"
                  variants={buttonVariants}
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
                  variants={itemVariants}
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
                      Eat red food to grow
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

      {/* Header */}
      {!showStartScreen && (
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
                variants={scoreVariants}
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
                onClick={togglePause}
                className="bg-white bg-opacity-20 text-white px-4 py-1 rounded-full text-xs font-semibold hover:bg-opacity-30 transition-all"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {isPaused ? "Resume (ESC)" : "Pause (ESC)"}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Game Board */}
      <motion.div
        className={`bg-gray-900 border-2 sm:border-4 border-gray-700 rounded-lg sm:rounded-xl shadow-2xl transition-all duration-300 ${
          showStartScreen ? "opacity-30 scale-95" : "opacity-100 scale-100"
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
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
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="text-center"
                  variants={countdownVariants}
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
                variants={overlayVariants}
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
                      onClick={continueGame}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg w-full"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Continue Game
                    </motion.button>
                    <motion.button
                      onClick={resetToStartScreen}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg w-full"
                      variants={buttonVariants}
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

          {/* Game Over Overlay */}
          <AnimatePresence>
            {gameOver && (
              <motion.div
                className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center rounded-lg sm:rounded-xl backdrop-blur-sm"
                onClick={handleOverlayClick}
                variants={overlayVariants}
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
                      <span className="text-green-300 font-bold">
                        {bestScore}
                      </span>
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
                      onClick={startGame}
                      className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg w-full"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Play Again
                    </motion.button>
                    <motion.button
                      onClick={resetToStartScreen}
                      className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg w-full"
                      variants={buttonVariants}
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
        </div>
      </motion.div>

      {/* Mobile Controls */}
      {!showStartScreen &&
        isMobile &&
        !gameOver &&
        !isPaused &&
        countdown === 0 && (
          <motion.div
            className="grid grid-cols-3 gap-1 sm:gap-3 mt-2 sm:mt-6 w-40 sm:w-48"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div></div>
            <motion.button
              onClick={() => handleSwipe("UP")}
              className="bg-white bg-opacity-30 backdrop-blur-sm rounded-lg p-2 sm:p-4 flex items-center justify-center hover:bg-white hover:bg-opacity-40 transition-all"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <span className="text-xl sm:text-2xl">↑</span>
            </motion.button>
            <div></div>

            <motion.button
              onClick={() => handleSwipe("LEFT")}
              className="bg-white bg-opacity-30 backdrop-blur-sm rounded-lg p-2 sm:p-4 flex items-center justify-center hover:bg-white hover:bg-opacity-40 transition-all"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <span className="text-l sm:text-2xl">←</span>
            </motion.button>
            <div className="bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <span className="text-xs text-white text-center">SWIPE</span>
            </div>
            <motion.button
              onClick={() => handleSwipe("RIGHT")}
              className="bg-white bg-opacity-30 backdrop-blur-sm rounded-lg p-2 sm:p-4 flex items-center justify-center hover:bg-white hover:bg-opacity-40 transition-all"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <span className="text-xl sm:text-2xl">→</span>
            </motion.button>

            <div></div>
            <motion.button
              onClick={() => handleSwipe("DOWN")}
              className="bg-white bg-opacity-30 backdrop-blur-sm rounded-lg p-2 sm:p-4 flex items-center justify-center hover:bg-white hover:bg-opacity-40 transition-all"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <span className="text-xl sm:text-2xl">↓</span>
            </motion.button>
            <div></div>
          </motion.div>
        )}

      {/* Instructions */}
      {!showStartScreen && !gameOver && !isPaused && countdown === 0 && (
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
