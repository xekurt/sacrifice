import { useState, useCallback } from 'react';
import type { GameState, DilemmaCard } from '../../../core/types/game';
import { PIETY_DECK, SEPAH_DECK, BAZAAR_DECK, ISOLATION_DECK } from '../data/decks';

const INITIAL_STATE: GameState = {
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
};

export const useGameEngine = () => {
    const [state, setState] = useState<GameState>(INITIAL_STATE);

    const clamp = (value: number) => Math.min(100, Math.max(0, value));

    const getCurrentCard = (s: GameState): DilemmaCard => {
        // We use the year and quarter to get a consistent card even if called multiple times
        const deckIndex = (s.currentYear - 1) % 2; // Simple loop through mock cards
        switch (s.currentQuarter) {
            case 1: return PIETY_DECK[deckIndex % PIETY_DECK.length];
            case 2: return SEPAH_DECK[deckIndex % SEPAH_DECK.length];
            case 3: return BAZAAR_DECK[deckIndex % BAZAAR_DECK.length];
            case 4: return ISOLATION_DECK[deckIndex % ISOLATION_DECK.length];
            default: return PIETY_DECK[0];
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

            const formsOfRuin = ['piety', 'sepah', 'bazaar', 'isolation'] as const;
            const isImminentGameOver = formsOfRuin.some(
                (m) => nextState[m] <= 0 || nextState[m] >= 100
            );

            if (isImminentGameOver) {
                if (!nextState.lifelineUsed && nextState.legitimacy >= 80) {
                    nextState.legitimacy = 0;
                    nextState.lifelineUsed = true;
                    formsOfRuin.forEach((m) => {
                        if (nextState[m] <= 0 || nextState[m] >= 100) {
                            nextState[m] = 50;
                        }
                    });
                } else {
                    nextState.gameStateStatus = 'lost';
                    return nextState; // Stop here if lost
                }
            }

            // C. Advance Year
            nextState.currentYear += 1;
            nextState.currentQuarter = 1;

            return nextState;
        });
    }, []);

    const restartGame = useCallback(() => {
        setState(INITIAL_STATE);
    }, []);

    return {
        state,
        processChoice,
        restartGame,
        getCurrentCard,
    };
};
