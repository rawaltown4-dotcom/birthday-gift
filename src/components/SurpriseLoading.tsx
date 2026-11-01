import { useState, useEffect } from 'react';
import { BirthdayProfile } from '../types/birthday';
import { Sparkles, Heart, Gift, Star } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface SurpriseLoadingProps {
  profile: BirthdayProfile;
  onComplete: () => void;
}

export default function SurpriseLoading({ profile, onComplete }: SurpriseLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState('Gathering cherished memories...');

  useEffect(() => {
    soundEngine.playSparkleChime();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 1;
        if (next === 25) setStageText(`Lighting ${profile.age} golden candles...`);
        if (next === 55) setStageText(`Composing melodic birthday wishes for ${profile.name}...`);
        if (next === 85) setStageText(`Polishing gift boxes from ${profile.createdBy}...`);
        if (next === 98) setStageText('Sprinkling stardust & final celebration magic! ✨');
        return next;
      });
    }, 35); // takes ~3.5 seconds to reach 100

    return () => clearInterval(interval);
  }, [profile]);

  useEffect(() => {
    if (progress === 100) {
      soundEngine.playGiftOpen();
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 px-4 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-rose-500/15 blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-amber-500/15 blur-3xl animate-pulse-glow pointer-events-none" />

      {/* Floating decorative mini stars and hearts */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute top-1/4 left-1/5 w-6 h-6 text-rose-400/40 animate-float-slow" />
        <Star className="absolute top-1/3 right-1/4 w-5 h-5 text-amber-300/40 animate-float-reverse" />
        <Sparkles className="absolute bottom-1/3 left-1/3 w-6 h-6 text-pink-400/40 animate-float-slow" />
        <Heart className="absolute bottom-1/4 right-1/5 w-7 h-7 text-purple-400/40 animate-float-reverse" />
      </div>

      <div className="relative text-center max-w-md w-full space-y-8 z-10">
        {/* Animated 3D Gift Box Asset & Glow */}
        <div className="relative mx-auto w-40 h-40 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/30 to-amber-500/30 blur-2xl animate-pulse" />

          {/* Luxury Gift Visual */}
          <div className="relative transform hover:scale-105 transition-transform duration-500">
            <img
              src="/src/assets/images/birthday_gift_luxury_1793541562888.jpg"
              alt="Birthday surprise box"
              className="w-36 h-36 object-cover rounded-3xl shadow-2xl border-2 border-white/20 animate-bounce"
              style={{ animationDuration: '2s' }}
            />
            <div className="absolute -top-3 -right-3 p-2 rounded-full bg-amber-400 text-slate-950 shadow-lg animate-spin" style={{ animationDuration: '6s' }}>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Preparing Something Special for {profile.name}...
          </h2>
          <p className="text-sm text-rose-300 font-medium min-h-[1.5rem] transition-all">
            {stageText}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/15">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-pink-400 to-amber-400 rounded-full transition-all duration-100 shadow-[0_0_12px_rgba(244,63,94,0.7)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-mono tabular-nums">
            <span>Creating Experience</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Instant Skip Button */}
        <div>
          <button
            type="button"
            onClick={onComplete}
            className="text-xs text-slate-400 hover:text-white underline transition-colors"
          >
            Unwrap immediately &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
