import { useState, useEffect } from 'react';

const TicTacToe = ({ onWin }) => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost', 'draw'
    const [attempts, setAttempts] = useState(1);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    useEffect(() => {
        // Bot makes move after player
        if (!isPlayerTurn && gameStatus === 'playing') {
            const timer = setTimeout(() => {
                makeBotMove();
            }, 600); // Slightly longer delay for natural feel
            return () => clearTimeout(timer);
        }
    }, [isPlayerTurn, gameStatus]);

    const checkWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6], // diagonals
        ];

        for (let line of lines) {
            const [a, b, c] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handleClick = (index) => {
        if (board[index] || !isPlayerTurn || gameStatus !== 'playing') return;

        const newBoard = [...board];
        newBoard[index] = 'X';
        setBoard(newBoard);

        const winner = checkWinner(newBoard);
        if (winner) {
            setGameStatus('won');
            if (onWin) onWin(attempts);
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

        // Helper to check if a move leads to a win for a specific player
        const findWinningMove = (player) => {
            for (let index of emptyIndices) {
                const tempBoard = [...newBoard];
                tempBoard[index] = player;
                if (checkWinner(tempBoard) === player) {
                    return index;
                }
            }
            return -1;
        };

        // 1. Try to win
        moveIndex = findWinningMove('O');

        // 2. Block player from winning
        if (moveIndex === -1) {
            moveIndex = findWinningMove('X');
        }

        // 3. Take center if available
        if (moveIndex === -1 && newBoard[4] === null) {
            moveIndex = 4;
        }

        // 4. Take random corner
        if (moveIndex === -1) {
            const corners = [0, 2, 6, 8].filter(idx => newBoard[idx] === null);
            if (corners.length > 0) {
                moveIndex = corners[Math.floor(Math.random() * corners.length)];
            }
        }

        // 5. Take random available spot
        if (moveIndex === -1) {
            moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }

        newBoard[moveIndex] = 'O';
        setBoard(newBoard);

        const winner = checkWinner(newBoard);
        if (winner) {
            setGameStatus('lost');
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
        setGameStatus('playing');
        setAttempts(prev => prev + 1);
    };

    const getStatusMessage = () => {
        if (gameStatus === 'won') return '🎉 Du hast gewonnen!';
        if (gameStatus === 'lost') return '😈 Ich hab gewonnen!';
        if (gameStatus === 'draw') return '🤝 Unentschieden!';
        return isPlayerTurn ? 'Du bist dran 💕' : 'Ich überlege... 🤔';
    };

    return (
        <div
            className={`flex flex-col items-center transform transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
        >
            <div className="text-center mb-6">
                <div className="inline-block bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-gray-400 mb-2 shadow-sm">
                    Versuch #{attempts}
                </div>
                <p className={`text-xl font-medium transition-colors duration-300 ${gameStatus === 'won' ? 'text-green-500 scale-110' :
                    gameStatus === 'lost' ? 'text-red-400' : 'text-gray-700'
                    }`}>
                    {getStatusMessage()}
                </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-sm mx-auto mb-8 p-4 bg-white/50 rounded-2xl shadow-sm">
                {board.map((cell, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(index)}
                        disabled={!isPlayerTurn || gameStatus !== 'playing' || cell !== null}
                        className={`
                            aspect-square rounded-xl text-4xl sm:text-5xl font-bold
                            flex items-center justify-center
                            transition-all duration-200 shadow-sm
                            ${cell === null
                                ? 'bg-white hover:bg-gray-50 hover:shadow-md cursor-pointer'
                                : 'bg-white/90 cursor-default'
                            }
                            ${cell === 'X' ? 'text-pastel-pink scale-100' : 'text-pastel-lavender scale-100'}
                            ${(!isPlayerTurn || gameStatus !== 'playing') && cell === null ? 'opacity-80 cursor-not-allowed' : ''}
                        `}
                    >
                        {cell && (
                            <span className="animate-pop-in">
                                {cell}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {gameStatus !== 'playing' && (
                <button
                    onClick={resetGame}
                    className="px-8 py-3 bg-white text-gray-700 font-medium rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    Nochmal spielen 🔄
                </button>
            )}
        </div>
    );
};

export default TicTacToe;
