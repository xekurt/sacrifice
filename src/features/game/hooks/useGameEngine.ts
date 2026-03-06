import { useState, useCallback } from 'react';
import type { GameState, DilemmaCard, Difficulty } from '../../../core/types/game';
import { PIETY_DECK, SEPAH_DECK, BAZAAR_DECK, ISOLATION_DECK } from '../data/decks';

const shuffle = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const DEATH_REASONS: Record<string, string> = {
    sepah_min: "death_reasons.sepah_min",
    sepah_max: "death_reasons.sepah_max",
    piety_min: "death_reasons.piety_min",
    piety_max: "death_reasons.piety_max",
    bazaar_min: "death_reasons.bazaar_min",
    bazaar_max: "death_reasons.bazaar_max",
    isolation_min: "death_reasons.isolation_min",
    isolation_max: "death_reasons.isolation_max",
};

const getInitialState = (difficulty: Difficulty = 'normal'): GameState => ({
    piety: 50,
    sepah: 50,
    bazaar: 50,
    isolation: 50,
    legitimacy: 10,
    currentYear: 1,
    currentTerm: 1,
    targetYears: difficulty === 'easy' ? 10 : difficulty === 'normal' ? 20 : 30,
    gameStateStatus: 'playing',
    lifelineUsed: false,
    term1Deck: shuffle([...PIETY_DECK, ...BAZAAR_DECK]),
    term2Deck: shuffle([...SEPAH_DECK, ...ISOLATION_DECK]),
    lossReason: null,
    lostThroughMetric: null,
    difficulty,
    yearEndReport: [],
});

export const useGameEngine = (initialDifficulty: Difficulty = 'normal') => {
    const [state, setState] = useState<GameState>(() => getInitialState(initialDifficulty));

    const clamp = (value: number) => Math.min(100, Math.max(0, value));

    const getCurrentCardData = useCallback((s: GameState): { card: DilemmaCard; ministryName: string } => {
        const index = (s.currentYear - 1);
        const card = s.currentTerm === 1
            ? s.term1Deck[index % s.term1Deck.length]
            : s.term2Deck[index % s.term2Deck.length];

        const char = card.id.charAt(0);
        let ministryName = 'ministries.m1'; // Default
        if (char === 'p') ministryName = 'ministries.m1';
        else if (char === 'b') ministryName = 'ministries.m3';
        else if (char === 's') ministryName = 'ministries.m2';
        else if (char === 'i') ministryName = 'ministries.m4';

        return { card, ministryName };
    }, []);

    const processChoice = useCallback((choice: 'yes' | 'no', card: DilemmaCard) => {
        setState((prev) => {
            if (prev.gameStateStatus !== 'playing') return prev;

            const effects = choice === 'yes' ? card.yesEffects : card.noEffects;

            // 1. Immediate Apply: Apply effects and clamp metrics
            let nextState: GameState = {
                ...prev,
                piety: clamp(prev.piety + (effects.piety || 0)),
                sepah: clamp(prev.sepah + (effects.sepah || 0)),
                bazaar: clamp(prev.bazaar + (effects.bazaar || 0)),
                isolation: clamp(prev.isolation + (effects.isolation || 0)),
                legitimacy: clamp(prev.legitimacy + (effects.legitimacy || 0)),
            };

            // 2. Term Check
            if (nextState.currentTerm < 2) {
                // Advance to Term 2
                nextState.currentTerm = 2;
                return nextState;
            }

            // If currentTerm === 2: Apply Systemic Rules, Check Win/Loss, and Advance Year
            let reportMessages: string[] = [];

            // A. Apply Systemic Rules (Soften penalties to -3 for faster pacing)
            if (nextState.isolation < 30) {
                nextState.piety -= 3;
                reportMessages.push("Open borders have slightly eroded traditional Piety.");
            }
            if (nextState.sepah > 70) {
                nextState.bazaar -= 3;
                reportMessages.push("Martial law is choking the local Bazaar.");
            }
            if (nextState.piety < 40) {
                nextState.sepah += 3;
                reportMessages.push("Secularism forces the Sepah to exert more control.");
            }

            // Clamp again after rules
            nextState.piety = clamp(nextState.piety);
            nextState.sepah = clamp(nextState.sepah);
            nextState.bazaar = clamp(nextState.bazaar);
            nextState.isolation = clamp(nextState.isolation);
            nextState.legitimacy = clamp(nextState.legitimacy);

            // B. Check Win/Loss
            if (nextState.currentYear >= nextState.targetYears) {
                nextState.gameStateStatus = 'won';
                return nextState;
            }

            // Evaluate failure sequentially to identify the exact cause
            let failMetric: string | null = null;
            if (nextState.sepah <= 0) failMetric = 'sepah_min';
            else if (nextState.sepah >= 100) failMetric = 'sepah_max';
            else if (nextState.piety <= 0) failMetric = 'piety_min';
            else if (nextState.piety >= 100) failMetric = 'piety_max';
            else if (nextState.bazaar <= 0) failMetric = 'bazaar_min';
            else if (nextState.bazaar >= 100) failMetric = 'bazaar_max';
            else if (nextState.isolation <= 0) failMetric = 'isolation_min';
            else if (nextState.isolation >= 100) failMetric = 'isolation_max';

            if (failMetric) {
                if (!nextState.lifelineUsed && nextState.legitimacy >= 80) {
                    nextState.legitimacy = 0;
                    nextState.lifelineUsed = true;
                    // Reset the specific metric that failed
                    const baseMetric = failMetric.split('_')[0] as keyof GameState;
                    if (typeof nextState[baseMetric] === 'number') {
                        (nextState[baseMetric] as any) = 50;
                    }
                    reportMessages.push(`Political Legitimacy was spent to stabilize the ${failMetric.split('_')[0]}.`);
                } else {
                    nextState.gameStateStatus = 'lost';
                    nextState.lossReason = DEATH_REASONS[failMetric];
                    nextState.lostThroughMetric = failMetric.split('_')[0];
                    return nextState;
                }
            }

            // C. Advance Year
            nextState.yearEndReport = reportMessages;
            nextState.currentYear += 1;
            nextState.currentTerm = 1;

            return nextState;
        });
    }, []);

    const clearYearEndReport = useCallback(() => {
        setState(prev => ({ ...prev, yearEndReport: [] }));
    }, []);

    const restartGame = useCallback(() => {
        setState(getInitialState(state.difficulty));
    }, [state.difficulty]);

    return {
        state,
        processChoice,
        restartGame,
        getCurrentCardData,
        clearYearEndReport
    };
};
