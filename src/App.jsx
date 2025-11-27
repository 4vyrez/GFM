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
  visitedToday,
  completeChallengeForToday,
  isContentRefreshDue,
  adminResetApp,
  adminForceNextCycle,
  adminSetStreak,
  SPECIAL_MESSAGE,
  daysBetween
} from './utils/storage';

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
    const data = getData();
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

  const handleChallengeWin = () => {
    const result = completeChallengeForToday();
    if (result.success && !result.alreadyCompleted) {
      // Trigger Success Effect
      setShowSuccessEffect(true);
      setTimeout(() => setShowSuccessEffect(false), 3000);

      // Update local state
      setAppData(prev => ({
        ...prev,
        streak: result.newStreak,
        lastStreakUpdateDate: getTodayDate(),
        nextAvailableDate: result.nextAvailableDate // Ensure this is updated if returned
      }));

      // Reload app data to ensure nextAvailableDate is synced if not returned directly
      setTimeout(() => initializeApp(), 500);
    }
  };

  const getDaysUntilNext = () => {
    if (!appData?.nextAvailableDate) return 0;
    const today = getTodayDate();
    if (today >= appData.nextAvailableDate) return 0;
    return daysBetween(today, appData.nextAvailableDate);
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
    <div className="h-screen overflow-hidden bg-pastel-gradient font-sans text-gray-800 relative">

      {/* Success Overlay */}
      {showSuccessEffect && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="text-center animate-pop-in">
            <div className="text-9xl mb-4 animate-bounce">🔥</div>
            <h2 className="text-4xl font-bold text-white drop-shadow-lg">Streak erhöht!</h2>
          </div>
        </div>
      )}

      <div className="h-full overflow-y-auto py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-8 pb-20">

          {/* Header */}
          <header className={`text-center transition-all duration-500 ${currentView === 'challenge' ? 'mb-6' : 'mb-10'}`}>
            <h1
              onClick={(e) => e.detail === 3 && setCurrentView('admin')}
              className={`font-bold text-gray-800 transition-all duration-500 ${currentView === 'challenge' ? 'text-3xl' : 'text-4xl md:text-5xl'} mb-2 cursor-default select-none`}
            >
              Hallo Schatz ❤️
            </h1>
            <p className="text-gray-600 font-light">Hier ist etwas für dich</p>
          </header>

          {/* Navigation Toggle */}
          <div className="flex justify-center mb-8">
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
            {currentView === 'today' ? (
              <div className="space-y-8 animate-fade-in">
                <StreakDisplay
                  streak={appData.streak}
                  hasFreeze={appData.streakFreezes > 0}
                  lastUpdate={appData.lastStreakUpdateDate}
                />

                {/* Timer / Info if locked */}
                {isChallengeLocked && (
                  <div className="text-center text-sm text-gray-500 bg-white/40 py-2 rounded-full max-w-xs mx-auto mb-4">
                    ⏰ Nächste Flamme in {getDaysUntilNext()} Tagen
                  </div>
                )}

                <EmotionalArea photo={dailyPhoto} message={dailyMessage} />
              </div>
            ) : (
              <div className="animate-fade-in">
                {isChallengeLocked ? (
                  <div className="card max-w-md mx-auto text-center py-12">
                    <div className="text-6xl mb-4">🔒</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Challenge geschafft!</h3>
                    <p className="text-gray-600 mb-6">Du hast deine Flamme für heute schon gesichert.</p>
                    <div className="inline-block bg-pastel-lavender px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                      Nächste Chance in {getDaysUntilNext()} Tagen
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
