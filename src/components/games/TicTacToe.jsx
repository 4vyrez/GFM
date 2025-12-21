import { useState, useEffect } from 'react';
import { SparkleIcon } from '../icons/Icons';

const TicTacToe = ({ onWin }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [gameStatus, setGameStatus] = useState('selecting'); // selecting, playing, won, lost, draw
    const [difficulty, setDifficulty] = useState('normal'); // easy, normal, hard
    const [attempts, setAttempts] = useState(1);
    const [moveCount, setMoveCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [winningLine, setWinningLine] = useState([]);
    const [lastMove, setLastMove] = useState(null);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    useEffect(() => {
        if (!isPlayerTurn && gameStatus === 'playing') {
            const timer = setTimeout(() => {
                makeBotMove();
            }, 700);
            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, gameStatus]);

    const checkWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];

        for (let line of lines) {
            const [a, b, c] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a], line };
            }
        }
        return null;
    };

    const handleClick = (index) => {
        if (board[index] || !isPlayerTurn || gameStatus !== 'playing') return;

        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);
        setMoveCount(prev => prev + 1);
        setLastMove(index);

        const result = checkWinner(newBoard);
        if (result) {
            setGameStatus('won');
            setWinningLine(result.line);
            if (onWin) onWin({ gameId: 'tictactoe-1', metric: 'moves', value: moveCount + 1 });
            return;
        }

        if (newBoard.every((cell) => cell !== null)) {
            setGameStatus('draw');
            return;
        }

        setIsPlayerTurn(false);
    };

    const makeBotMove = () => {
        const newBoard = [...board];
        const emptyIndices = newBoard
            .map((cell, idx) => (cell === null ? idx : -1))
            .filter((idx) => idx !== -1);

        if (emptyIndices.length === 0) return;

        let moveIndex = -1;

        const findWinningMove = (player) => {
            for (let index of emptyIndices) {
                const tempBoard = [...newBoard];
                tempBoard[index] = player;
                if (checkWinner(tempBoard)?.winner === player) {
                    return index;
                }
            }
            return -1;
        };

        // Easy mode: 50% chance to make a mistake
        if (difficulty === 'easy' && Math.random() < 0.5) {
            moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        } else {
            // Normal/Hard: Try to win or block
            moveIndex = findWinningMove('O');
            if (moveIndex === -1) moveIndex = findWinningMove('X');
            if (moveIndex === -1 && newBoard[4] === null) moveIndex = 4;
            if (moveIndex === -1) {
                const corners = [0, 2, 6, 8].filter(idx => newBoard[idx] === null);
                if (corners.length > 0) {
                    moveIndex = corners[Math.floor(Math.random() * corners.length)];
                }
            }
            // Hard mode: Never miss a winning opportunity (already covered above)
            // Normal mode: Occasionally pick random
            if (moveIndex === -1 || (difficulty === 'normal' && Math.random() < 0.2)) {
                moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            }
        }

        newBoard[moveIndex] = 'O';
        setBoard(newBoard);
        setLastMove(moveIndex);

        const result = checkWinner(newBoard);
        if (result) {
            setGameStatus('lost');
            setWinningLine(result.line);
            return;
        }

        if (newBoard.every((cell) => cell !== null)) {
            setGameStatus('draw');
            return;
        }

        setIsPlayerTurn(true);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setGameStatus('selecting');
        setAttempts(prev => prev + 1);
        setMoveCount(0);
        setWinningLine([]);
        setLastMove(null);
    };

    const startGame = (diff) => {
        setDifficulty(diff);
        setBoard(Array(9).fill(null));
        setIsPlayerTurn(true);
        setGameStatus('playing');
        setMoveCount(0);
        setWinningLine([]);
        setLastMove(null);
    };

    const getStatusMessage = () => {
        if (gameStatus === 'won') return '🎉 GG! Du hast gewonnen!';
        if (gameStatus === 'lost') return '😈 Ich hab gewonnen! Rematch?';
        if (gameStatus === 'draw') return '🤝 Unentschieden! Wir sind beide gut!';
        return isPlayerTurn ? 'Du bist dran 💕' : 'Hmm... ich überlege... 🤔';
    };

    return (
        <div
            className={`
                flex flex-col items-center
                transform transition-all duration-700 ease-apple
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}
        >
            {/* Status Header */}
            <div className="text-center mb-6 w-full">
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-4 py-1.5 rounded-full text-xs font-bold text-gray-400 mb-3 shadow-sm border border-white/50">
                    <span>Versuch #{attempts}</span>
                    {gameStatus === 'playing' && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span>{moveCount} Züge</span>
                        </>
                    )}
                </div>

                <p className={`
                    text-xl font-bold transition-all duration-300
                    ${gameStatus === 'won' ? 'text-green-500 scale-105' :
                        gameStatus === 'lost' ? 'text-red-400' : 'text-gray-700'}
                `}>
                    {gameStatus === 'selecting' ? 'Wähle Schwierigkeit! 🎮' : getStatusMessage()}
                </p>
            </div>

            {/* Difficulty Selection */}
            {gameStatus === 'selecting' && (
                <div className="flex flex-col items-center gap-4 mb-6 animate-fade-in">
                    <div className="flex gap-3">
                        <button
                            onClick={() => startGame('easy')}
                            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-br from-green-400 to-green-500 text-white shadow-md hover:scale-105 transition-transform"
                        >
                            😊 Leicht
                        </button>
                        <button
                            onClick={() => startGame('normal')}
                            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md hover:scale-105 transition-transform"
                        >
                            😏 Normal
                        </button>
                        <button
                            onClick={() => startGame('hard')}
                            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-br from-red-400 to-red-500 text-white shadow-md hover:scale-105 transition-transform"
                        >
                            🔥 Schwer
                        </button>
                    </div>
                    <p className="text-xs text-gray-400">
                        {difficulty === 'easy' ? 'Der Bot macht Fehler' :
                            difficulty === 'hard' ? 'Der Bot spielt optimal' : 'Ausgewogen'}
                    </p>
                </div>
            )}

            {/* Game Board with 3D perspective */}
            <div className="perspective-1000 w-full max-w-sm mx-auto mb-8">
                <div className="grid grid-cols-3 gap-3 p-5 bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-sm rounded-3xl shadow-glass border border-white/50">
                    {board.map((cell, index) => {
                        const isWinningCell = winningLine.includes(index);
                        const isLastMoveCell = lastMove === index;

                        return (
                            <button
                                key={index}
                                onClick={() => handleClick(index)}
                                disabled={!isPlayerTurn || gameStatus !== 'playing' || cell !== null}
                                className={`
                                    game-cell
                                    text-4xl sm:text-5xl font-black
                                    ${cell === null && isPlayerTurn && gameStatus === 'playing'
                                        ? 'hover:bg-pastel-pink/10 hover:border-pastel-pink/30'
                                        : ''}
                                    ${isWinningCell ? 'bg-green-100 border-green-300 shadow-glow-pink' : ''}
                                    ${isLastMoveCell && cell ? 'animate-pop-in' : ''}
                                    ${(!isPlayerTurn || gameStatus !== 'playing') && cell === null
                                        ? 'opacity-60 cursor-not-allowed' : ''}
                                `}
                            >
                                {cell && (
                                    <span className={`
                                        inline-block
                                        ${cell === 'X'
                                            ? 'text-gradient-warm'
                                            : 'text-pastel-lavender'}
                                    `}>
                                        {cell}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Result Actions */}
            {gameStatus !== 'playing' && (
                <div className="flex flex-col items-center gap-3 animate-slide-up">
                    {gameStatus === 'won' && (
                        <div className="flex items-center gap-2 text-green-500 mb-2">
                            <SparkleIcon className="w-5 h-5" />
                            <span className="text-sm font-bold">
                                {moveCount <= 3 ? 'Perfekt! 🌟' : moveCount <= 5 ? 'Sehr gut! ✨' : 'Geschafft! 💪'}
                            </span>
                            <SparkleIcon className="w-5 h-5" />
                        </div>
                    )}

                    <button
                        onClick={resetGame}
                        className="btn-secondary"
                    >
                        Nochmal spielen 🔄
                    </button>
                </div>
            )}
        </div>
    );
};

export default TicTacToe;
