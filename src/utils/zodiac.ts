export interface ZodiacInfo {
  sign: string;
  symbol: string;
  element: string;
  traits: string[];
  luckyStone: string;
  flower: string;
  greeting: string;
}

export function getZodiacInfo(birthDateStr: string): ZodiacInfo {
  let month = 11;
  let day = 2;

  if (birthDateStr) {
    const parts = birthDateStr.split('-');
    if (parts.length >= 3) {
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    }
  }

  // Calculate zodiac based on month and day
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    return {
      sign: 'Aquarius',
      symbol: '♒',
      element: 'Air',
      traits: ['Visionary', 'Kind-hearted', 'Independent', 'Original'],
      luckyStone: 'Amethyst',
      flower: 'Orchid',
      greeting: 'The innovative visionary whose kindness lights up the room!',
    };
  }
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    return {
      sign: 'Pisces',
      symbol: '♓',
      element: 'Water',
      traits: ['Compassionate', 'Artistic', 'Intuitive', 'Gentle'],
      luckyStone: 'Aquamarine',
      flower: 'Water Lily',
      greeting: 'The empathetic soul whose warmth makes the world brighter!',
    };
  }
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    return {
      sign: 'Aries',
      symbol: '♈',
      element: 'Fire',
      traits: ['Courageous', 'Passionate', 'Dynamic', 'Inspiring'],
      luckyStone: 'Diamond',
      flower: 'Honeysuckle',
      greeting: 'The bold trailblazer who brings infectious joy to every room!',
    };
  }
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    return {
      sign: 'Taurus',
      symbol: '♉',
      element: 'Earth',
      traits: ['Reliable', 'Patient', 'Devoted', 'Affectionate'],
      luckyStone: 'Emerald',
      flower: 'Rose',
      greeting: 'The loyal, beautiful heart that anchors everyone in love!',
    };
  }
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    return {
      sign: 'Gemini',
      symbol: '♊',
      element: 'Air',
      traits: ['Adaptable', 'Playful', 'Curious', 'Witty'],
      luckyStone: 'Pearl',
      flower: 'Lavender',
      greeting: 'The vibrant conversationalist who makes every memory magical!',
    };
  }
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    return {
      sign: 'Cancer',
      symbol: '♋',
      element: 'Water',
      traits: ['Nurturing', 'Sweet', 'Deeply Loyal', 'Creative'],
      luckyStone: 'Ruby',
      flower: 'White Rose',
      greeting: 'The golden-hearted protector whose love feels like home!',
    };
  }
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    return {
      sign: 'Leo',
      symbol: '♌',
      element: 'Fire',
      traits: ['Radiant', 'Generous', 'Warm-hearted', 'Magnetic'],
      luckyStone: 'Peridot',
      flower: 'Sunflower',
      greeting: 'The shining superstar who radiates joy and laughter!',
    };
  }
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    return {
      sign: 'Virgo',
      symbol: '♍',
      element: 'Earth',
      traits: ['Thoughtful', 'Graceful', 'Empathetic', 'Dedicated'],
      luckyStone: 'Sapphire',
      flower: 'Buttercup',
      greeting: 'The elegant perfectionist whose gentle care touches every soul!',
    };
  }
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    return {
      sign: 'Libra',
      symbol: '♎',
      element: 'Air',
      traits: ['Charming', 'Harmonious', 'Diplomatic', 'Graceful'],
      luckyStone: 'Opal',
      flower: 'Rose',
      greeting: 'The graceful angel who brings balance and sweetness everywhere!',
    };
  }
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    return {
      sign: 'Scorpio',
      symbol: '♏',
      element: 'Water',
      traits: ['Intuitive', 'Deeply Loyal', 'Magnetic', 'Passionate'],
      luckyStone: 'Topaz',
      flower: 'Peony & Chrysanthemum',
      greeting: 'The mesmerizing, deeply loyal soul with an unforgettable heart!',
    };
  }
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    return {
      sign: 'Sagittarius',
      symbol: '♐',
      element: 'Fire',
      traits: ['Free-spirited', 'Generous', 'Adventurous', 'Enthusiastic'],
      luckyStone: 'Turquoise',
      flower: 'Carnation',
      greeting: 'The bright wanderer who brings endless smiles and adventures!',
    };
  }
  // Capricorn
  return {
    sign: 'Capricorn',
    symbol: '♑',
    element: 'Earth',
    traits: ['Ambitious', 'Steadfast', 'Wise', 'Warmly Devoted'],
    luckyStone: 'Garnet',
    flower: 'Pansy',
    greeting: 'The inspiring soul whose quiet grace and resilience shines bright!',
  };
}

export interface MilestoneData {
  daysLived: number;
  hoursLived: number;
  heartbeatsEstimate: string;
  smilesEstimate: string;
  daysToNextBirthday: number;
  hoursToNextBirthday: number;
  minutesToNextBirthday: number;
  secondsToNextBirthday: number;
}

export function calculateMilestones(birthDateStr: string, age: number): MilestoneData {
  const now = new Date();
  let bDayMonth = 10; // 0-indexed: Nov = 10
  let bDayDay = 2;

  if (birthDateStr) {
    const parts = birthDateStr.split('-');
    if (parts.length >= 3) {
      bDayMonth = parseInt(parts[1], 10) - 1;
      bDayDay = parseInt(parts[2], 10);
    }
  }

  // Days lived estimate based on age
  const daysLived = Math.floor(age * 365.25);
  const hoursLived = daysLived * 24;

  // Next birthday calculation
  let nextBirthday = new Date(now.getFullYear(), bDayMonth, bDayDay, 0, 0, 0);
  if (now.getTime() > nextBirthday.getTime() + 24 * 60 * 60 * 1000) {
    // If today is past birthday, set to next year
    nextBirthday = new Date(now.getFullYear() + 1, bDayMonth, bDayDay, 0, 0, 0);
  }

  const diffMs = Math.max(0, nextBirthday.getTime() - now.getTime());
  const diffSec = Math.floor(diffMs / 1000);
  const days = Math.floor(diffSec / (3600 * 24));
  const hours = Math.floor((diffSec % (3600 * 24)) / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const seconds = diffSec % 60;

  // 75 beats per minute average
  const heartbeats = Math.floor(daysLived * 24 * 60 * 75);
  const heartbeatsFormatted = (heartbeats / 1000000).toFixed(1) + ' Million';

  return {
    daysLived,
    hoursLived,
    heartbeatsEstimate: heartbeatsFormatted,
    smilesEstimate: 'Infinite & Priceless ✨',
    daysToNextBirthday: days,
    hoursToNextBirthday: hours,
    minutesToNextBirthday: minutes,
    secondsToNextBirthday: seconds,
  };
}
