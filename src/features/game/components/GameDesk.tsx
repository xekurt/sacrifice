import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGameEngine } from '../hooks/useGameEngine';

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
    const { t } = useTranslation();
    const { state, processChoice, restartGame, getCurrentCard } = useGameEngine();

    const currentCard = getCurrentCard(state);

    const QUARTER_METADATA = {
        1: { name: t('ministries.m1'), color: '#8b5cf6' },
        2: { name: t('ministries.m2'), color: '#ef4444' },
        3: { name: t('ministries.m3'), color: '#f59e0b' },
        4: { name: t('ministries.m4'), color: '#3b82f6' },
    };

    const ministryInfo = QUARTER_METADATA[state.currentQuarter as keyof typeof QUARTER_METADATA];

    if (state.gameStateStatus !== 'playing') {
        return (
            <div className="game-over-container">
                <div className="game-over-card">
                    <h1 className={state.gameStateStatus === 'won' ? 'text-won' : 'text-lost'}>
                        {state.gameStateStatus === 'won' ? t('game.reign_endures') : t('game.crown_falls')}
                    </h1>
                    <p>
                        {state.gameStateStatus === 'won'
                            ? t('game.win_message', { years: state.currentYear })
                            : t('game.loss_message', { year: state.currentYear, quarter: state.currentQuarter })}
                    </p>
                    <button className="restart-btn" onClick={restartGame}>{t('game.restart')}</button>
                </div>
            </div>
        );
    }

    return (
        <div className="game-layout">
            <header className="game-header">
                <div className="year-display">
                    {t('game.year')} {state.currentYear} <span className="quarter-text">| {t('game.quarter')}{state.currentQuarter}</span>
                </div>
                <div className="target-display">{t('game.goal', { years: state.targetYears })}</div>
                {state.lifelineUsed && <div className="lifeline-badge">{t('game.lifeline_spent')}</div>}
            </header>

            <section className="dashboard">
                <MetricBar label={t('metrics.piety')} value={state.piety} color="#8b5cf6" />
                <MetricBar label={t('metrics.sepah')} value={state.sepah} color="#ef4444" />
                <MetricBar label={t('metrics.bazaar')} value={state.bazaar} color="#f59e0b" />
                <MetricBar label={t('metrics.isolation')} value={state.isolation} color="#3b82f6" />
                <MetricBar label={t('metrics.legitimacy')} value={state.legitimacy} color="#10b981" />
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
