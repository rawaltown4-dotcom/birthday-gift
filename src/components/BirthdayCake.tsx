import { useState } from 'react';
import { Sparkles, Flame, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface BirthdayCakeProps {
  name: string;
  age: number;
  accentColor?: string;
  onWishCompleted?: () => void;
}

export default function BirthdayCake({ name, age, accentColor = '#f43f5e', onWishCompleted }: BirthdayCakeProps) {
  // If age is reasonable (e.g. 18), show all 18 candles, otherwise cap at 18 with age badge
  const candleCount = Math.min(Math.max(1, age), 18);
  const [litCandles, setLitCandles] = useState<boolean[]>(() => Array(candleCount).fill(true));
  const [wishMade, setWishMade] = useState(false);
  const [blowingSmoke, setBlowingSmoke] = useState(false);

  const allBlownOut = litCandles.every((lit) => !lit);

  const blowOutCandle = (index: number) => {
    if (!litCandles[index]) return;
    soundEngine.playCandleBlow();
    setLitCandles((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });

    // Check if that was the last one
    const remaining = litCandles.filter((lit, idx) => idx !== index && lit);
    if (remaining.length === 0) {
      triggerWishCelebration();
    }
  };

  const handleMakeAWish = () => {
    if (allBlownOut && wishMade) return;

    soundEngine.playCandleBlow();
    setBlowingSmoke(true);
    setLitCandles(Array(candleCount).fill(false));

    setTimeout(() => {
      setBlowingSmoke(false);
      triggerWishCelebration();
    }, 600);
  };

  const triggerWishCelebration = () => {
    setWishMade(true);
    soundEngine.playSparkleChime();
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fbbf24', '#c084fc', '#ffffff', '#fb7185'],
    });
    if (onWishCompleted) {
      setTimeout(() => {
        onWishCompleted();
      }, 3500);
    }
  };

  const relightCandles = () => {
    soundEngine.playPop();
    setLitCandles(Array(candleCount).fill(true));
    setWishMade(false);
  };

  return (
    <div className="relative glass-panel rounded-3xl p-6 sm:p-8 md:p-10 border border-white/10 text-center max-w-2xl mx-auto shadow-2xl backdrop-blur-xl">
      {/* Title */}
      <div className="mb-6 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Interactive Cake & Candles</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Make an 18th Birthday Wish, {name}!
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Tap each flame to blow them out one by one, or click <strong className="text-amber-300">"Make a Wish"</strong> to blow them all out together!
        </p>
      </div>

      {/* Visual Realistic Birthday Cake Container */}
      <div className="relative py-8 flex flex-col items-center justify-center min-h-[300px]">
        {/* Wish Granted Banner overlay */}
        {wishMade && (
          <div className="absolute top-0 z-30 animate-bounce duration-1000 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 text-slate-950 font-bold text-sm sm:text-base shadow-2xl border border-white/40">
            ✨ May all your {age} wishes come true, {name}! ✨
          </div>
        )}

        {/* Candles Array Row */}
        <div className="relative z-20 flex items-end justify-center gap-1.5 sm:gap-2 mb-[-8px] px-4 max-w-md flex-wrap">
          {litCandles.map((isLit, i) => (
            <div
              key={i}
              onClick={() => blowOutCandle(i)}
              className="group flex flex-col items-center cursor-pointer select-none transition-transform hover:scale-110 active:scale-95"
              title={isLit ? 'Click to blow out this candle' : 'Candle blown out'}
            >
              {/* Flame or Smoke */}
              <div className="h-7 flex items-end justify-center relative">
                {isLit ? (
                  <div className="relative">
                    {/* Flame outer glow */}
                    <div className="absolute -inset-1 rounded-full bg-amber-400/60 blur-xs animate-pulse" />
                    {/* Candle Flame shape */}
                    <div className="w-3 h-5 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 animate-flame shadow-[0_0_12px_#f59e0b]" />
                    {/* Blue base */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 opacity-75" />
                  </div>
                ) : (
                  <div className="relative flex flex-col items-center">
                    {/* Wick */}
                    <div className="w-0.5 h-2 bg-slate-400" />
                    {/* Smoke puff */}
                    <div className="absolute -top-4 w-2 h-4 bg-white/40 rounded-full blur-[1px] animate-smoke" />
                  </div>
                )}
              </div>

              {/* Candle Body */}
              <div
                className="w-2.5 sm:w-3 h-10 sm:h-12 rounded-t-sm shadow-md border-t border-white/40 relative overflow-hidden"
                style={{
                  background:
                    i % 2 === 0
                      ? 'linear-gradient(to right, #f43f5e, #fb7185, #f43f5e)'
                      : 'linear-gradient(to right, #fbbf24, #fef08a, #f59e0b)',
                }}
              >
                {/* Spiral stripe effect */}
                <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,white_3px,white_5px)]" />
              </div>
            </div>
          ))}
        </div>

        {/* Multi-Layer Cake Geometry */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Top Tier (Smallest) */}
          <div className="relative w-48 sm:w-60 h-16 rounded-t-2xl bg-gradient-to-b from-rose-200 via-rose-100 to-rose-200 shadow-md border-t-2 border-white/60 flex items-center justify-center overflow-hidden">
            {/* Frosting Drips */}
            <div className="absolute top-0 inset-x-0 h-4 flex justify-around">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-5 h-4 bg-white rounded-b-full shadow-sm"
                  style={{ height: `${12 + (idx % 3) * 4}px` }}
                />
              ))}
            </div>

            {/* Cake Message Badge */}
            <span className="relative z-10 text-xs sm:text-sm font-serif font-bold text-rose-800 tracking-wider">
              DIJAAA • 18
            </span>
          </div>

          {/* Middle Tier */}
          <div className="relative w-64 sm:w-80 h-18 bg-gradient-to-b from-amber-100 via-rose-50 to-amber-100 shadow-lg border-t-2 border-rose-300/40 flex items-center justify-center">
            {/* Decorative Icing Pearls */}
            <div className="absolute -top-2 inset-x-2 flex justify-between">
              {Array.from({ length: 14 }).map((_, idx) => (
                <div key={idx} className="w-3 h-3 rounded-full bg-rose-400 shadow-sm" />
              ))}
            </div>
            {/* Middle decorative ribbon */}
            <div className="w-full h-3 bg-gradient-to-r from-rose-400 via-pink-300 to-rose-400 opacity-70" />
          </div>

          {/* Bottom Tier (Base) */}
          <div className="relative w-80 sm:w-96 h-20 rounded-b-2xl bg-gradient-to-b from-rose-200 via-amber-100 to-rose-300 shadow-xl border-t-2 border-amber-300/40 flex items-center justify-center overflow-hidden">
            {/* Bottom Swirls */}
            <div className="absolute -top-2 inset-x-2 flex justify-between">
              {Array.from({ length: 18 }).map((_, idx) => (
                <div key={idx} className="w-3.5 h-3.5 rounded-full bg-amber-300 shadow-sm" />
              ))}
            </div>
            {/* Texture */}
            <span className="text-rose-900/40 text-xs font-cursive text-2xl tracking-widest">
              Happy 18th Birthday
            </span>
          </div>

          {/* Cake Stand Plate */}
          <div className="w-92 sm:w-[420px] h-4 rounded-full bg-gradient-to-r from-slate-300 via-white to-slate-300 shadow-2xl border-t border-white" />
          <div className="w-48 h-3 rounded-b-lg bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 shadow-inner" />
        </div>
      </div>

      {/* Action Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleMakeAWish}
          disabled={allBlownOut && wishMade}
          className={`px-6 py-3 rounded-2xl font-semibold text-sm transition-all flex items-center gap-2 shadow-lg ${
            allBlownOut && wishMade
              ? 'bg-white/10 text-slate-400 cursor-not-allowed border border-white/10'
              : 'bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 text-white shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-95'
          }`}
        >
          <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
          <span>{allBlownOut ? 'Wishes Made!' : 'Make a Wish & Blow Candles 🎂'}</span>
        </button>

        {allBlownOut && (
          <button
            type="button"
            onClick={relightCandles}
            className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-sm transition-all flex items-center gap-2 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Light Candles Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
