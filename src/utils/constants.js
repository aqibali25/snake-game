export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;

export const DIRECTIONS = {
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
};

export const OPPOSITE_DIRECTIONS = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

export const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  },
  button: {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  },
  overlay: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
  score: {
    pulse: {
      scale: [1, 1.1, 1],
      transition: { duration: 0.3, repeat: 1 },
    },
  },
  logo: {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 100, duration: 0.8 },
    },
  },
  countdown: {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: [1.5, 1, 1.2, 1],
      opacity: 1,
      transition: { scale: { duration: 1, times: [0, 0.3, 0.8, 1] } },
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } },
  },
};
