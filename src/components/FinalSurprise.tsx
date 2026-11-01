import { useRef, useEffect, useState } from 'react';
import { BirthdayProfile } from '../types/birthday';
import { Heart, Sparkles, Share2, Download, RotateCcw, Edit3, Check } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface FinalSurpriseProps {
  profile: BirthdayProfile;
  onCelebrateAgain: () => void;
  onEditProfile: () => void;
}

export default function FinalSurprise({ profile, onCelebrateAgain, onEditProfile }: FinalSurpriseProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);

  // Fireworks canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 450;
    };
    window.addEventListener('resize', handleResize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
    }

    interface Firework {
      x: number;
      y: number;
      targetY: number;
      vy: number;
      color: string;
      exploded: boolean;
      particles: Particle[];
    }

    const fireworks: Firework[] = [];
    const colors = ['#f43f5e', '#fb7185', '#fbbf24', '#c084fc', '#38bdf8', '#34d399', '#ffffff'];

    const spawnFirework = (targetX?: number, targetY?: number) => {
      const x = targetX !== undefined ? targetX : Math.random() * (width - 100) + 50;
      const tY = targetY !== undefined ? targetY : Math.random() * (height * 0.45) + 50;
      const color = colors[Math.floor(Math.random() * colors.length)];

      fireworks.push({
        x,
        y: height,
        targetY: tY,
        vy: -7 - Math.random() * 4,
        color,
        exploded: false,
        particles: [],
      });
    };

    let tick = 0;
    const loop = () => {
      tick++;
      // Trail fade effect
      ctx.fillStyle = 'rgba(10, 10, 20, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Periodically spawn new fireworks
      if (tick % 45 === 0 && fireworks.length < 5) {
        spawnFirework();
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];

        if (!fw.exploded) {
          fw.y += fw.vy;
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.fill();

          if (fw.y <= fw.targetY) {
            fw.exploded = true;
            // Generate burst particles
            const count = 35 + Math.floor(Math.random() * 20);
            for (let p = 0; p < count; p++) {
              const angle = (p / count) * Math.PI * 2 + (Math.random() * 0.2);
              const speed = 1.5 + Math.random() * 4.5;
              fw.particles.push({
                x: fw.x,
                y: fw.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                alpha: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 2 + Math.random() * 2,
              });
            }
          }
        } else {
          // Update particles
          for (let p = fw.particles.length - 1; p >= 0; p--) {
            const pt = fw.particles[p];
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.vy += 0.05; // gravity
            pt.vx *= 0.98; // drag
            pt.alpha -= 0.015;

            ctx.save();
            ctx.globalAlpha = Math.max(0, pt.alpha);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
            ctx.fillStyle = pt.color;
            ctx.fill();
            ctx.restore();

            if (pt.alpha <= 0) {
              fw.particles.splice(p, 1);
            }
          }

          if (fw.particles.length === 0) {
            fireworks.splice(i, 1);
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLaunchFireworkClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    soundEngine.playPop();

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x: (rect.left + x) / window.innerWidth, y: (rect.top + y) / window.innerHeight },
    });
  };

  const handleShare = async () => {
    soundEngine.playSparkleChime();
    const shareData = {
      title: `Happy 18th Birthday Dijaaa!`,
      text: `Someone special crafted a personalized 18th birthday surprise experience for Dijaaa with love!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or fallback
      }
    }

    // Fallback: Copy link
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleDownloadCard = () => {
    setIsGeneratingCard(true);
    soundEngine.playFanfare();

    // Render a high-res souvenir card onto an offscreen canvas
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 1200;
    cardCanvas.height = 800;
    const ctx = cardCanvas.getContext('2d');

    if (!ctx) {
      setIsGeneratingCard(false);
      return;
    }

    // Background luxury gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 800);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(0.5, '#2e1065');
    bgGrad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 800);

    // Decorative inner gold border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 1140, 740);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(45, 45, 1110, 710);

    // Sparkles
    ctx.fillStyle = '#fbbf24';
    ctx.font = '24px serif';
    ctx.fillText('✨', 80, 100);
    ctx.fillText('✨', 1100, 100);
    ctx.fillText('✨', 100, 700);
    ctx.fillText('✨', 1080, 700);

    // Header Kicker
    ctx.fillStyle = '#f43f5e';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OFFICIAL DIGITAL BIRTHDAY KEEPSAKE', 600, 140);

    // Main Greeting
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px "Playfair Display", Georgia, serif';
    ctx.fillText(`HAPPY 18TH BIRTHDAY!`, 600, 230);

    // Name in Gold
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 72px "Playfair Display", Georgia, serif';
    ctx.fillText(profile.name.toUpperCase(), 600, 320);

    // Subtitle Message
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'italic 26px "Playfair Display", Georgia, serif';
    ctx.fillText(
      `"May your 18th year be filled with boundless joy, love, laughter, and wild success."`,
      600,
      400
    );

    // Custom personal line
    ctx.fillStyle = '#fda4af';
    ctx.font = '24px sans-serif';
    ctx.fillText(`A digital surprise crafted with endless love by ${profile.createdBy}`, 600, 480);

    // Milestones ribbon
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.roundRect(150, 540, 900, 100, 20);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.fillText(`Born: 2 November • Scorpio ♏ • Best Friend Forever`, 600, 600);

    // Signature
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'italic 32px "Great Vibes", cursive, serif';
    ctx.fillText(`With love always, ${profile.createdBy} ❤️`, 600, 700);

    // Download PNG
    const link = document.createElement('a');
    link.download = `${profile.name}_18th_Birthday_Card.png`;
    link.href = cardCanvas.toDataURL('image/png');
    link.click();
    setIsGeneratingCard(false);
  };

  return (
    <div className="relative py-12 px-4 max-w-4xl mx-auto space-y-10 text-center">
      {/* Interactive Fireworks Canvas Card */}
      <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-slate-950/90 shadow-2xl backdrop-blur-xl">
        <canvas
          ref={canvasRef}
          onClick={handleLaunchFireworkClick}
          className="w-full h-80 sm:h-96 cursor-pointer block"
          title="Click anywhere to launch fireworks!"
        />

        {/* Floating Centered Message Overlay */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6 space-y-4">
          <div className="p-3 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
            <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
          </div>

          <span className="text-xs font-semibold tracking-widest uppercase text-amber-300">
            One Last Thing...
          </span>

          <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-md">
            You Are Truly Special, {profile.name}!
          </h3>

          <p className="text-sm sm:text-base text-rose-100 max-w-md mx-auto leading-relaxed drop-shadow">
            "Thank you for being the sweetest friend and bringing so much magic into the world.
            Always keep shining bright!"
          </p>

          <span className="text-xs text-slate-400">
            (Tap the night sky above to launch fireworks!)
          </span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {/* Celebrate Again */}
        <button
          onClick={onCelebrateAgain}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-sm shadow-xl shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Celebrate Again! 🎊</span>
        </button>

        {/* Download Card */}
        <button
          onClick={handleDownloadCard}
          disabled={isGeneratingCard}
          className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>{isGeneratingCard ? 'Generating Card...' : 'Download Keepsake Card 💌'}</span>
        </button>

        {/* Share Surprise */}
        <button
          onClick={handleShare}
          className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          {copiedShare ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-blue-300" />
              <span>Share Surprise</span>
            </>
          )}
        </button>

        {/* Edit / Customize Profile */}
        <button
          onClick={onEditProfile}
          className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold text-sm transition-all flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>Customize Another Surprise</span>
        </button>
      </div>

      {/* Quiet Footer */}
      <footer className="pt-8 border-t border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span>Crafted with love for </span>
          <strong className="text-white">{profile.name}</strong>
          <span> by </span>
          <strong className="text-rose-400">{profile.createdBy}</strong>
        </div>
        <div className="flex items-center gap-2">
          <span>Digital Birthday Experience</span>
          <span aria-hidden="true">·</span>
          <span>18th Milestone Edition</span>
        </div>
      </footer>
    </div>
  );
}
