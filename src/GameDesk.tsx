import React from 'react';
import { useGameEngine } from './useGameEngine';

const QUARTER_METADATA = {
    1: { name: 'Ministry of Guidance', color: '#8b5cf6' },
    2: { name: 'Supreme National Security Council', color: '#ef4444' },
    3: { name: 'The Bonyads & Bazaar', color: '#f59e0b' },
    4: { name: 'Ministry of Foreign Affairs', color: '#3b82f6' },
};

const MetricBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="metric-container">
        <div className="metric-header">
            <span className="metric-label">{label}</span>
            <span className="metric-value">{Math.round(value)}%</span>
        </div>
        <div className="progress-bg">
            <div
                className="progress-fill"
                style={{ width: `${value}%`, backgroundColor: color }}
            />
        </div>
    </div>
);

const GameDesk: React.FC = () => {
    const { state, processChoice, restartGame, getCurrentCard } = useGameEngine();

    const currentCard = getCurrentCard(state);
    const ministryInfo = QUARTER_METADATA[state.currentQuarter as keyof typeof QUARTER_METADATA];

    if (state.gameStateStatus !== 'playing') {
        return (
            <div className="game-over-container">
                <div className="game-over-card">
                    <h1 className={state.gameStateStatus === 'won' ? 'text-won' : 'text-lost'}>
                        {state.gameStateStatus === 'won' ? 'The Reign Endures' : 'The Crown Falls'}
                    </h1>
                    <p>
                        {state.gameStateStatus === 'won'
                            ? `You have successfully navigated the complexities of your kingdom for ${state.currentYear} years.`
                            : `Your rule has come to a tragic end in year ${state.currentYear}, Quarter ${state.currentQuarter}.`}
                    </p>
                    <button className="restart-btn" onClick={restartGame}>Rule Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="game-layout">
            <header className="game-header">
                <div className="year-display">
                    Year {state.currentYear} <span className="quarter-text">| Q{state.currentQuarter}</span>
                </div>
                <div className="target-display">Goal: {state.targetYears} Years</div>
                {state.lifelineUsed && <div className="lifeline-badge">Lifeline Spent</div>}
            </header>

            <section className="dashboard">
                <MetricBar label="Piety" value={state.piety} color="#8b5cf6" />
                <MetricBar label="Sepah" value={state.sepah} color="#ef4444" />
                <MetricBar label="Bazaar" value={state.bazaar} color="#f59e0b" />
                <MetricBar label="Isolation" value={state.isolation} color="#3b82f6" />
                <MetricBar label="Legitimacy" value={state.legitimacy} color="#10b981" />
            </section>

            <main className="card-area">
                <div className="dilemma-card">
                    <div className="ministry-header" style={{ color: ministryInfo.color }}>
                        {ministryInfo.name}
                    </div>
                    <h2 className="card-title">{currentCard.title}</h2>
                    <p className="card-description">{currentCard.description}</p>
                    <div className="card-actions">
                        <button className="choice-btn yes-btn" onClick={() => processChoice('yes', currentCard)}>
                            {currentCard.yesText}
                        </button>
                        <button className="choice-btn no-btn" onClick={() => processChoice('no', currentCard)}>
                            {currentCard.noText}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GameDesk;
