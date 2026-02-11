import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameEngine } from '../hooks/useGameEngine';
import GameButton from '../../../shared/components/GameButton';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import ImaginaryMap from './ImaginaryMap';

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

interface GameDeskProps {
    onExit: () => void;
}

const GameDesk: React.FC<GameDeskProps> = ({ onExit }) => {
    const { t } = useTranslation();
    const { state, processChoice, restartGame, getCurrentCard } = useGameEngine();
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);

    const currentCard = getCurrentCard(state);

    const QUARTER_METADATA = {
        1: { name: t('ministries.m1'), color: '#8b5cf6' },
        2: { name: t('ministries.m2'), color: 'var(--color-bad)' },
        3: { name: t('ministries.m3'), color: 'var(--color-warning)' },
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

                    <div className="mt-8 grid grid-cols-5 gap-2 border-y border-zinc-800 py-4 mb-4">
                        <div className={`text-center py-2 rounded-sm transition-all ${state.lostThroughMetric === 'piety' ? 'bg-violet-950/30 ring-1 ring-violet-500/50 scale-105' : ''}`}>
                            <span className="block text-[8px] uppercase tracking-widest text-zinc-500 mb-1">{t('metrics.piety')}</span>
                            <span className="text-sm font-bold text-violet-400">{Math.round(state.piety)}%</span>
                        </div>
                        <div className={`text-center py-2 rounded-sm transition-all ${state.lostThroughMetric === 'sepah' ? 'bg-orange-950/30 ring-1 ring-orange-500/50 scale-105' : ''}`}>
                            <span className="block text-[8px] uppercase tracking-widest text-zinc-500 mb-1">{t('metrics.sepah')}</span>
                            <span className="text-sm font-bold text-orange-400">{Math.round(state.sepah)}%</span>
                        </div>
                        <div className={`text-center py-2 rounded-sm transition-all ${state.lostThroughMetric === 'bazaar' ? 'bg-yellow-950/30 ring-1 ring-yellow-500/50 scale-105' : ''}`}>
                            <span className="block text-[8px] uppercase tracking-widest text-zinc-500 mb-1">{t('metrics.bazaar')}</span>
                            <span className="text-sm font-bold text-yellow-500">{Math.round(state.bazaar)}%</span>
                        </div>
                        <div className={`text-center py-2 rounded-sm transition-all ${state.lostThroughMetric === 'isolation' ? 'bg-blue-950/30 ring-1 ring-blue-500/50 scale-105' : ''}`}>
                            <span className="block text-[8px] uppercase tracking-widest text-zinc-500 mb-1">{t('metrics.isolation')}</span>
                            <span className="text-sm font-bold text-blue-400">{Math.round(state.isolation)}%</span>
                        </div>
                        <div className="text-center py-2">
                            <span className="block text-[8px] uppercase tracking-widest text-zinc-500 mb-1">{t('metrics.legitimacy')}</span>
                            <span className="text-sm font-bold text-emerald-400">{Math.round(state.legitimacy)}%</span>
                        </div>
                    </div>

                    {state.gameStateStatus === 'lost' && state.lossReason && (
                        <div className="mt-6 p-4 border border-red-900/50 bg-red-950/10 rounded-sm text-left">
                            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-red-500/60 mb-2">
                                Incident Report #{state.currentYear}-{state.currentQuarter}
                            </span>
                            <p className="text-red-400 italic font-serif leading-relaxed text-sm">
                                "{state.lossReason}"
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mt-8">
                        <GameButton className="restart-btn !mt-0" onClick={restartGame}>{t('game.restart')}</GameButton>
                        <GameButton
                            onClick={onExit}
                            className="py-3 px-8 bg-zinc-900 border border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest text-xs hover:border-zinc-100 hover:text-zinc-100 transition-all duration-300 rounded-sm"
                        >
                            {t('menu.back')}
                        </GameButton>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="game-layout">
            <header className="game-header">
                <div className="flex items-center gap-6">
                    <GameButton
                        onClick={() => setIsExitModalOpen(true)}
                        className="group flex items-center gap-2 px-3 py-1.5 border border-zinc-800 hover:border-red-900 text-zinc-600 hover:text-red-500 transition-all duration-300 rounded-sm"
                        title={t('game.exit')}
                    >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{t('game.exit')}</span>
                    </GameButton>
                    <div className="year-display">
                        {t('game.year')} {state.currentYear} <span className="quarter-text">| {t('game.quarter')}{state.currentQuarter}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="target-display">{t('game.goal', { years: state.targetYears })}</div>
                    {state.lifelineUsed && <div className="lifeline-badge">{t('game.lifeline_spent')}</div>}
                </div>
            </header>

            <section className="dashboard">
                <MetricBar label={t('metrics.piety')} value={state.piety} color="#8b5cf6" />
                <MetricBar label={t('metrics.sepah')} value={state.sepah} color="var(--color-bad)" />
                <MetricBar label={t('metrics.bazaar')} value={state.bazaar} color="var(--color-warning)" />
                <MetricBar label={t('metrics.isolation')} value={state.isolation} color="#3b82f6" />
                <MetricBar label={t('metrics.legitimacy')} value={state.legitimacy} color="var(--color-good)" />
            </section>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl mx-auto items-center flex-grow p-4">
                <div className="w-full h-auto flex justify-center items-center drop-shadow-2xl">
                    <ImaginaryMap gameState={state} />
                </div>

                <div className="w-full max-w-lg mx-auto">
                    <div className="dilemma-card !max-w-none">
                        <div className="ministry-header" style={{ color: ministryInfo.color }}>
                            {ministryInfo.name}
                        </div>
                        <h2 className="card-title">{currentCard.title}</h2>
                        <p className="card-description">{currentCard.description}</p>
                        <div className="card-actions">
                            <GameButton className="choice-btn yes-btn" onClick={() => processChoice('yes', currentCard)}>
                                {currentCard.yesText}
                            </GameButton>
                            <GameButton className="choice-btn no-btn" onClick={() => processChoice('no', currentCard)}>
                                {currentCard.noText}
                            </GameButton>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isExitModalOpen}
                title={t('game.exit_confirm_title')}
                description={t('game.exit_confirm_desc')}
                confirmLabel={t('game.confirm')}
                cancelLabel={t('game.cancel')}
                onConfirm={onExit}
                onCancel={() => setIsExitModalOpen(false)}
            />
        </div>
    );
};

export default GameDesk;
