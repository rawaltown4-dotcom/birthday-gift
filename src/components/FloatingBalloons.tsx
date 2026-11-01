import { useState, useEffect } from 'react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface BalloonItem {
  id: number;
  x: number; // percentage 0-100
  speed: number;
  color: string;
  size: number;
  delay: number;
  sway: number;
}

interface FloatingBalloonsProps {
  colors?: string[];
  interactive?: boolean;
}

export default function FloatingBalloons({
  colors = ['#fb7185', '#f43f5e', '#fecdd3', '#fda4af', '#fcd34d', '#c084fc', '#38bdf8'],
  interactive = true,
}: FloatingBalloonsProps) {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);

  useEffect(() => {
    // Generate an array of 12 balloons with varied horizontal positions and animations
    const initialBalloons: BalloonItem[] = Array.from({ length: 12 }, (_, i) => ({
      id: Date.now() + i,
      x: 5 + (i * 8.5) % 90 + (Math.random() * 4 - 2),
      speed: 16 + Math.random() * 10, // duration in seconds
      color: colors[i % colors.length],
      size: 44 + Math.random() * 26,
      delay: -(Math.random() * 20), // staggered start
      sway: 15 + Math.random() * 25,
    }));
    setBalloons(initialBalloons);
  }, [colors]);

  const popBalloon = (e: React.MouseEvent, id: number, color: string) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    soundEngine.playPop();

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { x, y },
      colors: [color, '#ffffff', '#fcd34d'],
      ticks: 150,
      gravity: 1.2,
    });

    // Remove popped balloon and respawn after 3 seconds
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    setTimeout(() => {
      setBalloons((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: 5 + Math.random() * 90,
          speed: 16 + Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 44 + Math.random() * 26,
          delay: 0,
          sway: 15 + Math.random() * 25,
        },
      ]);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {balloons.map((b) => (
        <div
          key={b.id}
          className="absolute bottom-[-120px] pointer-events-auto cursor-pointer transition-transform hover:scale-110 active:scale-90"
          style={{
            left: `${b.x}%`,
            animation: `floatUp ${b.speed}s linear infinite`,
            animationDelay: `${b.delay}s`,
          }}
          onClick={(e) => popBalloon(e, b.id, b.color)}
          title="Click to pop!"
        >
          {/* Balloon shape */}
          <div
            className="relative rounded-full shadow-lg transition-all duration-300 group"
            style={{
              width: `${b.size}px`,
              height: `${b.size * 1.22}px`,
              background: `radial-gradient(circle at 35% 30%, #ffffff88 0%, ${b.color} 45%, #00000033 100%)`,
              boxShadow: `0 8px 24px ${b.color}44`,
            }}
          >
            {/* Balloon highlight */}
            <div className="absolute top-2 left-2.5 w-2 h-3.5 bg-white/60 rounded-full rotate-[-25deg] blur-[0.5px]" />
            {/* Balloon knot */}
            <div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2 rounded-sm"
              style={{ backgroundColor: b.color }}
            />
            {/* Balloon string */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-[1px] h-20 bg-white/20 origin-top animate-pulse" />
          </div>
        </div>
      ))}

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-55vh) translateX(25px);
          }
          100% {
            transform: translateY(-130vh) translateX(-20px);
          }
        }
      `}</style>
    </div>
  );
}
