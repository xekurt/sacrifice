import { useState, useCallback } from 'react';
import type { GameState, DilemmaCard } from './gameTypes';

const PIETY_DECK: DilemmaCard[] = [
    {
        id: 'p1',
        title: 'The Great Cathedral',
        description: 'The Ministry of Guidance proposes a grand construction project to solidify the faith of the people.',
        yesText: 'Fund Cathedral',
        noText: 'Build Schools',
        yesEffects: { piety: 15, bazaar: -10, legitimacy: 5 },
        noEffects: { piety: -10, bazaar: 10 },
    },
    {
        id: 'p2',
        title: 'Religious Census',
        description: 'Should we force all citizens to register their faith, or allow private worship?',
        yesText: 'Require Registration',
        noText: 'Allow Privacy',
        yesEffects: { piety: 10, isolation: 10, legitimacy: -5 },
        noEffects: { piety: -15, isolation: -10, legitimacy: 5 },
    },
];

const SEPAH_DECK: DilemmaCard[] = [
    {
        id: 's1',
        title: 'Border Skirmish',
        description: 'The Supreme National Security Council reports minor incursions. A show of force is requested.',
        yesText: 'Deploy the Sepah',
        noText: 'Diplomatic Protest',
        yesEffects: { sepah: 15, isolation: 5, bazaar: -5 },
        noEffects: { sepah: -10, legitimacy: -10, isolation: -5 },
    },
    {
        id: 's2',
        title: 'New Armored Division',
        description: 'The generals request funds for a new mechanized unit to "ensure peace through strength."',
        yesText: 'Grant Funds',
        noText: 'Deny Funding',
        yesEffects: { sepah: 20, bazaar: -15 },
        noEffects: { sepah: -15, legitimacy: 5 },
    },
];

const BAZAAR_DECK: DilemmaCard[] = [
    {
        id: 'b1',
        title: 'The Steel Tariff',
        description: 'The Bonyads demand protection for local industries. The Bazaris are divided.',
        yesText: 'Impose Tariffs',
        noText: 'Free Trade',
        yesEffects: { bazaar: 15, isolation: 10, piety: 5 },
        noEffects: { bazaar: -10, isolation: -15, legitimacy: 5 },
    },
    {
        id: 'b2',
        title: 'Market Subsidy',
        description: 'The price of bread is rising. Should we subsidize the merchants to prevent riots?',
        yesText: 'Provide Subsidies',
        noText: 'Let the Market Decouple',
        yesEffects: { bazaar: 5, legitimacy: 15, piety: -5 },
        noEffects: { bazaar: 10, legitimacy: -20 },
    },
];

const ISOLATION_DECK: DilemmaCard[] = [
    {
        id: 'i1',
        title: 'The Cultural Exchange',
        description: 'The Ministry of Foreign Affairs suggests inviting western artists to a local festival.',
        yesText: 'Open the Gates',
        noText: 'Preserve Tradition',
        yesEffects: { isolation: -20, piety: -10, bazaar: 10 },
        noEffects: { isolation: 15, piety: 10, legitimacy: 5 },
    },
    {
        id: 'i2',
        title: 'Global Sanctions',
        description: 'Foreign powers threaten sanctions unless we halt our independent research.',
        yesText: 'Halt Research',
        noText: 'Defy the World',
        yesEffects: { isolation: -10, sepah: -5, bazaar: 5 },
        noEffects: { isolation: 20, sepah: 10, bazaar: -15 },
    },
];

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
