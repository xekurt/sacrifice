export interface PopulationDangerStates {
    bazaarBelow50Turns: number;
    bazaarBelow20Turns: number;
    sepahAbove80Turns: number;
    sepahBelow20Turns: number;
    isolationAbove80Turns: number;
    isolationBelow20Turns: number;
    pietyAbove80Turns: number;
    pietyBelow20Turns: number;
}

export interface PopulationCasualties {
    emigrated: number;
    starvation: number;
    militaryKills: number;
    civilUnrest: number;
    disease: number;
    brainDrain: number;
    executions: number;
    sectarianViolence: number;
}

export interface GameState {
    piety: number;
    sepah: number;
    bazaar: number;
    isolation: number;
    legitimacy: number;
    currentYear: number;
    currentTerm: number;
    targetYears: number;

    gameStateStatus: 'playing' | 'won' | 'lost';
    lifelineUsed: boolean;
    // Current shuffled decks
    term1Deck: DilemmaCard[];
    term2Deck: DilemmaCard[];

    lossReason: string | null;
    lostThroughMetric: string | null;
    difficulty: Difficulty;
    yearEndReport: string[];

    // Hidden Population System
    initialPopulation: number;
    currentPopulation: number;
    turnCount: number;
    consecutiveStates: PopulationDangerStates;
    casualties: PopulationCasualties;
}


export type CardEffect = Partial<Pick<GameState, 'piety' | 'sepah' | 'bazaar' | 'isolation' | 'legitimacy'>>;

export interface DilemmaCard {
    id: string;
    title?: string;
    description: string;
    advisorQuotes: {
        sepah: string;
        bazaar: string;
        isolation: string;
        piety: string;
    };
    yesText?: string;
    noText?: string;
    yesEffects: CardEffect;
    noEffects: CardEffect;
}

export type AppScreen = 'intro' | 'main_menu' | 'settings' | 'game';
export type Difficulty = 'easy' | 'normal' | 'hard';

export interface GameSettings {
    difficulty: Difficulty;
    volume: number;
    isMuted: boolean;
}
