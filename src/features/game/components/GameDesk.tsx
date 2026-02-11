import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameEngine } from '../hooks/useGameEngine';
import GameButton from '../../../shared/components/GameButton';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import ImaginaryMap from './ImaginaryMap';
import type { Difficulty } from '../../../core/types/game';

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
    difficulty: Difficulty;
}

const GameDesk: React.FC<GameDeskProps> = ({ onExit, difficulty }) => {
    const { t } = useTranslation();
    const { state, processChoice, restartGame, getCurrentCardData } = useGameEngine(difficulty);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [hoveredOption, setHoveredOption] = useState<'yes' | 'no' | null>(null);

    const { card: currentCard, ministryName } = getCurrentCardData(state);

    // Translation helper for cards based on their ID (e.g., 'p1', 's5')
    const typeChar = currentCard.id.charAt(0);
    const typeKey = {
        'p': 'piety',
        's': 'sepah',
        'b': 'bazaar',
        'i': 'isolation'
    }[typeChar] || 'piety';

    const index = parseInt(currentCard.id.substring(1)) - 1;
    const cardBaseKey = `cards.${typeKey}.${index}`;

    const MINISTRY_COLORS: Record<string, string> = {
        'p': '#8b5cf6',
        's': 'var(--color-bad)',
        'b': 'var(--color-warning)',
        'i': '#3b82f6',
    };

    const ministryColor = MINISTRY_COLORS[typeChar] || '#8b5cf6';

    const renderForecast = () => {
        if (!hoveredOption) {
            return (
                <div className="min-h-[60px] flex items-center justify-center border border-zinc-800/30 bg-zinc-900/20 rounded-sm p-4 mb-6 transition-all duration-500">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600/60 animate-pulse text-center">
                        {state.difficulty === 'hard' ? t('game.outcome_uncertain') : t('game.hover_instruction')}
                    </p>
                </div>
            );
        }

        const effects = hoveredOption === 'yes' ? currentCard.yesEffects : currentCard.noEffects;

        return (
            <div className="min-h-[60px] flex flex-col items-center justify-center border border-zinc-700/50 bg-zinc-800/40 rounded-sm p-4 mb-6 shadow-inner transition-all duration-300 backdrop-blur-sm relative overflow-hidden">
                {/* Holographic scanner effect line */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-100/5 to-transparent h-4 w-full animate-scanline pointer-events-none" />

                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">{t('game.advisor_projection')}</span>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    {state.difficulty === 'easy' && (
                        Object.entries(effects).map(([key, value]) => (
                            <div key={key} className="flex items-center gap-1.5">
                                <span className="text-[9px] uppercase font-bold text-zinc-400">{t(`metrics.${key}`)}</span>
                                <span className={`text-xs font-black ${value && value > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {value && value > 0 ? '+' : ''}{value}
                                </span>
                            </div>
                        ))
                    )}
                    {state.difficulty === 'normal' && (
                        <p className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider text-center">
                            {t('game.will_impact')}: {Object.keys(effects).map(key => t(`metrics.${key}`)).join(', ')}
                        </p>
                    )}
                    {state.difficulty === 'hard' && (
                        <p className="text-[10px] uppercase font-bold text-red-500/60 tracking-[0.4em] italic animate-pulse">
                            {t('game.outcome_uncertain')}
                        </p>
                    )}
                </div>
            </div>
        );
    };

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
                            : t('game.loss_message', { year: state.currentYear, term: state.currentTerm })}
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
                                Incident Report #{state.currentYear}-{state.currentTerm === 1 ? 'E' : 'L'}
                            </span>
                            <p className="text-red-400 italic font-serif leading-relaxed text-sm">
                                "{t(state.lossReason)}"
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
                        {t('game.year')} {state.currentYear} <span className="quarter-text">| {state.currentTerm === 1 ? t('game.early_year') : t('game.late_year')}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-[10px] uppercase tracking-widest px-2 py-1 border border-zinc-800 rounded-sm bg-zinc-900/50 text-zinc-500">
                        {t(`difficulty.${state.difficulty}`)}
                    </div>
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
                        <div className="ministry-header" style={{ color: ministryColor }}>
                            {t(ministryName)}
                        </div>
                        <h2 className="card-title">{t(`${cardBaseKey}.title`)}</h2>
                        <p className="card-description mb-6">{t(`${cardBaseKey}.description`)}</p>

                        {/* Advisor's Forecast Panel */}
                        {renderForecast()}

                        <div className="card-actions">
                            <GameButton
                                className="choice-btn yes-btn"
                                onClick={() => processChoice('yes', currentCard)}
                                onMouseEnter={() => setHoveredOption('yes')}
                                onMouseLeave={() => setHoveredOption(null)}
                            >
                                {t(`${cardBaseKey}.yesText`)}
                            </GameButton>
                            <GameButton
                                className="choice-btn no-btn"
                                onClick={() => processChoice('no', currentCard)}
                                onMouseEnter={() => setHoveredOption('no')}
                                onMouseLeave={() => setHoveredOption(null)}
                            >
                                {t(`${cardBaseKey}.noText`)}
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
