import { Component } from 'react';

/**
 * Error Boundary wrapper for game components
 * Catches JavaScript errors and displays a fallback UI
 */
class GameErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Game Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="text-6xl mb-4">😵</div>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                        Ups! Etwas ist schiefgelaufen
                    </h3>
                    <p className="text-gray-500 mb-4 text-sm">
                        Das Spiel hatte einen kleinen Fehler
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-xl font-bold shadow-md hover:scale-105 transition-transform"
                    >
                        Nochmal versuchen 🔄
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GameErrorBoundary;
