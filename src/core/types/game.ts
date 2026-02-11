export interface GameState {
    piety: number;
    sepah: number;
    bazaar: number;
    isolation: number;
    legitimacy: number;
    currentYear: number;
    currentQuarter: 1 | 2 | 3 | 4;
    targetYears: number;
    gameStateStatus: 'playing' | 'won' | 'lost';
    lifelineUsed: boolean;
    // Current shuffled decks
    pietyDeck: DilemmaCard[];
    sepahDeck: DilemmaCard[];
    bazaarDeck: DilemmaCard[];
    isolationDeck: DilemmaCard[];
}

export type CardEffect = Partial<Pick<GameState, 'piety' | 'sepah' | 'bazaar' | 'isolation' | 'legitimacy'>>;

export interface DilemmaCard {
    id: string;
    title: string;
    description: string;
    yesText: string;
    noText: string;
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
