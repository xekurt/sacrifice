import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameEngine } from '../hooks/useGameEngine';
import GameButton from '../../../shared/components/GameButton';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import ImaginaryMap from './ImaginaryMap';
import Stamp from '../../../shared/components/Stamp';
import EndGameScreen from './EndGameScreen';
import type { Difficulty, DilemmaCard } from '../../../core/types/game';

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

    const [transitionState, setTransitionState] = useState<'idle' | 'stamping' | 'sliding'>('idle');
    const [decision, setDecision] = useState<'yes' | 'no' | null>(null);

    const isGameOver = state.gameStateStatus !== 'playing';

    const { card: currentCard, ministryName } = getCurrentCardData(state);

    const handleDecision = async (choice: 'yes' | 'no', card: DilemmaCard) => {
        if (transitionState !== 'idle' || isGameOver) return;

        setDecision(choice);
        setTransitionState('stamping');

        try {
            const audio = new Audio('/audio/click_stamp.mp3');
            audio.volume = 0.6;
            audio.play().catch(e => console.warn("Audio play blocked:", e));
        } catch (e) {
            console.error("SFX Error:", e);
        }

        await new Promise(resolve => setTimeout(resolve, 600));
        setTransitionState('sliding');
        await new Promise(resolve => setTimeout(resolve, 400));

        processChoice(choice, card);
        setTransitionState('idle');
        setDecision(null);
    };

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
        if (!hoveredOption || transitionState !== 'idle') {
            return (
                <div className="min-h-[60px] flex items-center justify-center border border-zinc-800/30 bg-zinc-900/20 rounded-sm p-4 mb-6 transition-all duration-500">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600/60 animate-pulse text-center">
                        {transitionState !== 'idle' ? "Processing Decision..." : (state.difficulty === 'hard' ? t('game.outcome_uncertain') : t('game.hover_instruction'))}
                    </p>
                </div>
            );
        }

        const effects = hoveredOption === 'yes' ? currentCard.yesEffects : currentCard.noEffects;

        return (
            <div className="min-h-[60px] flex flex-col items-center justify-center border border-zinc-700/50 bg-zinc-800/40 rounded-sm p-4 mb-6 shadow-inner transition-all duration-300 backdrop-blur-sm relative overflow-hidden text-center">
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
                        <p className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider">
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

    const cardContainerClass = transitionState === 'sliding'
        ? (decision === 'yes' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0')
        : (transitionState === 'idle' ? 'card-transition-idle' : 'translate-x-0 opacity-100');

    // Visual Filter Logic
    const mainFilterClass = isGameOver
        ? (state.gameStateStatus === 'lost' ? 'grayscale brightness-[0.4]' : 'sepia-[0.3] contrast-[1.2]')
        : '';

    return (
        <div className="game-layout transition-all duration-1000 relative">
            <div className={`w-full h-full flex flex-col transition-all duration-1000 ${mainFilterClass}`}>
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

                    <div className="w-full max-w-lg mx-auto overflow-hidden">
                        <div className={`dilemma-card !max-w-none transition-all duration-300 ease-in-out relative ${cardContainerClass}`}>
                            {(transitionState === 'stamping' || transitionState === 'sliding') && (
                                <Stamp type={decision === 'yes' ? 'approved' : 'denied'} />
                            )}

                            <div className="ministry-header" style={{ color: ministryColor }}>
                                {t(ministryName)}
                            </div>
                            <h2 className="card-title">{t(`${cardBaseKey}.title`)}</h2>
                            <p className="card-description mb-6">{t(`${cardBaseKey}.description`)}</p>
                            {renderForecast()}

                            <div className="card-actions">
                                <GameButton
                                    className={`choice-btn yes-btn ${transitionState !== 'idle' ? 'opacity-50 pointer-events-none' : ''}`}
                                    onClick={() => handleDecision('yes', currentCard)}
                                    onMouseEnter={() => setHoveredOption('yes')}
                                    onMouseLeave={() => setHoveredOption(null)}
                                    disabled={transitionState !== 'idle'}
                                >
                                    {t(`${cardBaseKey}.yesText`)}
                                </GameButton>
                                <GameButton
                                    className={`choice-btn no-btn ${transitionState !== 'idle' ? 'opacity-50 pointer-events-none' : ''}`}
                                    onClick={() => handleDecision('no', currentCard)}
                                    onMouseEnter={() => setHoveredOption('no')}
                                    onMouseLeave={() => setHoveredOption(null)}
                                    disabled={transitionState !== 'idle'}
                                >
                                    {t(`${cardBaseKey}.noText`)}
                                </GameButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* End Game Overlay */}
            {isGameOver && (
                <EndGameScreen
                    gameState={state}
                    onRestart={restartGame}
                    onExit={onExit}
                />
            )}

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
