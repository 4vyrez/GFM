import { useState, useEffect, useMemo } from 'react';
import EmotionalArea from './components/EmotionalArea';
import StreakDisplay from './components/StreakDisplay';
import FunArea from './components/FunArea';
import AdminPanel from './components/AdminPanel';
import ComparisonDisplay from './components/ComparisonDisplay';
import SettingsArea from './components/SettingsArea';
import { ThemeProvider } from './context/ThemeContext';
import BackgroundParticles from './components/BackgroundParticles';
import StreakMilestone from './components/StreakMilestone';
import StatsPanel from './components/StatsPanel';
import Inventory from './components/Inventory';
import TicTacToe from './components/games/TicTacToe';
import ReactionRace from './components/games/ReactionRace';
import FindTheHeart from './components/games/FindTheHeart';
import ColorMatch from './components/games/ColorMatch';
import NumberGuess from './components/games/NumberGuess';
import MemoryCards from './components/games/MemoryCards';
import EmojiStory from './components/games/EmojiStory';
import QuizGame from './components/games/QuizGame';
import WordPuzzle from './components/games/WordPuzzle';
// New Games - Reflex/Timing
import ChargeBar from './components/games/ChargeBar';
import StopTheBar from './components/games/StopTheBar';
import SimonColors from './components/games/SimonColors';
// New Games - Meme/UI
import LanguageChaos from './components/games/LanguageChaos';
import CaptchaCats from './components/games/CaptchaCats';
import ButtonChase from './components/games/ButtonChase';
import FakeUpdate from './components/games/FakeUpdate';
// New Games - Memory/Puzzle
import SequenceMemory from './components/games/SequenceMemory';
import GhostDownload from './components/games/GhostDownload';
// New Games - Word/Insider
import LoveCode from './components/games/LoveCode';
import MegalodonQuiz from './components/games/MegalodonQuiz';
import MemeQuiz from './components/games/MemeQuiz';
// New Games - Emotional/Easy
import HistoryQuiz from './components/games/HistoryQuiz';
import ComplimentReveal from './components/games/ComplimentReveal';
import BiteMeter from './components/games/BiteMeter';
// New Games - Creative Additions
import LuckySpin from './components/games/LuckySpin';
import MirrorMatch from './components/games/MirrorMatch';
import LoveMeter from './components/games/LoveMeter';
// UX Enhancement Features
import TapHearts from './components/TapHearts';
import CountdownWidget from './components/CountdownWidget';
import AmbientConfetti from './components/AmbientConfetti';
import ThemeOverlay from './components/ThemeOverlay';
import LoginScreen from './components/LoginScreen';
import SpecialDateOverlay from './components/SpecialDateOverlay';
import { getSpecialDateForToday } from './data/specials';
import { photos, messages, getRandomItem, getNextPhoto, getNextMessage } from './data/content';
import { getGameById, games } from './data/games';
import { SparkleIcon, FlameIcon, ConfettiIcon } from './components/icons/Icons';
import EasterEggs, { getRandomLoadingMessage } from './components/EasterEggs';
import {
  getData,
  saveData,
  getTodayDate,
  checkStreakLoss,
  isContentRefreshDue,
  completeChallengeForToday,
  adminResetApp,
  adminForceNextCycle,
  adminSetStreak,
  SPECIAL_MESSAGE,
  daysBetween,
  getNextGameForCycle,
  saveGameResult,
  getGameComparison
} from './utils/storage';

// Time-based greeting function
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return { text: 'Guten Morgen, Schatz', emoji: '☀️' };
  } else if (hour >= 12 && hour < 17) {
    return { text: 'Hallo Schatz', emoji: '💕' };
  } else if (hour >= 17 && hour < 22) {
    return { text: 'Guten Abend, Schatz', emoji: '🌙' };
  } else {
    return { text: 'Hallo Nachtmütze', emoji: '💫' };
  }
};

// Confetti particle component
const ConfettiParticle = ({ delay, color, left }) => (
  <div
    className="confetti-particle"
    style={{
      left: `${left}%`,
      backgroundColor: color,
      animationDelay: `${delay}s`,
      transform: `rotate(${Math.random() * 360}deg)`
    }}
  />
);

// Premium Countdown component
const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!targetDate) return;
      const now = new Date();
      const target = new Date(targetDate + 'T00:00:00');
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Jetzt verfügbar!');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days} Tagen, ${hours} Std. und ${minutes} Min.`);
      } else if (hours > 0) {
        setTimeLeft(`${hours} Std. und ${minutes} Min.`);
      } else {
        setTimeLeft(`${minutes} Min.`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return <span className="font-semibold">{timeLeft}</span>;
};

function App() {
  // Authentication state - checks localStorage for saved auth
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('gfm_auth_code') !== null;
  });

  const [appData, setAppData] = useState(null);
  const [dailyPhoto, setDailyPhoto] = useState(null);
  const [dailyMessage, setDailyMessage] = useState(null);
  const [currentView, setCurrentView] = useState('today'); // 'today' | 'challenge' | 'settings' | 'admin'
  const [showSuccessEffect, setShowSuccessEffect] = useState(false);
  const [currentGameConfig, setCurrentGameConfig] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneStreak, setMilestoneStreak] = useState(0);
  const [showInventory, setShowInventory] = useState(false);
  const [showSpecialDate, setShowSpecialDate] = useState(false);
  const [konamiUnlocked, setKonamiUnlocked] = useState(false);
  const [loadingMessage] = useState(() => getRandomLoadingMessage());

  // Handle login
  const handleLogin = (code) => {
    localStorage.setItem('gfm_auth_code', code.toLowerCase().trim());
    setIsAuthenticated(true);
  };

  // Time-based greeting
  const greeting = useMemo(() => getGreeting(), []);

  // Generate confetti particles - stable memoization
  const confettiParticles = useMemo(() => {
    const colors = ['#FF6B9D', '#FFD700', '#4FC3F7', '#A855F7', '#FF7F7F', '#BDFCC9', '#FFA500', '#FFB7C5'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100
    }));
  }, []); // Empty dependency - regenerate only on mount

  useEffect(() => {
    initializeApp();
    // Check for special dates (birthday, anniversary)
    const specialDate = getSpecialDateForToday();
    if (specialDate) {
      // Check if we've already shown this special today
      const lastShownSpecialDate = localStorage.getItem('gfm_last_special_date');
      const today = new Date().toISOString().split('T')[0];
      if (lastShownSpecialDate !== today) {
        setShowSpecialDate(true);
        localStorage.setItem('gfm_last_special_date', today);
      }
    }
  }, []);

  const initializeApp = () => {
    let data = getData();
    data = checkStreakLoss(data);

    if (data.streak === 10 && !data.lastStreakUpdateDate) {
      data.streak = 0;
    }

    saveData(data);

    const today = getTodayDate();

    // Content refresh logic:
    // Pick new content IF: cycle is due AND we don't have content for this cycle
    // Use cycleStartDate to track which cycle the content belongs to
    const cycleIsDue = isContentRefreshDue(data);
    const currentCycleStart = data.nextAvailableDate || today;
    const contentMatchesCurrentCycle = data.dailyContent?.cycleStartDate === currentCycleStart;
    const shouldPickNewContent = cycleIsDue && !contentMatchesCurrentCycle;

    if (shouldPickNewContent) {
      const isSpecialMoment = data.streak === 17;
      // Use non-repeating selection for photos and messages
      const shownPhotoIds = data.shownPhotoIds || [];
      const shownMessageIds = data.shownMessageIds || [];
      const photo = getNextPhoto(shownPhotoIds);
      let message = getNextMessage(shownMessageIds);

      if (isSpecialMoment) {
        message = SPECIAL_MESSAGE;
      }

      const selectedGame = getNextGameForCycle(data);

      // Track shown photos (reset if all have been shown)
      let newShownPhotoIds = [...shownPhotoIds, photo.id];
      if (newShownPhotoIds.length >= photos.length) {
        newShownPhotoIds = [photo.id]; // Reset, keep current
      }

      // Track shown messages (reset if all have been shown)
      let newShownMessageIds = [...shownMessageIds, message.id];
      if (newShownMessageIds.length >= messages.length) {
        newShownMessageIds = [message.id]; // Reset, keep current
      }

      const updatedData = {
        ...data,
        lastVisit: today,
        totalVisits: (data.totalVisits || 0) + 1,
        currentGameId: selectedGame.id,
        shownPhotoIds: newShownPhotoIds,
        shownMessageIds: newShownMessageIds,
        dailyContent: {
          date: today,
          cycleStartDate: data.nextAvailableDate || today, // Track which cycle this content belongs to
          photoId: photo.id,
          messageId: message.id,
          minigameId: selectedGame.id,
          isSpecial: isSpecialMoment,
        },
      };

      saveData(updatedData);
      setAppData(updatedData);
      setDailyPhoto(photo);
      setDailyMessage(message);
      setCurrentGameConfig(selectedGame);
    } else {
      const photo = photos.find((p) => p.id === data.dailyContent.photoId) || getRandomItem(photos);
      let message = messages.find((m) => m.id === data.dailyContent.messageId) || getRandomItem(messages);

      if (data.dailyContent.messageId === SPECIAL_MESSAGE.id) {
        message = SPECIAL_MESSAGE;
      }

      const game = getGameById(data.currentGameId || data.dailyContent.minigameId);

      setAppData(data);
      setDailyPhoto(photo);
      setDailyMessage(message);
      setCurrentGameConfig(game || getNextGameForCycle(data));

      if (data.lastStreakUpdateDate === today && game) {
        const comparison = getGameComparison(game.id);
        if (comparison && comparison.user) {
          setComparisonData(comparison);
        }
      }
    }
  };

  const handleViewChange = (newView) => {
    if (newView === currentView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(newView);
      // Scroll to top smoothly on view change
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  };

  const handleChallengeWin = (gameData) => {
    if (gameData && gameData.metric && gameData.value != null) {
      saveGameResult(gameData.gameId, gameData.metric, gameData.value);

      const comparison = getGameComparison(gameData.gameId);
      if (comparison && comparison.user) {
        setComparisonData(comparison);
      }
    }

    const result = completeChallengeForToday(gameData);
    if (result.success && !result.alreadyCompleted) {
      setShowSuccessEffect(true);
      setTimeout(() => setShowSuccessEffect(false), 4000);

      // Check for milestone celebrations (7, 14, 30, 50, 100)
      const milestoneValues = [7, 14, 30, 50, 100];
      if (milestoneValues.includes(result.newStreak)) {
        setMilestoneStreak(result.newStreak);
        setTimeout(() => setShowMilestone(true), 4500); // Show after success effect
      }

      setAppData(prev => ({
        ...prev,
        streak: result.newStreak,
        longestStreak: Math.max(prev.longestStreak || 0, result.newStreak),
        streakFreezes: result.freezeEarned ? prev.streakFreezes + 1 : prev.streakFreezes,
        lastStreakUpdateDate: getTodayDate(),
        nextAvailableDate: result.nextAvailableDate
      }));

      setTimeout(() => initializeApp(), 500);
    }
  };

  const handleUseTicket = (ticketId) => {
    const data = getData();
    const updatedTickets = data.collectedTickets.map(t =>
      t.id === ticketId ? { ...t, used: true } : t
    );
    saveData({ ...data, collectedTickets: updatedTickets });
    setAppData(prev => ({
      ...prev,
      collectedTickets: updatedTickets
    }));
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (!appData || !dailyPhoto || !dailyMessage || !currentGameConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <FlameIcon className="w-16 h-16 animate-pulse-glow" />
            <SparkleIcon className="absolute -top-2 -right-2 w-6 h-6 animate-float" />
          </div>
          <div className="text-xl text-gray-600 font-medium animate-pulse">
            {loadingMessage}
          </div>
        </div>
      </div>
    );
  }

  const handleTestGame = (gameId) => {
    const data = getData();
    const selectedGame = games.find(g => g.id === gameId);

    if (selectedGame) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const updatedData = {
        ...data,
        currentGameId: selectedGame.id,
        nextAvailableDate: getTodayDate(),
        lastStreakUpdateDate: yesterday.toISOString().split('T')[0],
      };
      saveData(updatedData);
      setCurrentGameConfig(selectedGame);
      setCurrentView('challenge');
    }
  };

  if (currentView === 'admin') {
    return (
      <AdminPanel
        onClose={() => setCurrentView('today')}
        onTestGame={handleTestGame}
        currentAppData={appData}
      />
    );
  }

  const isChallengeLocked = appData.lastStreakUpdateDate === getTodayDate() && appData.nextAvailableDate > getTodayDate();

  const GameComponents = {
    // Original Games
    TicTacToe,
    ReactionRace,
    FindTheHeart,
    ColorMatch,
    NumberGuess,
    MemoryCards,
    EmojiStory,
    QuizGame,
    WordPuzzle,
    // New Games - Reflex/Timing
    ChargeBar,
    StopTheBar,
    SimonColors,
    // New Games - Meme/UI
    LanguageChaos,
    CaptchaCats,
    ButtonChase,
    FakeUpdate,
    GhostDownload,
    // New Games - Memory/Puzzle
    SequenceMemory,
    // New Games - Word/Insider
    LoveCode,
    MegalodonQuiz,
    MemeQuiz,
    // New Games - Emotional/Easy
    HistoryQuiz,
    ComplimentReveal,
    BiteMeter,
    // New Games - Creative Additions
    LuckySpin,
    MirrorMatch,
    LoveMeter,
  };

  const GameComponent = GameComponents[currentGameConfig.component] || TicTacToe;

  return (
    <ThemeProvider>
      <div className="fixed inset-0 overflow-hidden font-sans text-gray-800 flex flex-col">

        {/* Background Particles - Only show on 'today' view for performance */}
        {currentView === 'today' && (
          <>
            <BackgroundParticles />
            <AmbientConfetti intensity="low" />
          </>
        )}

        {/* Tap Hearts - Interactive heart spawner (lightweight, keep everywhere) */}
        <TapHearts />

        {/* Easter Eggs - Konami code, seasonal decorations */}
        <EasterEggs
          onKonamiUnlock={() => {
            setKonamiUnlocked(true);
            // Could unlock special theme or feature here
          }}
        />

        {/* Floating Inventory Button - Top Right */}
        <button
          onClick={() => setShowInventory(true)}
          aria-label="Inventar öffnen - Badges und Gutscheine anzeigen"
          className="fixed top-4 right-4 z-40 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/50 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
          title="Inventar öffnen"
        >
          🎒
          {/* Badge count indicator */}
          {(appData.collectedBadges?.length > 0 || appData.collectedTickets?.filter(t => !t.used).length > 0) && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center" aria-label="Neue Items">
              {(appData.collectedBadges?.length || 0) + (appData.collectedTickets?.filter(t => !t.used).length || 0)}
            </span>
          )}
        </button>


        {/* Theme-Specific HUD Overlay - Creative elements per theme */}
        <ThemeOverlay />

        {/* Streak Milestone Celebration Overlay */}
        <StreakMilestone
          streak={milestoneStreak}
          isVisible={showMilestone}
          onClose={() => setShowMilestone(false)}
        />

        {/* Special Date Overlay (Birthday, Anniversary) */}
        {showSpecialDate && (
          <SpecialDateOverlay
            onClose={() => setShowSpecialDate(false)}
          />
        )}

        {/* Inventory Drawer */}
        <Inventory
          isOpen={showInventory}
          onClose={() => setShowInventory(false)}
          badges={appData.collectedBadges || []}
          tickets={appData.collectedTickets || []}
          onUseTicket={handleUseTicket}
        />

        {/* Premium Success Overlay - Duolingo Style Celebration */}
        {showSuccessEffect && (
          <div className="win-overlay animate-fade-in" role="alert" aria-live="assertive">
            {/* Confetti particles - more of them! */}
            {confettiParticles.map(particle => (
              <ConfettiParticle key={particle.id} {...particle} />
            ))}

            {/* Golden radial burst */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(255,215,0,0.4) 0%, rgba(255,165,0,0.2) 30%, transparent 60%)'
              }}
            />

            {/* Animated golden rays */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 bg-gradient-to-t from-yellow-400/60 to-transparent animate-pulse-glow"
                  style={{
                    height: '150%',
                    transform: `rotate(${i * 30}deg)`,
                    transformOrigin: 'center center',
                    opacity: 0.6,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>

            <div className="win-content z-10 relative">
              {/* Large animated flame with glow */}
              <div className="relative mb-6">
                <div
                  className="absolute inset-0 flex items-center justify-center scale-150"
                  style={{
                    background: 'radial-gradient(circle, rgba(255,165,0,0.3) 0%, transparent 50%)'
                  }}
                />
                <FlameIcon className="w-36 h-36 mx-auto drop-shadow-2xl animate-bounce-in" animated />
                {/* Orbiting sparkles */}
                <SparkleIcon className="absolute -top-2 left-1/3 w-10 h-10 animate-float text-yellow-300" />
                <SparkleIcon className="absolute top-1/2 -right-4 w-8 h-8 animate-float-slow text-yellow-200" />
                <SparkleIcon className="absolute bottom-0 left-1/4 w-6 h-6 animate-float text-orange-300" />
              </div>

              {/* Streak increase display */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-6xl font-black text-white drop-shadow-lg animate-bounce-in">
                  {appData.streak}
                </span>
                <span className="text-3xl font-bold text-yellow-300 animate-pop-in">+1</span>
              </div>

              <h2 className="text-4xl font-black text-white drop-shadow-lg mb-2 animate-slide-up">
                Streak erhöht! 🔥
              </h2>
              <p className="text-lg text-white/90 font-medium animate-fade-in">
                Weiter so, Schatz! Du bist großartig! 💕
              </p>
            </div>
          </div>
        )}

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 scroll-smooth pb-safe scrollbar-hide">
          <div className="max-w-xl mx-auto space-y-6 pb-20">

            {/* Premium Header with floating animation */}
            <header className={`
            text-center transition-all duration-500 ease-apple
            ${currentView === 'challenge' ? 'mb-4' : 'mb-8'}
          `}>
              <h1
                onClick={(e) => e.detail === 3 && setCurrentView('admin')}
                className={`
                font-black text-gray-800
                transition-all duration-500 ease-spring
                ${currentView === 'challenge' ? 'text-2xl' : 'text-4xl md:text-5xl'}
                mb-2 cursor-default select-none
                animate-fade-in
              `}
              >
                {greeting.text}{' '}
                <span className="inline-block animate-heartbeat">{greeting.emoji}</span>
              </h1>
              <p className={`
              text-gray-500 font-medium
              transition-all duration-500
              ${currentView === 'challenge' ? 'text-xs opacity-0 h-0 overflow-hidden' : 'text-sm opacity-100'}
            `}>
                ✨ Hier ist etwas für dich ✨
              </p>
            </header>

            {/* Premium Navigation Toggle with spring physics */}
            <div className="flex justify-center mb-6">
              <div className="pill-toggle relative grid grid-cols-3" role="tablist" aria-label="Hauptnavigation">
                <button
                  onClick={() => handleViewChange('today')}
                  role="tab"
                  aria-selected={currentView === 'today'}
                  aria-controls="main-content"
                  className={`
                  relative z-10 px-5 py-2.5 rounded-full text-sm font-bold
                  transition-all duration-300 text-center
                  ${currentView === 'today' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}
                `}
                >
                  Heute
                </button>
                <button
                  onClick={() => handleViewChange('challenge')}
                  role="tab"
                  aria-selected={currentView === 'challenge'}
                  aria-controls="main-content"
                  className={`
                  relative z-10 px-5 py-2.5 rounded-full text-sm font-bold
                  transition-all duration-300 text-center
                  ${currentView === 'challenge' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}
                `}
                >
                  Spiel
                </button>
                <button
                  onClick={() => handleViewChange('settings')}
                  role="tab"
                  aria-selected={currentView === 'settings'}
                  aria-controls="main-content"
                  className={`
                  relative z-10 px-5 py-2.5 rounded-full text-sm font-bold
                  transition-all duration-300 text-center
                  ${currentView === 'settings' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}
                `}
                >
                  Styles
                </button>

                {/* Animated pill background - uses grid column positioning */}
                <div
                  className="absolute top-1 bottom-1 bg-white rounded-full shadow-md transition-all duration-300 ease-spring"
                  style={{
                    width: 'calc(33.333% - 4px)',
                    left: currentView === 'today'
                      ? '2px'
                      : currentView === 'challenge'
                        ? 'calc(33.333% + 2px)'
                        : 'calc(66.666% + 2px)',
                  }}
                />
              </div>
            </div>

            {/* Main Content Area with smooth transitions */}
            <div
              id="main-content"
              role="tabpanel"
              aria-label={`${currentView === 'today' ? 'Heute' : currentView === 'challenge' ? 'Spiel' : 'Styles'} Bereich`}
              className={`
            transition-all duration-300 ease-apple
            ${isTransitioning
                  ? 'opacity-0 scale-[0.98] translate-y-3 blur-sm'
                  : 'opacity-100 scale-100 translate-y-0 blur-0'
                }
          `}>

              {/* Persistent Streak Display */}
              <StreakDisplay
                streak={appData.streak}
                streakFreezes={appData.streakFreezes}
                lastUpdate={appData.lastStreakUpdateDate}
                nextAvailableDate={appData.nextAvailableDate}
                isCompact={currentView === 'challenge'}
              />

              {currentView === 'today' ? (
                <div className="space-y-6">
                  <EmotionalArea photo={dailyPhoto} message={dailyMessage} />

                  {/* Christmas Countdown Widget */}
                  <div className="max-w-md mx-auto">
                    <CountdownWidget
                      targetDate="2026-12-25"
                      label="Bis Weihnachten"
                    />
                  </div>
                </div>
              ) : currentView === 'settings' ? (
                <SettingsArea />
              ) : (
                <div>
                  {isChallengeLocked ? (
                    <div className="glass-card max-w-md mx-auto text-center py-12 px-6">
                      <div className="relative inline-block mb-6">
                        <div className="text-7xl opacity-40 grayscale">🎮</div>
                        <div className="absolute -top-2 -right-2">
                          <SparkleIcon className="w-6 h-6" />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800 mb-3">
                        Challenge geschafft!
                      </h3>

                      {comparisonData && (
                        <div className="mb-6">
                          <ComparisonDisplay
                            userScore={comparisonData.user}
                            partnerScore={comparisonData.partner}
                          />
                        </div>
                      )}

                      <p className="text-gray-500 mb-8 leading-relaxed">
                        Du hast deine Flamme für heute schon gesichert.<br />
                        Ruh dich aus, Schatz! 💕
                      </p>

                      <div className="inline-flex items-center gap-3 bg-gradient-to-r from-pastel-lavender/50 to-pastel-pink/30 px-6 py-3 rounded-full text-gray-600 font-medium border border-white/50 shadow-sm">
                        <span className="text-lg">⏳</span>
                        <span>Nächste Chance in <Countdown targetDate={appData.nextAvailableDate} /></span>
                      </div>
                    </div>
                  ) : (
                    <FunArea gameDescription={currentGameConfig.description}>
                      <GameComponent onWin={handleChallengeWin} />
                    </FunArea>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
