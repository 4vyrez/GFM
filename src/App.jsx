import { useState, useEffect, useMemo } from 'react';
import EmotionalArea from './components/EmotionalArea';
import StreakDisplay from './components/StreakDisplay';
import FunArea from './components/FunArea';
import AdminPanel from './components/AdminPanel';
import ComparisonDisplay from './components/ComparisonDisplay';
import TicTacToe from './components/games/TicTacToe';
import ReactionRace from './components/games/ReactionRace';
import FindTheHeart from './components/games/FindTheHeart';
import ColorMatch from './components/games/ColorMatch';
import NumberGuess from './components/games/NumberGuess';
import MemoryCards from './components/games/MemoryCards';
import EmojiStory from './components/games/EmojiStory';
import QuizGame from './components/games/QuizGame';
import WordPuzzle from './components/games/WordPuzzle';
import { photos, messages, getRandomItem } from './data/content';
import { getGameById, games } from './data/games';
import { SparkleIcon, FlameIcon, ConfettiIcon } from './components/icons/Icons';
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
  const [appData, setAppData] = useState(null);
  const [dailyPhoto, setDailyPhoto] = useState(null);
  const [dailyMessage, setDailyMessage] = useState(null);
  const [currentView, setCurrentView] = useState('today'); // 'today' | 'challenge' | 'admin'
  const [showSuccessEffect, setShowSuccessEffect] = useState(false);
  const [currentGameConfig, setCurrentGameConfig] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Generate confetti particles
  const confettiParticles = useMemo(() => {
    const colors = ['#FF6B9D', '#FFD700', '#4FC3F7', '#A855F7', '#FF7F7F', '#BDFCC9'];
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100
    }));
  }, [showSuccessEffect]);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = () => {
    let data = getData();
    data = checkStreakLoss(data);

    if (data.streak === 10 && !data.lastStreakUpdateDate) {
      data.streak = 0;
    }

    saveData(data);

    const today = getTodayDate();

    if (isContentRefreshDue(data)) {
      const isSpecialMoment = data.streak === 17;
      const photo = getRandomItem(photos);
      let message = getRandomItem(messages);

      if (isSpecialMoment) {
        message = SPECIAL_MESSAGE;
      }

      const selectedGame = getNextGameForCycle(data);

      const updatedData = {
        ...data,
        lastVisit: today,
        totalVisits: (data.totalVisits || 0) + 1,
        currentGameId: selectedGame.id,
        dailyContent: {
          date: today,
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

      setAppData(prev => ({
        ...prev,
        streak: result.newStreak,
        streakFreezes: result.freezeEarned ? prev.streakFreezes + 1 : prev.streakFreezes,
        lastStreakUpdateDate: getTodayDate(),
        nextAvailableDate: result.nextAvailableDate
      }));

      setTimeout(() => initializeApp(), 500);
    }
  };

  if (!appData || !dailyPhoto || !dailyMessage || !currentGameConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <FlameIcon className="w-16 h-16 animate-pulse-glow" />
            <SparkleIcon className="absolute -top-2 -right-2 w-6 h-6 animate-float" />
          </div>
          <div className="text-xl text-gray-600 font-medium animate-pulse">
            Wird geladen... ✨
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
    TicTacToe,
    ReactionRace,
    FindTheHeart,
    ColorMatch,
    NumberGuess,
    MemoryCards,
    EmojiStory,
    QuizGame,
    WordPuzzle,
  };

  const GameComponent = GameComponents[currentGameConfig.component] || TicTacToe;

  return (
    <div className="fixed inset-0 overflow-hidden font-sans text-gray-800 flex flex-col">

      {/* Premium Success Overlay with Confetti */}
      {showSuccessEffect && (
        <div className="win-overlay animate-fade-in">
          {/* Confetti particles */}
          {confettiParticles.map(particle => (
            <ConfettiParticle key={particle.id} {...particle} />
          ))}

          {/* Golden glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 via-transparent to-transparent animate-pulse-glow" />

          <div className="win-content z-10">
            <div className="relative mb-6">
              <FlameIcon className="w-32 h-32 mx-auto drop-shadow-2xl" animated />
              {/* Orbiting sparkles */}
              <SparkleIcon className="absolute top-0 left-1/4 w-8 h-8 animate-float" />
              <SparkleIcon className="absolute bottom-4 right-1/4 w-6 h-6 animate-float-slow" />
            </div>
            <h2 className="text-5xl font-black text-white drop-shadow-lg mb-2">
              Streak erhöht!
            </h2>
            <p className="text-xl text-white/80 font-medium">🔥 Weiter so, Schatz! 🔥</p>
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
              Hallo Schatz{' '}
              <span className="inline-block animate-heartbeat">❤️</span>
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
            <div className="pill-toggle relative">
              <button
                onClick={() => handleViewChange('today')}
                className={`
                  relative z-10 px-8 py-2.5 rounded-full text-sm font-bold
                  transition-all duration-300
                  ${currentView === 'today' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                Heute
              </button>
              <button
                onClick={() => handleViewChange('challenge')}
                className={`
                  relative z-10 px-8 py-2.5 rounded-full text-sm font-bold
                  transition-all duration-300
                  ${currentView === 'challenge' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}
                `}
              >
                Spiel
              </button>

              {/* Animated pill background */}
              <div
                className={`
                  absolute top-1.5 bottom-1.5 w-[calc(50%-6px)]
                  bg-white rounded-full shadow-md
                  transition-all duration-300 ease-spring
                  ${currentView === 'today' ? 'left-1.5' : 'left-[calc(50%+3px)]'}
                `}
              />
            </div>
          </div>

          {/* Main Content Area with smooth transitions */}
          <div className={`
            transition-all duration-300 ease-apple
            ${isTransitioning ? 'opacity-0 scale-98 translate-y-2' : 'opacity-100 scale-100 translate-y-0'}
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
              <div className="space-y-8">
                <EmotionalArea photo={dailyPhoto} message={dailyMessage} />
              </div>
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
  );
}

export default App;
