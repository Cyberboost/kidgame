'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Profile, GameSession, GameSettings, TileState } from '@/core/types';
import { getProfile, getSettings, saveSettings, saveSession, resetAllData, exportData } from '@/core/persistence';
import { saveProfileData } from '@/profiles/profileManager';
import { DIFFICULTY_CONFIGS, getDifficultyForGrade } from '@/core/difficultyConfig';
import { generateBoard } from '@/core/boardGenerator';
import { ReviewBasket } from '@/core/reviewBasket';
import { gameEngine } from '@/core/gameEngine';
import { WordSelector } from '@/words/wordSelector';
import { getWordListForGrade } from '@/words/starterLists';
import { PerformanceTracker } from '@/words/performanceTracker';
import { getThemeById } from '@/themes/themeRegistry';
import Grid from '@/components/Grid';
import WordCard from '@/components/WordCard';
import ActionBar from '@/components/ActionBar';
import Header from '@/components/Header';
import SettingsModal from '@/components/SettingsModal';
import { LivyCharacter, LivyPose } from '@/components/characters';

function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const profileId = searchParams.get('profile');

  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<GameSession | null>(null);
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [reviewBasket, setReviewBasket] = useState<ReviewBasket | null>(null);
  const [wordSelector, setWordSelector] = useState<WordSelector | null>(null);
  const [performanceTracker, setPerformanceTracker] = useState<PerformanceTracker | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [turnNumber, setTurnNumber] = useState(0);
  const [livyPose, setLivyPose] = useState<LivyPose | null>(null);
  const [showLivy, setShowLivy] = useState(false);
  
  // Refs to track timeouts for cleanup
  const livyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (livyTimeoutRef.current) clearTimeout(livyTimeoutRef.current);
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
      if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    };
  }, []);

  const loadGame = useCallback(async () => {
    if (!profileId) {
      router.push('/');
      return;
    }

    try {
      const loadedProfile = await getProfile(profileId);
      const loadedSettings = await getSettings();

      if (!loadedProfile) {
        router.push('/');
        return;
      }

      setProfile(loadedProfile);
      setSettings(loadedSettings || {
        highContrast: false,
        dyslexicFont: false,
        speechEnabled: true,
        soundEnabled: true,
        musicEnabled: true,
      });

      // Initialize game
      const difficulty = loadedProfile.preferredDifficulty || getDifficultyForGrade(loadedProfile.defaultGrade);
      const config = DIFFICULTY_CONFIGS[difficulty];
      const { board, bunnyTraps } = generateBoard(config.gridSize);

      // Setup word lists
      const wordList = getWordListForGrade(loadedProfile.defaultGrade, loadedProfile.customWords);
      const selector = new WordSelector(wordList);
      const basket = new ReviewBasket();
      const tracker = new PerformanceTracker(loadedProfile.wordPerformance);

      setWordSelector(selector);
      setReviewBasket(basket);
      setPerformanceTracker(tracker);

      const firstWord = selector.getNextWord(0, basket);

      const newSession: GameSession = {
        id: `session-${Date.now()}`,
        mode: 'solo',
        profileIds: [profileId],
        currentPlayerIndex: 0,
        difficulty,
        grade: loadedProfile.defaultGrade,
        themeId: loadedProfile.unlockedThemes[0] || 'front-lawn',
        gridSize: config.gridSize,
        board,
        bunnyTraps,
        activeWords: wordList,
        reviewBasket: [],
        currentWordIndex: 0,
        currentWord: firstWord,
        currentInput: '',
        selectedTiles: [],
        gardenFocus: config.gardenFocusMax,
        gardenFocusMax: config.gardenFocusMax,
        streak: 0,
        bunniesRescued: 0,
        totalBunnies: bunnyTraps.length,
        wordsSpelled: 0,
        hintsDisabled: false,
        turnStartTime: Date.now(),
        sessionStartTime: Date.now(),
        completed: false,
        stats: {
          [profileId]: {
            wordsSpelled: 0,
            bunniesRescued: 0,
            letterMistakes: 0,
            incorrectSubmits: 0,
            turnsTaken: 0,
          },
        },
      };

      setSession(newSession);
      await saveSession(newSession);
    } catch (error) {
      console.error('Error loading game:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [profileId, router]);

  useEffect(() => {
    if (profileId) {
      loadGame();
    }
  }, [profileId, loadGame]);

  const handleTileClick = useCallback((row: number, col: number) => {
    if (!session || !profile || !reviewBasket) return;

    const config = DIFFICULTY_CONFIGS[session.difficulty];
    const tile = session.board[row][col];

    // Validate letter selection
    const validation = gameEngine.validateLetterSelection(session, tile, config);

    if (validation.valid) {
      // Add letter to current input
      const newInput = session.currentInput + tile.letter;
      const newSelectedTiles = [...session.selectedTiles, { row, col }];
      
      // Update tile state
      const newBoard = session.board.map(r => r.map(t => ({ ...t })));
      newBoard[row][col].selected = true;

      setSession({
        ...session,
        currentInput: newInput,
        selectedTiles: newSelectedTiles,
        board: newBoard,
      });

      setMessage('');
    } else {
      // Invalid selection
      setMessage(validation.message || '');

      if (validation.focusReduced) {
        const newFocus = session.gardenFocus - 1;
        
        if (validation.tileLocked) {
          const newBoard = session.board.map(r => r.map(t => ({ ...t })));
          newBoard[row][col].locked = true;
          setSession({ ...session, gardenFocus: newFocus, board: newBoard });
        } else {
          setSession({ ...session, gardenFocus: newFocus });
        }

        if (validation.turnEnded) {
          livyTimeoutRef.current = setTimeout(() => handleFocusZeroEndTurn(), 1500);
        }
      }

      // Update stats
      if (performanceTracker && validation.focusReduced) {
        const stats = session.stats[profile.id];
        stats.letterMistakes++;
      }
    }
  }, [session, profile, reviewBasket]);

  const handleFocusZeroEndTurn = useCallback(() => {
    if (!session || !reviewBasket || !wordSelector || !profile) return;

    const config = DIFFICULTY_CONFIGS[session.difficulty];
    
    // Add word to review basket
    reviewBasket.add(session.currentWord);
    
    // Apply consequence
    gameEngine.applyFocusZeroConsequence(session, config);
    
    // Reset and move to next turn
    gameEngine.resetTurn(session);
    const nextWord = wordSelector.getNextWord(turnNumber + 1, reviewBasket);
    
    setTurnNumber(turnNumber + 1);
    setSession({
      ...session,
      currentWord: nextWord,
      reviewBasket: reviewBasket.getAll(),
    });
    setMessage('Garden Focus reached zero. Moving to next word.');
    
    messageTimeoutRef.current = setTimeout(() => setMessage(''), 2000);
  }, [session, reviewBasket, wordSelector, turnNumber, profile]);

  const handleUndo = useCallback(() => {
    if (!session || session.selectedTiles.length === 0) return;

    const lastTile = session.selectedTiles[session.selectedTiles.length - 1];
    const newBoard = session.board.map(r => r.map(t => ({ ...t })));
    newBoard[lastTile.row][lastTile.col].selected = false;

    setSession({
      ...session,
      currentInput: session.currentInput.slice(0, -1),
      selectedTiles: session.selectedTiles.slice(0, -1),
      board: newBoard,
    });
  }, [session]);

  const handleClear = useCallback(() => {
    if (!session) return;

    const newBoard = session.board.map(row =>
      row.map(tile => ({
        ...tile,
        selected: false,
      }))
    );

    setSession({
      ...session,
      currentInput: '',
      selectedTiles: [],
      board: newBoard,
    });
  }, [session]);

  const handleSubmit = useCallback(async () => {
    if (!session || !profile || !reviewBasket || !wordSelector || !performanceTracker) return;

    const config = DIFFICULTY_CONFIGS[session.difficulty];
    const result = gameEngine.submitWord(session, config);

    if (result.correct) {
      // Mark selected tiles as cleared
      const newBoard = session.board.map(r => r.map(t => ({ ...t, selected: false })));
      session.selectedTiles.forEach(pos => {
        newBoard[pos.row][pos.col].cleared = true;
      });

      // Update bunnies rescued
      const newBunniesRescued = session.bunniesRescued + result.bunniesRescued;
      const newWordsSpelled = session.wordsSpelled + 1;
      const newStreak = session.streak + 1;

      // Remove word from review basket if it was a review word
      if (reviewBasket.has(session.currentWord)) {
        reviewBasket.remove(session.currentWord);
      }

      // Record performance
      performanceTracker.recordAttempt(
        session.currentWord,
        true,
        session.stats[profile.id].letterMistakes,
        Date.now() - session.turnStartTime
      );

      // Update stats
      const stats = session.stats[profile.id];
      stats.wordsSpelled++;
      stats.bunniesRescued += result.bunniesRescued;
      stats.turnsTaken++;

      // Check win condition
      const won = gameEngine.checkWinCondition(session, reviewBasket);

      if (won) {
        setMessage(`🎉 You won! All bunnies rescued and review basket cleared!`);
        setLivyPose('celebrating');
        setShowLivy(true);
        setSession({
          ...session,
          completed: true,
          board: newBoard,
          bunniesRescued: newBunniesRescued,
          wordsSpelled: newWordsSpelled,
          streak: newStreak,
          reviewBasket: reviewBasket.getAll(),
        });

        // Update profile stats
        profile.stats.totalGamesPlayed++;
        profile.stats.totalBunniesRescued += result.bunniesRescued;
        profile.stats.totalWordsSpelled++;
        profile.stats.currentStreak = newStreak;
        profile.wordPerformance = performanceTracker.getAllPerformances();
        await saveProfileData(profile);

        navigationTimeoutRef.current = setTimeout(() => {
          setShowLivy(false);
          router.push('/');
        }, 3000);
        return;
      }

      // Show cheering Livy for correct word
      setLivyPose('cheering');
      setShowLivy(true);
      livyTimeoutRef.current = setTimeout(() => setShowLivy(false), 1500);

      // Move to next word
      gameEngine.resetTurn(session);
      const nextWord = wordSelector.getNextWord(turnNumber + 1, reviewBasket);

      setTurnNumber(turnNumber + 1);
      setSession({
        ...session,
        board: newBoard,
        currentWord: nextWord,
        bunniesRescued: newBunniesRescued,
        wordsSpelled: newWordsSpelled,
        streak: newStreak,
        reviewBasket: reviewBasket.getAll(),
        currentInput: '',
        selectedTiles: [],
      });
      setMessage(result.message);
      messageTimeoutRef.current = setTimeout(() => setMessage(''), 2000);
    } else {
      // Incorrect submission
      reviewBasket.add(session.currentWord);
      
      performanceTracker.recordAttempt(
        session.currentWord,
        false,
        session.stats[profile.id].letterMistakes,
        Date.now() - session.turnStartTime
      );

      const stats = session.stats[profile.id];
      stats.incorrectSubmits++;

      // Show thinking Livy for incorrect submission
      setLivyPose('thinking');
      setShowLivy(true);
      livyTimeoutRef.current = setTimeout(() => setShowLivy(false), 2000);

      if (result.requireRetry) {
        // Keep same word, just reset selection
        handleClear();
        setMessage(result.message);
      } else {
        // Move to next word
        gameEngine.resetTurn(session);
        const nextWord = wordSelector.getNextWord(turnNumber + 1, reviewBasket);
        
        setTurnNumber(turnNumber + 1);
        setSession({
          ...session,
          currentWord: nextWord,
          reviewBasket: reviewBasket.getAll(),
        });
        setMessage(result.message);
      }

      messageTimeoutRef.current = setTimeout(() => setMessage(''), 3000);
    }
  }, [session, profile, reviewBasket, wordSelector, performanceTracker, turnNumber, handleClear]);

  const handleSettingsChange = async (newSettings: GameSettings) => {
    setSettings(newSettings);
    await saveSettings(newSettings);

    // Apply settings to document
    if (newSettings.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (newSettings.dyslexicFont) {
      document.body.style.fontFamily = 'OpenDyslexic, Comic Sans MS, sans-serif';
    } else {
      document.body.style.fontFamily = '';
    }
  };

  const handleResetData = async () => {
    await resetAllData();
    router.push('/');
  };

  const handleExportData = async () => {
    const data = await exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bunnies-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 to-grass-200">
        <LivyCharacter pose="thinking" size="large" animated={true} />
        <div className="text-2xl font-bold text-gray-800 mt-4">Loading game...</div>
      </div>
    );
  }

  if (!session || !settings || !profile) {
    return null;
  }

  const theme = getThemeById(session.themeId);
  const remainingBunnies = session.bunnyTraps.filter(t => !t.rescued).length;

  return (
    <div className={`min-h-screen ${theme?.styles.background || 'bg-gradient-to-b from-sky-300 to-grass-200'}`}>
      <Header
        themeName={theme?.name || 'Front Lawn'}
        bunniesRemaining={remainingBunnies}
        totalBunnies={session.totalBunnies}
        reviewBasketCount={session.reviewBasket.length}
        streak={session.streak}
        onSettings={() => setShowSettings(true)}
      />

      <div className="container mx-auto px-4 pb-8">
        {message && (
          <div className="max-w-2xl mx-auto mb-4 bg-white border-2 border-blue-400 rounded-lg p-4 text-center font-semibold text-gray-800 shadow-lg">
            {message}
          </div>
        )}

        {/* Livy character popup for reactions */}
        {showLivy && livyPose && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className="bg-white bg-opacity-90 rounded-2xl p-8 shadow-2xl">
              <LivyCharacter pose={livyPose} size="large" animated={true} />
            </div>
          </div>
        )}

        <WordCard
          word={session.currentWord}
          currentInput={session.currentInput}
          gardenFocus={session.gardenFocus}
          gardenFocusMax={session.gardenFocusMax}
          speechEnabled={settings.speechEnabled}
        />

        <Grid
          board={session.board}
          onTileClick={handleTileClick}
          disabled={session.completed}
          tileStyles={theme?.styles || {
            tileNormal: 'bg-grass-100 border-grass-400 text-gray-800',
            tileSelected: 'bg-yellow-300 border-yellow-600 text-gray-900 ring-4 ring-yellow-400',
            tileCleared: 'bg-grass-400 border-grass-600 text-grass-600',
            tileLocked: 'bg-gray-300 border-gray-500 text-gray-500 opacity-50',
          }}
        />

        <ActionBar
          onUndo={handleUndo}
          onClear={handleClear}
          onSubmit={handleSubmit}
          canUndo={session.selectedTiles.length > 0}
          canSubmit={session.currentInput.length > 0}
          disabled={session.completed}
        />
      </div>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        onResetData={handleResetData}
        onExportData={handleExportData}
      />
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 to-grass-200">
        <div className="text-2xl font-bold text-gray-800">Loading...</div>
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}
