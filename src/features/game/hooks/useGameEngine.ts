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

    // Hidden Population System
    initialPopulation: 70000000,
    currentPopulation: 70000000,
    turnCount: 0,
    consecutiveStates: {
        bazaarBelow50Turns: 0,
        bazaarBelow20Turns: 0,
        sepahAbove80Turns: 0,
        sepahBelow20Turns: 0,
        isolationAbove80Turns: 0,
        isolationBelow20Turns: 0,
        pietyAbove80Turns: 0,
        pietyBelow20Turns: 0,
    },
    casualties: {
        emigrated: 0,
        starvation: 0,
        militaryKills: 0,
        civilUnrest: 0,
        disease: 0,
        brainDrain: 0,
        executions: 0,
        sectarianViolence: 0,
    },
});

export const useGameEngine = (initialDifficulty: Difficulty = 'normal') => {
    const [state, setState] = useState<GameState>(() => getInitialState(initialDifficulty));

    const clamp = (value: number) => Math.min(100, Math.max(0, value));

    const getRandomInt = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const getStampsPerYear = (difficulty: Difficulty) => {
        if (difficulty === 'easy') return 1;
        if (difficulty === 'normal') return 2;
        return 4; // hard
    };

    const getCurrentCardData = useCallback((s: GameState): { card: DilemmaCard; ministryName: string } => {
        // Global deck index ensures no cards are skipped
        const deckIndex = s.turnCount;

        // Alternate decks based on turn count
        const isOddTurn = deckIndex % 2 !== 0;
        const card = isOddTurn
            ? s.term2Deck[Math.floor(deckIndex / 2) % s.term2Deck.length]
            : s.term1Deck[Math.floor(deckIndex / 2) % s.term1Deck.length];

        const char = card.id.charAt(0);
        let ministryName = 'ministries.m1';
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
            const stampsPerYear = getStampsPerYear(prev.difficulty);
            const penaltyThreshold = stampsPerYear; // "1 year" period

            // 1. Immediate Apply: Apply effects and clamp metrics
            let nextState: GameState = {
                ...prev,
                piety: clamp(prev.piety + (effects.piety || 0)),
                sepah: clamp(prev.sepah + (effects.sepah || 0)),
                bazaar: clamp(prev.bazaar + (effects.bazaar || 0)),
                isolation: clamp(prev.isolation + (effects.isolation || 0)),
                legitimacy: clamp(prev.legitimacy + (effects.legitimacy || 0)),
                turnCount: prev.turnCount + 1,
            };

            // 2. Population Consequence System Logic
            const cs = { ...nextState.consecutiveStates };
            const cas = { ...nextState.casualties };
            let popLoss = 0;

            // Update Consecutive States
            cs.bazaarBelow50Turns = nextState.bazaar < 50 ? cs.bazaarBelow50Turns + 1 : 0;
            cs.bazaarBelow20Turns = nextState.bazaar < 20 ? cs.bazaarBelow20Turns + 1 : 0;
            cs.sepahAbove80Turns = nextState.sepah > 80 ? cs.sepahAbove80Turns + 1 : 0;
            cs.sepahBelow20Turns = nextState.sepah < 20 ? cs.sepahBelow20Turns + 1 : 0;
            cs.isolationAbove80Turns = nextState.isolation > 80 ? cs.isolationAbove80Turns + 1 : 0;
            cs.isolationBelow20Turns = nextState.isolation < 20 ? cs.isolationBelow20Turns + 1 : 0;
            cs.pietyAbove80Turns = nextState.piety > 80 ? cs.pietyAbove80Turns + 1 : 0;
            cs.pietyBelow20Turns = nextState.piety < 20 ? cs.pietyBelow20Turns + 1 : 0;

            // Apply Penalties (>= penaltyThreshold)
            if (cs.bazaarBelow50Turns >= penaltyThreshold) {
                const loss = getRandomInt(50000, 100000);
                popLoss += loss;
                cas.emigrated += loss;
            }
            if (cs.bazaarBelow20Turns >= penaltyThreshold) {
                const loss = getRandomInt(100000, 200000);
                popLoss += loss;
                cas.starvation += loss;
            }
            if (cs.sepahAbove80Turns >= penaltyThreshold) {
                const loss = getRandomInt(20000, 50000);
                popLoss += loss;
                cas.militaryKills += loss;
            }
            if (cs.sepahBelow20Turns >= penaltyThreshold) {
                const loss = getRandomInt(30000, 60000);
                popLoss += loss;
                cas.civilUnrest += loss;
            }
            if (cs.isolationAbove80Turns >= penaltyThreshold) {
                const loss = getRandomInt(40000, 80000);
                popLoss += loss;
                cas.disease += loss;
            }
            if (cs.isolationBelow20Turns >= penaltyThreshold) {
                const loss = getRandomInt(50000, 90000);
                popLoss += loss;
                cas.brainDrain += loss;
            }
            if (cs.pietyAbove80Turns >= penaltyThreshold) {
                const loss = getRandomInt(10000, 30000);
                popLoss += loss;
                cas.executions += loss;
            }
            if (cs.pietyBelow20Turns >= penaltyThreshold) {
                const loss = getRandomInt(20000, 50000);
                popLoss += loss;
                cas.sectarianViolence += loss;
            }

            nextState.consecutiveStates = cs;
            nextState.casualties = cas;
            nextState.currentPopulation = Math.max(0, nextState.currentPopulation - popLoss);

            // 3. Term / Year Progress
            if (nextState.currentTerm < stampsPerYear) {
                nextState.currentTerm += 1;
                // Minor check for immediate failure even mid-year
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
                        const baseMetric = failMetric.split('_')[0] as keyof GameState;
                        if (typeof nextState[baseMetric] === 'number') {
                            (nextState[baseMetric] as any) = 50;
                        }
                    } else {
                        nextState.gameStateStatus = 'lost';
                        nextState.lossReason = DEATH_REASONS[failMetric];
                        nextState.lostThroughMetric = failMetric;
                    }
                }
                return nextState;
            }

            // If currentTerm reached the stampsPerYear: Apply Systemic Rules, Check Win/Loss, and Advance Year
            let reportMessages: string[] = [];

            // A. Apply Systemic Rules
            if (nextState.isolation < 30) {
                nextState.piety -= 3;
                reportMessages.push("desk.report.open_borders");
            }
            if (nextState.sepah > 70) {
                nextState.bazaar -= 3;
                reportMessages.push("desk.report.martial_law");
            }
            if (nextState.piety < 40) {
                nextState.sepah += 3;
                reportMessages.push("desk.report.secularism");
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

            // Evaluate failure
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
                    const baseMetric = failMetric.split('_')[0] as keyof GameState;
                    if (typeof nextState[baseMetric] === 'number') {
                        (nextState[baseMetric] as any) = 50;
                    }
                    reportMessages.push(`desk.report.legitimacy_spent`);
                } else {
                    nextState.gameStateStatus = 'lost';
                    nextState.lossReason = DEATH_REASONS[failMetric];
                    nextState.lostThroughMetric = failMetric;
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
