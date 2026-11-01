import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Sparkles, RefreshCw } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AudioPlayerControlProps {
  onReset?: () => void;
  accentColor?: string;
}

export default function AudioPlayerControl({ onReset, accentColor = '#f43f5e' }: AudioPlayerControlProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Check initial state
    setIsPlaying(soundEngine.isMusicPlaying());
    setIsMuted(soundEngine.getMuted());
  }, []);

  const toggleMusic = () => {
    soundEngine.toggleBirthdayMelody();
    setIsPlaying(soundEngine.isMusicPlaying());
    if (!isPlaying) {
      soundEngine.playSparkleChime();
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    soundEngine.setMuted(nextMute);
    setIsMuted(nextMute);
    setIsPlaying(soundEngine.isMusicPlaying());
  };

  const burstConfetti = () => {
    soundEngine.playPop();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.2, x: 0.85 },
      colors: ['#f43f5e', '#fb7185', '#fbbf24', '#c084fc', '#38bdf8', '#34d399'],
    });
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 p-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/15 shadow-xl transition-all">
      {/* Play/Pause Birthday Song */}
      <button
        onClick={toggleMusic}
        title={isPlaying ? 'Pause Birthday Melody' : 'Play Birthday Melody'}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          isPlaying
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
            : 'text-slate-300 hover:text-white hover:bg-white/10'
        }`}
      >
        <Music className={`w-3.5 h-3.5 ${isPlaying ? 'animate-bounce text-rose-400' : ''}`} />
        <span className="hidden sm:inline">{isPlaying ? 'Playing Melody' : 'Birthday Music'}</span>
        {isPlaying && (
          <span className="flex items-end gap-0.5 h-3 w-3">
            <span className="w-0.5 bg-rose-400 animate-pulse h-full rounded-full" />
            <span className="w-0.5 bg-rose-400 animate-pulse h-2/3 rounded-full" />
            <span className="w-0.5 bg-rose-400 animate-pulse h-4/5 rounded-full" />
          </span>
        )}
      </button>

      {/* Mute SFX / Audio */}
      <button
        onClick={toggleMute}
        title={isMuted ? 'Unmute' : 'Mute Audio'}
        className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
      >
        {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
      </button>

      {/* Sparkle Confetti Blast */}
      <button
        onClick={burstConfetti}
        title="Pop Confetti!"
        className="p-1.5 rounded-full text-amber-300 hover:text-amber-200 hover:bg-white/10 transition-transform active:scale-90"
      >
        <Sparkles className="w-4 h-4" />
      </button>

      {/* Reset / Edit Surprise */}
      {onReset && (
        <button
          onClick={onReset}
          title="Customize Surprise / Edit Details"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Edit</span>
        </button>
      )}
    </div>
  );
}
