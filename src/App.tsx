import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Zap,
  Trophy,
  Compass,
  Heart,
  QrCode,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  Info,
  CloudRain,
  MapPin,
  Flame,
  Award,
  ExternalLink,
  Play,
  Users,
  Bot,
  User,
  Crown,
  CheckCircle2,
  Calendar,
  Navigation,
  ArrowLeft,
  Settings2,
  WifiOff,
  Download,
} from 'lucide-react';
import { GameEngine, CITY_ITINERARIES } from './engine';
import { sounds } from './audio';
import type { CityTheme, GameMode, GamePhase, GameSettings, LeaderboardEntry, StormState } from './types';

const LEADERBOARD_KEY = 'pavey_beat_the_storm_leaderboard';
const PAVEY_APP_URL = 'https://frontend-sage-ten-29.vercel.app/';

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'TIN', score: 1540, distance: 980, destinations: 18, timeSurvived: 82, date: '2026-08-21', city: 'medan', mode: 'solo', dayReached: 2 },
  { id: '2', name: 'PAV', score: 1260, distance: 820, destinations: 14, timeSurvived: 68, date: '2026-08-21', city: 'jakarta', mode: 'vs_bot', dayReached: 2 },
  { id: '3', name: 'DEV', score: 980, distance: 640, destinations: 11, timeSurvived: 54, date: '2026-08-21', city: 'bandung', mode: 'pvp', dayReached: 1 },
  { id: '4', name: 'ALX', score: 810, distance: 530, destinations: 9, timeSurvived: 45, date: '2026-08-21', city: 'medan', mode: 'solo', dayReached: 1 },
  { id: '5', name: 'SAM', score: 650, distance: 430, destinations: 7, timeSurvived: 36, date: '2026-08-21', city: 'jakarta', mode: 'vs_bot', dayReached: 1 },
];

function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load leaderboard', e);
  }
  return DEFAULT_LEADERBOARD;
}

function saveLeaderboard(entries: LeaderboardEntry[]) {
  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save leaderboard', e);
  }
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Game UI States
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [boothMode, setBoothMode] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<CityTheme>('medan');

  // Player 1 state
  const [p1Lives, setP1Lives] = useState<number>(3);
  const [p1Score, setP1Score] = useState<number>(0);
  const [p1Distance, setP1Distance] = useState<number>(0);
  const [p1Destinations, setP1Destinations] = useState<number>(0);

  // Player 2 / Bot state
  const [p2Lives, setP2Lives] = useState<number>(3);
  const [p2Score, setP2Score] = useState<number>(0);

  // Itinerary & Day Progression UI
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [activeToast, setActiveToast] = useState<{ title: string; subtitle: string; icon: string } | null>(null);
  const [dayUnlockBanner, setDayUnlockBanner] = useState<{ day: number } | null>(null);

  const [activeStorm, setActiveStorm] = useState<StormState | null>(null);
  const [showBriefing, setShowBriefing] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [showModeDropdown, setShowModeDropdown] = useState<boolean>(false);

  // Leaderboard & Result
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(loadLeaderboard);
  const [initials, setInitials] = useState<string[]>(['T', 'I', 'N']);
  const [activeInitialIndex, setActiveInitialIndex] = useState<number>(0);
  const [gameResult, setGameResult] = useState<{
    winner: 'p1' | 'p2' | 'bot' | 'draw' | 'solo';
    dayReached: number;
    p1Stats: { score: number; distance: number; destinations: number; time: number };
    p2Stats?: { score: number; distance: number; destinations: number; time: number };
  } | null>(null);
  const [savedRank, setSavedRank] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredInstallPrompt(null);
    }
  };

  // Initialize Game Engine
  useEffect(() => {
    const settings: GameSettings = {
      soundEnabled: soundOn,
      hapticsEnabled: true,
      boothMode,
      selectedCity,
      gameMode,
      autoCycleCity: true,
    };

    const engine = new GameEngine(settings);
    engineRef.current = engine;

    engine.onScoreChange = () => {
      setP1Score(engine.player1.score);
      setP1Distance(engine.player1.distance);
      setP1Destinations(engine.player1.destinationsCollected);
      setP1Lives(engine.player1.lives);
      setCurrentDay(engine.currentDay);

      if (engine.player2) {
        setP2Score(engine.player2.score);
        setP2Lives(engine.player2.lives);
      }
    };

    engine.onDestinationAchieved = (info) => {
      setActiveToast({
        title: `${info.spotIcon} ${info.spotName} Tercapai!`,
        subtitle: `Rute Wisata Hari ${info.day} (${info.completedCount}/${info.totalCount} Spot)`,
        icon: info.spotIcon,
      });
      setTimeout(() => {
        setActiveToast(null);
      }, 2800);
    };

    engine.onDayCompleted = (info) => {
      setDayUnlockBanner({ day: info.nextDay });
      sounds.playHighScore();
      setTimeout(() => {
        setDayUnlockBanner(null);
      }, 3800);
    };

    engine.onStormTrigger = (stormState) => {
      setActiveStorm({ ...stormState });
    };

    engine.onStormComplete = () => {
      setActiveStorm(null);
    };

    engine.onGameOver = (result) => {
      setGameResult(result);
      setPhase('gameover');
      sounds.playGameOver();
    };

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  // Sync settings
  useEffect(() => {
    sounds.setEnabled(soundOn);
    if (engineRef.current) {
      engineRef.current.settings.soundEnabled = soundOn;
      engineRef.current.settings.boothMode = boothMode;
      engineRef.current.currentCity = selectedCity;
      engineRef.current.gameMode = gameMode;
    }
  }, [soundOn, boothMode, selectedCity, gameMode]);

  // Main Canvas Animation Loop
  const loop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = Math.min(0.1, (timestamp - lastTimeRef.current) / 1000);
    lastTimeRef.current = timestamp;

    const canvas = canvasRef.current;
    const engine = engineRef.current;

    if (canvas && engine) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const targetWidth = Math.floor(rect.width * dpr);
        const targetHeight = Math.floor(rect.height * dpr);

        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          engine.resize(targetWidth, targetHeight);
        }

        engine.update(dt);
        engine.render(ctx);

        if (engine.storm.isActive) {
          setActiveStorm({ ...engine.storm });
        } else if (activeStorm) {
          setActiveStorm(null);
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(loop);
  }, [activeStorm]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [loop]);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const engine = engineRef.current;
      if (!engine) return;

      if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        if (phase === 'playing') engine.movePlayer1Lane('up');
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        if (phase === 'playing') engine.movePlayer1Lane('down');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (phase === 'playing') {
          if (gameMode === 'pvp') {
            engine.movePlayer2Lane('up');
          } else {
            engine.movePlayer1Lane('up');
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (phase === 'playing') {
          if (gameMode === 'pvp') {
            engine.movePlayer2Lane('down');
          } else {
            engine.movePlayer1Lane('down');
          }
        }
      } else if (e.key === 'PageUp' || e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        if (phase === 'playing' && gameMode === 'pvp') engine.movePlayer2Lane('up');
      } else if (e.key === 'PageDown' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        if (phase === 'playing' && gameMode === 'pvp') engine.movePlayer2Lane('down');
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (phase === 'idle') startGame();
      } else if (e.key === 'b' || e.key === 'B') {
        engine.triggerManualStorm();
      } else if (e.key === 'r' || e.key === 'R') {
        if (phase === 'gameover' || phase === 'leaderboard') startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, gameMode]);

  const startGame = () => {
    if (!engineRef.current) return;
    setShowModeDropdown(false);
    engineRef.current.resetGame(selectedCity, gameMode);
    setP1Lives(3);
    setP1Score(0);
    setP1Distance(0);
    setP1Destinations(0);
    setP2Lives(3);
    setP2Score(0);
    setCurrentDay(1);
    setActiveToast(null);
    setDayUnlockBanner(null);
    setActiveStorm(null);
    setSavedRank(null);
    setPhase('playing');
    sounds.playClick();
  };

  const backToModeSelection = () => {
    setShowModeDropdown(false);
    setPhase('idle');
    sounds.playClick();
  };

  const switchModeAndRestart = (newMode: GameMode) => {
    setGameMode(newMode);
    setShowModeDropdown(false);
    if (phase === 'playing') {
      if (engineRef.current) {
        engineRef.current.resetGame(selectedCity, newMode);
        setP1Lives(3);
        setP1Score(0);
        setP1Distance(0);
        setP1Destinations(0);
        setP2Lives(3);
        setP2Score(0);
        setCurrentDay(1);
        setActiveToast(null);
        setDayUnlockBanner(null);
        setActiveStorm(null);
      }
    }
  };

  const handleSaveScore = () => {
    if (!gameResult) return;
    const name = initials.join('');
    const newEntry: LeaderboardEntry = {
      id: String(Date.now()),
      name: name || 'TIN',
      score: gameResult.p1Stats.score,
      distance: gameResult.p1Stats.distance,
      destinations: gameResult.p1Stats.destinations,
      timeSurvived: gameResult.p1Stats.time,
      date: new Date().toISOString().split('T')[0],
      city: selectedCity,
      mode: gameMode,
      dayReached: gameResult.dayReached,
    };

    const updated = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setLeaderboard(updated);
    saveLeaderboard(updated);

    const rank = updated.findIndex((e) => e.id === newEntry.id) + 1;
    setSavedRank(rank > 0 ? rank : null);
    setPhase('leaderboard');
    sounds.playHighScore();
  };

  const cycleInitial = (direction: 'up' | 'down') => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const currentChar = initials[activeInitialIndex];
    const currentIndex = chars.indexOf(currentChar);
    let nextIndex = direction === 'up' ? currentIndex + 1 : currentIndex - 1;
    if (nextIndex >= chars.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = chars.length - 1;

    const nextInitials = [...initials];
    nextInitials[activeInitialIndex] = chars[nextIndex];
    setInitials(nextInitials);
    sounds.playClick();
  };

  const openPaveyApp = () => {
    window.open(PAVEY_APP_URL, '_blank');
  };

  const currentCityItinerary = CITY_ITINERARIES[selectedCity]?.[1] || CITY_ITINERARIES.medan[1];

  return (
    <div className="min-h-[100dvh] h-[100dvh] bg-zinc-950 flex justify-center items-center font-sans select-none antialiased overflow-hidden p-0 sm:p-4">
      {/* ── PHONE FRAME CONTAINER (100% RESPONSIVE MOBILE & PC) ── */}
      <div
        className={`w-full flex flex-col bg-[#F6F8FC] relative overflow-hidden transition-all duration-300 ${
          boothMode
            ? 'max-w-5xl h-full sm:h-[88vh] shadow-[0_0_80px_rgba(59,91,255,0.3)] rounded-none sm:rounded-3xl border sm:border-ink-200'
            : 'max-w-[440px] h-full sm:h-[92vh] shadow-[0_0_60px_rgba(0,0,0,0.5)] rounded-none sm:rounded-[36px] border sm:border-ink-200'
        }`}
      >
        {/* ── TOP HEADER BAR (RESPONSIVE FOR MOBILE & PC) ── */}
        <header className="relative z-30 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 bg-white/95 backdrop-blur-xl border-b border-ink-100 shadow-sm text-ink-900 shrink-0">
          <div className="flex items-center gap-2">
            {/* Back to mode selection button (When playing) */}
            {phase === 'playing' ? (
              <button
                onClick={backToModeSelection}
                className="p-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 flex items-center gap-1 text-xs font-black press"
                title="Kembali ke Pemilihan Mode"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden xs:inline">Mode</span>
              </button>
            ) : (
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-brand-500 shadow-sm flex items-center justify-center shrink-0">
                <img src="/mascot.svg" alt="TinTin" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-1">
                <span className="font-display font-black text-xs sm:text-sm text-ink-900 tracking-tight">Beat Storm</span>
                <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black uppercase bg-brand-50 text-brand-600 border border-brand-100">
                  3L
                </span>
              </div>
              <p className="text-[9px] text-ink-500 font-semibold truncate hidden xs:block">Pavey Weather Game</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Mode Switcher Pill in Top Bar */}
            <div className="relative">
              <button
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="px-2 py-1 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 flex items-center gap-1 text-[11px] font-black press shadow-sm"
                title="Ganti Mode Permainan"
              >
                {gameMode === 'solo' ? (
                  <>
                    <User className="w-3 h-3 text-brand-600" />
                    <span>Solo</span>
                  </>
                ) : gameMode === 'vs_bot' ? (
                  <>
                    <Bot className="w-3 h-3 text-emerald-600" />
                    <span>Vs Bot</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3 text-orange-600" />
                    <span>1v1</span>
                  </>
                )}
                <ChevronDown className="w-3 h-3 ml-0.5 text-brand-500" />
              </button>

              {/* Mode Dropdown Popover */}
              <AnimatePresence>
                {showModeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-2xl p-2 shadow-2xl border-2 border-brand-500 z-50 text-ink-900"
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider text-ink-400 block px-2 py-1">
                      PILIH MODE:
                    </span>
                    <button
                      onClick={() => switchModeAndRestart('solo')}
                      className={`w-full text-left p-2 rounded-xl flex items-center gap-2 transition ${
                        gameMode === 'solo' ? 'bg-brand-50 text-brand-700 font-black' : 'hover:bg-ink-50 text-ink-700 font-bold'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 text-brand-600" />
                      <div className="text-xs">
                        <div>Mode Solo</div>
                        <div className="text-[9px] text-ink-400 font-medium">Rekor Highscore</div>
                      </div>
                    </button>

                    <button
                      onClick={() => switchModeAndRestart('vs_bot')}
                      className={`w-full text-left p-2 rounded-xl flex items-center gap-2 transition ${
                        gameMode === 'vs_bot' ? 'bg-brand-50 text-brand-700 font-black' : 'hover:bg-ink-50 text-ink-700 font-bold'
                      }`}
                    >
                      <Bot className="w-3.5 h-3.5 text-emerald-600" />
                      <div className="text-xs">
                        <div>Vs AI Bot</div>
                        <div className="text-[9px] text-ink-400 font-medium">Balapan Bot Pintar</div>
                      </div>
                    </button>

                    <button
                      onClick={() => switchModeAndRestart('pvp')}
                      className={`w-full text-left p-2 rounded-xl flex items-center gap-2 transition ${
                        gameMode === 'pvp' ? 'bg-brand-50 text-brand-700 font-black' : 'hover:bg-ink-50 text-ink-700 font-bold'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-orange-600" />
                      <div className="text-xs">
                        <div>1 vs 1 Teman</div>
                        <div className="text-[9px] text-ink-400 font-medium">2 Pemain 1 Layar</div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* City Selector (Locked during gameplay) */}
            {phase === 'playing' ? (
              <div
                className="flex items-center gap-1 bg-ink-100/90 text-ink-800 px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black border border-ink-200"
                title="Lokasi terkunci selama bermain. Tekan Mode untuk kembali ke menu."
              >
                <MapPin className="w-3 h-3 text-brand-600" />
                <span className="capitalize">{selectedCity}</span>
              </div>
            ) : (
              <div className="flex bg-ink-50 p-0.5 rounded-xl border border-ink-100 text-[10px] sm:text-xs font-bold">
                {(['medan', 'jakarta', 'bandung'] as CityTheme[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedCity(c)}
                    className={`px-1.5 sm:px-2.5 py-1 rounded-lg capitalize transition-all ${
                      selectedCity === c
                        ? 'bg-brand-500 text-white shadow-sm font-black'
                        : 'text-ink-500 hover:text-ink-900'
                    }`}
                  >
                    {c === 'medan' ? 'Medan' : c === 'jakarta' ? 'JKT' : 'Bdg'}
                  </button>
                ))}
              </div>
            )}

            {/* Offline Mode Indicator */}
            {!isOnline && (
              <div
                className="flex items-center gap-1 bg-amber-500/10 text-amber-800 border border-amber-300 px-2 sm:px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black shadow-sm"
                title="Mode Offline Aktif: Game dapat dimainkan 100% tanpa internet!"
              >
                <WifiOff className="w-3 h-3 text-amber-600 animate-pulse" />
                <span className="hidden xs:inline">Offline</span>
              </div>
            )}

            {/* PWA Install Button */}
            {deferredInstallPrompt && (
              <button
                onClick={handleInstallApp}
                className="flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-2 sm:px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black transition press"
                title="Pasang aplikasi di perangkat untuk main offline"
              >
                <Download className="w-3 h-3 text-emerald-600" />
                <span className="hidden sm:inline">Pasang Game</span>
              </button>
            )}

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundOn(!soundOn)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ink-50 hover:bg-ink-100 border border-ink-100 text-ink-700 flex items-center justify-center press"
              title={soundOn ? 'Mute' : 'Unmute'}
            >
              {soundOn ? <Volume2 className="w-3.5 h-3.5 text-brand-600" /> : <VolumeX className="w-3.5 h-3.5 text-ink-400" />}
            </button>

            {/* Booth Widescreen Toggle */}
            <button
              onClick={() => setBoothMode(!boothMode)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ink-50 hover:bg-ink-100 border border-ink-100 text-ink-700 flex items-center justify-center press"
              title={boothMode ? 'Tampilan Mobile' : 'Tampilan Layar Lebar'}
            >
              {boothMode ? <Minimize2 className="w-3.5 h-3.5 text-brand-600" /> : <Maximize2 className="w-3.5 h-3.5 text-ink-600" />}
            </button>
          </div>
        </header>

        {/* ── MAIN CANVAS AREA ── */}
        <main className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-[#F8FAFC]">
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-pointer"
            onClick={() => {
              if (phase === 'idle') startGame();
            }}
          />

          {/* ── IN-GAME PLAY HUD OVERLAY ── */}
          {phase === 'playing' && (
            <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-4 pb-4">
              {/* Top Score & Day Tracker Bar */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                  {/* Player 1 HUD (Blue) */}
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-xl px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl border-2 border-brand-200 shadow-card">
                    <span className="w-5 h-5 rounded-full bg-brand-500 text-white font-black text-[10px] sm:text-xs flex items-center justify-center shadow-sm">
                      P1
                    </span>
                    <div className="flex items-center gap-0.5 sm:gap-1">
                      {[1, 2, 3].map((heartIndex) => (
                        <Heart
                          key={heartIndex}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            heartIndex <= p1Lives ? 'text-rose-500 fill-rose-500' : 'text-ink-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-display font-black text-xs sm:text-sm text-brand-700 ml-0.5 sm:ml-1">
                      {p1Score}
                    </span>
                  </div>

                  {/* Player 2 / Bot HUD */}
                  {gameMode !== 'solo' && (
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-xl px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl border-2 border-orange-200 shadow-card">
                      <span className="w-5 h-5 rounded-full bg-[#F97316] text-white font-black text-[10px] sm:text-xs flex items-center justify-center shadow-sm">
                        {gameMode === 'vs_bot' ? 'BOT' : 'P2'}
                      </span>
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {[1, 2, 3].map((heartIndex) => (
                          <Heart
                            key={heartIndex}
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                              heartIndex <= p2Lives ? 'text-rose-500 fill-rose-500' : 'text-ink-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-display font-black text-xs sm:text-sm text-orange-700 ml-0.5 sm:ml-1">
                        {p2Score}
                      </span>
                    </div>
                  )}

                  {/* Secret Booth Trigger Button */}
                  <button
                    onClick={() => engineRef.current?.triggerManualStorm()}
                    className="pointer-events-auto px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-[11px] sm:text-xs font-black shadow-glow flex items-center gap-1 transition press"
                    title="Picu Storm Sequence secara instan [B]"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                    <span className="hidden sm:inline">AI Storm [B]</span>
                  </button>
                </div>

                {/* ── STABLE FIXED ROUTE & ITINERARY BAR (NO LAYOUT SHIFTING) ── */}
                <div className="relative flex items-center justify-between bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-2xl border border-ink-200 shadow-sm text-ink-800 text-[11px] sm:text-xs overflow-hidden min-h-[40px]">
                  {activeToast ? (
                    <motion.div
                      key="toast"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-2 font-black text-emerald-600 truncate">
                        <span className="text-base">{activeToast.icon}</span>
                        <span className="truncate">{activeToast.title}</span>
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                        {activeToast.subtitle}
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="itinerary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-1.5 font-black">
                        <Calendar className="w-3.5 h-3.5 text-brand-600" />
                        <span className="text-brand-600 uppercase">HARI {currentDay}</span>
                        <span className="text-ink-400">•</span>
                        <span className="capitalize">{selectedCity}</span>
                      </div>
                      <div className="flex items-center gap-1 text-ink-600 font-bold">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{p1Destinations} Wisata</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* ── DAY UNLOCKED BONUS BANNER (ABSOLUTE TOP-CENTER, CLEAN NO-EMOJI) ── */}
              <AnimatePresence>
                {dayUnlockBanner && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -20 }}
                    className="absolute top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-gradient-to-r from-brand-600 to-indigo-600 text-white p-3.5 rounded-3xl shadow-2xl border-2 border-amber-300 text-center z-40 pointer-events-none"
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Award className="w-4 h-4 text-amber-300" />
                      <h4 className="font-display font-black text-xs sm:text-sm text-amber-300 uppercase tracking-wider">
                        HARI SEBELUMNYA SELESAI
                      </h4>
                    </div>
                    <p className="text-[11px] sm:text-xs font-bold text-white mb-1.5">
                      Melanjutkan ke Rute Wisata Hari {dayUnlockBanner.day}
                    </p>
                    <span className="inline-block px-3 py-0.5 rounded-full bg-amber-400 text-ink-900 font-black text-[10px] sm:text-xs shadow-sm">
                      BONUS +100 XP
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── STORM WARNING BANNER ── */}
              <AnimatePresence>
                {activeStorm?.phase === 'warning' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    className="self-center bg-rose-500 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl font-display font-black text-[11px] sm:text-xs tracking-wide shadow-2xl flex items-center gap-2 border-2 border-white animate-bounce"
                  >
                    <CloudRain className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                    <span>⚠️ PERINGATAN: BADAI CUACA BURUK!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── AI DYNAMIC REROUTING MODAL ── */}
              <AnimatePresence>
                {(activeStorm?.phase === 'freeze' ||
                  activeStorm?.phase === 'rerouting' ||
                  activeStorm?.phase === 'indoor_transition') && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="self-center max-w-sm w-full bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border-2 border-brand-500 text-ink-900 text-center"
                  >
                    <div className="flex items-center gap-3 mb-2.5 text-left">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-50 border-2 border-brand-500 shadow-sm flex items-center justify-center shrink-0">
                        <img src="/mascot.svg" alt="TinTin" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0, 0.8] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute inset-0 rounded-full border-2 border-brand-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-display font-black text-xs sm:text-sm text-ink-900 truncate">
                            TinTin AI Rerouting
                          </h4>
                          <span className="px-1.5 py-0.2 rounded-full text-[8px] font-extrabold bg-brand-50 text-brand-600 border border-brand-100">
                            LIVE
                          </span>
                        </div>
                        <p className="text-[10px] text-ink-500 font-medium">Pavey Weather Engine</p>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-ink-700 mb-2">
                      {activeStorm.phase === 'freeze' && '⚡ Mengidentifikasi badai & rute aman...'}
                      {activeStorm.phase === 'rerouting' && '🔍 Mencari destinasi alternatif indoor...'}
                      {activeStorm.phase === 'indoor_transition' && '✅ Rute baru ditemukan! Rainy Day Mode'}
                    </p>

                    <div className="w-full bg-ink-100 h-2 rounded-full overflow-hidden mb-2.5">
                      <motion.div
                        className="h-full bg-gradient-to-r from-brand-500 via-purple-500 to-emerald-500"
                        initial={{ width: '0%' }}
                        animate={{ width: `${(activeStorm.rerouteProgress || 0.85) * 100}%` }}
                        transition={{ ease: 'easeOut', duration: 0.3 }}
                      />
                    </div>

                    {/* Found Destination Card */}
                    <div className="bg-ink-50 border border-ink-200 rounded-2xl p-2.5 sm:p-3 flex items-center gap-2.5 text-left">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-600">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 mb-0.5">
                          <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-wider">
                            DESTINASI INDOOR
                          </span>
                          <span className="text-[9px] text-amber-500 font-black">⭐ 4.9</span>
                        </div>
                        <h5 className="text-xs font-extrabold text-ink-900 truncate">
                          {activeStorm.selectedIndoorSpot}
                        </h5>
                        <p className="text-[10px] text-ink-500 truncate">{activeStorm.indoorCategory}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── ON-SCREEN TOUCH CONTROLS (RESPONSIVE FOR MOBILE & PC) ── */}
              <div className="pointer-events-auto flex items-center justify-between gap-3 mt-auto">
                {/* Player 1 Lane Switch Buttons (Blue) */}
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] sm:text-[10px] font-black text-brand-600 uppercase">P1 (W / S)</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => engineRef.current?.movePlayer1Lane('up')}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-brand-300 text-brand-700 active:bg-brand-500 active:text-white flex flex-col items-center justify-center press shadow-card"
                      aria-label="P1 Lane Atas"
                    >
                      <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span className="text-[8px] sm:text-[9px] font-black uppercase">ATAS</span>
                    </button>
                    <button
                      onClick={() => engineRef.current?.movePlayer1Lane('down')}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-brand-300 text-brand-700 active:bg-brand-500 active:text-white flex flex-col items-center justify-center press shadow-card"
                      aria-label="P1 Lane Bawah"
                    >
                      <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span className="text-[8px] sm:text-[9px] font-black uppercase">BAWAH</span>
                    </button>
                  </div>
                </div>

                {/* Player 2 Lane Switch Buttons (Coral, if PvP mode) */}
                {gameMode === 'pvp' && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[9px] sm:text-[10px] font-black text-orange-600 uppercase">P2 (Panah / I-K / Pg)</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => engineRef.current?.movePlayer2Lane('up')}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-orange-300 text-orange-700 active:bg-orange-500 active:text-white flex flex-col items-center justify-center press shadow-card"
                        aria-label="P2 Lane Atas"
                      >
                        <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7" />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase">ATAS</span>
                      </button>
                      <button
                        onClick={() => engineRef.current?.movePlayer2Lane('down')}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border-2 border-orange-300 text-orange-700 active:bg-orange-500 active:text-white flex flex-col items-center justify-center press shadow-card"
                        aria-label="P2 Lane Bawah"
                      >
                        <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7" />
                        <span className="text-[8px] sm:text-[9px] font-black uppercase">BAWAH</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ATTRACT / GREETING SCREEN ── */}
          {phase === 'idle' && (
            <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 sm:p-5 bg-[#F6F8FC] overflow-y-auto no-scrollbar">
              <div className="space-y-3 sm:space-y-4 pt-1">
                {/* 1. TinTin Buddy Greeting Card */}
                <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-ink-100 shadow-card flex items-start gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-brand-500 shadow-sm flex items-center justify-center shrink-0">
                    <img src="/mascot.svg" alt="TinTin" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-display font-extrabold text-sm text-ink-900">TinTin</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-brand-50 text-brand-600 border border-brand-100">
                        AI Travel Buddy
                      </span>
                    </div>
                    <p className="text-xs text-ink-700 leading-relaxed font-medium">
                      "Selamat datang di rute wisata <strong className="capitalize text-brand-600">{selectedCity}</strong>! Capai semua checkpoint wisata di Hari 1 untuk lanjut ke Hari 2!"
                    </p>
                  </div>
                </div>

                {/* 2. Destination Itinerary Route Preview Card */}
                <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-ink-100 shadow-sm text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-brand-600 flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5" />
                      RUTE HARI 1: {selectedCity.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-extrabold text-ink-500 bg-ink-50 px-2 py-0.5 rounded-full border border-ink-100">
                      4 Spots
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {currentCityItinerary.map((spot) => (
                      <div key={spot.id} className="bg-ink-50 p-2 sm:p-2.5 rounded-2xl border border-ink-100 flex items-center gap-2">
                        <span className="text-lg sm:text-xl">{spot.icon}</span>
                        <div className="min-w-0">
                          <h6 className="text-[11px] sm:text-xs font-black text-ink-900 truncate">{spot.name}</h6>
                          <p className="text-[9px] sm:text-[10px] text-ink-500 font-medium truncate">{spot.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Game Mode Selector Tabs */}
                <div className="bg-white rounded-3xl p-3 sm:p-3.5 border border-ink-100 shadow-sm">
                  <label className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-ink-400 block mb-2 px-1">
                    PILIH MODE PERMAINAN:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setGameMode('solo')}
                      className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                        gameMode === 'solo'
                          ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                          : 'bg-ink-50 border-ink-100 text-ink-600 hover:bg-ink-100'
                      }`}
                    >
                      <User className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
                      <span className="font-display font-black text-[11px] sm:text-xs">Solo</span>
                      <span className="text-[8px] sm:text-[9px] text-ink-400 font-bold">Highscore</span>
                    </button>

                    <button
                      onClick={() => setGameMode('vs_bot')}
                      className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                        gameMode === 'vs_bot'
                          ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                          : 'bg-ink-50 border-ink-100 text-ink-600 hover:bg-ink-100'
                      }`}
                    >
                      <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                      <span className="font-display font-black text-[11px] sm:text-xs">Vs AI Bot</span>
                      <span className="text-[8px] sm:text-[9px] text-ink-400 font-bold">Balapan Bot</span>
                    </button>

                    <button
                      onClick={() => setGameMode('pvp')}
                      className={`p-2.5 sm:p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                        gameMode === 'pvp'
                          ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                          : 'bg-ink-50 border-ink-100 text-ink-600 hover:bg-ink-100'
                      }`}
                    >
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      <span className="font-display font-black text-[11px] sm:text-xs">1 vs 1 Teman</span>
                      <span className="text-[8px] sm:text-[9px] text-ink-400 font-bold">2 Pemain</span>
                    </button>
                  </div>
                </div>

                {/* 4. Hero Start Card */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1020] via-[#1A1F2E] to-[#1E3AD6] p-4 sm:p-5 text-white shadow-xl border border-brand-400/30">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase bg-brand-500 text-white tracking-wider">
                        {gameMode === 'solo' ? 'SOLO ITINERARY' : gameMode === 'vs_bot' ? 'PLAYER VS BOT' : '1 VS 1 LOCAL PVP'}
                      </span>
                      <span className="text-[11px] sm:text-xs text-amber-300 font-bold">⭐ 3 Lanes</span>
                    </div>
                    <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight mb-1">
                      BEAT THE STORM ⛈️
                    </h2>
                    <p className="text-[11px] sm:text-xs text-ink-300 leading-relaxed mb-3.5 font-medium">
                      {gameMode === 'pvp'
                        ? 'Balapan mengumpulkan destinasi wisata! P1 gunakan W/S, P2 gunakan PageUp/PageDown.'
                        : gameMode === 'vs_bot'
                        ? 'Balapan melawan TinTin AI pintar! Siapa yang tercepat menyelesaikan Hari 1 & 2?'
                        : 'Jelajahi wisata kota di 3 lajur dan rasakan Dynamic AI Rerouting Pavey!'}
                    </p>

                    <button
                      onClick={startGame}
                      className="w-full py-3.5 sm:py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-display font-black text-xs sm:text-sm shadow-glow flex items-center justify-center gap-2 press"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>MULAI MAIN (SPACE)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="space-y-2 pt-3 pb-1">
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowBriefing(true)}
                    className="flex-1 py-3 rounded-2xl bg-white hover:bg-ink-50 text-ink-800 font-bold text-xs border border-ink-200 shadow-sm press flex items-center justify-center gap-1.5"
                  >
                    <Info className="w-3.5 h-3.5 text-brand-600" />
                    <span>Cara Main</span>
                  </button>
                  <button
                    onClick={() => setPhase('leaderboard')}
                    className="flex-1 py-3 rounded-2xl bg-white hover:bg-ink-50 text-ink-800 font-bold text-xs border border-ink-200 shadow-sm press flex items-center justify-center gap-1.5"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-500" />
                    <span>Leaderboard</span>
                  </button>
                </div>

                <button
                  onClick={openPaveyApp}
                  className="w-full py-3 rounded-2xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-black text-xs border border-brand-200 press flex items-center justify-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Coba Pavey App Full Version</span>
                </button>
              </div>
            </div>
          )}

          {/* ── GAME OVER & VICTORY MODAL ── */}
          {phase === 'gameover' && gameResult && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-sm w-full bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-ink-100 text-center text-ink-900"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-500 mx-auto mb-2 flex items-center justify-center shadow-sm">
                  <Crown className="w-7 h-7 sm:w-8 sm:h-8 fill-current" />
                </div>

                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-brand-600 block mb-0.5">
                  HASIL PERTANDINGAN
                </span>
                <h3 className="font-display font-black text-xl sm:text-2xl text-ink-900 mb-1">
                  {gameResult.winner === 'p1' &&
                    (gameMode === 'vs_bot'
                      ? '🏆 PLAYER 1 MENANG!'
                      : gameMode === 'pvp'
                      ? '🏆 PLAYER 1 MENANG!'
                      : '🏆 PLAYER 1 MENANG!')}
                  {gameResult.winner === 'p2' && '🏆 PLAYER 2 MENANG!'}
                  {gameResult.winner === 'bot' && '🤖 TINTIN BOT MENANG!'}
                  {gameResult.winner === 'draw' && '🤝 HASIL IMBANG!'}
                  {gameResult.winner === 'solo' && '💔 NYAWA HABIS!'}
                </h3>
                <p className="text-xs text-ink-500 font-bold mb-3">
                  {gameResult.winner === 'solo'
                    ? `Petualangan Berakhir di Hari ${gameResult.dayReached} (${selectedCity.toUpperCase()})`
                    : gameResult.winner === 'p1'
                    ? `Lawan Kehabisan Nyawa! Selesai di Hari ${gameResult.dayReached} (${selectedCity.toUpperCase()})`
                    : gameResult.winner === 'bot' || gameResult.winner === 'p2'
                    ? `Player 1 Kehabisan Nyawa! Selesai di Hari ${gameResult.dayReached} (${selectedCity.toUpperCase()})`
                    : `Selesai Saat Nyawa Habis di Hari ${gameResult.dayReached} (${selectedCity.toUpperCase()})`}
                </p>

                {/* Side by side comparison */}
                {gameResult.p2Stats ? (
                  <div className="grid grid-cols-2 gap-2 mb-3.5">
                    <div className="bg-brand-50 p-2.5 sm:p-3 rounded-2xl border border-brand-200 text-left">
                      <span className="text-[9px] sm:text-[10px] text-brand-600 font-black block">P1 (TINTIN BIRU)</span>
                      <span className="text-lg sm:text-xl font-black text-brand-900 font-display block">
                        {gameResult.p1Stats.score} pts
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-ink-500 font-semibold">{gameResult.p1Stats.destinations} Wisata</span>
                    </div>

                    <div className="bg-orange-50 p-2.5 sm:p-3 rounded-2xl border border-orange-200 text-left">
                      <span className="text-[9px] sm:text-[10px] text-orange-600 font-black block">
                        {gameMode === 'vs_bot' ? 'TINTIN BOT' : 'P2 (TINTIN CORAL)'}
                      </span>
                      <span className="text-lg sm:text-xl font-black text-orange-900 font-display block">
                        {gameResult.p2Stats.score} pts
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-ink-500 font-semibold">{gameResult.p2Stats.destinations} Wisata</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mb-3.5 text-left">
                    <div className="bg-ink-50 p-2.5 sm:p-3 rounded-2xl border border-ink-100">
                      <span className="text-[9px] sm:text-[10px] text-ink-400 uppercase font-black block">TOTAL SKOR</span>
                      <span className="text-xl sm:text-2xl font-black text-brand-600 font-display">
                        {gameResult.p1Stats.score}
                      </span>
                    </div>
                    <div className="bg-ink-50 p-2.5 sm:p-3 rounded-2xl border border-ink-100">
                      <span className="text-[9px] sm:text-[10px] text-ink-400 uppercase font-black block">WISATA TERCAPAI</span>
                      <span className="text-xl sm:text-2xl font-black text-ink-900 font-display">
                        {gameResult.p1Stats.destinations} Spot
                      </span>
                    </div>
                  </div>
                )}

                {/* 3-Letter Initial Arcade Input */}
                <div className="mb-3.5 bg-ink-50 p-3 rounded-2xl border border-ink-100">
                  <label className="text-xs font-black text-ink-700 block mb-2">
                    MASUKKAN INISIAL NAMA (3 HURUF):
                  </label>
                  <div className="flex items-center justify-center gap-2.5">
                    {initials.map((char, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <button
                          onClick={() => {
                            setActiveInitialIndex(idx);
                            cycleInitial('up');
                          }}
                          className="w-7 h-5 flex items-center justify-center text-ink-400 hover:text-ink-900"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveInitialIndex(idx)}
                          className={`w-11 h-12 sm:w-12 sm:h-14 rounded-2xl font-display font-black text-xl sm:text-2xl flex items-center justify-center border-2 transition ${
                            activeInitialIndex === idx
                              ? 'bg-brand-500 border-brand-600 text-white shadow-glow'
                              : 'bg-white border-ink-200 text-ink-900'
                          }`}
                        >
                          {char}
                        </button>
                        <button
                          onClick={() => {
                            setActiveInitialIndex(idx);
                            cycleInitial('down');
                          }}
                          className="w-7 h-5 flex items-center justify-center text-ink-400 hover:text-ink-900"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleSaveScore}
                    className="w-full py-3 sm:py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-display font-black text-xs shadow-glow press"
                  >
                    SIMPAN KE LEADERBOARD
                  </button>
                  <button
                    onClick={startGame}
                    className="w-full py-2.5 rounded-2xl bg-ink-50 hover:bg-ink-100 text-ink-700 font-bold text-xs border border-ink-200 press"
                  >
                    Tanding Lagi Langsung
                  </button>
                  <button
                    onClick={backToModeSelection}
                    className="w-full py-2 rounded-2xl bg-white hover:bg-ink-50 text-brand-600 font-extrabold text-xs border border-brand-200 press"
                  >
                    Ganti Mode / Pilih Kota
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* ── LEADERBOARD MODAL ── */}
          {phase === 'leaderboard' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-sm w-full bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-ink-100 flex flex-col max-h-[85vh] text-ink-900"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <h3 className="font-display font-black text-base text-ink-900">TOP 10 LEADERBOARD</h3>
                  </div>
                  <span className="text-[10px] text-brand-600 font-extrabold bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                    BOOTH LIVE
                  </span>
                </div>

                {savedRank && (
                  <div className="mb-3 bg-brand-50 border border-brand-200 p-2.5 rounded-2xl text-center text-xs font-bold text-brand-700 flex items-center justify-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Hebat! Kamu masuk peringkat #{savedRank}!</span>
                  </div>
                )}

                {/* Table */}
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1 mb-4">
                  {leaderboard.map((entry, idx) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl border transition ${
                        idx === 0
                          ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                          : idx === 1
                          ? 'bg-slate-50 border-slate-200 text-slate-900'
                          : idx === 2
                          ? 'bg-orange-50/80 border-orange-200 text-orange-900'
                          : 'bg-ink-50 border-ink-100 text-ink-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <span className="w-5 text-center font-display font-black text-xs text-ink-500">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-display font-black text-xs sm:text-sm tracking-wider text-ink-900">
                              {entry.name}
                            </span>
                            {entry.dayReached && (
                              <span className="text-[8px] sm:text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-100">
                                Day {entry.dayReached}
                              </span>
                            )}
                            {entry.mode && (
                              <span className="text-[8px] sm:text-[9px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.2 rounded">
                                {entry.mode === 'pvp' ? '1v1' : entry.mode === 'vs_bot' ? 'Bot' : 'Solo'}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] sm:text-[11px] text-ink-500 capitalize font-medium">
                            {entry.city} • {entry.destinations || 0} Wisata
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-display font-black text-xs sm:text-sm text-brand-600 block">{entry.score}</span>
                        <span className="text-[9px] sm:text-[10px] text-ink-400 font-bold">{entry.distance}m</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={startGame}
                      className="flex-1 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-display font-black text-xs shadow-glow press flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Main Lagi</span>
                    </button>
                    <button
                      onClick={() => setShowQrModal(true)}
                      className="flex-1 py-3 rounded-2xl bg-ink-50 hover:bg-ink-100 text-ink-800 font-bold text-xs border border-ink-200 press flex items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-4 h-4 text-brand-600" />
                      <span>Coba Pavey</span>
                    </button>
                  </div>
                  <button
                    onClick={backToModeSelection}
                    className="w-full py-2.5 rounded-2xl bg-white hover:bg-ink-50 text-brand-600 font-extrabold text-xs border border-brand-200 press"
                  >
                    Ganti Mode / Pilih Kota
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* ── HOW TO PLAY MODAL ── */}
          <AnimatePresence>
            {showBriefing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.85 }}
                  className="max-w-sm w-full bg-white rounded-3xl p-5 shadow-2xl border border-ink-100 text-left text-ink-900"
                >
                  <h3 className="font-display font-black text-base text-ink-900 mb-0.5">CARA MAIN BEAT THE STORM</h3>
                  <p className="text-xs text-ink-500 mb-3">Panduan kontrol 3 lajur & rute liburan tanpa batas waktu:</p>

                  <div className="space-y-2.5 mb-4 text-xs text-ink-700 font-medium">
                    <div className="flex items-start gap-2.5 bg-ink-50 p-2.5 rounded-2xl border border-ink-100">
                      <span className="w-7 h-7 rounded-xl bg-brand-50 text-brand-600 font-black text-xs flex items-center justify-center shrink-0 border border-brand-200">
                        1
                      </span>
                      <div>
                        <strong className="text-ink-900 block mb-0.5">Kumpulkan Destinasi & Poin:</strong>
                        Ambil pin destinasi wisata (📍), koin ($), dan bintang boost (⭐)! Kumpulkan 4 spot di setiap hari untuk lanjut ke Hari berikutnya (+100 XP)! Hati-hati: <strong>Nyawa tidak bisa bertambah/regenerasi</strong> setelah berkurang!
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-ink-50 p-2.5 rounded-2xl border border-ink-100">
                      <span className="w-7 h-7 rounded-xl bg-orange-50 text-orange-600 font-black text-xs flex items-center justify-center shrink-0 border border-orange-200">
                        2
                      </span>
                      <div>
                        <strong className="text-ink-900 block mb-0.5">Kontrol, Kecepatan & Survival:</strong>
                        P1: <kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-ink-800 border border-ink-200 text-xs">W</kbd>/<kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-ink-800 border border-ink-200 text-xs">S</kbd> atau Panah • P2: <kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-ink-800 border border-ink-200 text-xs">Panah</kbd>/<kbd className="px-1.5 py-0.5 rounded bg-white font-mono text-ink-800 border border-ink-200 text-xs">I-K</kbd>. Game <strong>TIDAK ADA TIMER</strong>, speed bertambah perlahan-lahan seiring jarak & waktu tempuh, dan game berakhir saat nyawa (3 ❤️) habis!
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-ink-50 p-2.5 rounded-2xl border border-ink-100">
                      <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                        3
                      </span>
                      <div>
                        <strong className="text-ink-900 block mb-0.5">Dynamic AI Weather Rerouting:</strong>
                        Saat badai hujan melanda, TinTin AI otomatis merutekan ulang rute ke destinasi indoor aman dengan perisai pelindung & hujan bonus!
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 bg-emerald-500/10 p-2.5 rounded-2xl border border-emerald-300">
                      <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0 border border-emerald-300">
                        4
                      </span>
                      <div>
                        <strong className="text-emerald-950 block mb-0.5">100% Dukungan Offline (PWA):</strong>
                        Game ini berjalan penuh tanpa internet setelah pertama kali dibuka! AI Bot, efek suara, semua kota & mode (Solo, Vs Bot, PvP) tersimpan di perangkat Anda.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowBriefing(false);
                      if (phase === 'idle') startGame();
                    }}
                    className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-display font-black text-xs shadow-glow press"
                  >
                    SIAP, MULAI MAIN!
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── QR CODE CTA MODAL ── */}
          <AnimatePresence>
            {showQrModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-ink-900/60 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.85 }}
                  className="max-w-sm w-full bg-white rounded-3xl p-6 shadow-2xl border border-ink-100 text-center text-ink-900"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-50 border border-brand-200 text-brand-600 mx-auto mb-2.5 flex items-center justify-center">
                    <Compass className="w-6 h-6" />
                  </div>

                  <h3 className="font-display font-black text-xl text-ink-900 mb-1">COBA PAVEY APP</h3>
                  <p className="text-xs text-ink-500 mb-4">
                    Buat itinerary liburan otomatis dengan fitur AI Weather Rerouting dan Expense Wallet terintegrasi!
                  </p>

                  <div className="bg-ink-50 p-3.5 rounded-3xl border border-ink-200 inline-block mb-4">
                    <svg width="150" height="150" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="180" height="180" rx="16" fill="white" />
                      <rect x="20" y="20" width="40" height="40" rx="6" fill="#0B1020" />
                      <rect x="28" y="28" width="24" height="24" rx="3" fill="white" />
                      <rect x="34" y="34" width="12" height="12" rx="2" fill="#3B5BFF" />

                      <rect x="120" y="20" width="40" height="40" rx="6" fill="#0B1020" />
                      <rect x="128" y="28" width="24" height="24" rx="3" fill="white" />
                      <rect x="134" y="34" width="12" height="12" rx="2" fill="#3B5BFF" />

                      <rect x="20" y="120" width="40" height="40" rx="6" fill="#0B1020" />
                      <rect x="28" y="128" width="24" height="24" rx="3" fill="white" />
                      <rect x="34" y="134" width="12" height="12" rx="2" fill="#3B5BFF" />

                      <rect x="70" y="24" width="12" height="12" fill="#0B1020" />
                      <rect x="88" y="36" width="16" height="8" fill="#0B1020" />
                      <rect x="72" y="52" width="20" height="10" fill="#3B5BFF" />
                      <rect x="24" y="70" width="16" height="16" fill="#0B1020" />
                      <rect x="48" y="76" width="12" height="12" fill="#3B5BFF" />
                      <rect x="70" y="70" width="40" height="40" rx="8" fill="#3B5BFF" />
                      <circle cx="90" cy="90" r="12" fill="white" />
                      <rect x="120" y="72" width="14" height="14" fill="#0B1020" />
                      <rect x="142" y="80" width="16" height="12" fill="#0B1020" />
                      <rect x="72" y="120" width="14" height="14" fill="#0B1020" />
                      <rect x="94" y="124" width="12" height="16" fill="#3B5BFF" />
                      <rect x="116" y="120" width="20" height="20" fill="#0B1020" />
                      <rect x="144" y="138" width="14" height="18" fill="#3B5BFF" />
                    </svg>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={openPaveyApp}
                      className="w-full py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-display font-black text-xs shadow-glow press flex items-center justify-center gap-1.5"
                    >
                      <span>Buka Pavey App Sekarang</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setShowQrModal(false)}
                      className="w-full py-2 rounded-2xl bg-ink-50 hover:bg-ink-100 text-ink-700 font-bold text-xs border border-ink-200 press"
                    >
                      Tutup
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
