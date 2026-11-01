import { useState } from 'react';
import { BirthdayProfile } from '../types/birthday';
import { Gift, Heart, Sparkles, Image, Award, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface DigitalGiftBoxesProps {
  profile: BirthdayProfile;
}

export default function DigitalGiftBoxes({ profile }: DigitalGiftBoxesProps) {
  const [openedBox, setOpenedBox] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [claimedVoucher, setClaimedVoucher] = useState(false);

  // Curated gallery combining user uploaded photo + our generated high-fidelity celebrations
  const memoryPhotos = [
    {
      url: profile.photoUrl || '/src/assets/images/birthday_memory_celebration_1793541562780.jpg',
      caption: `18th Birthday Celebration with ${profile.name}`,
      tag: 'Cherished Moment',
    },
    {
      url: '/src/assets/images/birthday_floral_bouquet_1793541563140.jpg',
      caption: `A bouquet of ${profile.favoriteFlower || 'Roses'} just for you`,
      tag: 'Pure Beauty',
    },
    {
      url: '/src/assets/images/birthday_gift_luxury_1793541562888.jpg',
      caption: `All the love in the universe wrapped in one gift`,
      tag: 'Warmth & Joy',
    },
  ];

  const birthdayQuotes = [
    '"Count your life by smiles, not tears. Count your age by friends, not years."',
    '"You don’t get older, you get better. May your 18th year be your masterpiece."',
    '"The secret of staying young is to live honestly, eat slowly, and lie about your age!"',
    '"May the next 365 days be your most brilliant, joyous and magical chapter yet."',
    '"To a fabulous 18-year-old: may your heart remain as young, bright, and loving as today."',
  ];

  const handleOpenGift = (giftNumber: number) => {
    soundEngine.playGiftOpen();
    setOpenedBox(giftNumber);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#fbbf24', '#c084fc', '#38bdf8'],
    });
  };

  const handleClaimVoucher = () => {
    soundEngine.playFanfare();
    setClaimedVoucher(true);
    confetti({
      particleCount: 70,
      spread: 75,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
          <Gift className="w-3.5 h-3.5 text-rose-400" />
          <span>Interactive Surprise Boxes</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Three Digital Birthday Gifts for You
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Tap each mystery box below to unwrap its secret contents!
        </p>
      </div>

      {/* 3 Gift Boxes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gift 1: A Special Message */}
        <div
          onClick={() => handleOpenGift(1)}
          className={`cursor-pointer group relative rounded-3xl p-6 transition-all duration-300 border ${
            openedBox === 1
              ? 'glass-panel border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.3)]'
              : 'glass-panel border-white/10 hover:border-rose-400/40 hover:scale-[1.02] shadow-xl'
          }`}
        >
          {/* Box Ribbon Accent */}
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mb-4 text-rose-300 group-hover:scale-110 transition-transform">
            <Heart className="w-6 h-6 fill-rose-500/40 text-rose-400" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-rose-300 tracking-wider uppercase">
              Gift #1
            </span>
            <h4 className="text-lg font-serif font-bold text-white">
              A Special Message
            </h4>
            <p className="text-xs text-slate-300">
              An intimate, heartfelt surprise confession from {profile.createdBy}.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-rose-400">
            <span>{openedBox === 1 ? 'Opened ✨' : 'Tap to Unwrap'}</span>
            <span className="text-lg transition-transform group-hover:translate-x-1">&rarr;</span>
          </div>
        </div>

        {/* Gift 2: Beautiful Memories */}
        <div
          onClick={() => handleOpenGift(2)}
          className={`cursor-pointer group relative rounded-3xl p-6 transition-all duration-300 border ${
            openedBox === 2
              ? 'glass-panel border-purple-500/50 shadow-[0_0_25px_rgba(168,85,247,0.3)]'
              : 'glass-panel border-white/10 hover:border-purple-400/40 hover:scale-[1.02] shadow-xl'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center mb-4 text-purple-300 group-hover:scale-110 transition-transform">
            <Image className="w-6 h-6 text-purple-400" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-purple-300 tracking-wider uppercase">
              Gift #2
            </span>
            <h4 className="text-lg font-serif font-bold text-white">
              Beautiful Memories
            </h4>
            <p className="text-xs text-slate-300">
              An interactive animated memory polaroid gallery celebrating your journey.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-purple-400">
            <span>{openedBox === 2 ? 'Opened ✨' : 'Tap to Unwrap'}</span>
            <span className="text-lg transition-transform group-hover:translate-x-1">&rarr;</span>
          </div>
        </div>

        {/* Gift 3: A Little Surprise */}
        <div
          onClick={() => handleOpenGift(3)}
          className={`cursor-pointer group relative rounded-3xl p-6 transition-all duration-300 border ${
            openedBox === 3
              ? 'glass-panel border-amber-500/50 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
              : 'glass-panel border-white/10 hover:border-amber-400/40 hover:scale-[1.02] shadow-xl'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-300 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-amber-400" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-amber-300 tracking-wider uppercase">
              Gift #3
            </span>
            <h4 className="text-lg font-serif font-bold text-white">
              A Little Surprise
            </h4>
            <p className="text-xs text-slate-300">
              Golden friendship voucher & wisdom quote unlocked just for today.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs font-semibold text-amber-400">
            <span>{openedBox === 3 ? 'Opened ✨' : 'Tap to Unwrap'}</span>
            <span className="text-lg transition-transform group-hover:translate-x-1">&rarr;</span>
          </div>
        </div>
      </div>

      {/* Revealed Content Drawer / Display */}
      {openedBox && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl animate-fade-in relative">
          <button
            onClick={() => setOpenedBox(null)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs px-2.5 py-1 rounded-full bg-white/10"
          >
            Close Gift
          </button>

          {/* Reveal 1: Special Message */}
          {openedBox === 1 && (
            <div className="space-y-4 max-w-xl mx-auto text-center py-4">
              <div className="inline-flex p-3 rounded-full bg-rose-500/20 text-rose-300">
                <Heart className="w-8 h-8 fill-rose-500 text-rose-500 animate-pulse" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-white">
                "To Dijaaa, My Favorite Human"
              </h4>
              <p className="text-base text-rose-100/90 leading-relaxed font-serif italic">
                "If I could wrap up all the laughs we've shared, every late-night conversation,
                and every moment your kindness lifted my spirits, it still wouldn't compare to how much
                you deserve the happiest 18th birthday on earth. You are truly irreplaceable."
              </p>
              <div className="pt-2 text-xs text-rose-300 font-semibold tracking-wider uppercase">
                Forever Grateful • Written by {profile.createdBy}
              </div>
            </div>
          )}

          {/* Reveal 2: Beautiful Memories Gallery */}
          {openedBox === 2 && (
            <div className="space-y-4 max-w-xl mx-auto text-center py-2">
              <h4 className="text-xl font-serif font-bold text-white mb-2">
                Memories & Moments of Dijaaa
              </h4>

              {/* Polaroid Frame */}
              <div className="relative mx-auto max-w-sm bg-stone-100 p-4 pb-8 rounded-2xl shadow-2xl text-stone-900 transform rotate-[-1deg] transition-all">
                {/* Photo */}
                <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-stone-200">
                  <img
                    src={memoryPhotos[activePhotoIndex].url}
                    alt="Memory"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-opacity duration-300"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                    {memoryPhotos[activePhotoIndex].tag}
                  </div>
                </div>

                {/* Polaroid Caption */}
                <p className="mt-3 font-cursive text-xl sm:text-2xl text-stone-800 text-center">
                  {memoryPhotos[activePhotoIndex].caption}
                </p>

                {/* Slideshow Controls */}
                <div className="flex items-center justify-between mt-3 px-2 pt-2 border-t border-stone-200 text-xs text-stone-600 font-sans">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) => (prev > 0 ? prev - 1 : memoryPhotos.length - 1));
                    }}
                    className="p-1 hover:text-stone-900 flex items-center gap-1 font-medium"
                  >
                    <ChevronLeft className="w-4 h-4" /> Prev
                  </button>
                  <span className="tabular-nums font-mono">
                    {activePhotoIndex + 1} / {memoryPhotos.length}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIndex((prev) => (prev < memoryPhotos.length - 1 ? prev + 1 : 0));
                    }}
                    className="p-1 hover:text-stone-900 flex items-center gap-1 font-medium"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reveal 3: Little Surprise & Golden Voucher */}
          {openedBox === 3 && (
            <div className="space-y-6 max-w-xl mx-auto text-center py-2">
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  Today's Golden Quote
                </span>
                <p className="text-base sm:text-lg font-serif italic text-white/90">
                  {birthdayQuotes[0]}
                </p>
              </div>

              {/* Digital Golden Voucher */}
              <div className="relative rounded-2xl p-6 bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border-2 border-dashed border-amber-400/60 shadow-xl space-y-3">
                <div className="flex items-center justify-center gap-2 text-amber-300">
                  <Award className="w-6 h-6" />
                  <span className="font-serif font-bold text-lg sm:text-xl text-white">
                    Official 18th Birthday Golden Voucher
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-amber-100 space-y-1">
                  <p>✨ <strong>Entitles Dijaaa to:</strong> 1x Unlimited Late-Night Call & Any Birthday Treat on demand!</p>
                  <p className="text-[11px] text-amber-300/80">Issued by {profile.createdBy} • Non-expiring • Redeemable anytime</p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleClaimVoucher}
                    disabled={claimedVoucher}
                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                      claimedVoucher
                        ? 'bg-emerald-500 text-white cursor-default'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {claimedVoucher ? (
                      <span className="flex items-center gap-1.5 justify-center">
                        <CheckCircle2 className="w-4 h-4" /> Voucher Claimed Successfully!
                      </span>
                    ) : (
                      'Claim Your Friendship Voucher 🎁'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
