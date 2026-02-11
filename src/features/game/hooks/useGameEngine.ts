import { useState, useCallback } from 'react';
import type { GameState, DilemmaCard } from '../../../core/types/game';
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

const getInitialState = (): GameState => ({
    piety: 50,
    sepah: 50,
    bazaar: 50,
    isolation: 50,
    legitimacy: 10,
    currentYear: 1,
    currentQuarter: 1,
    targetYears: 20,
    gameStateStatus: 'playing',
    lifelineUsed: false,
    pietyDeck: shuffle(PIETY_DECK),
    sepahDeck: shuffle(SEPAH_DECK),
    bazaarDeck: shuffle(BAZAAR_DECK),
    isolationDeck: shuffle(ISOLATION_DECK),
    lossReason: null,
    lostThroughMetric: null,
});

export const useGameEngine = () => {
    const [state, setState] = useState<GameState>(getInitialState);

    const clamp = (value: number) => Math.min(100, Math.max(0, value));

    const getCurrentCard = (s: GameState): DilemmaCard => {
        // We use the year as the index to cycle through the shuffled deck
        const index = (s.currentYear - 1);
        switch (s.currentQuarter) {
            case 1: return s.pietyDeck[index % s.pietyDeck.length];
            case 2: return s.sepahDeck[index % s.sepahDeck.length];
            case 3: return s.bazaarDeck[index % s.bazaarDeck.length];
            case 4: return s.isolationDeck[index % s.isolationDeck.length];
            default: return s.pietyDeck[0];
        }
    };

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

            // 2. Quarter Check
            if (nextState.currentQuarter < 4) {
                // Increment quarter and exit early
                nextState.currentQuarter = (nextState.currentQuarter + 1) as 1 | 2 | 3 | 4;
                return nextState;
            }

            // If currentQuarter === 4: Apply Systemic Rules, Check Win/Loss, and Advance Year

            // A. Apply Systemic Rules
            if (nextState.isolation < 30) {
                nextState.piety -= 5;
            }
            if (nextState.sepah > 70) {
                nextState.bazaar -= 5;
            }
            if (nextState.piety < 40) {
                nextState.sepah += 5;
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
                        (nextState[baseMetric] as number) = 50;
                    }
                } else {
                    nextState.gameStateStatus = 'lost';
                    nextState.lossReason = DEATH_REASONS[failMetric];
                    nextState.lostThroughMetric = failMetric.split('_')[0];
                    return nextState;
                }
            }

            // C. Advance Year
            nextState.currentYear += 1;
            nextState.currentQuarter = 1;

            return nextState;
        });
    }, []);

    const restartGame = useCallback(() => {
        setState(getInitialState());
    }, []);

    return {
        state,
        processChoice,
        restartGame,
        getCurrentCard,
    };
};
