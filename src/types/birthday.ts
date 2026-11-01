export interface BirthdayProfile {
  name: string;
  age: number;
  gender: 'female' | 'male' | 'other' | 'prefer-not-to-say';
  createdBy: string;
  birthDate: string; // YYYY-MM-DD
  relationship: string;
  favoriteColor: string; // e.g., 'rose-gold' | 'lavender' | 'emerald' | 'sapphire' | 'sunset-coral' | 'champagne'
  favoriteFlower: string;
  favoriteHobby: string;
  favoriteSong: string;
  personality: string;
  photoUrl?: string;
  customMessage?: string;
}

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  cardBg: string;
  glow: string;
  balloonColors: string[];
}

export const COLOR_THEMES: Record<string, ColorTheme> = {
  'rose-gold': {
    id: 'rose-gold',
    name: 'Rose Gold & Blush',
    primary: '#f43f5e',
    secondary: '#fb7185',
    accent: '#fbcfe8',
    gradient: 'from-rose-500/20 via-pink-500/10 to-amber-500/10',
    cardBg: 'bg-rose-950/20 border-rose-500/20',
    glow: 'rgba(244, 63, 94, 0.4)',
    balloonColors: ['#fb7185', '#f43f5e', '#fecdd3', '#fda4af', '#fcd34d'],
  },
  'lavender': {
    id: 'lavender',
    name: 'Lavender & Lilac',
    primary: '#a855f7',
    secondary: '#c084fc',
    accent: '#e9d5ff',
    gradient: 'from-purple-500/20 via-fuchsia-500/10 to-indigo-500/10',
    cardBg: 'bg-purple-950/20 border-purple-500/20',
    glow: 'rgba(168, 85, 247, 0.4)',
    balloonColors: ['#c084fc', '#a855f7', '#e9d5ff', '#818cf8', '#f472b6'],
  },
  'emerald': {
    id: 'emerald',
    name: 'Emerald & Mint',
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#a7f3d0',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/10',
    cardBg: 'bg-emerald-950/20 border-emerald-500/20',
    glow: 'rgba(16, 185, 129, 0.4)',
    balloonColors: ['#34d399', '#10b981', '#6ee7b7', '#2dd4bf', '#fde047'],
  },
  'sapphire': {
    id: 'sapphire',
    name: 'Midnight Sapphire & Sky',
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#bfdbfe',
    gradient: 'from-blue-500/20 via-indigo-500/10 to-sky-500/10',
    cardBg: 'bg-blue-950/20 border-blue-500/20',
    glow: 'rgba(59, 130, 246, 0.4)',
    balloonColors: ['#60a5fa', '#3b82f6', '#93c5fd', '#38bdf8', '#c084fc'],
  },
  'sunset-coral': {
    id: 'sunset-coral',
    name: 'Sunset Coral & Peach',
    primary: '#f97316',
    secondary: '#fb923c',
    accent: '#fed7aa',
    gradient: 'from-orange-500/20 via-rose-500/10 to-amber-500/10',
    cardBg: 'bg-orange-950/20 border-orange-500/20',
    glow: 'rgba(249, 115, 22, 0.4)',
    balloonColors: ['#fb923c', '#f97316', '#fdba74', '#f43f5e', '#fbbf24'],
  },
  'champagne': {
    id: 'champagne',
    name: 'Golden Champagne & Ivory',
    primary: '#eab308',
    secondary: '#facc15',
    accent: '#fef08a',
    gradient: 'from-amber-500/20 via-yellow-500/10 to-orange-500/10',
    cardBg: 'bg-amber-950/20 border-amber-500/20',
    glow: 'rgba(234, 179, 8, 0.4)',
    balloonColors: ['#facc15', '#eab308', '#fef08a', '#f59e0b', '#f43f5e'],
  },
};
