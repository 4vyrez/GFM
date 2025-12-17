import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

/**
 * PathFinder Game - Find the path through a simple maze
 * Click cells to mark the path from start to end
 */
const PathFinder = ({ onWin }) => {
    const [path, setPath] = useState([]);
    const [won, setWon] = useState(false);
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    // Simple 5x5 grid maze
    // 0 = wall, 1 = path, 2 = start, 3 = end
    const maze = [
        [2, 1, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 0, 3],
    ];

    // The correct path coordinates
    const correctPath = [
        [0, 0], [0, 1], [1, 1], [1, 2], [1, 3],
        [2, 3], [3, 3], [3, 2], [3, 1], [4, 1], [4, 4]
    ];

    const startPos = [0, 0];
    const endPos = [4, 4];

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const isAdjacent = (pos1, pos2) => {
        const rowDiff = Math.abs(pos1[0] - pos2[0]);
        const colDiff = Math.abs(pos1[1] - pos2[1]);
        // Adjacent means exactly one step in row OR column (not diagonal)
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    };

    const isInPath = (row, col) => {
        return path.some(p => p[0] === row && p[1] === col);
    };

    const handleCellClick = (row, col) => {
        if (won) return;

        const cell = maze[row][col];

        // Can't click walls
        if (cell === 0) return;

        const posKey = [row, col];

        // If clicking start, begin path
        if (cell === 2 && path.length === 0) {
            setPath([posKey]);
            return;
        }

        // If already in path, allow removing (undo)
        if (isInPath(row, col)) {
            const index = path.findIndex(p => p[0] === row && p[1] === col);
            // Can only remove from end
            if (index === path.length - 1 && path.length > 1) {
                setPath(path.slice(0, -1));
            }
            return;
        }

        // Check if adjacent to last path position
        if (path.length > 0) {
            const lastPos = path[path.length - 1];
            if (!isAdjacent(lastPos, posKey)) return;
        }

        const newPath = [...path, posKey];
        setPath(newPath);

        // Check for win
        if (cell === 3) {
            setWon(true);
            setTimeout(() => {
                if (onWin) {
                    onWin({
                        gameId: 'path-finder-1',
                        metric: 'steps',
                        value: newPath.length,
                    });
                }
            }, 1500);
        }
    };

    const resetGame = () => {
        setPath([]);
        setWon(false);
        setAttempts(prev => prev + 1);
    };

    const getCellStyle = (row, col) => {
        const cell = maze[row][col];
        const inPath = isInPath(row, col);
        const isStart = cell === 2;
        const isEnd = cell === 3;
        const isWall = cell === 0;

        if (isWall) return 'bg-gray-300 cursor-not-allowed';
        if (isStart) return inPath ? 'bg-green-400 border-green-500' : 'bg-green-200 border-green-400';
        if (isEnd) return won ? 'bg-yellow-400 border-yellow-500 animate-pulse' : 'bg-yellow-200 border-yellow-400';
        if (inPath) return 'bg-pastel-lavender border-purple-300';
        return 'bg-white/80 hover:bg-pastel-pink/30 border-gray-200';
    };

    const getCellContent = (row, col) => {
        const cell = maze[row][col];
        if (cell === 2) return '🚀';
        if (cell === 3) return '🏠';
        if (isInPath(row, col)) return '•';
        return '';
    };

    return (
        <div
            className={`
                flex flex-col items-center w-full
                transform transition-all duration-700 ease-apple
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
        >
            {/* Header */}
            <div className="text-center mb-6 w-full">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs font-bold text-gray-400 mb-3 shadow-sm border border-white/50">
                    <span>Versuch #{attempts}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{path.length} Schritte</span>
                </div>

                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${won ? 'text-green-500 scale-105' : 'text-gray-700'}
                `}>
                    {won ? '🎉 Weg gefunden!' : 'Finde den Weg! 🗺️'}
                </p>
            </div>

            {/* Instructions */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                <span>🚀 Start</span>
                <span>→</span>
                <span>🏠 Ziel</span>
            </div>

            {/* Maze Grid */}
            <div className="bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-glass border border-white/50 mb-6">
                <div className="grid grid-cols-5 gap-1">
                    {maze.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                            <button
                                key={`${rowIndex}-${colIndex}`}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                disabled={won || cell === 0}
                                className={`
                                    w-12 h-12 rounded-lg
                                    flex items-center justify-center
                                    text-xl font-bold
                                    border-2 transition-all duration-200
                                    ${getCellStyle(rowIndex, colIndex)}
                                    ${!won && cell !== 0 ? 'hover:scale-105' : ''}
                                `}
                            >
                                {getCellContent(rowIndex, colIndex)}
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Hint */}
            {path.length === 0 && !won && (
                <p className="text-sm text-gray-400 mb-4">
                    Klicke auf 🚀 um zu starten!
                </p>
            )}

            {/* Result */}
            {won && (
                <div className="text-center animate-slide-up">
                    <div className="flex items-center justify-center gap-2 text-green-500 mb-2">
                        <SparkleIcon className="w-5 h-5" />
                        <p className="text-lg font-bold">Super Navigator! 🧭</p>
                        <SparkleIcon className="w-5 h-5" />
                    </div>
                    <p className="text-gray-500 text-sm">
                        Du hast den Weg in {path.length} Schritten gefunden!
                    </p>
                </div>
            )}

            {/* Reset Button */}
            {path.length > 0 && !won && (
                <button onClick={resetGame} className="btn-secondary">
                    Neustart 🔄
                </button>
            )}
        </div>
    );
};

export default PathFinder;
