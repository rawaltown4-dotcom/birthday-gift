/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { BirthdayProfile, COLOR_THEMES } from './types/birthday';
import WelcomeCover from './components/WelcomeCover';
import WelcomeForm from './components/WelcomeForm';
import SurpriseLoading from './components/SurpriseLoading';
import AudioPlayerControl from './components/AudioPlayerControl';
import FloatingBalloons from './components/FloatingBalloons';
import BirthdayCake from './components/BirthdayCake';
import PersonalizedLetter from './components/PersonalizedLetter';
import DigitalGiftBoxes from './components/DigitalGiftBoxes';
import CountdownMilestones from './components/CountdownMilestones';
import BirthdayQuiz from './components/BirthdayQuiz';
import FinalSurprise from './components/FinalSurprise';
import { soundEngine } from './utils/audio';
import {
  Sparkles,
  Gift,
  Cake,
  Mail,
  Clock,
  HelpCircle,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  List,
  Layers,
  Settings,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'birthday_surprise_data_v1';

const INITIAL_PROFILE: BirthdayProfile = {
  name: 'Dijaaa',
  age: 18,
  gender: 'female',
  createdBy: 'mekii',
  birthDate: '2008-11-02',
  relationship: 'Best Friend',
  favoriteColor: 'rose-gold',
  favoriteFlower: 'Blush Roses & Peonies',
  favoriteHobby: 'Photography & Art',
  favoriteSong: 'Golden Hour',
  personality: 'Cute',
  photoUrl: '/src/assets/images/birthday_memory_celebration_1793541562780.jpg',
  customMessage:
    'Happy 18th Birthday Dijaaa! You are the sweetest best friend anyone could ever ask for. Thank you for filling every single day with warmth, laughter, and unforgettable moments. Welcome to 18! May this milestone year unlock all your dreams and bring endless happiness.',
};

export type StoryStepId =
  | 'hero'
  | 'cake'
  | 'letter'
  | 'gifts'
  | 'milestones'
  | 'quiz'
  | 'final';

interface StoryStepConfig {
  id: StoryStepId;
  title: string;
  shortLabel: string;
  durationSeconds: number; // Duration to dwell before auto-advancing
}

const STORY_STEPS: StoryStepConfig[] = [
  { id: 'hero', title: 'Grand Celebration', shortLabel: 'Celebration', durationSeconds: 8 },
  { id: 'cake', title: 'Interactive Cake & Wishes', shortLabel: 'Birthday Cake', durationSeconds: 12 },
  { id: 'letter', title: 'Personalized Keepsake Letter', shortLabel: 'Letter', durationSeconds: 14 },
  { id: 'gifts', title: 'Three Digital Gift Boxes', shortLabel: 'Gifts', durationSeconds: 13 },
  { id: 'milestones', title: '18th Journey & Zodiac', shortLabel: 'Zodiac & Stats', durationSeconds: 10 },
  { id: 'quiz', title: 'Birthday Vibe Quiz', shortLabel: 'Fun Quiz', durationSeconds: 15 },
  { id: 'final', title: 'Grand Finale & Fireworks', shortLabel: 'Finale', durationSeconds: 20 },
];

export default function App() {
  const [profile, setProfile] = useState<BirthdayProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_PROFILE;
  });

  // App high-level views: 'cover' -> 'loading' -> 'celebration' | 'form'
  const [mainView, setMainView] = useState<'cover' | 'loading' | 'celebration' | 'form'>('cover');

  // Celebration view mode: 'story' (auto-advancing page-by-page) vs 'scroll' (all sections continuous)
  const [viewMode, setViewMode] = useState<'story' | 'scroll'>('story');

  // Current story step index (0 to 6)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Auto-advance toggle and timer state
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(STORY_STEPS[0].durationSeconds);

  const theme = COLOR_THEMES[profile.favoriteColor] || COLOR_THEMES['rose-gold'];
  const timerRef = useRef<number | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage errors
    }
  }, [profile]);

  const currentStep = STORY_STEPS[currentStepIndex];

  // Navigation handlers
  const goToNextStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const next = (prev + 1) % STORY_STEPS.length;
      setSecondsRemaining(STORY_STEPS[next].durationSeconds);
      return next;
    });
    soundEngine.playSparkleChime();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToPrevStep = useCallback(() => {
    setCurrentStepIndex((prev) => {
      const prevIdx = prev > 0 ? prev - 1 : STORY_STEPS.length - 1;
      setSecondsRemaining(STORY_STEPS[prevIdx].durationSeconds);
      return prevIdx;
    });
    soundEngine.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goToStep = useCallback((index: number) => {
    setCurrentStepIndex(index);
    setSecondsRemaining(STORY_STEPS[index].durationSeconds);
    soundEngine.playPop();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Auto-advance countdown timer
  useEffect(() => {
    if (mainView !== 'celebration' || viewMode !== 'story' || !autoAdvanceEnabled) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // If on the last step (final fireworks), loop or pause
          if (currentStepIndex === STORY_STEPS.length - 1) {
            return STORY_STEPS[currentStepIndex].durationSeconds;
          }
          goToNextStep();
          return STORY_STEPS[(currentStepIndex + 1) % STORY_STEPS.length].durationSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mainView, viewMode, autoAdvanceEnabled, currentStepIndex, goToNextStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mainView !== 'celebration') return;
      if (e.key === 'ArrowRight') {
        goToNextStep();
      } else if (e.key === 'ArrowLeft') {
        goToPrevStep();
      } else if (e.key === ' ') {
        e.preventDefault();
        setAutoAdvanceEnabled((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mainView, goToNextStep, goToPrevStep]);

  // Celebrate on step transitions
  useEffect(() => {
    if (mainView === 'celebration') {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.25 },
        colors: theme.balloonColors,
      });
    }
  }, [currentStepIndex, mainView, theme]);

  const handleStartFromCover = () => {
    setMainView('loading');
  };

  const handleLoadingComplete = () => {
    setMainView('celebration');
    setCurrentStepIndex(0);
    setSecondsRemaining(STORY_STEPS[0].durationSeconds);
    soundEngine.startBirthdayMelody();
  };

  const handleCelebrateAgain = () => {
    soundEngine.playFanfare();
    setCurrentStepIndex(0);
    setSecondsRemaining(STORY_STEPS[0].durationSeconds);
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#a855f7', '#ffffff'],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-rose-500 selection:text-white">
      {/* Background ambient lighting glows customized by favorite color */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none opacity-40 blur-3xl z-0"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${theme.primary} 0%, ${theme.secondary} 30%, transparent 70%)`,
        }}
      />

      {/* Floating poppable balloons on celebration, cover, and form screens */}
      <FloatingBalloons colors={theme.balloonColors} />

      {/* Persistent audio & quick controls */}
      <AudioPlayerControl
        onReset={() => setMainView('form')}
        accentColor={theme.primary}
      />

      {/* VIEW 1: Welcome Cover Page with Auto-Start Countdown */}
      {mainView === 'cover' && (
        <WelcomeCover
          profile={profile}
          onOpenSurprise={handleStartFromCover}
          onEditDetails={() => setMainView('form')}
          autoStartSeconds={5}
        />
      )}

      {/* VIEW 2: Surprise Loading Progress Ceremony */}
      {mainView === 'loading' && (
        <SurpriseLoading
          profile={profile}
          onComplete={handleLoadingComplete}
        />
      )}

      {/* VIEW 3: Customization Form */}
      {mainView === 'form' && (
        <WelcomeForm
          onStartSurprise={(newProfile) => {
            setProfile(newProfile);
            setMainView('loading');
          }}
          defaultProfile={profile}
        />
      )}

      {/* VIEW 4: Main Celebration Experience */}
      {mainView === 'celebration' && (
        <div className="relative z-10 pb-24">
          {/* Glowing Birthday Lights Garland along top */}
          <div className="w-full flex justify-around items-center pt-2 px-4 pointer-events-none opacity-90">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-0.5 h-3 bg-slate-700" />
                <div
                  className="w-3 h-4 rounded-full shadow-lg animate-pulse"
                  style={{
                    backgroundColor: theme.balloonColors[i % theme.balloonColors.length],
                    boxShadow: `0 0 10px ${theme.balloonColors[i % theme.balloonColors.length]}`,
                    animationDelay: `${(i % 5) * 0.3}s`,
                    animationDuration: '2s',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Sticky Story Auto-Advance Navigation Bar */}
          <header className="sticky top-2 z-40 px-3 sm:px-6 max-w-5xl mx-auto my-3">
            <div className="glass-panel rounded-2xl p-2.5 sm:p-3 border border-white/15 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-3">
              {/* Step info & Step Dots */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  <span className="text-xs font-semibold text-white tracking-wide">
                    Page {currentStepIndex + 1}/{STORY_STEPS.length}:
                  </span>
                  <span className="text-xs text-rose-300 font-medium truncate max-w-[140px] sm:max-w-[200px]">
                    {currentStep.title}
                  </span>
                </div>

                {/* Step indicator pills */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {STORY_STEPS.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => goToStep(idx)}
                      title={`Jump to ${s.title}`}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentStepIndex
                          ? 'w-6 bg-gradient-to-r from-rose-500 to-amber-400'
                          : idx < currentStepIndex
                          ? 'w-2 sm:w-2.5 bg-emerald-400/80 hover:bg-emerald-300'
                          : 'w-2 sm:w-2.5 bg-white/20 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Auto-Advance Controls */}
              <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
                {/* Auto-Advance status timer */}
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-xl text-xs">
                  <button
                    onClick={() => setAutoAdvanceEnabled(!autoAdvanceEnabled)}
                    className="flex items-center gap-1.5 text-slate-300 hover:text-white"
                    title={autoAdvanceEnabled ? 'Pause auto-advancing' : 'Resume auto-advancing'}
                  >
                    {autoAdvanceEnabled ? (
                      <>
                        <Pause className="w-3.5 h-3.5 text-amber-300" />
                        <span className="font-mono tabular-nums text-amber-200">
                          Auto: {secondsRemaining}s
                        </span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-400">Paused</span>
                      </>
                    )}
                  </button>

                  {/* Micro progress fill */}
                  {autoAdvanceEnabled && (
                    <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-amber-400 transition-all duration-1000"
                        style={{
                          width: `${((currentStep.durationSeconds - secondsRemaining) / currentStep.durationSeconds) * 100}%`,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Step Navigation Arrows */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={goToPrevStep}
                    className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors"
                    title="Previous Page (Left Arrow)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={goToNextStep}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
                    title="Next Page (Right Arrow)"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* View Mode Switcher: Story Page vs Continuous Scroll */}
                <button
                  onClick={() => setViewMode(viewMode === 'story' ? 'scroll' : 'story')}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-colors hidden sm:flex items-center gap-1 text-xs"
                  title={viewMode === 'story' ? 'Switch to All-in-One Scroll view' : 'Switch to Step-by-Step Story Mode'}
                >
                  {viewMode === 'story' ? (
                    <>
                      <List className="w-3.5 h-3.5" />
                      <span className="text-[11px]">All-in-One</span>
                    </>
                  ) : (
                    <>
                      <Layers className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-[11px]">Story Pages</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </header>

          {/* MAIN CONTENT DISPLAY */}

          {/* MODE A: Step-by-Step Auto-Advancing Story Pages */}
          {viewMode === 'story' && (
            <main className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-4 min-h-[70vh] flex flex-col justify-center">
              {/* PAGE 1: Hero Announcement */}
              {currentStep.id === 'hero' && (
                <div className="text-center max-w-4xl mx-auto space-y-8 animate-fade-in py-8">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-rose-300 text-xs font-semibold backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>Official 18th Birthday Celebration</span>
                    <span aria-hidden="true">·</span>
                    <span>2 November</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-white leading-tight">
                    HAPPY{' '}
                    <span className="bg-gradient-to-r from-amber-300 via-rose-400 to-pink-500 bg-clip-text text-transparent">
                      {profile.age}TH
                    </span>{' '}
                    BIRTHDAY,
                    <br />
                    <span className="font-serif italic drop-shadow-[0_0_35px_rgba(244,63,94,0.4)]">
                      {profile.name.toUpperCase()}!
                    </span>{' '}
                    🎂
                  </h1>

                  <div className="space-y-3 max-w-2xl mx-auto">
                    <p className="text-lg sm:text-2xl text-rose-100 font-serif leading-relaxed">
                      "Today is all about YOU! May your {profile.age}th year be filled with boundless happiness, success, true love, and unforgettable memories."
                    </p>
                    <p className="text-sm text-slate-300 font-medium">
                      A digital surprise gift handcrafted with love by{' '}
                      <strong className="text-rose-400 underline decoration-rose-500/50 underline-offset-4">
                        {profile.createdBy}
                      </strong>{' '}
                      ❤️
                    </p>
                  </div>

                  <div className="pt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={goToNextStep}
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-sm shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <span>Proceed to Birthday Cake 🎂</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* PAGE 2: Interactive Cake & Candles */}
              {currentStep.id === 'cake' && (
                <div className="animate-fade-in py-4">
                  <BirthdayCake
                    name={profile.name}
                    age={profile.age}
                    accentColor={theme.primary}
                    onWishCompleted={() => {
                      if (autoAdvanceEnabled) {
                        goToNextStep();
                      }
                    }}
                  />
                  <div className="mt-4 text-center">
                    <button
                      onClick={goToNextStep}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white underline font-medium"
                    >
                      <span>Skip to Personalized Letter</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* PAGE 3: Personalized Letter */}
              {currentStep.id === 'letter' && (
                <div className="animate-fade-in py-4">
                  <PersonalizedLetter profile={profile} />
                  <div className="mt-4 text-center">
                    <button
                      onClick={goToNextStep}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white underline font-medium"
                    >
                      <span>Proceed to Gift Boxes</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* PAGE 4: Three Digital Gift Boxes */}
              {currentStep.id === 'gifts' && (
                <div className="animate-fade-in py-4">
                  <DigitalGiftBoxes profile={profile} />
                  <div className="mt-4 text-center">
                    <button
                      onClick={goToNextStep}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white underline font-medium"
                    >
                      <span>Check Zodiac & Milestones</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* PAGE 5: Countdown & Zodiac */}
              {currentStep.id === 'milestones' && (
                <div className="animate-fade-in py-4">
                  <CountdownMilestones profile={profile} />
                  <div className="mt-4 text-center">
                    <button
                      onClick={goToNextStep}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white underline font-medium"
                    >
                      <span>Play Birthday Vibe Quiz</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* PAGE 6: Fun Birthday Quiz */}
              {currentStep.id === 'quiz' && (
                <div className="animate-fade-in py-4">
                  <BirthdayQuiz
                    profile={profile}
                    onQuizCompleted={() => {
                      if (autoAdvanceEnabled) {
                        goToNextStep();
                      }
                    }}
                  />
                  <div className="mt-4 text-center">
                    <button
                      onClick={goToNextStep}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white underline font-medium"
                    >
                      <span>Proceed to Grand Fireworks Finale</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* PAGE 7: Grand Finale & Fireworks */}
              {currentStep.id === 'final' && (
                <div className="animate-fade-in py-4">
                  <FinalSurprise
                    profile={profile}
                    onCelebrateAgain={handleCelebrateAgain}
                    onEditProfile={() => setMainView('form')}
                  />
                </div>
              )}
            </main>
          )}

          {/* MODE B: Continuous Scroll View */}
          {viewMode === 'scroll' && (
            <main className="px-4 sm:px-6 lg:px-8 space-y-16 pb-20 pt-6">
              {/* Hero */}
              <div className="text-center max-w-4xl mx-auto space-y-6">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black tracking-tight text-white leading-tight">
                  HAPPY {profile.age}TH BIRTHDAY, {profile.name.toUpperCase()}! 🎂
                </h1>
                <p className="text-base sm:text-xl text-rose-100 font-serif leading-relaxed">
                  "Today is all about YOU! May your {profile.age}th year be filled with boundless happiness, success, true love, and unforgettable memories."
                </p>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  With love from {profile.createdBy} ❤️
                </p>
              </div>

              {/* Cake */}
              <section id="section-cake" className="scroll-mt-24">
                <BirthdayCake name={profile.name} age={profile.age} accentColor={theme.primary} />
              </section>

              {/* Letter */}
              <section id="section-letter" className="scroll-mt-24">
                <PersonalizedLetter profile={profile} />
              </section>

              {/* Gifts */}
              <section id="section-gifts" className="scroll-mt-24">
                <DigitalGiftBoxes profile={profile} />
              </section>

              {/* Milestones */}
              <section id="section-milestones" className="scroll-mt-24">
                <CountdownMilestones profile={profile} />
              </section>

              {/* Quiz */}
              <section id="section-quiz" className="scroll-mt-24">
                <BirthdayQuiz profile={profile} />
              </section>

              {/* Finale */}
              <section id="section-final" className="scroll-mt-24">
                <FinalSurprise
                  profile={profile}
                  onCelebrateAgain={handleCelebrateAgain}
                  onEditProfile={() => setMainView('form')}
                />
              </section>
            </main>
          )}

          {/* Bottom Fixed Navigation Bar on Story Mode */}
          {viewMode === 'story' && (
            <div className="fixed bottom-3 inset-x-0 mx-auto w-max z-40 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/15 backdrop-blur-md shadow-2xl flex items-center gap-2 text-xs">
              <button
                onClick={goToPrevStep}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <div className="h-3 w-[1px] bg-white/20" />

              <button
                onClick={() => setAutoAdvanceEnabled(!autoAdvanceEnabled)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-rose-300 hover:bg-white/10 transition-colors font-medium"
              >
                {autoAdvanceEnabled ? (
                  <>
                    <Pause className="w-3 h-3 text-amber-300" />
                    <span>Auto: {secondsRemaining}s</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-emerald-400" />
                    <span>Play Auto</span>
                  </>
                )}
              </button>

              <div className="h-3 w-[1px] bg-white/20" />

              <button
                onClick={goToNextStep}
                className="flex items-center gap-1 px-3 py-1 rounded-full text-amber-300 font-semibold hover:bg-white/10 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
