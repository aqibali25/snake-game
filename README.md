# 🐍 Snake Game

A modern, responsive Snake game built with React featuring smooth animations, realistic graphics, and mobile-friendly controls. Experience the classic Snake game with enhanced visuals and professional gameplay mechanics.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC)
![Framer Motion](https://img.shields.io/badge/Animations-Framer_Motion-FF69B4)

---

## 🎮 Features

### 🎯 Core Gameplay

- **Classic Snake Mechanics** with modern enhancements
- **Realistic Snake** with gradient body and animated head with eyes
- **Apple Food** with stem, leaf, and pulsing animations
- **Progressive Difficulty** - speed increases every 5 points
- **Collision Detection** for walls and self-collision

### 🎨 Visual Enhancements

- **Smooth Animations** using Framer Motion
- **Countdown Sequence** (3-2-1) for professional start
- **Responsive Design** that works on all devices
- **Mobile-Optimized** touch controls with swipe gestures
- **Beautiful Gradients** and modern UI with Tailwind CSS

### ⚡ Advanced Features

- **Pause/Resume** functionality with ESC key or spacebar
- **Local Storage** for persistent best scores
- **Keyboard & Touch** controls support
- **Start Screen** with game instructions
- **Game Over** screen with score comparison

---

## 🚀 Live Demo

[Demo](https://aqibali25.github.io/snake-game/)

---

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/snake-game.git
cd snake-game
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**
   http://localhost:5173/

## 🎯 How to Play

### Controls

- **Desktop**: Use arrow keys (`↑ ↓ ← →`) to control the snake
- **Mobile**: Swipe in any direction to control the snake
- **Pause**: Press `ESC` or `Spacebar` to pause/resume
- **Menu**: Press `ESC` from start screen to exit

### Game Rules

1. 🚫 Don't hit the walls or yourself
2. 🍎 Eat apples to grow longer and score points
3. ⚡ Game speeds up every 5 points
4. ⏸️ Pause anytime with `ESC` or `Spacebar`
5. 🏆 Compete for the highest score!

---

## 🛠️ Tech Stack

- **Frontend**: React 18.2.0
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, AOS (Animate On Scroll)
- **Icons**: Custom SVG and emoji fallbacks
- **Storage**: Browser Local Storage

## 📁 Project Structure

```text
src/
├── components/
│   ├── SnakeGame.jsx
│   ├── StartScreen.jsx
│   ├── GameOverScreen.jsx
│   ├── GameBoard.jsx
│   ├── GameHeader.jsx
│   └── MobileControls.jsx
├── hooks/
│   ├── useGameLogic.js
│   ├── useResponsive.js
│   └── useLocalStorage.js
└── utils/
    └── constants.js
```

## 📱 Responsive Design

The game automatically adapts to different screen sizes:

- **Mobile**: Compact layout with touch controls
- **Tablet**: Optimized spacing and sizing
- **Desktop**: Full-featured with keyboard controls

---

## 🔧 Browser Support

- Chrome ✅ (Recommended)
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile Browsers ✅

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## 🙏 Acknowledgments

- Inspired by the classic Nokia Snake game
- Built with modern web technologies
- Thanks to the React and Tailwind CSS communities
