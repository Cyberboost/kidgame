'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Profile, GameSession, GameSettings, TileState } from '@/core/types';
import { getProfile, getSettings, saveSettings, saveSession, resetAllData, exportData } from '@/core/persistence';
import { saveProfileData } from '@/profiles/profileManager';
import { DIFFICULTY_CONFIGS, getDifficultyForGrade } from '@/core/difficultyConfig';
import { generateBoard, shuffleBoard } from '@/core/boardGenerator';
import { ReviewBasket } from '@/core/reviewBasket';
import { gameEngine } from '@/core/gameEngine';
import { WordSelector } from '@/words/wordSelector';
import { getWordListForGrade } from '@/words/starterLists';
import { PerformanceTracker } from '@/words/performanceTracker';
import { getThemeById } from '@/themes/themeRegistry';
import Grid from '@/components/Grid';
import WordCard from '@/components/WordCard';
import WordList from '@/components/WordList';
import CountdownTimer from '@/components/CountdownTimer';
import BunnyRunner from '@/components/BunnyRunner';
import ActionBar from '@/components/ActionBar';
import Header from '@/components/Header';
import SettingsModal from '@/components/SettingsModal';

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
  
  // Multi-word round state
  const [targetWords, setTargetWords] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [strikes, setStrikes] = useState(0);
  const [roundTimeRemaining, setRoundTimeRemaining] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState(Date.now());
  const [lastShuffleTime, setLastShuffleTime] = useState(Date.now());
  const [bunnyRunnerTrigger, setBunnyRunnerTrigger] = useState(0);
  const [wobble, setWobble] = useState(false);

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
      
      // Initialize multi-word round if enabled
      const multiWordMode = config.wordsPerRound && config.wordsPerRound > 1;
      let initialTargetWords: string[] = [];
      let initialTimeRemaining = 0;
      
      if (multiWordMode) {
        // Pick multiple words for the round
        const wordCount = config.wordsPerRound || 3;
        for (let i = 0; i < wordCount; i++) {
          const word = selector.getNextWord(i, basket);
          initialTargetWords.push(word);
        }
        setTargetWords(initialTargetWords);
        setFoundWords([]);
        setStrikes(0);
        
        // Initialize timer
        initialTimeRemaining = config.timerDuration || 15;
        setRoundTimeRemaining(initialTimeRemaining);
        setRoundStartTime(Date.now());
        setLastShuffleTime(Date.now());
      }

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
        currentWord: multiWordMode ? initialTargetWords[0] : firstWord,
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
        targetWords: multiWordMode ? initialTargetWords : [],
        foundWords: [],
        strikes: 0,
        roundTimeRemaining: multiWordMode ? initialTimeRemaining : 0,
        roundStartTime: Date.now(),
        lastShuffleTime: Date.now(),
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

  // Timer countdown effect
  useEffect(() => {
    if (!session || session.completed || !profile) return;
    
    const config = DIFFICULTY_CONFIGS[session.difficulty];
    const multiWordMode = config.wordsPerRound && config.wordsPerRound > 1;
    
    if (!multiWordMode || !config.timerEnabled) return;
    
    const interval = setInterval(() => {
      setRoundTimeRemaining(prev => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [session, profile]);

  // Shuffle interval effect
  useEffect(() => {
    if (!session || session.completed || !profile) return;
    
    const config = DIFFICULTY_CONFIGS[session.difficulty];
    const multiWordMode = config.wordsPerRound && config.wordsPerRound > 1;
    
    if (!multiWordMode || !config.shuffleInterval) return;
    
    const interval = setInterval(() => {
      const elapsed = (Date.now() - lastShuffleTime) / 1000;
      
      // Trigger wobble 500ms before shuffle
      if (elapsed >= config.shuffleInterval - 0.5 && !wobble) {
        setWobble(true);
      }
      
      // Perform shuffle
      if (elapsed >= config.shuffleInterval) {
        // Clear selection before shuffle
        setSession(prev => {
          if (!prev) return prev;
          const newBoard = prev.board.map(row =>
            row.map(tile => ({ ...tile, selected: false }))
          );
          return {
            ...prev,
            board: shuffleBoard(newBoard),
            currentInput: '',
            selectedTiles: [],
          };
        });
        setLastShuffleTime(Date.now());
        setWobble(false);
      }
    }, 100); // Check every 100ms for precision
    
    return () => clearInterval(interval);
  }, [session, lastShuffleTime, wobble, profile]);
  
  // Reset round function
  const resetRound = useCallback(() => {
    if (!session || !wordSelector || !reviewBasket || !profile) return;
    
    const config = DIFFICULTY_CONFIGS[session.difficulty];
    const multiWordMode = config.wordsPerRound && config.wordsPerRound > 1;
    
    if (!multiWordMode) return;
    
    // Generate new board
    const { board, bunnyTraps } = generateBoard(config.gridSize);
    
    // Pick new words
    const wordCount = config.wordsPerRound || 3;
    const newTargetWords: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      const word = wordSelector.getNextWord(turnNumber + i, reviewBasket);
      newTargetWords.push(word);
    }
    
    // Reset state
    setTargetWords(newTargetWords);
    setFoundWords([]);
    setStrikes(0);
    setRoundTimeRemaining(config.timerDuration || 15);
    setRoundStartTime(Date.now());
    setLastShuffleTime(Date.now());
    setTurnNumber(prev => prev + 1);
    setMessage('');
    
    setSession({
      ...session,
      board,
      bunnyTraps,
      currentWord: newTargetWords[0],
      currentInput: '',
      selectedTiles: [],
      gardenFocus: config.gardenFocusMax,
      turnStartTime: Date.now(),
    });
  }, [session, wordSelector, reviewBasket, turnNumber, profile]);
  
  // Handle time up
  const handleTimeUp = useCallback(() => {
    setMessage('⏰ Time\'s up! Try again!');
    setTimeout(() => {
      resetRound();
    }, 1500);
  }, [resetRound]);

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
    
    setTimeout(() => setMessage(''), 2000);
  }, [session, reviewBasket, wordSelector, turnNumber, profile]);

  const handleTileClick = useCallback((row: number, col: number) => {
    if (!session || !profile || !reviewBasket) return;

    const config = DIFFICULTY_CONFIGS[session.difficulty];
    const tile = session.board[row][col];
    const multiWordMode = config.wordsPerRound && config.wordsPerRound > 1;

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
        
        // Track strikes in multi-word mode
        if (multiWordMode) {
          const newStrikes = strikes + 1;
          setStrikes(newStrikes);
          
          if (newStrikes >= config.maxStrikes) {
            setMessage(`❌ ${config.maxStrikes} strikes! Try again!`);
            setTimeout(() => {
              resetRound();
            }, 1500);
            return;
          }
        }
        
        if (validation.tileLocked) {
          const newBoard = session.board.map(r => r.map(t => ({ ...t })));
          newBoard[row][col].locked = true;
          setSession({ ...session, gardenFocus: newFocus, board: newBoard });
        } else {
          setSession({ ...session, gardenFocus: newFocus });
        }

        if (validation.turnEnded) {
          setTimeout(() => handleFocusZeroEndTurn(), 1500);
        }
      }

      // Update stats
      if (performanceTracker && validation.focusReduced) {
        const stats = session.stats[profile.id];
        stats.letterMistakes++;
      }
    }
  }, [session, profile, reviewBasket, strikes, resetRound, handleFocusZeroEndTurn, performanceTracker]);

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
    const multiWordMode = config.wordsPerRound && config.wordsPerRound > 1;
    
    // In multi-word mode, check if word matches any target word
    let matchedWord: string | null = null;
    if (multiWordMode) {
      const submittedWord = session.currentInput.toUpperCase();
      matchedWord = targetWords.find(w => w.toUpperCase() === submittedWord) || null;
    }
    
    const result = gameEngine.submitWord(session, config);

    if (result.correct || (multiWordMode && matchedWord)) {
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
      
      // Multi-word mode: add to found words and trigger bunny animation
      if (multiWordMode && matchedWord) {
        const newFoundWords = [...foundWords, matchedWord];
        setFoundWords(newFoundWords);
        setBunnyRunnerTrigger(prev => prev + 1);
        
        // Check if all words found
        if (newFoundWords.length >= targetWords.length) {
          setMessage('🎉 All words found! Starting new round...');
          setTimeout(() => {
            resetRound();
          }, 2000);
          
          // Update session state
          setSession({
            ...session,
            board: newBoard,
            currentInput: '',
            selectedTiles: [],
            bunniesRescued: newBunniesRescued,
            wordsSpelled: newWordsSpelled,
            streak: newStreak,
            reviewBasket: reviewBasket.getAll(),
          });
          return;
        }
        
        // Continue to next word in the round
        setSession({
          ...session,
          board: newBoard,
          currentInput: '',
          selectedTiles: [],
          bunniesRescued: newBunniesRescued,
          wordsSpelled: newWordsSpelled,
          streak: newStreak,
          reviewBasket: reviewBasket.getAll(),
        });
        setMessage('✅ Word found! Keep going!');
        setTimeout(() => setMessage(''), 1500);
        return;
      }

      // Check win condition (original game mode)
      const won = gameEngine.checkWinCondition(session, reviewBasket);

      if (won) {
        setMessage(`🎉 You won! All bunnies rescued and review basket cleared!`);
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

        setTimeout(() => router.push('/'), 3000);
        return;
      }

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
      setTimeout(() => setMessage(''), 2000);
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

      setTimeout(() => setMessage(''), 3000);
    }
  }, [session, profile, reviewBasket, wordSelector, performanceTracker, turnNumber, handleClear, targetWords, foundWords, resetRound, router]);

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-300 to-grass-200">
        <div className="text-2xl font-bold text-gray-800">Loading game...</div>
      </div>
    );
  }

  if (!session || !settings || !profile) {
    return null;
  }

  const theme = getThemeById(session.themeId);
  const remainingBunnies = session.bunnyTraps.filter(t => !t.rescued).length;
  const config = DIFFICULTY_CONFIGS[session.difficulty];
  const multiWordMode = config.wordsPerRound && config.wordsPerRound > 1;

  return (
    <div className={`min-h-screen ${theme?.styles.background || 'bg-gradient-to-b from-sky-300 to-grass-200'}`}>
      <BunnyRunner trigger={bunnyRunnerTrigger} />
      
      <Header
        themeName={theme?.name || 'Front Lawn'}
        bunniesRemaining={remainingBunnies}
        totalBunnies={session.totalBunnies}
        reviewBasketCount={session.reviewBasket.length}
        streak={session.streak}
        strikes={multiWordMode ? strikes : undefined}
        maxStrikes={multiWordMode ? config.maxStrikes : undefined}
        onSettings={() => setShowSettings(true)}
      />

      <div className="container mx-auto px-4 pb-8">
        {message && (
          <div className="max-w-2xl mx-auto mb-4 bg-white border-2 border-blue-400 rounded-lg p-4 text-center font-semibold text-gray-800 shadow-lg">
            {message}
          </div>
        )}

        {multiWordMode ? (
          <>
            <CountdownTimer 
              timeRemaining={roundTimeRemaining}
              totalTime={config.timerDuration || 15}
              onTimeUp={handleTimeUp}
            />
            <WordList 
              targetWords={targetWords}
              foundWords={foundWords}
            />
          </>
        ) : (
          <WordCard
            word={session.currentWord}
            currentInput={session.currentInput}
            gardenFocus={session.gardenFocus}
            gardenFocusMax={session.gardenFocusMax}
            speechEnabled={settings.speechEnabled}
          />
        )}

        <Grid
          board={session.board}
          onTileClick={handleTileClick}
          disabled={session.completed}
          wobble={wobble}
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
