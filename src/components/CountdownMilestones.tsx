import { useState, useEffect } from 'react';
import { BirthdayProfile } from '../types/birthday';
import { getZodiacInfo, calculateMilestones, MilestoneData, ZodiacInfo } from '../utils/zodiac';
import { Clock, Calendar, Compass, Heart, Sparkles, Award } from 'lucide-react';

interface CountdownMilestonesProps {
  profile: BirthdayProfile;
}

export default function CountdownMilestones({ profile }: CountdownMilestonesProps) {
  const [milestones, setMilestones] = useState<MilestoneData>(() =>
    calculateMilestones(profile.birthDate, profile.age)
  );
  const [zodiac] = useState<ZodiacInfo>(() => getZodiacInfo(profile.birthDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setMilestones(calculateMilestones(profile.birthDate, profile.age));
    }, 1000);
    return () => clearInterval(timer);
  }, [profile.birthDate, profile.age]);

  return (
    <div className="py-8 max-w-5xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Life Journey & Zodiac Milestones</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          {profile.name}’s 18th Milestone Journey
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Celebrating 18 beautiful years, celestial alignment, and counting every precious second.
        </p>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Birthday Live Countdown */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-400" />
              <h4 className="text-lg font-serif font-bold text-white">
                Countdown to Next Birthday
              </h4>
            </div>
            <span className="text-xs text-rose-300 bg-rose-500/20 px-2.5 py-1 rounded-full font-medium">
              2 November
            </span>
          </div>

          {/* Countdown Clock Digits */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              <span className="block text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                {milestones.daysToNextBirthday}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                Days
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              <span className="block text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                {milestones.hoursToNextBirthday}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                Hours
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              <span className="block text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
                {milestones.minutesToNextBirthday}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                Mins
              </span>
            </div>
            <div className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
              <span className="block text-2xl sm:text-3xl font-bold font-mono text-rose-400 tabular-nums animate-pulse">
                {milestones.secondsToNextBirthday}
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">
                Secs
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 text-center italic">
            "Every second with you is a gift to everyone lucky enough to know you."
          </p>
        </div>

        {/* Zodiac Sign & Astrological Attributes */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-purple-400" />
              <h4 className="text-lg font-serif font-bold text-white">
                Zodiac Alignment: {zodiac.sign}
              </h4>
            </div>
            <span className="text-2xl">{zodiac.symbol}</span>
          </div>

          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed font-serif">
              "{zodiac.greeting}"
            </p>

            {/* Traits */}
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-medium">Core Scorpio Traits:</span>
              <div className="flex flex-wrap gap-2">
                {zodiac.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-200 text-xs font-medium border border-purple-500/30"
                  >
                    ✨ {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-2 border-t border-white/5">
              <div>
                <span className="text-slate-400">Element:</span>{' '}
                <strong className="text-white">{zodiac.element}</strong>
              </div>
              <div>
                <span className="text-slate-400">Birthstone:</span>{' '}
                <strong className="text-amber-300">{zodiac.luckyStone}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Stat Milestones Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">
            Days of Sunshine
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            {milestones.daysLived.toLocaleString()}
          </span>
          <span className="text-[11px] text-rose-300 block">Days in this world</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">
            Hours of Memories
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
            {milestones.hoursLived.toLocaleString()}
          </span>
          <span className="text-[11px] text-amber-300 block">Hours of living brightly</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">
            Heartbeats Lived
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-400 tabular-nums">
            {milestones.heartbeatsEstimate}
          </span>
          <span className="text-[11px] text-rose-300 block">Loving pulses</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 text-center space-y-1 shadow-lg">
          <span className="text-xs text-slate-400 uppercase tracking-wider block">
            Smiles Created
          </span>
          <span className="text-2xl sm:text-3xl font-bold text-amber-300 flex items-center justify-center gap-1">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Countless</span>
          </span>
          <span className="text-[11px] text-amber-200 block">Pure joy delivered</span>
        </div>
      </div>
    </div>
  );
}
