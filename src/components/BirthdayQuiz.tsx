import { useState } from 'react';
import { BirthdayProfile } from '../types/birthday';
import { HelpCircle, Check, Award, Sparkles, RefreshCw, Heart } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

interface BirthdayQuizProps {
  profile: BirthdayProfile;
  onQuizCompleted?: () => void;
}

interface Question {
  id: number;
  question: string;
  options: { label: string; scoreMsg: string }[];
}

export default function BirthdayQuiz({ profile, onQuizCompleted }: BirthdayQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions: Question[] = [
    {
      id: 1,
      question: 'How special is today?',
      options: [
        { label: '🌟 A national holiday in our hearts!', scoreMsg: '100% True!' },
        { label: '🎂 The single most important day of the year!', scoreMsg: 'Absolutely!' },
        { label: '👑 A day worthy of a royal celebration!', scoreMsg: 'You know it!' },
        { label: '💖 All of the above and more!', scoreMsg: 'Without a doubt!' },
      ],
    },
    {
      id: 2,
      question: 'What superpower makes you truly amazing?',
      options: [
        { label: '✨ Your contagious smile & laughter', scoreMsg: 'Lighting up every room!' },
        { label: '💛 Being the most loyal, sweetest friend', scoreMsg: 'True gem of a human!' },
        { label: '🎨 Your creativity and graceful soul', scoreMsg: 'Pure artistic magic!' },
        { label: '🌸 Making everyone around you feel valued', scoreMsg: 'A golden heart!' },
      ],
    },
    {
      id: 3,
      question: 'Choose your biggest 18th birthday wish:',
      options: [
        { label: '✈️ Unforgettable travels and adventures', scoreMsg: 'The world is waiting!' },
        { label: '🎯 Massive success in your passion & dreams', scoreMsg: 'You will conquer it all!' },
        { label: '🕊️ Endless peace, joy, and laughter with loved ones', scoreMsg: 'The greatest blessing!' },
        { label: '🌈 All wishes granted at once!', scoreMsg: 'Because you deserve it all!' },
      ],
    },
    {
      id: 4,
      question: 'Pick your dream birthday getaway destination:',
      options: [
        { label: '🗼 Paris with romantic cafes and golden lights', scoreMsg: 'Chic and gorgeous!' },
        { label: '🏖️ Tropical beach with crystal blue waters', scoreMsg: 'Sunshine and serene waves!' },
        { label: '🌸 Tokyo during cherry blossom season', scoreMsg: 'Aesthetic wonderland!' },
        { label: '☕ Cozy cabin under starry night skies', scoreMsg: 'Warm cocoa and peace!' },
      ],
    },
    {
      id: 5,
      question: 'What gift brings the biggest smile to your face today?',
      options: [
        { label: '🎁 Knowing how deeply cherished you are', scoreMsg: 'Priceless love!' },
        { label: '🍰 Unlimited cake and sweet birthday treats', scoreMsg: 'Sweetness overload!' },
        { label: '💌 Genuine heartfelt surprises from friends', scoreMsg: 'Made with love!' },
        { label: '🎊 All the above wrapped in golden ribbons', scoreMsg: 'Total perfection!' },
      ],
    },
  ];

  const handleSelectOption = (optionIndex: number) => {
    soundEngine.playPop();
    const nextAnswers = [...selectedAnswers, optionIndex];
    setSelectedAnswers(nextAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setQuizFinished(true);
      soundEngine.playFanfare();
      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fbbf24', '#38bdf8', '#a855f7'],
      });
      if (onQuizCompleted) {
        setTimeout(() => {
          onQuizCompleted();
        }, 4000);
      }
    }
  };

  const restartQuiz = () => {
    soundEngine.playSparkleChime();
    setCurrentStep(0);
    setSelectedAnswers([]);
    setQuizFinished(false);
  };

  return (
    <div className="py-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-pink-400" />
          <span>Birthday Fun Quiz</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          The 18th Birthday Vibe Check
        </h3>
        <p className="text-xs sm:text-sm text-slate-300">
          5 quick questions to test how awesome today truly is!
        </p>
      </div>

      {/* Quiz Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {!quizFinished ? (
          <div className="space-y-6">
            {/* Step progress tracker */}
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-3 font-mono">
              <span>
                Question {currentStep + 1} of {questions.length}
              </span>
              <div className="flex gap-1.5">
                {questions.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentStep
                        ? 'w-6 bg-rose-400'
                        : idx < currentStep
                        ? 'w-3 bg-emerald-400'
                        : 'w-3 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Question */}
            <div className="space-y-4">
              <h4 className="text-lg sm:text-xl font-serif font-bold text-white">
                {questions[currentStep].question}
              </h4>

              {/* Options */}
              <div className="space-y-2.5">
                {questions[currentStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(i)}
                    className="w-full text-left p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-400/50 text-white font-medium text-xs sm:text-sm transition-all duration-200 flex items-center justify-between group active:scale-[0.99]"
                  >
                    <span>{opt.label}</span>
                    <span className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center group-hover:border-rose-400 text-xs group-hover:bg-rose-500/20">
                      &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Finished Quiz Result Certificate */
          <div className="text-center py-6 space-y-6 animate-fade-in">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 text-slate-950 shadow-xl shadow-rose-500/30">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                Official Certification
              </span>
              <h4 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                100% Certified Birthday Royalty! 👑
              </h4>
              <p className="text-xs sm:text-sm text-rose-200/90 max-w-md mx-auto leading-relaxed">
                Verdict: <strong className="text-white">{profile.name}</strong> scores off the charts in cuteness,
                warmth, and brilliance! There is nobody quite like you on this earth.
              </p>
            </div>

            {/* Certificate badge card */}
            <div className="rounded-2xl p-5 bg-white/5 border border-white/15 max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 border-b border-white/10 pb-2">
                <span>Awardee: <strong className="text-white">{profile.name}</strong></span>
                <span>Milestone: <strong className="text-amber-300">Level 18 Unlocked</strong></span>
              </div>
              <p className="text-xs text-slate-300 italic">
                "May your 18th chapter be your happiest, boldest, and most magical adventure yet!"
              </p>
              <div className="text-right text-[11px] text-rose-400 font-medium">
                Signed with love, {profile.createdBy} ❤️
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={restartQuiz}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
