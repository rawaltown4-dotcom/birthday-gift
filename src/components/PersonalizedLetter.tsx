import { useState } from 'react';
import { BirthdayProfile } from '../types/birthday';
import { Mail, Heart, Sparkles, Copy, Check } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface PersonalizedLetterProps {
  profile: BirthdayProfile;
}

export default function PersonalizedLetter({ profile }: PersonalizedLetterProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const toggleLetter = () => {
    soundEngine.playGiftOpen();
    setIsOpen(!isOpen);
  };

  const copyLetterText = () => {
    soundEngine.playSparkleChime();
    const fullText = `Dearest ${profile.name},\n\n` +
      `Happy 18th Birthday! Today is such an unforgettable milestone. Watching you grow into such a graceful, radiant, and genuinely sweet person has been one of the greatest privileges of my life.\n\n` +
      `As my ${profile.relationship.toLowerCase()}, your ${profile.personality.toLowerCase()} spirit and contagious laughter bring light into even the darkest days. Whether you are immersed in ${profile.favoriteHobby.toLowerCase()} or simply sharing stories, your unique warmth touches everyone around you.\n\n` +
      `Now that you are officially 18, the world is at your feet. I pray that this year brings you breathtaking adventures, dreams come true, and the courage to follow your passions wherever they lead.\n\n` +
      `Never forget how deeply appreciated and loved you are. I will always be right here cheering for you in every chapter.\n\n` +
      `With all my love and heart,\n` +
      `${profile.createdBy} ❤️`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative max-w-3xl mx-auto my-8">
      {/* Outer Envelope Wrapper */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl transition-all">
        {/* Envelope Top Header / Wax Seal toggle */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-rose-950/80 via-slate-900/90 to-rose-950/80 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-rose-400" />
            <span className="text-xs uppercase tracking-wider font-semibold text-rose-300">
              Personalized Keepsake Letter
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyLetterText}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              title="Copy Letter"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={toggleLetter}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors"
            >
              {isOpen ? 'Fold Envelope' : 'Open Letter'}
            </button>
          </div>
        </div>

        {/* Parchment Letter Body */}
        {isOpen ? (
          <div className="relative p-8 sm:p-12 bg-gradient-to-b from-stone-50 via-rose-50/50 to-stone-100 text-stone-900 border-x border-b border-rose-200/40 shadow-inner">
            {/* Subtle vintage parchment watermark border */}
            <div className="absolute inset-3 border border-rose-900/10 rounded-2xl pointer-events-none" />

            {/* Letter Header */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-stone-200 pb-4 mb-6 gap-2">
              <div>
                <span className="font-cursive text-3xl sm:text-4xl text-rose-700 block">
                  Dearest {profile.name},
                </span>
                <span className="text-xs text-stone-500 font-serif italic">
                  Celebrating your milestone 18th Birthday
                </span>
              </div>
              <div className="text-xs text-stone-500 font-serif">
                With endless love from <strong className="text-stone-800">{profile.createdBy}</strong>
              </div>
            </div>

            {/* Letter Paragraphs */}
            <div className="relative z-10 space-y-4 text-stone-800 font-serif text-base sm:text-lg leading-relaxed">
              <p>
                Happy 18th Birthday! Today is not just any day—it is an extraordinary celebration of YOU.
                Watching you grow into such a kind-hearted, radiant, and deeply thoughtful person has been one of the greatest privileges of my life.
              </p>

              <p>
                As your <strong className="font-semibold text-rose-900">{profile.relationship.toLowerCase()}</strong>,
                I see every single day how your <strong className="font-semibold text-rose-900">{profile.personality.toLowerCase()}</strong> energy
                lights up every single room. Your passion for <strong className="font-semibold text-rose-900">{profile.favoriteHobby.toLowerCase()}</strong> and
                the gentle sincerity in everything you do makes you truly one of a kind.
              </p>

              <p>
                Turning 18 opens a brand new horizon of possibilities. May this milestone year bring you boundless happiness,
                unforgettable adventures, pure laughter, and the confidence to chase all of your wildest dreams.
                Whenever you look at the stars tonight, remember that someone is wishing the absolute best for you with every breath.
              </p>

              <p>
                {profile.customMessage ||
                  'Thank you for being the sweetest soul, for every shared smile, and for making life brighter just by being in it.'}
              </p>
            </div>

            {/* Letter Sign-off */}
            <div className="relative z-10 pt-8 mt-6 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-stone-400 font-sans font-medium block">
                  Forever Your
                </span>
                <span className="text-sm font-serif italic text-stone-700">
                  {profile.relationship} & Biggest Supporter
                </span>
              </div>

              <div className="text-right">
                <span className="font-cursive text-3xl sm:text-4xl text-rose-700 block">
                  {profile.createdBy}
                </span>
                <span className="text-xs text-stone-500 font-serif">
                  With all my love & heart ❤️
                </span>
              </div>
            </div>

            {/* Decorative Stamp in Corner */}
            <div className="absolute bottom-6 right-6 opacity-20 pointer-events-none rotate-[-12deg]">
              <div className="w-20 h-20 rounded-full border-4 border-dashed border-rose-900 flex items-center justify-center text-center text-xs font-serif font-bold uppercase text-rose-900 p-2">
                18 & Blessed Nov 2
              </div>
            </div>
          </div>
        ) : (
          /* Sealed Envelope Graphic */
          <div
            onClick={toggleLetter}
            className="p-12 bg-slate-900 text-center cursor-pointer hover:bg-slate-800 transition-colors flex flex-col items-center justify-center space-y-4"
          >
            <div className="w-16 h-16 rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/40 flex items-center justify-center transform hover:scale-110 active:scale-95 transition-transform border-2 border-amber-300">
              <Heart className="w-8 h-8 fill-white" />
            </div>
            <div>
              <h4 className="text-lg font-serif font-semibold text-white">
                Letter Sealed with Love for {profile.name}
              </h4>
              <p className="text-xs text-rose-300 mt-1">
                Click the seal to unfold your personal letter from {profile.createdBy}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
