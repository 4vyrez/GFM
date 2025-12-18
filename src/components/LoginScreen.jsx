import { useState } from 'react';

/**
 * Login Screen - Simple code-based authentication
 */
const LoginScreen = ({ onLogin }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!code.trim()) {
            setError('Bitte Code eingeben');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code.trim() }),
                credentials: 'include'
            });

            const data = await response.json();

            if (data.success) {
                onLogin(code.trim());
            } else {
                setError(data.message || 'Ungültiger Code');
            }
        } catch (err) {
            // Fallback: Try localStorage-only mode if API fails
            if (code.toLowerCase().trim() === 'luzi') {
                localStorage.setItem('gfm_auth_code', code.toLowerCase().trim());
                onLogin(code.trim());
            } else {
                setError('Verbindungsfehler - Versuche es nochmal');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 flex items-center justify-center p-4">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-10 text-6xl animate-float opacity-30">💕</div>
                <div className="absolute top-32 right-20 text-4xl animate-float-slow opacity-20">✨</div>
                <div className="absolute bottom-20 left-20 text-5xl animate-float opacity-25">💫</div>
                <div className="absolute bottom-40 right-10 text-4xl animate-float-slow opacity-30">🌸</div>
            </div>

            {/* Login Card */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-white/50">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">💝</div>
                    <h1 className="text-2xl font-bold text-gray-800">Für meine Liebste</h1>
                    <p className="text-gray-500 text-sm mt-2">Gib deinen Code ein</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <input
                            type="password"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setError('');
                            }}
                            placeholder="Dein geheimer Code..."
                            className={`
                                w-full px-6 py-4 rounded-2xl text-center text-lg font-medium
                                bg-gray-50 border-2 transition-all duration-300
                                focus:outline-none focus:ring-4 focus:ring-pink-200
                                ${error ? 'border-red-300 bg-red-50' : 'border-gray-100 focus:border-pink-300'}
                            `}
                            autoComplete="current-password"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="text-center text-red-500 text-sm font-medium animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`
                            w-full py-4 rounded-2xl font-bold text-lg
                            bg-gradient-to-r from-pink-400 to-purple-400 text-white
                            shadow-lg hover:shadow-xl transform hover:scale-[1.02]
                            transition-all duration-300
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                        `}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Wird geprüft...
                            </span>
                        ) : (
                            'Eintreten 💕'
                        )}
                    </button>
                </form>

                {/* Hint */}
                <p className="text-center text-gray-400 text-xs mt-6">
                    Nur für dich gemacht 💝
                </p>
            </div>

            {/* CSS for shake animation */}
            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default LoginScreen;
