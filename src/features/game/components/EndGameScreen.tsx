import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import GameButton from '../../../shared/components/GameButton';
import type { GameState } from '../../../core/types/game';

interface EndGameScreenProps {
    gameState: GameState;
    onRestart: () => void;
    onExit: () => void;
}

const EndGameScreen: React.FC<EndGameScreenProps> = ({ gameState, onRestart, onExit }) => {
    const { t } = useTranslation();
    const isWin = gameState.gameStateStatus === 'won';

    useEffect(() => {
        const audioPath = isWin ? 'audio/victory.mp3' : 'audio/defeat.mp3';
        const audio = new Audio(audioPath);
        audio.volume = 0.5;
        audio.play().catch(e => console.warn("End game audio blocked or missing:", e));

        return () => {
            audio.pause();
        };
    }, [isWin]);

    const headline = useMemo(() => {
        if (isWin) return t('end_game.win_headline');

        const metric = gameState.lostThroughMetric;
        if (!metric) return t('end_game.reign_over');

        return t(`end_game.${metric}_headline`, { defaultValue: t('end_game.reign_over') });
    }, [isWin, gameState, t]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            {/* Newspaper / Dossier Container */}
            <div className="w-full max-w-2xl bg-[#f4f1ea] text-zinc-900 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.8)] border-b-8 border-zinc-400/30 animate-spin-slam overflow-hidden">
                {/* Header Strip */}
                <div className="bg-zinc-900 text-zinc-400 px-6 py-2 flex justify-between items-center border-b border-zinc-800">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase">{t('end_game.bulletin')}</span>
                    <span className="text-[10px] font-mono uppercase">{t('game.year')} {gameState.currentYear} | {t('game.quarter')} {gameState.currentTerm}</span>
                </div>

                <div className="p-10 flex flex-col items-center">
                    {/* Main Headline */}
                    <h1 className="font-serif text-6xl font-black uppercase tracking-tighter text-center leading-[0.9] mb-8 border-b-4 border-zinc-900 pb-4 w-full">
                        {headline}
                    </h1>

                    {/* Sub-Headline / Description */}
                    <div className="w-full mb-10">
                        <p className="font-mono text-lg text-zinc-700 leading-relaxed italic border-l-4 border-zinc-300 pl-6 py-2">
                            {gameState.lossReason ? t(gameState.lossReason) : (isWin ? t('game.win_message', { years: gameState.targetYears }) : t('end_game.default_loss'))}
                        </p>
                    </div>

                    {/* Stats Panel */}
                    <div className="grid grid-cols-2 gap-8 w-full border-t border-b border-zinc-300 py-8 mb-10">
                        <div className="text-center">
                            <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">{t('end_game.years_in_power')}</span>
                            <span className="text-4xl font-black font-serif">{gameState.currentYear}</span>
                        </div>
                        <div className="text-center border-l border-zinc-300">
                            <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-1">{t('end_game.final_approval')}</span>
                            <span className="text-4xl font-black font-serif">{Math.round(gameState.legitimacy)}%</span>
                        </div>
                    </div>

                    {/* Interaction Buttons */}
                    <div className="flex flex-col gap-4 w-full max-w-sm">
                        <GameButton
                            className="w-full py-4 bg-zinc-900 text-zinc-100 font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-colors hover-shake"
                            onClick={onRestart}
                        >
                            {t('end_game.restart_button')}
                        </GameButton>
                        <button
                            className="text-[11px] uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors font-bold"
                            onClick={onExit}
                        >
                            {t('end_game.exit_button')}
                        </button>
                    </div>
                </div>

                {/* Footer Aging */}
                <div className="h-4 bg-gradient-to-t from-zinc-200 to-transparent opacity-50" />
            </div>
        </div>
    );
};

export default EndGameScreen;
