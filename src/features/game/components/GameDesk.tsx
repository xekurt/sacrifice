import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGameEngine } from '../hooks/useGameEngine';
import GameButton from '../../../shared/components/GameButton';
import ConfirmationModal from '../../../shared/components/ConfirmationModal';
import ImaginaryMap from './ImaginaryMap';
import Stamp from '../../../shared/components/Stamp';
import EndGameScreen from './EndGameScreen';
import type { Difficulty, DilemmaCard } from '../../../core/types/game';
import { playApproveSound, playRejectSound, resumeAudio } from '../../../shared/utils/audioEngine';
import { useAudio } from '../../../shared/contexts/AudioContext';

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
    const { isMuted, toggleMute } = useAudio();
    const { state, processChoice, restartGame, getCurrentCardData, clearYearEndReport } = useGameEngine(difficulty);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const [hoveredOption, setHoveredOption] = useState<'yes' | 'no' | null>(null);
    const [activePerspective, setActivePerspective] = useState<'sepah' | 'bazaar' | 'isolation'>('sepah');

    const [transitionState, setTransitionState] = useState<'idle' | 'stamping' | 'sliding'>('idle');
    const [decision, setDecision] = useState<'yes' | 'no' | null>(null);

    const isGameOver = state.gameStateStatus !== 'playing';

    const { card: currentCard, ministryName } = getCurrentCardData(state);

    // Sync active perspective with the card's ministry
    React.useEffect(() => {
        const typeChar = currentCard.id.charAt(0);
        if (typeChar === 's') setActivePerspective('sepah');
        else if (typeChar === 'b') setActivePerspective('bazaar');
        else if (typeChar === 'i' || typeChar === 'p') setActivePerspective('isolation');
    }, [currentCard.id]);

    const handleDecision = async (choice: 'yes' | 'no', card: DilemmaCard) => {
        if (transitionState !== 'idle' || isGameOver) return;

        // Ensure audio context is active
        await resumeAudio();

        setDecision(choice);
        setTransitionState('stamping');

        // Trigger procedural synthesized audio
        if (choice === 'yes') {
            playApproveSound();
        } else {
            playRejectSound();
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

    // Bias Filter Configuration: Each faction only sees metrics they care about
    const FACTION_VISIBILITY: Record<'sepah' | 'bazaar' | 'isolation', string[]> = {
        sepah: ['sepah', 'isolation', 'legitimacy'],      // Military: Security & Control
        bazaar: ['bazaar', 'isolation'],                   // Economy: Trade & Markets
        isolation: ['isolation', 'legitimacy', 'piety']    // Sovereignty: Independence & Authority
    };

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

        // Filter effects based on active perspective's bias
        const visibleMetrics = FACTION_VISIBILITY[activePerspective];
        const filteredEffects = Object.entries(effects).filter(([key]) => visibleMetrics.includes(key));

        return (
            <div className="min-h-[60px] flex flex-col items-center justify-center border border-zinc-700/50 bg-zinc-800/40 rounded-sm p-4 mb-6 shadow-inner transition-all duration-300 backdrop-blur-sm relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-100/5 to-transparent h-4 w-full animate-scanline pointer-events-none" />

                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">{t('game.advisor_projection')}</span>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    {state.difficulty === 'easy' && (
                        filteredEffects.length > 0 ? (
                            filteredEffects.map(([key, value]) => (
                                <div key={key} className="flex items-center gap-1.5">
                                    <span className="text-[9px] uppercase font-bold text-zinc-400">{t(`metrics.${key}`)}</span>
                                    <span className={`text-xs font-black ${value && value > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {value && value > 0 ? '+' : ''}{value}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-[10px] uppercase font-bold text-zinc-500/60 tracking-wider italic">
                                No relevant impacts detected
                            </p>
                        )
                    )}
                    {state.difficulty === 'normal' && (
                        filteredEffects.length > 0 ? (
                            <p className="text-[10px] uppercase font-bold text-zinc-300 tracking-wider">
                                {t('game.will_impact')}: {filteredEffects.map(([key]) => t(`metrics.${key}`)).join(', ')}
                            </p>
                        ) : (
                            <p className="text-[10px] uppercase font-bold text-zinc-500/60 tracking-wider italic">
                                No relevant impacts detected
                            </p>
                        )
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
                        <div className="flex items-center gap-2">
                            <GameButton
                                onClick={() => setIsExitModalOpen(true)}
                                className="group flex items-center gap-2 px-3 py-1.5 border border-zinc-800 hover:border-red-900 text-zinc-600 hover:text-red-500 transition-all duration-300 rounded-sm"
                                title={t('game.exit')}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-widest">{t('game.exit')}</span>
                            </GameButton>

                            <GameButton
                                onClick={toggleMute}
                                className={`group flex items-center justify-center w-9 h-9 border border-zinc-800 transition-all duration-300 rounded-sm ${isMuted ? 'text-zinc-600 bg-zinc-950/50' : 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20'}`}
                                title={isMuted ? "Enable Music" : "Disable Music"}
                            >
                                <span className="text-sm">{isMuted ? '🔇' : '🔊'}</span>
                            </GameButton>
                        </div>
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
                            <h2 className="card-title font-mono uppercase tracking-tighter border-b border-zinc-800 pb-2 mb-4">
                                {currentCard.title || t(`${cardBaseKey}.title`)}
                            </h2>

                            <div className="card-description bg-zinc-950/40 p-6 border-l-2 border-zinc-800 mb-6 italic shadow-inner">
                                <p className="text-zinc-400 leading-relaxed text-sm">
                                    {currentCard.description}
                                </p>
                            </div>

                            {/* Advisor Avatar Selection */}
                            <div className="flex justify-center gap-4 mb-8">
                                {(['sepah', 'bazaar', 'isolation'] as const).map(faction => (
                                    <button
                                        key={faction}
                                        onClick={() => setActivePerspective(faction)}
                                        className={`relative group transition-all duration-300 ${activePerspective === faction ? 'scale-110' : 'opacity-40 grayscale hover:opacity-100'}`}
                                    >
                                        <div className={`w-14 h-14 rounded-sm border-2 overflow-hidden transition-all duration-300 ${activePerspective === faction ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'border-zinc-800'}`}>
                                            <img
                                                src={`public/character/${faction}.jpg`}
                                                alt={faction}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-1 text-[7px] font-black uppercase tracking-tighter ${activePerspective === faction ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                            {faction}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Character Comms Channel */}
                            <div className={`character-panel border transition-all duration-500 p-4 mb-6 relative overflow-hidden bg-gradient-to-br from-zinc-900/80 to-black/80
                                ${activePerspective === 'sepah' ? 'border-orange-900/50 shadow-[inset_0_0_20px_rgba(154,52,18,0.1)]' : ''}
                                ${activePerspective === 'bazaar' ? 'border-yellow-900/50 shadow-[inset_0_0_20px_rgba(133,77,14,0.1)]' : ''}
                                ${activePerspective === 'isolation' ? 'border-blue-900/50 shadow-[inset_0_0_20px_rgba(30,64,175,0.1)]' : ''}
                            `}>
                                <div className="flex gap-4 items-start">
                                    <div className="w-20 h-20 flex-shrink-0 border border-zinc-800 bg-zinc-950">
                                        <img
                                            src={`public/character/${activePerspective}.jpg`}
                                            alt="Advisor"
                                            className="w-full h-full object-cover grayscale-[0.5] brightness-75"
                                        />
                                    </div>
                                    <div className="flex-grow space-y-3">
                                        <div className="comms-header flex justify-between items-center opacity-50">
                                            <span className="text-[8px] font-bold uppercase tracking-[0.2em]">{activePerspective} Feed // Secure</span>
                                            <span className="text-[8px] font-mono">15.00.412</span>
                                        </div>
                                        <p className="text-xs italic text-zinc-100 leading-snug animate-in fade-in slide-in-from-left-2 duration-500">
                                            "{currentCard.advisorQuotes[activePerspective]}"
                                        </p>

                                        <div className="pt-2 animate-in fade-in duration-700">
                                            {renderForecast()}
                                        </div>
                                    </div>
                                </div>
                            </div>

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

            {/* Annual Intelligence Briefing Modal */}
            {state.yearEndReport.length > 0 && !isGameOver && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-500">
                    <div className="w-full max-w-lg border border-zinc-800 bg-zinc-950 p-8 shadow-2xl relative overflow-hidden">
                        {/* Decorative Scanner Line */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-20 w-full animate-scanline pointer-events-none" />

                        <div className="relative z-10">
                            <header className="mb-6 border-b border-zinc-800 pb-4">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 mb-1">Intelligence Division</h3>
                                <h2 className="text-xl font-bold text-zinc-100 uppercase tracking-tighter">Annual Systemic Briefing</h2>
                                <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">Year {state.currentYear - 1} Conclusion</p>
                            </header>

                            <div className="space-y-4 mb-8">
                                {state.yearEndReport.map((msg, index) => (
                                    <div key={index} className="flex gap-4 items-start group">
                                        <span className="text-emerald-500 font-mono text-xs opacity-50">[0{index + 1}]</span>
                                        <p className="text-sm text-zinc-300 leading-relaxed font-medium group-hover:text-emerald-400 transition-colors">
                                            {msg}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <GameButton
                                onClick={clearYearEndReport}
                                className="w-full py-4 bg-emerald-950/20 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all duration-300 uppercase text-xs font-black tracking-[0.3em]"
                            >
                                Acknowledge Briefing
                            </GameButton>
                        </div>

                        {/* Background Watermark */}
                        <div className="absolute -bottom-4 -right-4 text-[60px] font-black text-emerald-500/5 select-none pointer-events-none uppercase tracking-tighter">
                            SECURE
                        </div>
                    </div>
                </div>
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
