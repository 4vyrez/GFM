import { useState, useEffect } from 'react';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(true);
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost', 'draw'
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    useEffect(() => {
        // Bot makes move after player
        if (!isPlayerTurn && gameStatus === 'playing') {
            setTimeout(() => {
                makeBotMove();
            }, 500);
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

        // Simple bot: random move
        const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        newBoard[randomIndex] = 'O';
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
    };

    const getStatusMessage = () => {
        if (gameStatus === 'won') return '🎉 Du hast gewonnen!';
        if (gameStatus === 'lost') return '😊 Der Bot war schneller!';
        if (gameStatus === 'draw') return '🤝 Unentschieden!';
        return isPlayerTurn ? 'Du bist dran (X)' : 'Bot denkt nach...';
    };

    return (
        <div
            className={`transform transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
        >
            <div className="text-center mb-4">
                <p className="text-xl font-medium text-gray-800">{getStatusMessage()}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
                {board.map((cell, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(index)}
                        className={`
              aspect-square rounded-lg text-3xl font-bold
              transition-all duration-200
              ${cell === null
                                ? 'bg-white/60 hover:bg-white/80 hover:scale-105'
                                : 'bg-white/90'
                            }
              ${cell === 'X' ? 'text-pastel-pink' : 'text-pastel-lavender'}
              ${!isPlayerTurn || gameStatus !== 'playing' ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
                        disabled={!isPlayerTurn || gameStatus !== 'playing' || cell !== null}
                    >
                        {cell}
                    </button>
                ))}
            </div>

            {gameStatus !== 'playing' && (
                <div className="text-center">
                    <button
                        onClick={resetGame}
                        className="btn-primary"
                    >
                        Nochmal spielen
                    </button>
                </div>
            )}
        </div>
    );
};

export default TicTacToe;
