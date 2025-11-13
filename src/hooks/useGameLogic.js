import { useState, useEffect, useCallback } from "react";
import {
  GRID_SIZE,
  INITIAL_SPEED,
  DIRECTIONS,
  OPPOSITE_DIRECTIONS,
} from "../utils/constants";

export const useGameLogic = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(DIRECTIONS.RIGHT);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [countdown, setCountdown] = useState(0);
  const [isFirstStart, setIsFirstStart] = useState(true);

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
    setDirection(DIRECTIONS.RIGHT);
    setGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    generateFood();

    if (isFirstStart) {
      startCountdown();
      setIsFirstStart(false);
    }
  };

  // Reset game
  const resetGame = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setGameOver(false);
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
        case DIRECTIONS.UP:
          head.y -= 1;
          break;
        case DIRECTIONS.DOWN:
          head.y += 1;
          break;
        case DIRECTIONS.LEFT:
          head.x -= 1;
          break;
        case DIRECTIONS.RIGHT:
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
      if (countdown > 0) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== OPPOSITE_DIRECTIONS.UP && isPlaying && !isPaused)
            setDirection(DIRECTIONS.UP);
          break;
        case "ArrowDown":
          if (direction !== OPPOSITE_DIRECTIONS.DOWN && isPlaying && !isPaused)
            setDirection(DIRECTIONS.DOWN);
          break;
        case "ArrowLeft":
          if (direction !== OPPOSITE_DIRECTIONS.LEFT && isPlaying && !isPaused)
            setDirection(DIRECTIONS.LEFT);
          break;
        case "ArrowRight":
          if (direction !== OPPOSITE_DIRECTIONS.RIGHT && isPlaying && !isPaused)
            setDirection(DIRECTIONS.RIGHT);
          break;
        case "Escape":
          if (isPlaying && !gameOver) {
            togglePause();
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
  }, [direction, isPlaying, isPaused, gameOver, countdown]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver || isPaused || countdown > 0) return;

    const gameInterval = setInterval(moveSnake, speed);
    return () => clearInterval(gameInterval);
  }, [moveSnake, isPlaying, gameOver, speed, isPaused, countdown]);

  // Touch controls for mobile
  const handleSwipe = (newDirection) => {
    if (!isPlaying || isPaused || countdown > 0) return;

    if (direction !== OPPOSITE_DIRECTIONS[newDirection]) {
      setDirection(newDirection);
    }
  };

  return {
    snake,
    food,
    direction,
    gameOver,
    score,
    setScore,
    isPlaying,
    setIsPlaying,
    isPaused,
    speed,
    countdown,
    startGame,
    resetGame,
    togglePause,
    continueGame,
    handleSwipe,
    generateFood,
  };
};
