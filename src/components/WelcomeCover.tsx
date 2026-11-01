import { useEffect, useState } from 'react';
import { BirthdayProfile } from '../types/birthday';
import { Gift, Sparkles, Heart, Settings, Play, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface WelcomeCoverProps {
  profile: BirthdayProfile;
  onOpenSurprise: () => void;
  onEditDetails: () => void;
  autoStartSeconds?: number;
}

export default function WelcomeCover({
  profile,
  onOpenSurprise,
  onEditDetails,
  autoStartSeconds = 5,
}: WelcomeCoverProps) {
  const [countdown, setCountdown] = useState(autoStartSeconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    if (countdown <= 0) {
      onOpenSurprise();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isPaused, onOpenSurprise]);

  const handleStartNow = () => {
    soundEngine.playGiftOpen();
    onOpenSurprise();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 text-center">
      {/* Ambient background glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-rose-500/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      <div className="relative max-w-xl w-full glass-panel rounded-3xl p-8 sm:p-12 border border-white/15 shadow-2xl backdrop-blur-xl space-y-8">
        {/* Top Kicker */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
          <span>A Special Digital Birthday Gift</span>
          <span aria-hidden="true">·</span>
          <span>From {profile.createdBy}</span>
        </div>

        {/* 3D Animated Luxury Gift Box */}
        <div className="relative mx-auto w-36 h-36 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-500/25 blur-xl animate-pulse" />
          <div
            onClick={handleStartNow}
            className="cursor-pointer group relative transform hover:scale-110 active:scale-95 transition-all duration-300"
            title="Click to Open Surprise!"
          >
            <img
              src="/src/assets/images/birthday_gift_luxury_1793541562888.jpg"
              alt="Birthday Gift"
              className="w-32 h-32 object-cover rounded-3xl shadow-2xl border-2 border-white/30 group-hover:border-amber-300/80 transition-all animate-bounce"
              style={{ animationDuration: '2.5s' }}
            />
            <div className="absolute -bottom-2 inset-x-0 mx-auto w-max px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] shadow-lg">
              TAP TO OPEN
            </div>
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            Someone Special Deserves a Special Surprise!
          </h1>
          <p className="text-sm sm:text-base text-rose-200/90 font-serif leading-relaxed">
            A personalized 18th birthday experience created with love for{' '}
            <strong className="text-white underline decoration-rose-400 underline-offset-4">
              {profile.name}
            </strong>{' '}
            by <strong className="text-amber-300">{profile.createdBy}</strong>.
          </p>
        </div>

        {/* Auto Advance Countdown Indicator */}
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium">
              <Play className="w-3.5 h-3.5 text-rose-400" />
              {isPaused ? 'Auto-start paused' : `Auto-starting surprise in ${countdown}s...`}
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-[11px] text-rose-400 hover:text-white underline"
            >
              {isPaused ? 'Resume timer' : 'Pause timer'}
            </button>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-1000"
              style={{
                width: isPaused ? '100%' : `${((autoStartSeconds - countdown) / autoStartSeconds) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleStartNow}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-sm shadow-xl shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Gift className="w-4 h-4" />
            <span>Open Birthday Surprise ✨</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onEditDetails}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-2"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Customize Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
