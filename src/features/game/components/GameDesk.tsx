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
                <div className="flex items-center justify-center h-12">
                    <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-zinc-600/60 animate-pulse">
                        {transitionState !== 'idle' ? "Processing Node..." : "Awaiting Operational Choice"}
                    </p>
                </div>
            );
        }

        const effects = hoveredOption === 'yes' ? currentCard.yesEffects : currentCard.noEffects;
        const visibleMetrics = FACTION_VISIBILITY[activePerspective];
        const filteredEffects = Object.entries(effects).filter(([key]) => visibleMetrics.includes(key));

        return (
            <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-8 justify-center py-4 px-8 bg-zinc-950/80 border-y border-white/5 backdrop-blur-md">
                    {filteredEffects.length > 0 ? (
                        filteredEffects.map(([key, value]) => (
                            <div key={key} className="flex flex-col items-center min-w-[80px]">
                                <span className="text-[8px] uppercase font-black tracking-widest text-zinc-500 mb-1">{t(`metrics.${key}`)}</span>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1 h-3 ${value && value > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    <span className={`text-xl font-mono font-bold ${value && value > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {value && value > 0 ? '+' : ''}{value}%
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-[10px] uppercase font-bold text-zinc-600 tracking-widest italic py-2">
                            No significant systemic impacts detected
                        </p>
                    )}
                </div>
                <div className="text-[8px] font-bold uppercase tracking-[0.5em] text-amber-500/50">Advisor Predictive Data // Filter: {activePerspective}</div>
            </div>
        );
    };

    const cardContainerClass = transitionState === 'sliding'
        ? (decision === 'yes' ? 'translate-x-[50%] opacity-0' : '-translate-x-[50%] opacity-0')
        : (transitionState === 'idle' ? '' : 'translate-x-0 opacity-100');

    // Visual Filter Logic
    const mainFilterClass = isGameOver
        ? (state.gameStateStatus === 'lost' ? 'grayscale brightness-[0.4]' : 'sepia-[0.3] contrast-[1.2]')
        : '';

    return (
        <div className={`game-layout transition-all duration-1000 relative bg-zinc-950 h-screen w-full overflow-hidden ${mainFilterClass}`}>
            <div className="w-full h-full flex flex-col overflow-x-hidden">

                {/* Tactical Header */}
                <header className="game-header h-14 border-b border-white/5 bg-black/60 backdrop-blur-md flex items-center justify-between px-8 z-30">
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-4">
                            <GameButton onClick={() => setIsExitModalOpen(true)} className="!p-2 !bg-transparent border border-zinc-800 hover:border-red-900 transition-all rounded-none">
                                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{t('game.exit')}</span>
                            </GameButton>
                            <button onClick={toggleMute} className={`p-2 transition-all ${isMuted ? 'text-zinc-700' : 'text-emerald-500'}`}>
                                {isMuted ? '🔇' : '🔊'}
                            </button>
                        </div>
                        <div className="font-mono text-xs tracking-[0.3em] uppercase text-zinc-400">
                            {t('game.year')} {state.currentYear} <span className="text-zinc-600 px-2">//</span> {state.currentTerm === 1 ? t('game.early_year') : t('game.late_year')}
                        </div>
                    </div>

                    <div className="hidden xl:flex items-center gap-8 border-x border-white/5 px-12 h-full">
                        <div className="flex flex-col items-center">
                            <span className="text-[7px] uppercase font-black tracking-widest text-zinc-500 mb-0.5">Sepah</span>
                            <span className={`text-xs font-mono font-bold ${state.sepah < 20 || state.sepah > 80 ? 'text-red-500 animate-pulse' : 'text-zinc-300'}`}>{state.sepah}%</span>
                        </div>
                        <div className="w-[1px] h-4 bg-white/5" />
                        <div className="flex flex-col items-center">
                            <span className="text-[7px] uppercase font-black tracking-widest text-zinc-500 mb-0.5">Bazaar</span>
                            <span className={`text-xs font-mono font-bold ${state.bazaar < 20 || state.bazaar > 80 ? 'text-red-500 animate-pulse' : 'text-zinc-300'}`}>{state.bazaar}%</span>
                        </div>
                        <div className="w-[1px] h-4 bg-white/5" />
                        <div className="flex flex-col items-center">
                            <span className="text-[7px] uppercase font-black tracking-widest text-zinc-500 mb-0.5">Isolation</span>
                            <span className={`text-xs font-mono font-bold ${state.isolation < 20 || state.isolation > 80 ? 'text-red-500 animate-pulse' : 'text-zinc-300'}`}>{state.isolation}%</span>
                        </div>
                        <div className="w-[1px] h-4 bg-white/5" />
                        <div className="flex flex-col items-center">
                            <span className="text-[7px] uppercase font-black tracking-widest text-zinc-500 mb-0.5">Piety</span>
                            <span className={`text-xs font-mono font-bold ${state.piety < 20 || state.piety > 80 ? 'text-red-500 animate-pulse' : 'text-zinc-300'}`}>{state.piety}%</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="metrics-group flex gap-8">
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] uppercase font-black tracking-widest text-zinc-600">Global Legitimacy</span>
                                <div className="h-1 w-24 bg-zinc-900 mt-1">
                                    <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${state.legitimacy}%` }} />
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[8px] uppercase font-black tracking-widest text-zinc-600">Goal Progress</span>
                                <span className="text-[10px] font-mono text-zinc-400">{state.currentYear}/{state.targetYears}</span>
                            </div>
                        </div>
                        <div className="text-[9px] uppercase tracking-[0.4em] font-black px-4 py-1.5 border border-zinc-800 text-zinc-500">
                            {state.difficulty}
                        </div>
                    </div>
                </header>

                {/* Cinematic Main Area */}
                <main className="flex-grow grid grid-cols-12 overflow-hidden relative">

                    {/* LEFT PANE: TACTICAL MAP */}
                    <div className="col-span-12 lg:col-span-7 relative flex items-center justify-center bg-transparent group overflow-hidden">
                        {/* Decorative Background Grid */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                        <div className="w-full h-full max-h-[80vh] filter blur-[0.5px] hover:blur-0 transition-all duration-[2000ms] flex items-center justify-center transform group-hover:scale-[1.02] cursor-default">
                            <ImaginaryMap gameState={state} />
                        </div>

                        {/* Map Overlay HUD */}
                        <div className="absolute top-12 left-12 border-l border-t border-white/20 w-16 h-16 pointer-events-none" />
                        <div className="absolute bottom-12 right-12 border-r border-b border-white/20 w-16 h-16 pointer-events-none" />
                        <div className="absolute top-1/2 -left-4 -translate-y-1/2 font-mono text-[8px] text-zinc-700 tracking-[0.5em] rotate-90 uppercase">Satellite Feed // Active</div>
                    </div>

                    {/* RIGHT PANE: COMMAND DASHBOARD */}
                    <div className="col-span-12 lg:col-span-5 bg-zinc-950 border-l border-white/5 flex flex-col relative z-20 shadow-[-50px_0_100px_rgba(0,0,0,0.5)]">

                        {/* 1. Dossier (Narrative Context) */}
                        <div className="p-10 lg:p-14 pb-4">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-zinc-600" style={{ color: ministryColor }}>
                                    {t(ministryName)} // MISSION BRIEF
                                </h2>
                                <div className="h-[2px] w-12 bg-zinc-800" />
                            </div>

                            <div className="relative">
                                <p className="text-lg lg:text-xl font-serif text-slate-300 leading-relaxed italic drop-shadow-lg">
                                    {currentCard.description}
                                </p>
                                <div className="absolute -top-4 -left-4 text-white/5 font-serif text-6xl select-none">"</div>
                            </div>
                        </div>

                        {/* 2. Character Command Section */}
                        <div className="relative w-full h-[50vh] overflow-hidden group">
                            {/* Cinematic Portrait */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={`character/${activePerspective}.jpg`}
                                    alt="Advisor"
                                    className={`w-full h-full object-cover object-top opacity-60 transition-all duration-1000 ${transitionState !== 'idle' ? 'scale-110 blur-sm' : 'scale-100'}`}
                                    style={{
                                        maskImage: 'linear-gradient(to bottom, black 50%, transparent 95%)',
                                        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 95%)'
                                    }}
                                />
                                {/* Strong Bottom Gradient Overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#09090b] to-transparent z-10" />
                            </div>

                            {/* Perspective Nav (Relocated to Top Right) */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
                                {(['sepah', 'bazaar', 'isolation'] as const).map(faction => (
                                    <button
                                        key={faction}
                                        onClick={() => setActivePerspective(faction)}
                                        className={`group relative transition-all duration-500 ${activePerspective === faction ? 'scale-110' : 'opacity-30 hover:opacity-100'}`}
                                    >
                                        <div className={`w-12 h-12 border transition-all duration-300 ${activePerspective === faction ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'border-zinc-800 hover:border-zinc-600'}`}>
                                            <img src={`character/${faction}.jpg`} alt={faction} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0" />
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* 3. Advisor Overlay Content (Anchored to Bottom) */}
                            <div className={`absolute bottom-8 z-20 w-full px-6 transition-all duration-500 transform ${cardContainerClass}`}>
                                {transitionState === 'stamping' && (
                                    <div className="absolute inset-0 z-50 flex items-center justify-center scale-150 pointer-events-none">
                                        <Stamp type={decision === 'yes' ? 'approved' : 'denied'} />
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {/* Subtitle / Quote */}
                                    <p className="text-sm lg:text-base font-serif italic text-zinc-500 text-center leading-snug max-w-2xl mx-auto">
                                        "{currentCard.advisorQuotes[activePerspective]}"
                                    </p>

                                    {/* Projection / Math */}
                                    <div className="transition-all duration-700">
                                        {renderForecast()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4. Action Buttons (Tactical Command Blocks) */}
                        <div className="flex h-32 border-t border-white/5 flex-shrink-0">
                            <GameButton
                                className={`flex-1 py-6 bg-slate-900 border-r border-slate-700 hover:bg-slate-800 transition-colors flex flex-col items-center justify-center rounded-none group ${transitionState !== 'idle' ? 'opacity-10 pointer-events-none' : ''}`}
                                onClick={() => handleDecision('yes', currentCard)}
                                onMouseEnter={() => setHoveredOption('yes')}
                                onMouseLeave={() => setHoveredOption(null)}
                                disabled={transitionState !== 'idle'}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-emerald-500 font-black text-2xl uppercase tracking-[0.2em] group-hover:scale-110 transition-transform duration-300">
                                        {t(`${cardBaseKey}.yesText`) || 'Approve'}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 mt-2 font-mono tracking-[0.5em]">AUTHORIZE_EXECUTION</span>
                                </div>
                            </GameButton>
                            <GameButton
                                className={`flex-1 py-6 bg-slate-900 hover:bg-slate-800 transition-colors flex flex-col items-center justify-center rounded-none group ${transitionState !== 'idle' ? 'opacity-10 pointer-events-none' : ''}`}
                                onClick={() => handleDecision('no', currentCard)}
                                onMouseEnter={() => setHoveredOption('no')}
                                onMouseLeave={() => setHoveredOption(null)}
                                disabled={transitionState !== 'idle'}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-red-500 font-black text-2xl uppercase tracking-[0.2em] group-hover:scale-110 transition-transform duration-300">
                                        {t(`${cardBaseKey}.noText`) || 'Deny'}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 mt-2 font-mono tracking-[0.5em]">REJECT_PROPOSAL</span>
                                </div>
                            </GameButton>
                        </div>
                    </div>
                </main>

                {/* Status Bar / Metrics (Alternative Mobile View or Additional Detail) */}
                <footer className="h-4 bg-zinc-950 border-t border-white/5 px-8 flex items-center justify-between text-[6px] text-zinc-700 font-mono uppercase tracking-[0.4em]">
                    <div>System Status: Nominal // High Priority Decision Required</div>
                    <div>User ID: LEADER_01 // Encryption: AES-256</div>
                </footer>
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
