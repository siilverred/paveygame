import { sounds } from './audio';
import { drawBackground, drawCollectible, drawObstacle, drawPlayer, drawTrack, drawPromenade } from './assets';
import type {
  CityTheme,
  Collectible,
  DestinationVibe,
  FloatingText,
  GameMode,
  GameSettings,
  ItinerarySpot,
  Lane,
  Obstacle,
  ObstacleType,
  Particle,
  PlayerState,
  StormState,
} from './types';

export const CITY_ITINERARIES: Record<CityTheme, Record<number, ItinerarySpot[]>> = {
  medan: {
    1: [
      { id: 'm_1', name: 'Istana Maimun', category: 'Cultural Heritage', vibe: 'cultural', icon: '🏰', day: 1 },
      { id: 'm_2', name: 'Kopi Apek Kesawan', category: 'Heritage Cafe', vibe: 'cafe', icon: '☕', day: 1 },
      { id: 'm_3', name: 'Masjid Raya Al-Mashun', category: 'Historic Landmark', vibe: 'cultural', icon: '🕌', day: 1 },
      { id: 'm_4', name: 'Kuliner Bihun Bebek Asie', category: 'Foodie Destination', vibe: 'balanced', icon: '🍜', day: 1 },
    ],
    2: [
      { id: 'm_5', name: 'Danau Toba Viewpoint', category: 'Scenic Nature', vibe: 'nature', icon: '🌲', day: 2 },
      { id: 'm_6', name: 'Tjong A Fie Mansion', category: 'Historical Museum', vibe: 'cultural', icon: '🏛️', day: 2 },
      { id: 'm_7', name: 'Macehat Coffee Avocado', category: 'Modern Roastery', vibe: 'cafe', icon: '🥑', day: 2 },
      { id: 'm_8', name: 'Merdeka Walk Heritage', category: 'Lifestyle Hub', vibe: 'activities', icon: '🛍️', day: 2 },
    ],
    3: [
      { id: 'm_9', name: 'Graha Maria Annai Velangkanni', category: 'Unique Architecture', vibe: 'cultural', icon: '⛪', day: 3 },
      { id: 'm_10', name: 'Rahmat International Museum', category: 'Wildlife Gallery', vibe: 'activities', icon: '🦁', day: 3 },
      { id: 'm_11', name: 'Bolu Meranti Heritage', category: 'Authentic Delicacy', vibe: 'cafe', icon: '🍰', day: 3 },
      { id: 'm_12', name: 'Ucok Durian Night Plaza', category: 'Night Gastronomy', vibe: 'balanced', icon: '🌟', day: 3 },
    ],
  },
  jakarta: {
    1: [
      { id: 'j_1', name: 'Monas & Museum Nasional', category: 'National Monument', vibe: 'cultural', icon: '🏛️', day: 1 },
      { id: 'j_2', name: 'Cafe Batavia Kota Tua', category: 'Vintage Cafe', vibe: 'cafe', icon: '☕', day: 1 },
      { id: 'j_3', name: 'Museum MACAN Modern Art', category: 'Art & Exhibition', vibe: 'cultural', icon: '🖼️', day: 1 },
      { id: 'j_4', name: 'Bundaran HI Skyline Walk', category: 'City Center View', vibe: 'activities', icon: '🌃', day: 1 },
    ],
    2: [
      { id: 'j_5', name: 'Taman Mini Indonesia Indah', category: 'Cultural Nature Park', vibe: 'nature', icon: '🌲', day: 2 },
      { id: 'j_6', name: 'Tanamera Coffee Roastery', category: 'Specialty Coffee', vibe: 'cafe', icon: '☕', day: 2 },
      { id: 'j_7', name: 'Grand Indonesia Skybridge', category: 'Lifestyle & Mall', vibe: 'activities', icon: '🛍️', day: 2 },
      { id: 'j_8', name: 'Kuliner Pasar Santa', category: 'Street Food Center', vibe: 'balanced', icon: '🍜', day: 2 },
    ],
    3: [
      { id: 'j_9', name: 'Pantai Pasir Putih PIK 2', category: 'Coastal Promenade', vibe: 'nature', icon: '🏖️', day: 3 },
      { id: 'j_10', name: 'Museum Fatahillah Square', category: 'Colonial Heritage', vibe: 'cultural', icon: '🏛️', day: 3 },
      { id: 'j_11', name: 'Sarinah Sky Rooftop', category: 'Artisan Crafts & Sunset', vibe: 'activities', icon: '🌇', day: 3 },
      { id: 'j_12', name: 'Pecinan Petak Sembilan Glodok', category: 'Culinary Heritage', vibe: 'balanced', icon: '🏮', day: 3 },
    ],
  },
  bandung: {
    1: [
      { id: 'b_1', name: 'Gedung Sate & Museum Pos', category: 'Heritage Architecture', vibe: 'cultural', icon: '🏛️', day: 1 },
      { id: 'b_2', name: 'Kopi Toko Djawa Braga', category: 'Artisan Cafe', vibe: 'cafe', icon: '☕', day: 1 },
      { id: 'b_3', name: 'Taman Hutan Raya Djuanda', category: 'Pine Forest Trail', vibe: 'nature', icon: '🌲', day: 1 },
      { id: 'b_4', name: 'Jalan Riau Heritage Outlets', category: 'Fashion Shopping', vibe: 'activities', icon: '🛍️', day: 1 },
    ],
    2: [
      { id: 'b_5', name: 'Kawah Putih Ciwidey', category: 'Volcanic Crater Lake', vibe: 'nature', icon: '🌋', day: 2 },
      { id: 'b_6', name: 'Armor Kopi Dago Pakar', category: 'Nature Open Cafe', vibe: 'cafe', icon: '☕', day: 2 },
      { id: 'b_7', name: 'Perkebunan Teh Rancabali', category: 'Scenic Tea Valley', vibe: 'nature', icon: '🍃', day: 2 },
      { id: 'b_8', name: 'Paskal Food Market', category: 'Culinary Night Market', vibe: 'balanced', icon: '🍜', day: 2 },
    ],
    3: [
      { id: 'b_9', name: 'Tebing Keraton Sunrise', category: 'Highland Overlook', vibe: 'nature', icon: '🌄', day: 3 },
      { id: 'b_10', name: 'NuArt Sculpture Park', category: 'Contemporary Art', vibe: 'cultural', icon: '🗿', day: 3 },
      { id: 'b_11', name: 'Sudirman Street Night Bazaar', category: 'Culinary Walk', vibe: 'activities', icon: '🍢', day: 3 },
      { id: 'b_12', name: 'Ranca Upas Deer Sanctuary', category: 'Highland Nature Sanctuary', vibe: 'nature', icon: '🦌', day: 3 },
    ],
  },
};

export function getCityDaySpots(city: CityTheme, day: number): ItinerarySpot[] {
  const cityObj = CITY_ITINERARIES[city] || CITY_ITINERARIES.medan;
  if (cityObj[day]) return cityObj[day];
  const days = Object.keys(cityObj).map(Number);
  const maxDay = Math.max(...days);
  const cycleDay = ((day - 1) % maxDay) + 1;
  return cityObj[cycleDay] || cityObj[1];
}

const INDOOR_DESTINATIONS: Record<CityTheme, { name: string; cat: string }[]> = {
  medan: [
    { name: 'Sun Plaza Medan', cat: 'Indoor Shopping & Cafe' },
    { name: 'Museum Negeri Sumatera Utara', cat: 'Cultural Indoor Gallery' },
    { name: 'Delipark Mall Podomoro', cat: 'Lifestyle & Entertainment' },
    { name: 'Otten Coffee Experience', cat: 'Cozy Roastery Studio' },
  ],
  jakarta: [
    { name: 'Museum MACAN Modern Art', cat: 'Modern Art' },
    { name: 'Grand Indonesia Indoor Boulevard', cat: 'Lifestyle & Cafe' },
    { name: 'Perpustakaan Nasional RI', cat: 'Quiet Cultural Hub' },
    { name: 'Tanamera Coffee Roastery', cat: 'Indoor Specialty Cafe' },
  ],
  bandung: [
    { name: '23 Paskal Shopping Center', cat: 'Indoor Lifestyle Mall' },
    { name: 'Selasar Sunaryo Art Space', cat: 'Contemporary Gallery' },
    { name: 'Paris Van Java Resort Mall', cat: 'Indoor Sky Garden' },
    { name: 'Roemah Seni Sarasvati', cat: 'Art Exhibition & Cafe' },
  ],
};

export class GameEngine {
  public width: number = 800;
  public height: number = 450;
  public roadY: number = 140;
  public roadHeight: number = 230;
  public laneHeight: number = 76;

  public player1: PlayerState;
  public player2: PlayerState | null = null;
  public obstacles: Obstacle[] = [];
  public collectibles: Collectible[] = [];
  public particles: Particle[] = [];
  public floatingTexts: FloatingText[] = [];
  public storm: StormState;

  public settings: GameSettings;
  public currentCity: CityTheme = 'medan';
  public gameMode: GameMode = 'solo';
  public isIndoor: boolean = false;
  public indoorTransitionPct: number = 0;

  // Itinerary progression
  public currentDay: number = 1;
  public completedSpotIds: string[] = [];
  private spotSpawnIndex: number = 0;

  public baseSpeed: number = 270;
  public currentSpeed: number = 270;
  public runDistance: number = 0;
  public runTime: number = 0;
  public animTime: number = 0;
  public runCycle: number = 0;
  public isGameOver: boolean = false;

  private spawnTimer: number = 0;
  private minSpawnDistance: number = 1.35;
  private botReactionTimer: number = 0;

  // Callback hooks for UI
  public onGameOver?: (result: {
    winner: 'p1' | 'p2' | 'bot' | 'draw' | 'solo';
    dayReached: number;
    p1Stats: { score: number; distance: number; destinations: number; time: number };
    p2Stats?: { score: number; distance: number; destinations: number; time: number };
  }) => void;
  public onDestinationAchieved?: (info: {
    spotName: string;
    spotIcon: string;
    day: number;
    completedCount: number;
    totalCount: number;
  }) => void;
  public onDayCompleted?: (info: {
    completedDay: number;
    nextDay: number;
  }) => void;
  public onStormTrigger?: (storm: StormState) => void;
  public onStormComplete?: () => void;
  public onScoreChange?: () => void;

  constructor(settings: GameSettings) {
    this.settings = settings;
    this.currentCity = settings.selectedCity || 'medan';
    this.gameMode = settings.gameMode || 'solo';

    this.player1 = this.createPlayer('p1', 'P1', 'blue', false);
    if (this.gameMode === 'vs_bot') {
      this.player2 = this.createPlayer('p2', 'TinTin Bot', 'emerald', true);
    } else if (this.gameMode === 'pvp') {
      this.player2 = this.createPlayer('p2', 'P2', 'coral', false);
    }

    this.storm = this.createDefaultStorm();
  }

  private createPlayer(
    id: string,
    name: string,
    color: 'blue' | 'coral' | 'emerald' | 'purple',
    isBot: boolean
  ): PlayerState {
    const isP1 = id === 'p1';
    const initialLane: Lane = isP1 ? 1 : 2;
    const initialX = 130;
    return {
      id,
      name,
      isBot,
      color,
      x: initialX,
      lane: initialLane,
      targetLane: initialLane,
      laneTransitionProgress: 1,
      lives: 3,
      maxLives: 3,
      invincibleTimer: 0,
      isInvincible: false,
      score: 0,
      distance: 0,
      destinationsCollected: 0,
      coinsCollected: 0,
      starsCollected: 0,
      speedBoostTimer: 0,
      isAlive: true,
    };
  }

  private createDefaultStorm(): StormState {
    return {
      isActive: false,
      phase: 'idle',
      timer: 0,
      warningDuration: 0.6,
      freezeDuration: 1.0,
      rerouteDuration: 1.8,
      rewardDuration: 3.0,
      rerouteProgress: 0,
      nextStormIn: 22.0,
      selectedIndoorSpot: 'Sun Plaza Medan',
      indoorCategory: 'Indoor Shopping & Cafe',
      lightningFlash: 0,
    };
  }

  public resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    const isPortrait = height > width * 1.05;
    if (isPortrait) {
      // Mobile portrait layout: comfortable center road height
      this.roadHeight = Math.min(310, Math.max(220, height * 0.46));
      this.roadY = Math.floor((height - this.roadHeight) * 0.44);
    } else {
      // Landscape / Desktop PC layout
      this.roadHeight = Math.min(250, height * 0.48);
      this.roadY = Math.floor(height * 0.38);
    }
    this.laneHeight = this.roadHeight / 3;
  }

  public resetGame(city?: CityTheme, mode?: GameMode) {
    if (city) this.currentCity = city;
    if (mode) this.gameMode = mode;

    this.player1 = this.createPlayer('p1', 'P1', 'blue', false);
    if (this.gameMode === 'vs_bot') {
      this.player2 = this.createPlayer('p2', 'TinTin Bot', 'emerald', true);
    } else if (this.gameMode === 'pvp') {
      this.player2 = this.createPlayer('p2', 'P2', 'coral', false);
    } else {
      this.player2 = null;
    }

    this.currentDay = 1;
    this.completedSpotIds = [];
    this.spotSpawnIndex = 0;

    this.storm = this.createDefaultStorm();
    this.obstacles = [];
    this.collectibles = [];
    this.particles = [];
    this.floatingTexts = [];
    this.isIndoor = false;
    this.indoorTransitionPct = 0;
    this.currentSpeed = this.baseSpeed;
    this.runDistance = 0;
    this.runTime = 0;
    this.animTime = 0;
    this.runCycle = 0;
    this.spawnTimer = 0;
    this.botReactionTimer = 0;
    this.isGameOver = false;

    this.initParticles();
  }

  public addFloatingText(text: string, x: number, y: number, color: string, size: number = 14) {
    this.floatingTexts.push({
      id: `ft_${Date.now()}_${Math.random()}`,
      text,
      x,
      y,
      vy: -48,
      color,
      size,
      alpha: 1,
      life: 0.9,
      maxLife: 0.9,
    });
  }

  private updateFloatingTexts(dt: number) {
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.life -= dt;
      ft.alpha = Math.max(0, ft.life / ft.maxLife);
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  private initParticles() {
    this.particles = [];
    for (let i = 0; i < 40; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: -60 - Math.random() * 30,
        vy: 300 + Math.random() * 100,
        size: 1 + Math.random() * 1.5,
        color: 'rgba(59, 91, 255, 0.25)',
        alpha: 0.15 + Math.random() * 0.25,
        life: 1,
        maxLife: 1,
        type: 'rain',
      });
    }
  }

  // ── Input Handling (Pure 3-Lane Switching) ──
  public movePlayer1Lane(direction: 'up' | 'down') {
    if (this.isGameOver || !this.player1.isAlive) return;
    if (this.storm.phase === 'freeze' || this.storm.phase === 'rerouting') return;

    if (direction === 'up' && this.player1.targetLane > 0) {
      this.player1.targetLane = (this.player1.targetLane - 1) as Lane;
      this.player1.laneTransitionProgress = 0;
      sounds.playClick();
    } else if (direction === 'down' && this.player1.targetLane < 2) {
      this.player1.targetLane = (this.player1.targetLane + 1) as Lane;
      this.player1.laneTransitionProgress = 0;
      sounds.playClick();
    }
  }

  public movePlayer2Lane(direction: 'up' | 'down') {
    if (this.isGameOver || !this.player2 || !this.player2.isAlive || this.player2.isBot) return;
    if (this.storm.phase === 'freeze' || this.storm.phase === 'rerouting') return;

    if (direction === 'up' && this.player2.targetLane > 0) {
      this.player2.targetLane = (this.player2.targetLane - 1) as Lane;
      this.player2.laneTransitionProgress = 0;
      sounds.playClick();
    } else if (direction === 'down' && this.player2.targetLane < 2) {
      this.player2.targetLane = (this.player2.targetLane + 1) as Lane;
      this.player2.laneTransitionProgress = 0;
      sounds.playClick();
    }
  }

  public triggerManualStorm() {
    if (this.storm.phase === 'idle' && !this.isGameOver) {
      this.startStormSequence();
    }
  }

  private startStormSequence() {
    this.storm.isActive = true;
    this.storm.phase = 'warning';
    this.storm.timer = 0;
    this.storm.lightningFlash = 1.0;

    const spots = INDOOR_DESTINATIONS[this.currentCity] || INDOOR_DESTINATIONS.medan;
    const spot = spots[Math.floor(Math.random() * spots.length)];
    this.storm.selectedIndoorSpot = spot.name;
    this.storm.indoorCategory = spot.cat;

    sounds.playThunder();

    if (this.onStormTrigger) {
      this.onStormTrigger(this.storm);
    }
  }

  // ── Main Update Loop ──
  public update(dt: number) {
    if (this.isGameOver) return;

    this.animTime += dt;

    if (this.storm.isActive) {
      this.updateStormSequence(dt);
      if (this.storm.phase === 'freeze' || this.storm.phase === 'rerouting') {
        return;
      }
    } else {
      this.storm.nextStormIn -= dt;
      if (this.storm.nextStormIn <= 0) {
        this.startStormSequence();
      }
    }

    // Smooth, progressive speed scaling that builds gradually the longer the player survives
    const distanceSpeedInc = (this.runDistance / 1000) * 0.035; // +3.5% per 1,000 meters
    const timeSpeedInc = (this.runTime / 60) * 0.04;            // +4.0% per 60 seconds
    const daySpeedInc = (this.currentDay - 1) * 0.06;           // +6.0% per completed day
    const speedMultiplier = 1 + Math.min(2.0, distanceSpeedInc + timeSpeedInc + daySpeedInc);
    this.currentSpeed = this.baseSpeed * speedMultiplier;

    this.updatePlayer(this.player1, dt);

    if (this.player2) {
      if (this.player2.isBot && this.player2.isAlive) {
        this.updateBotAI(dt, speedMultiplier);
      }
      this.updatePlayer(this.player2, dt);
    }

    this.runTime += dt;
    this.runDistance += (this.currentSpeed * dt) / 10;
    this.player1.distance = Math.floor(this.runDistance);
    if (this.player2) {
      this.player2.distance = Math.floor(this.runDistance);
    }

    if (Math.floor(this.runTime) > Math.floor(this.runTime - dt)) {
      if (this.player1.isAlive) this.player1.score += 1;
      if (this.player2 && this.player2.isAlive) this.player2.score += 1;
      if (this.onScoreChange) this.onScoreChange();
    }

    this.spawnTimer += dt;
    const targetInterval = Math.max(0.85, 1.55 / Math.sqrt(speedMultiplier));
    if (this.spawnTimer >= targetInterval) {
      this.spawnTimer = 0;
      this.spawnEntities();
    }

    // Move Obstacles
    const moveX = this.currentSpeed * dt;
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.x -= moveX;

      if (obs.active) {
        // Test collision against player physically closest to the incoming obstacle first
        const activePlayers = [this.player1, this.player2]
          .filter((p): p is PlayerState => !!p && p.isAlive)
          .sort((a, b) => b.x - a.x);

        for (const p of activePlayers) {
          if (!obs.active) break;
          this.checkCollision(p, obs);
        }
      }

      if (obs.x < -120) {
        this.obstacles.splice(i, 1);
      }
    }

    // Move Collectibles
    for (let i = this.collectibles.length - 1; i >= 0; i--) {
      const col = this.collectibles[i];
      col.x -= moveX;

      if (col.active) {
        // Collectible reached by player physically closest to it first
        const activePlayers = [this.player1, this.player2]
          .filter((p): p is PlayerState => !!p && p.isAlive)
          .sort((a, b) => b.x - a.x);

        for (const p of activePlayers) {
          if (!col.active) break;
          this.checkPickup(p, col);
        }
      }

      if (col.x < -120) {
        this.collectibles.splice(i, 1);
      }
    }

    // Update Particles & Floating Texts
    this.updateParticles(dt);
    this.updateFloatingTexts(dt);

    if (this.isIndoor && this.indoorTransitionPct < 1) {
      this.indoorTransitionPct = Math.min(1, this.indoorTransitionPct + dt * 1.6);
    } else if (!this.isIndoor && this.indoorTransitionPct > 0) {
      this.indoorTransitionPct = Math.max(0, this.indoorTransitionPct - dt * 1.6);
    }

    this.checkGameEnd();
  }

  private updatePlayer(p: PlayerState, dt: number) {
    if (!p.isAlive) return;

    this.runCycle += dt * (this.currentSpeed / 100);

    if (p.laneTransitionProgress < 1) {
      p.laneTransitionProgress = Math.min(1, p.laneTransitionProgress + dt * 10);
      if (p.laneTransitionProgress >= 1) {
        p.lane = p.targetLane;
      }
    }

    if (p.isInvincible) {
      p.invincibleTimer -= dt;
      if (p.invincibleTimer <= 0) {
        p.isInvincible = false;
      }
    }

    if (p.speedBoostTimer > 0) {
      p.speedBoostTimer -= dt;
    }
  }

  private updateBotAI(dt: number, speedMultiplier: number = 1) {
    const bot = this.player2;
    if (!bot || !bot.isAlive) return;

    this.botReactionTimer += dt;
    // Humanized reaction time (~0.35s) so the bot does not instantly out-react the player
    if (this.botReactionTimer < 0.35) return;
    this.botReactionTimer = 0;

    const currentLane = bot.targetLane;
    // Balanced lookahead that gives a natural sense of anticipation
    const lookahead = Math.min(270, 180 * Math.sqrt(speedMultiplier));

    // Check danger in bot's current lane ahead
    const immediateThreat = this.obstacles.find(
      (o) => o.active && o.lane === currentLane && o.x > bot.x - 10 && o.x < bot.x + lookahead
    );

    const isLaneSafe = (lane: Lane) => {
      return !this.obstacles.some(
        (o) => o.active && o.lane === lane && o.x > bot.x - 20 && o.x < bot.x + lookahead + 25
      );
    };

    if (immediateThreat) {
      // Natural hesitation at high speeds (~10% chance) so the bot faces realistic survival pressure
      if (speedMultiplier > 1.3 && Math.random() < 0.10) {
        return; // slight hesitation
      }

      // Must dodge to a safe lane
      const candidateLanes: Lane[] = [];
      if (currentLane > 0) candidateLanes.push((currentLane - 1) as Lane);
      if (currentLane < 2) candidateLanes.push((currentLane + 1) as Lane);

      const safeLanes = candidateLanes.filter(isLaneSafe);

      if (safeLanes.length > 0) {
        let bestLane = safeLanes[0];
        let bestVal = -1;

        for (const lane of safeLanes) {
          let val = 1;
          const col = this.collectibles.find(
            (c) => c.active && c.lane === lane && c.x > bot.x - 10 && c.x < bot.x + 220
          );
          if (col) {
            if (col.type === 'destination') val = 40;
            else if (col.type === 'star') val = 25;
            else if (col.type === 'coin') val = 10;
          }
          if (val > bestVal) {
            bestVal = val;
            bestLane = lane;
          }
        }

        bot.targetLane = bestLane;
        bot.laneTransitionProgress = 0;
      }
    } else {
      // Current lane is safe.
      // FAIR PLAY: The bot only switches lanes for items occasionally (35% chance)
      // and NEVER jumps into Player 1's active lane to steal their items!
      if (Math.random() < 0.35) {
        const candidateLanes: Lane[] = [];
        if (currentLane > 0) candidateLanes.push((currentLane - 1) as Lane);
        if (currentLane < 2) candidateLanes.push((currentLane + 1) as Lane);

        for (const lane of candidateLanes) {
          if (!isLaneSafe(lane)) continue;

          // Never steal Player 1's line!
          if (this.player1.isAlive && (this.player1.lane === lane || this.player1.targetLane === lane)) {
            continue;
          }

          const col = this.collectibles.find(
            (c) => c.active && c.lane === lane && c.x > bot.x + 60 && c.x < bot.x + 240
          );

          if (col && (col.type === 'destination' || col.type === 'star')) {
            bot.targetLane = lane;
            bot.laneTransitionProgress = 0;
            break;
          }
        }
      }
    }
  }

  private updateStormSequence(dt: number) {
    this.storm.timer += dt;

    if (this.storm.lightningFlash > 0) {
      this.storm.lightningFlash = Math.max(0, this.storm.lightningFlash - dt * 3);
    }

    if (this.storm.phase === 'warning') {
      if (this.storm.timer >= this.storm.warningDuration) {
        this.storm.phase = 'freeze';
        this.storm.timer = 0;
        sounds.playAiDing();
      }
    } else if (this.storm.phase === 'freeze') {
      if (this.storm.timer >= this.storm.freezeDuration) {
        this.storm.phase = 'rerouting';
        this.storm.timer = 0;
        this.storm.rerouteProgress = 0;
      }
    } else if (this.storm.phase === 'rerouting') {
      this.storm.rerouteProgress = Math.min(1, this.storm.timer / this.storm.rerouteDuration);
      if (this.storm.timer >= this.storm.rerouteDuration) {
        this.storm.phase = 'indoor_transition';
        this.storm.timer = 0;
        this.isIndoor = true;
        sounds.playAiRerouteSuccess();

        this.obstacles = [];
        this.spawnIndoorCelebrationPack();
      }
    } else if (this.storm.phase === 'indoor_transition') {
      if (this.storm.timer >= 1.2) {
        this.storm.phase = 'reward';
        this.storm.timer = 0;

        if (this.player1.isAlive) {
          this.player1.isInvincible = true;
          this.player1.invincibleTimer = 3.0;
          this.player1.speedBoostTimer = 3.0;
          this.player1.score += 50;
        }
        if (this.player2 && this.player2.isAlive) {
          this.player2.isInvincible = true;
          this.player2.invincibleTimer = 3.0;
          this.player2.speedBoostTimer = 3.0;
          this.player2.score += 50;
        }

        if (this.onScoreChange) this.onScoreChange();
      }
    } else if (this.storm.phase === 'reward') {
      if (this.storm.timer >= this.storm.rewardDuration) {
        this.storm.phase = 'idle';
        this.storm.isActive = false;
        this.storm.nextStormIn = 24.0;

        if (this.onStormComplete) {
          this.onStormComplete();
        }

        setTimeout(() => {
          this.isIndoor = false;
        }, 12000);
      }
    }
  }

  private spawnEntities() {
    const availableLanes: Lane[] = [0, 1, 2];
    const blockedLane = Math.floor(Math.random() * 3) as Lane;

    const types: ObstacleType[] = ['tourist_crowd', 'construction', 'water_hazard', 'luggage_pile'];
    const obsType = types[Math.floor(Math.random() * types.length)];

    this.obstacles.push({
      id: `obs_${Date.now()}_${Math.random()}`,
      type: obsType,
      lane: blockedLane,
      x: this.width + 80,
      width: 52,
      height: this.laneHeight,
      active: true,
    });

    const freeLanes = availableLanes.filter((l) => l !== blockedLane);

    const spawnItemInLane = (lane: Lane, offsetX: number = 0) => {
      const cRand = Math.random();
      if (cRand < 0.45) {
        const cityDaySpots = getCityDaySpots(this.currentCity, this.currentDay);
        const spot = cityDaySpots[this.spotSpawnIndex % cityDaySpots.length];
        this.spotSpawnIndex++;

        this.collectibles.push({
          id: `spot_${spot.id}_${Date.now()}_${Math.random()}`,
          type: 'destination',
          vibe: spot.vibe,
          vibeName: spot.category,
          spotName: spot.name,
          spotIcon: spot.icon,
          lane,
          x: this.width + 120 + offsetX,
          value: 25,
          active: true,
          scale: 1.1,
          rotation: 0,
        });
      } else if (cRand < 0.75) {
        this.collectibles.push({
          id: `col_${Date.now()}_${Math.random()}`,
          type: 'coin',
          lane,
          x: this.width + 100 + offsetX,
          value: 5,
          active: true,
          scale: 1,
          rotation: 0,
        });
      } else {
        this.collectibles.push({
          id: `col_${Date.now()}_${Math.random()}`,
          type: 'star',
          lane,
          x: this.width + 100 + offsetX,
          value: 15,
          active: true,
          scale: 1,
          rotation: 0,
        });
      }
    };

    // Spawn collectible in first free lane
    if (freeLanes.length > 0) {
      spawnItemInLane(freeLanes[0], 0);
    }

    // In 2-player modes (Vs Bot or PvP), also spawn in second free lane with slight offset
    // so both players have an equal, balanced opportunity to collect points!
    if (this.gameMode !== 'solo' && freeLanes.length > 1) {
      spawnItemInLane(freeLanes[1], 40);
    }
  }

  private spawnIndoorCelebrationPack() {
    const cityDaySpots = getCityDaySpots(this.currentCity, this.currentDay);
    for (let i = 0; i < 6; i++) {
      const spot = cityDaySpots[i % cityDaySpots.length];
      this.collectibles.push({
        id: `bonus_${i}_${Date.now()}`,
        type: i % 2 === 0 ? 'destination' : 'star',
        vibe: spot.vibe,
        vibeName: spot.category,
        spotName: spot.name,
        spotIcon: spot.icon,
        lane: (i % 3) as Lane,
        x: this.width + 100 + i * 130,
        value: i % 2 === 0 ? 30 : 15,
        active: true,
        scale: 1.15,
        rotation: 0,
      });
    }
  }

  private checkCollision(p: PlayerState, obs: Obstacle) {
    if (!obs.active || !p.isAlive || p.isInvincible) return;

    const pX = p.x;
    const pY = this.getPlayerRenderY(p);
    const obsCenterY = this.getLaneCenterY(obs.lane);

    // Collision check based on player's true position
    if (Math.abs(obs.x - pX) > 30) return;
    if (Math.abs(pY - obsCenterY) > this.laneHeight * 0.40) return;

    obs.active = false;
    p.lives -= 1;
    p.isInvincible = true;
    p.invincibleTimer = 1.8; // Generous i-frames to recover

    sounds.playHit();
    this.createImpactSparks(pX, pY);
    this.addFloatingText('-1 ❤️', pX, pY - 24, '#EF4444', 16);

    if (p.lives <= 0) {
      p.isAlive = false;
      this.addFloatingText('OUT! 💀', pX, pY - 40, '#94A3B8', 18);
    }

    if (this.onScoreChange) this.onScoreChange();
  }

  private checkPickup(p: PlayerState, col: Collectible): boolean {
    if (!col.active || !p.isAlive) return false;

    const pX = p.x;
    const pY = this.getPlayerRenderY(p);
    const colCenterY = this.getLaneCenterY(col.lane);

    // Distance-based horizontal pickup window
    if (Math.abs(col.x - pX) > 30) return false;

    // Vertical lane matching based on player's true vertical render position
    if (Math.abs(pY - colCenterY) > this.laneHeight * 0.42) return false;

    col.active = false;
    p.score += col.value;

    if (col.type === 'coin') {
      p.coinsCollected += 1;
      sounds.playCoin();
      this.addFloatingText(`+${col.value}`, pX, pY - 22, '#FBBF24', 14);
    } else if (col.type === 'star') {
      p.starsCollected += 1;
      p.speedBoostTimer = 2.5;
      sounds.playStar();
      this.addFloatingText(`+${col.value} BOOST!`, pX, pY - 22, '#A855F7', 15);
    } else if (col.type === 'destination') {
      p.destinationsCollected += 1;
      sounds.playDestination();
      this.addFloatingText(`+${col.value} 📍`, pX, pY - 24, '#3B5BFF', 15);

      if (col.spotName) {
        if (!this.completedSpotIds.includes(col.spotName)) {
          this.completedSpotIds.push(col.spotName);
        }

        const cityDaySpots = getCityDaySpots(this.currentCity, this.currentDay);
        const totalInDay = cityDaySpots.length;

        if (this.onDestinationAchieved) {
          this.onDestinationAchieved({
            spotName: col.spotName,
            spotIcon: col.spotIcon || '📍',
            day: this.currentDay,
            completedCount: this.completedSpotIds.length,
            totalCount: totalInDay,
          });
        }

        if (this.completedSpotIds.length >= totalInDay) {
          const completedDay = this.currentDay;
          this.currentDay++;
          this.completedSpotIds = [];

          // Fair reward for all active surviving players (Score only - strict permanent life depletion)
          if (this.player1.isAlive) {
            this.player1.score += 100;
            this.addFloatingText('+100 XP CLEAR!', this.player1.x, this.getPlayerRenderY(this.player1) - 36, '#F59E0B', 16);
          }
          if (this.player2 && this.player2.isAlive) {
            this.player2.score += 100;
            this.addFloatingText('+100 XP CLEAR!', this.player2.x, this.getPlayerRenderY(this.player2) - 36, '#F59E0B', 16);
          }

          sounds.playHighScore();

          if (this.onDayCompleted) {
            this.onDayCompleted({
              completedDay,
              nextDay: this.currentDay,
            });
          }
        }
      }
    }

    this.createSparkles(col.x, colCenterY, col.type);
    if (this.onScoreChange) this.onScoreChange();
    return true;
  }

  private checkGameEnd() {
    if (this.isGameOver) return;

    if (this.gameMode === 'solo') {
      if (!this.player1.isAlive) {
        this.triggerGameOver('solo');
      }
    } else {
      const p1Dead = !this.player1.isAlive;
      const p2Dead = !this.player2 || !this.player2.isAlive;

      if (p1Dead && p2Dead) {
        const p1Score = this.player1.score;
        const p2Score = this.player2 ? this.player2.score : 0;
        const winner =
          p1Score > p2Score ? 'p1' : p2Score > p1Score ? (this.player2?.isBot ? 'bot' : 'p2') : 'draw';
        this.triggerGameOver(winner);
      } else if (p1Dead) {
        this.triggerGameOver(this.player2?.isBot ? 'bot' : 'p2');
      } else if (p2Dead) {
        this.triggerGameOver('p1');
      }
    }
  }

  private triggerGameOver(winner: 'p1' | 'p2' | 'bot' | 'draw' | 'solo') {
    this.isGameOver = true;
    sounds.playGameOver();

    if (this.onGameOver) {
      this.onGameOver({
        winner,
        dayReached: this.currentDay,
        p1Stats: {
          score: this.player1.score,
          distance: this.player1.distance,
          destinations: this.player1.destinationsCollected,
          time: Math.floor(this.runTime),
        },
        p2Stats: this.player2
          ? {
              score: this.player2.score,
              distance: this.player2.distance,
              destinations: this.player2.destinationsCollected,
              time: Math.floor(this.runTime),
            }
          : undefined,
      });
    }
  }

  public getLaneCenterY(lane: number): number {
    return this.roadY + lane * this.laneHeight + this.laneHeight * 0.5;
  }

  private getPlayerRenderY(p: PlayerState): number {
    const startY = this.getLaneCenterY(p.lane);
    const endY = this.getLaneCenterY(p.targetLane);
    const t = p.laneTransitionProgress;
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    return startY + (endY - startY) * ease;
  }

  private createSparkles(x: number, y: number, type: string) {
    const colors = type === 'star' ? ['#FACC15', '#A855F7', '#FFFFFF'] : ['#FDE047', '#3B5BFF', '#FFFFFF'];
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + Math.random() * 0.5;
      const speed = 60 + Math.random() * 120;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 3.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0.45,
        maxLife: 0.45,
        type: 'sparkle',
      });
    }
  }

  private createImpactSparks(x: number, y: number) {
    for (let i = 0; i < 14; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 260,
        vy: (Math.random() - 0.5) * 260,
        size: 3.5 + Math.random() * 3.5,
        color: Math.random() > 0.5 ? '#EF4444' : '#F97316',
        alpha: 1,
        life: 0.4,
        maxLife: 0.4,
        type: 'splash',
      });
    }
  }

  private updateParticles(dt: number) {
    const isStormWarning = this.storm.phase === 'warning' || this.storm.phase === 'freeze';
    const rainSpeed = isStormWarning ? 650 : this.isIndoor ? 80 : 320;
    const rainAlpha = this.isIndoor ? 0.05 : isStormWarning ? 0.7 : 0.25;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      if (p.type === 'rain') {
        p.x += p.vx * dt;
        p.y += rainSpeed * dt;
        p.alpha = rainAlpha;

        if (p.y > this.height) {
          p.y = -10;
          p.x = Math.random() * (this.width + 100);
        }
      } else {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        p.alpha = Math.max(0, p.life / p.maxLife);

        if (p.life <= 0) {
          this.particles.splice(i, 1);
        }
      }
    }
  }

  // ── Render ──
  public render(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);

    const isStormy = this.storm.phase === 'warning' || this.storm.phase === 'freeze';

    // 1. Light Theme Parallax Background
    drawBackground(
      ctx,
      this.width,
      this.height,
      this.runDistance,
      this.currentCity,
      this.isIndoor,
      this.indoorTransitionPct,
      this.animTime,
      isStormy
    );

    // 2. Light Theme 3-Lane Track (Lifted higher up)
    drawTrack(
      ctx,
      this.width,
      this.roadY,
      this.roadHeight,
      this.runDistance,
      this.player1.targetLane,
      this.player2 ? this.player2.targetLane : null,
      this.isIndoor
    );

    // 3. Decorative City Promenade / Travel Sidewalk Below the 3 Lanes
    const promenadeY = this.roadY + this.roadHeight;
    const promenadeHeight = Math.max(20, this.height - promenadeY);
    drawPromenade(
      ctx,
      this.width,
      promenadeY,
      promenadeHeight,
      this.runDistance,
      this.currentCity,
      this.isIndoor
    );

    // 4. Obstacles & Tourism Checkpoints (Z-sorted by lane)
    for (let lane = 0; lane < 3; lane++) {
      this.obstacles
        .filter((o) => o.lane === lane && o.active)
        .forEach((obs) => {
          ctx.save();
          const laneY = this.roadY + obs.lane * this.laneHeight;
          ctx.translate(0, laneY);
          drawObstacle(ctx, obs, this.animTime);
          ctx.restore();
        });

      this.collectibles
        .filter((c) => c.lane === lane && c.active)
        .forEach((col) => {
          const centerY = this.getLaneCenterY(col.lane);
          drawCollectible(ctx, col, centerY, this.animTime);
        });

      // Render Player 1 if in this lane
      if (this.player1.isAlive && (this.player1.lane === lane || this.player1.targetLane === lane)) {
        const p1Y = this.getPlayerRenderY(this.player1);
        drawPlayer(
          ctx,
          this.player1,
          this.player1.x,
          p1Y,
          this.runCycle,
          this.player1.isInvincible,
          this.player1.invincibleTimer
        );
      }

      // Render Player 2 / Bot if in this lane
      if (
        this.player2 &&
        this.player2.isAlive &&
        (this.player2.lane === lane || this.player2.targetLane === lane)
      ) {
        const p2Y = this.getPlayerRenderY(this.player2);
        drawPlayer(
          ctx,
          this.player2,
          this.player2.x,
          p2Y,
          this.runCycle,
          this.player2.isInvincible,
          this.player2.invincibleTimer
        );
      }
    }

    // 5. Particles
    ctx.save();
    this.particles.forEach((p) => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      if (p.type === 'rain') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 5, p.y + 12);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();

    // 6. Floating Feedback Texts (+Score, +Heart, +Boost, -1 Heart)
    ctx.save();
    for (const ft of this.floatingTexts) {
      ctx.globalAlpha = ft.alpha;
      ctx.font = `bold ${ft.size}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Dark shadow for crystal-clear readability
      ctx.fillStyle = 'rgba(11, 16, 32, 0.75)';
      ctx.fillText(ft.text, ft.x + 1, ft.y + 1);

      ctx.fillStyle = ft.color;
      ctx.fillText(ft.text, ft.x, ft.y);
    }
    ctx.restore();

    // 7. Lightning Flash Screen VFX
    if (this.storm.lightningFlash > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${this.storm.lightningFlash * 0.7})`;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }
  }
}
