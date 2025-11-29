import { useState, useEffect } from 'react';
import EmotionalArea from './components/EmotionalArea';
import StreakDisplay from './components/StreakDisplay';
import FunArea from './components/FunArea';
import TicTacToe from './components/games/TicTacToe';
import { photos, messages, getRandomItem } from './data/content';
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
  daysBetween
} from './utils/storage';

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

  return <span>{timeLeft}</span>;
};

function App() {
  const [appData, setAppData] = useState(null);
  const [dailyPhoto, setDailyPhoto] = useState(null);
  const [dailyMessage, setDailyMessage] = useState(null);
  const [currentView, setCurrentView] = useState('today'); // 'today' | 'challenge' | 'admin'
  const [showSuccessEffect, setShowSuccessEffect] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = () => {
    // 1. Load data
    let data = getData();

    // 2. Check for streak loss (missed cycles)
    data = checkStreakLoss(data);

    // Migration: Reset test streak (10) if no updates have happened
    if (data.streak === 10 && !data.lastStreakUpdateDate) {
      data.streak = 0;
    }

    saveData(data); // Save potential updates from streak loss check

    const today = getTodayDate();

    // Check if we need to refresh content (every 3 days or first visit)
    if (isContentRefreshDue(data)) {
      // It's a new cycle!

      // Check for Special Message Condition (Streak 17 -> 18)
      // If streak is 17, the NEXT win will make it 18.
      // So we show the special message NOW.
      const isSpecialMoment = data.streak === 17;

      // Select new daily content
      const photo = getRandomItem(photos);
      let message = getRandomItem(messages);

      if (isSpecialMoment) {
        message = SPECIAL_MESSAGE;
      }

      const updatedData = {
        ...data,
        lastVisit: today,
        dailyContent: {
          date: today,
          photoId: photo.id,
          messageId: message.id,
          minigameId: 'tictactoe',
          isSpecial: isSpecialMoment,
        },
      };

      saveData(updatedData);
      setAppData(updatedData);
      setDailyPhoto(photo);
      setDailyMessage(message);
    } else {
      // Load existing content
      const photo = photos.find((p) => p.id === data.dailyContent.photoId) || getRandomItem(photos);
      let message = messages.find((m) => m.id === data.dailyContent.messageId) || getRandomItem(messages);

      // Fallback for special message if ID matches
      if (data.dailyContent.messageId === SPECIAL_MESSAGE.id) {
        message = SPECIAL_MESSAGE;
      }

      setAppData(data);
      setDailyPhoto(photo);
      setDailyMessage(message);
    }
  };

  const handleChallengeWin = (attempts) => {
    const result = completeChallengeForToday();
    if (result.success && !result.alreadyCompleted) {
      // Trigger Success Effect
      setShowSuccessEffect(true);
      setTimeout(() => setShowSuccessEffect(false), 3000);

      // Update local state
      setAppData(prev => ({
        ...prev,
        streak: result.newStreak,
        streakFreezes: result.freezeEarned ? prev.streakFreezes + 1 : prev.streakFreezes,
        lastStreakUpdateDate: getTodayDate(),
        nextAvailableDate: result.nextAvailableDate // Ensure this is updated if returned
      }));

      // Reload app data to ensure nextAvailableDate is synced if not returned directly
      setTimeout(() => initializeApp(), 500);
    }
  };

  if (!appData || !dailyPhoto || !dailyMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-gradient">
        <div className="text-2xl text-white font-medium animate-pulse">Wird geladen... ✨</div>
      </div>
    );
  }

  // Admin View
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard 🛠️</h1>
        <div className="space-y-4">
          <div className="card p-4">
            <h2 className="font-bold mb-2">Current State</h2>
            <pre className="text-xs bg-gray-800 text-white p-2 rounded overflow-auto">
              {JSON.stringify(appData, null, 2)}
            </pre>
          </div>

          <div className="grid gap-4">
            <button onClick={adminForceNextCycle} className="btn-primary bg-blue-500">
              Force Next Cycle (Unlock Game)
            </button>
            <button onClick={() => adminSetStreak(17)} className="btn-primary bg-purple-500">
              Set Streak to 17 (Test Special Msg)
            </button>
            <button onClick={adminResetApp} className="btn-primary bg-red-500">
              Reset App Completely
            </button>
            <button onClick={() => setCurrentView('today')} className="btn-primary bg-gray-500">
              Back to App
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isChallengeLocked = appData.lastStreakUpdateDate === getTodayDate() && appData.nextAvailableDate > getTodayDate();

  return (
    <div className="fixed inset-0 overflow-hidden bg-pastel-gradient font-sans text-gray-800 flex flex-col">

      {/* Success Overlay */}
      {showSuccessEffect && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="text-center animate-pop-in">
            <div className="text-9xl mb-4 animate-bounce">🔥</div>
            <h2 className="text-4xl font-bold text-white drop-shadow-lg">Streak erhöht!</h2>
          </div>
        </div>
      )}

      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 scroll-smooth pb-safe">
        <div className="max-w-xl mx-auto space-y-6 pb-20">

          {/* Header */}
          <header className={`text-center transition-all duration-500 ${currentView === 'challenge' ? 'mb-4' : 'mb-8'}`}>
            <h1
              onClick={(e) => e.detail === 3 && setCurrentView('admin')}
              className={`font-bold text-gray-800 transition-all duration-500 ${currentView === 'challenge' ? 'text-2xl' : 'text-4xl md:text-5xl'} mb-2 cursor-default select-none`}
            >
              Hallo Schatz ❤️
            </h1>
            <p className={`text-gray-600 font-light transition-all duration-500 ${currentView === 'challenge' ? 'text-xs opacity-0 h-0' : 'text-sm opacity-100'}`}>
              Hier ist etwas für dich
            </p>
          </header>

          {/* Navigation Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/50 p-1 rounded-full shadow-sm flex relative">
              <button
                onClick={() => setCurrentView('today')}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentView === 'today' ? 'text-gray-800' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Heute
              </button>
              <button
                onClick={() => setCurrentView('challenge')}
                className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${currentView === 'challenge' ? 'text-gray-800' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                Spiel
              </button>

              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-md transition-all duration-300 ease-out ${currentView === 'today' ? 'left-1' : 'left-[calc(50%+2px)]'
                  }`}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="transition-all duration-500 ease-in-out">

            {/* Persistent Streak Display (Full or Compact) */}
            <StreakDisplay
              streak={appData.streak}
              hasFreeze={appData.streakFreezes > 0}
              lastUpdate={appData.lastStreakUpdateDate}
              nextAvailableDate={appData.nextAvailableDate}
              isCompact={currentView === 'challenge'}
            />

            {currentView === 'today' ? (
              <div className="space-y-8 animate-fade-in">
                <EmotionalArea photo={dailyPhoto} message={dailyMessage} />
              </div>
            ) : (
              <div className="animate-slide-up">
                {isChallengeLocked ? (
                  <div className="card max-w-md mx-auto text-center py-12 bg-white/60 backdrop-blur-sm border border-white/50 shadow-lg rounded-3xl">
                    <div className="text-6xl mb-6 opacity-50 grayscale filter">🎮</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">Challenge geschafft!</h3>
                    <p className="text-gray-600 mb-8 px-6">
                      Du hast deine Flamme für heute schon gesichert. Ruh dich aus, Schatz! 💕
                    </p>

                    <div className="inline-flex items-center gap-2 bg-pastel-lavender/50 px-6 py-3 rounded-full text-gray-700 font-medium border border-pastel-lavender">
                      <span>⏳</span>
                      <span>Nächste Chance in <Countdown targetDate={appData.nextAvailableDate} /></span>
                    </div>
                  </div>
                ) : (
                  <FunArea>
                    <TicTacToe onWin={handleChallengeWin} />
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
