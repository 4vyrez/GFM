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
  visitedYesterday,
  visitedToday,
  completeChallengeForToday,
} from './utils/storage';

function App() {
  const [appData, setAppData] = useState(null);
  const [dailyPhoto, setDailyPhoto] = useState(null);
  const [dailyMessage, setDailyMessage] = useState(null);
  const [currentView, setCurrentView] = useState('today'); // 'today' | 'challenge'

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = () => {
    const data = getData();
    const today = getTodayDate();

    // Check if this is a new day
    if (!visitedToday(data.lastVisit)) {
      // Calculate new streak (preliminary check, actual update happens on win)
      // For display purposes, we show the CURRENT streak.
      // If they missed a day, we reset to 0 internally? 
      // User requirement: "Kein automatisches Zurücksetzen auf 0 bei Lücken."
      // So streak stays as is.

      let currentStreak = data.streak;

      // Select new daily content
      const photo = getRandomItem(photos);
      const message = getRandomItem(messages);

      const updatedData = {
        ...data,
        lastVisit: today,
        dailyContent: {
          date: today,
          photoId: photo.id,
          messageId: message.id,
          minigameId: 'tictactoe', // Always available now
        },
      };

      saveData(updatedData);
      setAppData(updatedData);
      setDailyPhoto(photo);
      setDailyMessage(message);
    } else {
      // Same day - load existing content
      const photo = photos.find((p) => p.id === data.dailyContent.photoId) || getRandomItem(photos);
      const message = messages.find((m) => m.id === data.dailyContent.messageId) || getRandomItem(messages);

      setAppData(data);
      setDailyPhoto(photo);
      setDailyMessage(message);
    }
  };

  const handleChallengeWin = () => {
    const result = completeChallengeForToday();
    if (result.success && !result.alreadyCompleted) {
      // Update local state to reflect new streak immediately
      setAppData(prev => ({
        ...prev,
        streak: result.newStreak,
        lastStreakUpdateDate: getTodayDate()
      }));
    }
  };

  if (!appData || !dailyPhoto || !dailyMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-gradient">
        <div className="text-2xl text-white font-medium animate-pulse">Wird geladen... ✨</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 font-sans text-gray-800">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <header className={`text-center transition-all duration-500 ${currentView === 'challenge' ? 'mb-6' : 'mb-10'}`}>
          <h1 className={`font-bold text-gray-800 transition-all duration-500 ${currentView === 'challenge' ? 'text-3xl' : 'text-4xl md:text-5xl'} mb-2`}>
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

            {/* Sliding Background */}
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
              <EmotionalArea photo={dailyPhoto} message={dailyMessage} />
            </div>
          ) : (
            <div className="animate-fade-in">
              <FunArea>
                <TicTacToe onWin={handleChallengeWin} />
              </FunArea>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
