import { useState, useEffect } from 'react';
import EmotionalArea from './components/EmotionalArea';
import StreakDisplay from './components/StreakDisplay';
import FunArea from './components/FunArea';
import TicTacToe from './components/games/TicTacToe';
import { photos, messages, getRandomItem, shouldShowMinigame } from './data/content';
import {
  getData,
  saveData,
  getTodayDate,
  visitedYesterday,
  visitedToday,
} from './utils/storage';

function App() {
  const [appData, setAppData] = useState(null);
  const [dailyPhoto, setDailyPhoto] = useState(null);
  const [dailyMessage, setDailyMessage] = useState(null);
  const [showMinigame, setShowMinigame] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = () => {
    const data = getData();
    const today = getTodayDate();

    // Check if this is a new day
    if (!visitedToday(data.lastVisit)) {
      // Calculate new streak
      let newStreak = data.streak;

      if (visitedYesterday(data.lastVisit)) {
        // Continue streak
        newStreak = data.streak + 1;
      } else if (data.lastVisit === null) {
        // First visit ever
        newStreak = 1;
      } else {
        // Streak broken - but we don't punish! Just reset to 1
        newStreak = 1;
      }

      // Select new daily content
      const photo = getRandomItem(photos);
      const message = getRandomItem(messages);
      const hasMinigame = shouldShowMinigame(newStreak);

      const updatedData = {
        ...data,
        lastVisit: today,
        streak: newStreak,
        dailyContent: {
          date: today,
          photoId: photo.id,
          messageId: message.id,
          minigameId: hasMinigame ? 'tictactoe' : null,
        },
      };

      saveData(updatedData);
      setAppData(updatedData);
      setDailyPhoto(photo);
      setDailyMessage(message);
      setShowMinigame(hasMinigame);
    } else {
      // Same day - load existing content
      const photo = photos.find((p) => p.id === data.dailyContent.photoId) || getRandomItem(photos);
      const message = messages.find((m) => m.id === data.dailyContent.messageId) || getRandomItem(messages);
      const hasMinigame = data.dailyContent.minigameId !== null;

      setAppData(data);
      setDailyPhoto(photo);
      setDailyMessage(message);
      setShowMinigame(hasMinigame);
    }
  };

  if (!appData || !dailyPhoto || !dailyMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-700">Wird geladen... ✨</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
            Hallo Schatz ❤️
          </h1>
          <p className="text-gray-600">Hier ist etwas für dich</p>
        </header>

        {/* Streak Display */}
        <StreakDisplay streak={appData.streak} hasFreeze={appData.streakFreezes > 0} />

        {/* Emotional Area (Main Content) */}
        <EmotionalArea photo={dailyPhoto} message={dailyMessage} />

        {/* Fun Area */}
        {showMinigame && (
          <FunArea minigame={<TicTacToe />} />
        )}
      </div>
    </div>
  );
}

export default App;
