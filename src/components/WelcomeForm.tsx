import React, { useState, useRef } from 'react';
import { BirthdayProfile, COLOR_THEMES } from '../types/birthday';
import { Sparkles, Heart, Gift, Camera, Calendar, User, HeartHandshake, Music, Flower, Palette, Smile } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface WelcomeFormProps {
  onStartSurprise: (profile: BirthdayProfile) => void;
  defaultProfile?: BirthdayProfile;
}

const DEFAULT_PROFILE: BirthdayProfile = {
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
    'Happy 18th Birthday Dijaaa! You are the brightest light and the most genuinely sweet best friend anyone could ever ask for. Thank you for filling every day with warmth and smiles. Welcome to 18! May this milestone year unlock all your dreams and bring endless happiness.',
};

export default function WelcomeForm({ onStartSurprise, defaultProfile }: WelcomeFormProps) {
  const [profile, setProfile] = useState<BirthdayProfile>(defaultProfile || DEFAULT_PROFILE);
  const [photoPreview, setPhotoPreview] = useState<string>(
    profile.photoUrl || '/src/assets/images/birthday_memory_celebration_1793541562780.jpg'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const relationships = [
    'Best Friend',
    'Friend',
    'Sister',
    'Brother',
    'Girlfriend',
    'Boyfriend',
    'Wife',
    'Husband',
    'Family Member',
    'Other',
  ];

  const personalities = [
    'Cute',
    'Friendly',
    'Funny',
    'Romantic',
    'Emotional',
    'Introvert',
    'Extrovert',
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setProfile((prev) => ({ ...prev, photoUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const loadDefaultPreset = () => {
    soundEngine.playSparkleChime();
    setProfile(DEFAULT_PROFILE);
    setPhotoPreview(DEFAULT_PROFILE.photoUrl || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playGiftOpen();
    onStartSurprise(profile);
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Decorative ambient gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-3xl">
        {/* Header Hero */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Digital Birthday Experience</span>
            <span aria-hidden="true">·</span>
            <span>Crafted with Love</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight text-balance">
            Someone Special Deserves a Special Surprise!
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            Let's create a magical birthday experience.
          </p>

          {/* Quick preset loader */}
          <div className="pt-2">
            <button
              type="button"
              onClick={loadDefaultPreset}
              className="inline-flex items-center gap-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:underline transition-colors"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-500/30 text-rose-400" />
              <span>Loaded with Dijaaa & mekii's 18th Surprise details</span>
            </button>
          </div>
        </div>

        {/* Main Personalization Form Card */}
        <form
          onSubmit={handleSubmit}
          className="glass-panel rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl border border-white/10 space-y-8"
        >
          {/* Section: Personal Information */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-rose-300 text-sm font-semibold tracking-wide">
              <User className="w-4 h-4 text-rose-400" />
              <span>Personal Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name (Birthday Star)
                </label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Dijaaa"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-sm"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Age Milestone
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 18 })}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-sm"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value as BirthdayProfile['gender'] })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-sm"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Non-Binary / Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              {/* Created By */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Created By (Sender Name)
                </label>
                <input
                  type="text"
                  required
                  value={profile.createdBy}
                  onChange={(e) => setProfile({ ...profile, createdBy: e.target.value })}
                  placeholder="e.g. mekii"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-sm"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={profile.birthDate}
                    onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-sm"
                  />
                  <Calendar className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Relationship with Sender */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Relationship with Sender
                </label>
                <div className="relative">
                  <select
                    value={profile.relationship}
                    onChange={(e) => setProfile({ ...profile, relationship: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-sm"
                  >
                    {relationships.map((rel) => (
                      <option key={rel} value={rel}>
                        {rel}
                      </option>
                    ))}
                  </select>
                  <HeartHandshake className="absolute right-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Additional Details */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-rose-300 text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Personal Preferences & Personality</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Favorite Color Theme */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Favorite Color Theme</span>
                  <Palette className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(COLOR_THEMES).map(([key, theme]) => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setProfile({ ...profile, favoriteColor: key })}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left text-xs transition-all border ${
                        profile.favoriteColor === key
                          ? 'border-white/80 bg-white/15 shadow-sm ring-1 ring-white/50'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <span className="truncate text-white text-[11px] font-medium">{theme.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personality */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Personality Vibe</span>
                  <Smile className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <select
                  value={profile.personality}
                  onChange={(e) => setProfile({ ...profile, personality: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/15 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-sm"
                >
                  {personalities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Favorite Flower */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Favorite Flower</span>
                  <Flower className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <input
                  type="text"
                  value={profile.favoriteFlower}
                  onChange={(e) => setProfile({ ...profile, favoriteFlower: e.target.value })}
                  placeholder="e.g. Roses & Peonies"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-sm"
                />
              </div>

              {/* Favorite Hobby */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Favorite Hobby
                </label>
                <input
                  type="text"
                  value={profile.favoriteHobby}
                  onChange={(e) => setProfile({ ...profile, favoriteHobby: e.target.value })}
                  placeholder="e.g. Photography & Art"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-sm"
                />
              </div>

              {/* Favorite Song */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Favorite Song or Musical Vibe</span>
                  <Music className="w-3.5 h-3.5 text-slate-400" />
                </label>
                <input
                  type="text"
                  value={profile.favoriteSong}
                  onChange={(e) => setProfile({ ...profile, favoriteSong: e.target.value })}
                  placeholder="e.g. Golden Hour / Enchanted"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section: Photograph Upload & Personal Note */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-rose-300 text-sm font-semibold tracking-wide">
              <Camera className="w-4 h-4 text-rose-400" />
              <span>Photograph & Personal Message</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Photo Upload / Preview */}
              <div className="md:col-span-1 space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Celebration Photo (Optional)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-square border-2 border-dashed border-white/20 hover:border-rose-400/60 bg-white/5 transition-all flex flex-col items-center justify-center text-center p-3"
                >
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Celebration preview"
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : null}
                  <div className={`relative z-10 p-2 rounded-full ${photoPreview ? 'bg-black/50 backdrop-blur-sm' : ''} text-white`}>
                    <Camera className="w-6 h-6 text-rose-300 mx-auto" />
                    <span className="block text-[11px] font-medium mt-1">
                      {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-[11px] text-slate-400 text-center">
                  Supports custom pictures or aesthetic memory photos
                </p>
              </div>

              {/* Personal Birthday Message */}
              <div className="md:col-span-2 space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Personal Birthday Message (From {profile.createdBy || 'Sender'})
                </label>
                <textarea
                  rows={6}
                  value={profile.customMessage}
                  onChange={(e) => setProfile({ ...profile, customMessage: e.target.value })}
                  placeholder="Write something heartfelt, nostalgic, or inspiring..."
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-semibold text-base shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mx-auto"
            >
              <Gift className="w-5 h-5" />
              <span>Create My Birthday Surprise ✨</span>
            </button>
            <p className="text-xs text-slate-400 mt-3">
              Prepares interactive candles, personalized gifts, quiz, and celebration letter.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
