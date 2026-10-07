export type Lane = 0 | 1 | 2; // 0 = Top, 1 = Middle, 2 = Bottom

export type CityTheme = 'medan' | 'jakarta' | 'bandung';

export type GameMode = 'solo' | 'vs_bot' | 'pvp';

export type ObstacleType = 'tourist_crowd' | 'construction' | 'water_hazard' | 'luggage_pile';

export type CollectibleType = 'destination' | 'coin' | 'star' | 'heart';

export type DestinationVibe = 'nature' | 'cafe' | 'activities' | 'cultural' | 'balanced';

export type TinTinColor = 'blue' | 'coral' | 'emerald' | 'purple';

export interface ItinerarySpot {
  id: string;
  name: string;
  category: string;
  vibe: DestinationVibe;
  icon: string;
  day: number;
}

export interface PlayerState {
  id: string;
  name: string;
  isBot?: boolean;
  color: TinTinColor;
  x: number;
  lane: Lane;
  targetLane: Lane;
  laneTransitionProgress: number; // 0 to 1
  lives: number;
  maxLives: number;
  invincibleTimer: number;
  isInvincible: boolean;
  score: number;
  distance: number;
  destinationsCollected: number;
  coinsCollected: number;
  starsCollected: number;
  speedBoostTimer: number;
  isAlive: boolean;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface Obstacle {
  id: string;
  type: ObstacleType;
  lane: Lane;
  x: number;
  width: number;
  height: number;
  active: boolean;
}

export interface Collectible {
  id: string;
  type: CollectibleType;
  vibe?: DestinationVibe;
  vibeName?: string;
  spotName?: string;
  spotIcon?: string;
  lane: Lane;
  x: number;
  value: number;
  active: boolean;
  scale: number;
  rotation: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  type?: 'rain' | 'sparkle' | 'splash' | 'smoke' | 'shield';
}

export interface StormState {
  isActive: boolean;
  phase: 'idle' | 'warning' | 'freeze' | 'rerouting' | 'indoor_transition' | 'reward';
  timer: number;
  warningDuration: number;
  freezeDuration: number;
  rerouteDuration: number;
  rewardDuration: number;
  rerouteProgress: number;
  nextStormIn: number;
  selectedIndoorSpot: string;
  indoorCategory: string;
  lightningFlash: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  distance: number;
  destinations: number;
  timeSurvived: number;
  date: string;
  city: CityTheme;
  mode?: GameMode;
  dayReached?: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  boothMode: boolean;
  selectedCity: CityTheme;
  gameMode: GameMode;
  autoCycleCity: boolean;
}

export type GamePhase = 'idle' | 'briefing' | 'playing' | 'gameover' | 'leaderboard' | 'cta';
