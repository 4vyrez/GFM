import { useState, useEffect, useCallback } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * Premium Word Puzzle Game with letter shuffle animations
 */
const WordPuzzle = ({ onWin }) => {
    const gridSize = 8;
    const wordsToFind = ['LIEBE', 'HERZ', 'KUSS', 'PAAR', 'GERN', 'EWIG'];

    const [grid, setGrid] = useState([]);
    const [foundWords, setFoundWords] = useState([]);
    const [foundCells, setFoundCells] = useState([]);
    const [selectedCells, setSelectedCells] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [gameState, setGameState] = useState('ready');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
        initializeGame();
    }, []);

    useEffect(() => {
        let interval;
        if (gameState === 'playing') {
            interval = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [gameState, startTime]);

    const initializeGame = () => {
        const newGrid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

        wordsToFind.forEach(word => {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 100) {
                const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
                const row = Math.floor(Math.random() * gridSize);
                const col = Math.floor(Math.random() * gridSize);

                if (canPlaceWord(newGrid, word, row, col, direction)) {
                    placeWord(newGrid, word, row, col, direction);
                    placed = true;
                }
                attempts++;
            }
        });

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (newGrid[i][j] === '') {
                    newGrid[i][j] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }

        setGrid(newGrid);
        setFoundWords([]);
        setFoundCells([]);
        setSelectedCells([]);
        setGameState('ready');
        setElapsedTime(0);
    };

    const canPlaceWord = (grid, word, row, col, direction) => {
        if (direction === 'horizontal') {
            if (col + word.length > gridSize) return false;
            for (let i = 0; i < word.length; i++) {
                if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) return false;
            }
        } else {
            if (row + word.length > gridSize) return false;
            for (let i = 0; i < word.length; i++) {
                if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) return false;
            }
        }
        return true;
    };

    const placeWord = (grid, word, row, col, direction) => {
        for (let i = 0; i < word.length; i++) {
            if (direction === 'horizontal') {
                grid[row][col + i] = word[i];
            } else {
                grid[row + i][col] = word[i];
            }
        }
    };

    const startGame = () => {
        setGameState('playing');
        setStartTime(Date.now());
    };

    const handleCellDown = (row, col) => {
        if (gameState !== 'playing') return;

        if (isDragging) {
            const start = selectedCells[0];
            if (start) {
                handleCellEnter(row, col);
            }
            commitSelection();
            return;
        }

        setIsDragging(true);
        setSelectedCells([{ row, col }]);
    };

    const handleCellEnter = (row, col) => {
        if (!isDragging || gameState !== 'playing') return;

        const start = selectedCells[0];
        if (!start) return;

        if (row === start.row) {
            const minCol = Math.min(start.col, col);
            const maxCol = Math.max(start.col, col);
            const newSelection = [];
            for (let c = minCol; c <= maxCol; c++) {
                newSelection.push({ row: start.row, col: c });
            }
            setSelectedCells(newSelection);
        } else if (col === start.col) {
            const minRow = Math.min(start.row, row);
            const maxRow = Math.max(start.row, row);
            const newSelection = [];
            for (let r = minRow; r <= maxRow; r++) {
                newSelection.push({ row: r, col: start.col });
            }
            setSelectedCells(newSelection);
        }
    };

    const handleTouchMove = (e) => {
        if (!isDragging || gameState !== 'playing') return;

        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        if (element && element.dataset.row !== undefined && element.dataset.col !== undefined) {
            const row = parseInt(element.dataset.row);
            const col = parseInt(element.dataset.col);
            handleCellEnter(row, col);
        }
    };

    const handleTouchEnd = () => {
        if (isDragging) {
            commitSelection();
        }
    };

    const commitSelection = () => {
        setIsDragging(false);

        const selectedWord = selectedCells.map(cell => grid[cell.row][cell.col]).join('');
        const reversedWord = selectedWord.split('').reverse().join('');

        let matchedWord = null;
        if (wordsToFind.includes(selectedWord) && !foundWords.includes(selectedWord)) {
            matchedWord = selectedWord;
        } else if (wordsToFind.includes(reversedWord) && !foundWords.includes(reversedWord)) {
            matchedWord = reversedWord;
        }

        if (matchedWord) {
            setFoundWords(prev => [...prev, matchedWord]);
            setFoundCells(prev => [...prev, ...selectedCells.map(c => `${c.row}-${c.col}`)]);

            // Check win condition
            const newFoundCount = foundWords.length + 1;
            if (newFoundCount === wordsToFind.length) {
                setGameState('won');
                const finalTime = Math.round((Date.now() - startTime) / 1000);
                setTimeout(() => {
                    if (onWin) {
                        onWin({
                            gameId: 'word-puzzle-1',
                            metric: 'seconds',
                            value: finalTime
                        });
                    }
                }, 1500);
            }
        }

        setSelectedCells([]);
    };

    const handleCellUp = () => {
        if (!isDragging || gameState !== 'playing') return;
        if (selectedCells.length > 1) {
            commitSelection();
        }
    };

    const isSelected = (row, col) => {
        return selectedCells.some(cell => cell.row === row && cell.col === col);
    };

    const isFoundCell = (row, col) => {
        return foundCells.includes(`${row}-${col}`);
    };

    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const tenths = Math.floor((ms % 1000) / 100);
        return `${seconds}.${tenths}s`;
    };

    return (
        <div
            className={`
                flex flex-col items-center w-full select-none
                transform transition-all duration-700 ease-apple
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
            onMouseUp={handleCellUp}
            onMouseLeave={handleCellUp}
        >
            {/* Header */}
            <div className="text-center mb-6">
                <div className="badge mb-3">
                    {gameState === 'playing' ? formatTime(elapsedTime) : 'Wort Suche'}
                </div>

                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${gameState === 'won' ? 'text-green-500' : 'text-gray-700'}
                `}>
                    {gameState === 'won' ? '🎉 Alle Wörter gefunden!' : 'Finde die versteckten Wörter!'}
                </p>
            </div>

            {/* Word List */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
                {wordsToFind.map((word, index) => (
                    <span
                        key={word}
                        style={{ animationDelay: `${index * 100}ms` }}
                        className={`
                            px-4 py-2 rounded-xl text-sm font-bold
                            transition-all duration-300 ease-bouncy
                            ${foundWords.includes(word)
                                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md scale-105'
                                : 'bg-white/80 text-gray-600 shadow-sm'}
                        `}
                    >
                        {foundWords.includes(word) ? (
                            <span className="flex items-center gap-1">
                                <span className="line-through opacity-70">{word}</span>
                                <span className="animate-pop-in">✓</span>
                            </span>
                        ) : word}
                    </span>
                ))}
            </div>

            {/* Progress */}
            <div className="flex gap-2 mb-4">
                {wordsToFind.map((_, index) => (
                    <div
                        key={index}
                        className={`
                            w-3 h-3 rounded-full transition-all duration-500 ease-bouncy
                            ${index < foundWords.length
                                ? 'bg-gradient-to-br from-green-400 to-green-500 scale-110'
                                : 'bg-gray-200'}
                        `}
                    />
                ))}
            </div>

            {/* Grid */}
            <div className="perspective-1000 mb-6">
                <div
                    className="grid gap-1.5 p-4 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-2xl shadow-glass border border-white/50 touch-none"
                    style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {grid.map((row, r) => (
                        row.map((letter, c) => {
                            const selected = isSelected(r, c);
                            const found = isFoundCell(r, c);

                            return (
                                <div
                                    key={`${r}-${c}`}
                                    data-row={r}
                                    data-col={c}
                                    onMouseDown={() => handleCellDown(r, c)}
                                    onMouseEnter={() => handleCellEnter(r, c)}
                                    onTouchStart={() => handleCellDown(r, c)}
                                    style={{ animationDelay: `${(r * gridSize + c) * 20}ms` }}
                                    className={`
                                        w-8 h-8 sm:w-10 sm:h-10
                                        flex items-center justify-center
                                        text-lg font-black rounded-lg
                                        cursor-pointer select-none
                                        transition-all duration-200 ease-bouncy
                                        animate-fade-in
                                        ${selected
                                            ? 'bg-gradient-to-br from-pastel-blue to-blue-400 text-white scale-110 shadow-lg z-10'
                                            : found
                                                ? 'bg-gradient-to-br from-green-200 to-green-300 text-green-700'
                                                : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-105'}
                                        border border-white/50
                                    `}
                                >
                                    {letter}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>

            {/* Start Button */}
            {gameState === 'ready' && (
                <button
                    onClick={startGame}
                    className="btn-primary animate-fade-in"
                >
                    Starten 📝
                </button>
            )}

            {/* Win State */}
            {gameState === 'won' && (
                <div className="text-center animate-slide-up">
                    <div className="flex items-center justify-center gap-2 text-green-500 mb-3">
                        <SparkleIcon className="w-5 h-5" />
                        <span className="font-bold">Geschafft in {formatTime(elapsedTime)}!</span>
                        <SparkleIcon className="w-5 h-5" />
                    </div>
                    <button
                        onClick={initializeGame}
                        className="btn-secondary"
                    >
                        Nochmal spielen 🔄
                    </button>
                </div>
            )}
        </div>
    );
};

export default WordPuzzle;
